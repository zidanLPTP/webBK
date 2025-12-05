"use client";

import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";

// Daftar Pilihan Avatar (Emoji)
const AVATARS = [
  { id: "cat", emoji: "🐱", label: "Kucing" },
  { id: "dog", emoji: "🐶", label: "Anjing" },
  { id: "fox", emoji: "🦊", label: "Rubah" },
  { id: "panda", emoji: "🐼", label: "Panda" },
  { id: "rabbit", emoji: "🐰", label: "Kelinci" },
  { id: "lion", emoji: "🦁", label: "Singa" },
  { id: "dolphin", emoji: "🐬", label: "Lumba" },
  { id: "alien", emoji: "👽", label: "Alien" },
  { id: "ghost", emoji: "👻", label: "Hantu" },
  { id: "robot", emoji: "🤖", label: "Robot" },
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar: string;
  onSelect: (avatar: string) => void;
};

export default function AvatarSelector({ isOpen, onClose, currentAvatar, onSelect }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 dark:text-white">Pilih Identitas</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Grid Avatar */}
        <div className="p-6 grid grid-cols-4 gap-4">
          {AVATARS.map((av) => (
            <button
              key={av.id}
              onClick={() => onSelect(av.emoji)}
              className={`aspect-square rounded-2xl flex items-center justify-center text-3xl transition-all relative ${
                currentAvatar === av.emoji 
                  ? "bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-500 shadow-md transform scale-110" 
                  : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-transparent"
              }`}
            >
              {av.emoji}
              {currentAvatar === av.emoji && (
                <div className="absolute -top-2 -right-2 bg-purple-500 text-white rounded-full p-0.5">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="px-6 pb-6 text-center text-xs text-gray-400">
          Avatar ini hanya hiasan lokal di perangkatmu.
        </div>
      </div>
    </div>
  );
}