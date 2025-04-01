
import { useAuthState } from './use-auth-state';
import { Session, User } from '@supabase/supabase-js';

export interface AuthState {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
}

export const useAuth = (): AuthState => {
  const authState = useAuthState();
  return authState;
};
