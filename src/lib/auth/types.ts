import type { ProfileRole } from '@/lib/database.types';

export type AuthContext = {
  userId: string;
  profileId: string;
  tenantId: string;
  role: ProfileRole;
  displayName: string;
};

export class AuthError extends Error {
  constructor(
    message: string,
    public code: 'NOT_AUTHENTICATED' | 'NO_PROFILE' | 'INACTIVE_PROFILE' | 'DB_ERROR'
  ) {
    super(message);
    this.name = 'AuthError';
  }
}
