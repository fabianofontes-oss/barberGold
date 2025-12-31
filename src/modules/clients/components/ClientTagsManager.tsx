'use client';

import React from 'react';
import { X, Crown, Clock, AlertTriangle, Smile, Star, Sparkles, Heart } from 'lucide-react';
import type { ClientTag } from '@/types';

interface ClientTagsManagerProps {
  tags: ClientTag[];
  onToggleTag: (tag: ClientTag) => void;
  readOnly?: boolean;
}

const TAG_CONFIG: Record<ClientTag, { label: string; color: string; icon: React.ReactNode }> = {
  VIP: { label: 'VIP', color: 'bg-amber-500 text-zinc-900', icon: <Crown className="w-3 h-3" /> },
  PONTUAL: { label: 'Pontual', color: 'bg-emerald-500 text-white', icon: <Clock className="w-3 h-3" /> },
  ATRASA: { label: 'Atrasa', color: 'bg-red-500 text-white', icon: <AlertTriangle className="w-3 h-3" /> },
  EXIGENTE: { label: 'Exigente', color: 'bg-purple-500 text-white', icon: <Star className="w-3 h-3" /> },
  FACIL: { label: 'FÃ¡cil', color: 'bg-blue-500 text-white', icon: <Smile className="w-3 h-3" /> },
  NOVO: { label: 'Novo', color: 'bg-cyan-500 text-white', icon: <Sparkles className="w-3 h-3" /> },
  FIEL: { label: 'Fiel', color: 'bg-pink-500 text-white', icon: <Heart className="w-3 h-3" /> },
};

const ALL_TAGS: ClientTag[] = ['VIP', 'PONTUAL', 'ATRASA', 'EXIGENTE', 'FACIL', 'NOVO', 'FIEL'];

export const ClientTagsManager: React.FC<ClientTagsManagerProps> = ({ tags, onToggleTag, readOnly = false }) => {
  return (
    <div className="space-y-3">
      <p className="text-xs text-zinc-500 font-bold uppercase">Etiquetas</p>
      <div className="flex flex-wrap gap-2">
        {ALL_TAGS.map((tag) => {
          const config = TAG_CONFIG[tag];
          const isActive = tags.includes(tag);

          return (
            <button
              key={tag}
              type="button"
              disabled={readOnly}
              onClick={() => onToggleTag(tag)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                isActive
                  ? config.color
                  : 'bg-zinc-800 text-zinc-500 hover:text-white hover:bg-zinc-700'
              } ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
            >
              {config.icon}
              {config.label}
              {isActive && !readOnly && <X className="w-3 h-3 ml-1" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const ClientTagsBadges: React.FC<{ tags: ClientTag[] }> = ({ tags }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag) => {
        const config = TAG_CONFIG[tag];
        return (
          <span
            key={tag}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${config.color}`}
          >
            {config.icon}
            {config.label}
          </span>
        );
      })}
    </div>
  );
};
