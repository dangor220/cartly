import { supabase } from '@/shared/lib/supabase';
import { userMetadataSchema, type LogInData, type SignUpData } from './schemas';
import type { User } from './types';
import type { User as AuthUser } from '@supabase/supabase-js';

export class EmailTakenError extends Error {}
export class InvalidCredentialsError extends Error {}

function toUser(authUser: AuthUser): User {
  const parsed = userMetadataSchema.safeParse(authUser.user_metadata);
  return {
    email: authUser.email ?? '',
    ...(parsed.success ? parsed.data : { firstName: '', lastName: '' }),
  };
}

export async function signUp({ email, password, firstName, lastName }: SignUpData): Promise<void> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { firstName, lastName },
      emailRedirectTo: `${window.location.origin}${import.meta.env.BASE_URL}`,
    },
  });

  if (error) {
    if (error.code === 'user_already_exists') {
      throw new EmailTakenError('This email already exists');
    }
    throw error;
  }

  if (data.user?.identities?.length === 0) {
    throw new EmailTakenError('This email already exists');
  }
}

export async function logIn(userData: LogInData): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword(userData);

  if (error) {
    if (error.code === 'invalid_credentials') {
      throw new InvalidCredentialsError('Invalid email or password');
    }
    throw error;
  }

  const metadata = userMetadataSchema.parse(data.user.user_metadata);

  return { email: data.user.email ?? userData.email, ...metadata };
}

export async function logOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ? toUser(session.user) : null);
  });
  return () => data.subscription.unsubscribe();
}
