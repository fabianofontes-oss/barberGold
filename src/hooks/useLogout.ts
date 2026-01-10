'use client';

import { createClient } from '@/lib/supabase/client';

export function useLogout() {
  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return { logout };
}
