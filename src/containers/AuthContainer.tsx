import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '@/lib/auth-client';
import { AuthForm } from '@/components/AuthForm';

export function AuthContainer() {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && session) navigate('/collection', { replace: true });
  }, [session, isPending, navigate]);

  if (isPending) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6">
      <AuthForm />
    </div>
  );
}
