/**
 * Login Demo Mode
 * 
 * Usado quando Supabase não está configurado
 * Permite testar UI sem backend
 */

export interface DemoUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'OWNER' | 'ADMIN' | 'BARBER';
  tenant_id: string;
}

/**
 * Usuários de demonstração
 */
export const DEMO_USERS: DemoUser[] = [
  {
    id: 'demo-user-1',
    email: 'admin@barberflow.com',
    password: 'admin123',
    name: 'Admin Demo',
    role: 'OWNER',
    tenant_id: 'demo-tenant-1',
  },
  {
    id: 'demo-user-2',
    email: 'barbeiro@barberflow.com',
    password: 'barbeiro123',
    name: 'Barbeiro Demo',
    role: 'BARBER',
    tenant_id: 'demo-tenant-1',
  },
  {
    id: 'demo-user-3',
    email: 'teste@barberflow.com',
    password: 'teste123',
    name: 'Teste Demo',
    role: 'ADMIN',
    tenant_id: 'demo-tenant-1',
  },
];

/**
 * Verifica se está em modo demo
 */
export function isDemoMode(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return !supabaseUrl || !supabaseKey || supabaseUrl === 'your-supabase-url';
}

/**
 * Login em modo demo
 */
export function loginDemo(email: string, password: string): DemoUser | null {
  const user = DEMO_USERS.find(
    u => u.email === email && u.password === password
  );
  
  if (user) {
    // Salva no localStorage para manter sessão
    if (typeof window !== 'undefined') {
      localStorage.setItem('demo_user', JSON.stringify(user));
      localStorage.setItem('demo_session', 'active');
    }
    return user;
  }
  
  return null;
}

/**
 * Obtém usuário demo da sessão
 */
export function getDemoUser(): DemoUser | null {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem('demo_user');
  const session = localStorage.getItem('demo_session');
  
  if (!userStr || session !== 'active') return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Logout demo
 */
export function logoutDemo(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('demo_user');
    localStorage.removeItem('demo_session');
  }
}

/**
 * Verifica se está logado em modo demo
 */
export function isDemoLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('demo_session') === 'active';
}

