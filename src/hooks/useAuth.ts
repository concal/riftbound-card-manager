import { useState, type SyntheticEvent } from 'react';
import { authClient } from '@/lib/auth-client';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // TODO: Any security risks with storing password like this?
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const signIn = async (event: SyntheticEvent) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await authClient.signIn.email(signInData);
    if (error) {
      setError(error.message ?? 'Sign in failed');
    }
    setLoading(false);
  };

  const signUp = async (event: SyntheticEvent) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await authClient.signUp.email(signUpData);
    if (error) {
      setError(error.message ?? 'Sign up failed');
    }
    setLoading(false);
  };

  return {
    error,
    loading,
    setError,
    setSignInData,
    setSignUpData,
    signIn,
    signInData,
    signUp,
    signUpData,
  };
}
