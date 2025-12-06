import { NextResponse } from "next/server";
import { PrismaAdminRepository } from "@/infrastructure/repositories/PrismaAdminRepository";
import { LoginAdminUseCase } from "@/core/usecases/LoginAdminUseCase";
import { signToken } from "@/lib/auth"; // Helper baru
import { z } from "zod"; // Validasi input

// Schema Validasi
const loginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Validasi Input (Zod)
    const validData = loginSchema.parse(body);

    const adminRepo = new PrismaAdminRepository();
    const loginUseCase = new LoginAdminUseCase(adminRepo);

    // 2. Cek Kredensial
    const adminData = await loginUseCase.execute(validData.username, validData.password);

    // 3. Buat Token JWT
    const token = await signToken({ 
      id: adminData.id, 
      role: adminData.role, 
      username: adminData.username 
    });

    // 4. Set HttpOnly Cookie
    const response = NextResponse.json({
      success: true,
      message: "Login berhasil",
      data: { nama: adminData.nama } // Jangan kirim token di sini!
    });

    response.cookies.set({
      name: "access_token",
      value: token,
      httpOnly: true, // Anti XSS (JS gak bisa baca)
      secure: process.env.NODE_ENV === "production", // Wajib HTTPS di prod
      sameSite: "strict", // Anti CSRF
      path: "/",
      maxAge: 60 * 60 * 24 // 1 Hari
    });

    return response;

  } catch (error: any) {
    const message = error instanceof z.ZodError
      ? error.issues[0].message
      : error.message;

    return NextResponse.json(
      { success: false, error: message },
      { status: 401 }
    );
  }
}