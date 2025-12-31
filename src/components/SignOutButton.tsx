'use client';

import { LogOut } from 'lucide-react';
import { signOutAction } from '@/modules/auth/actions';

interface SignOutButtonProps {
  className?: string;
  showText?: boolean;
}

export function SignOutButton({ className = '', showText = true }: SignOutButtonProps) {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className={`flex items-center gap-2 text-zinc-400 hover:text-white transition-colors ${className}`}
        title="Sair"
        aria-label="Sair"
      >
        <LogOut className="w-4 h-4" />
        {showText && <span className="text-sm font-medium">Sair</span>}
      </button>
    </form>
  );
}
