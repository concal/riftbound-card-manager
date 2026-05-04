import {
  Routes as ReactRoute,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import { useUserSettingsContext } from '@/context/UserSettingsContext';
import { AuthContainer } from '@/containers/AuthContainer';
import { SettingsContainer } from '@/containers/SettingsContainer';
import { SearchContainer } from '@/containers/SearchContainer';
import { CollectionContainer } from '@/containers/CollectionContainer';
import { Button } from '@/components/ui/button';

function AuthGate({
  children,
  message,
}: {
  children: React.ReactNode;
  message: string;
}) {
  const { authData } = useUserSettingsContext();
  const navigate = useNavigate();

  if (!authData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 max-w-sm mx-auto p-4 sm:p-6 text-center">
        <p className="text-muted-foreground text-sm">{message}</p>
        <Button onClick={() => navigate('/login')}>Sign In</Button>
      </div>
    );
  }

  return children;
}

export function Routes() {
  return (
    <ReactRoute>
      <Route path="/search" element={<SearchContainer />} />
      <Route
        path="/collection"
        element={
          <AuthGate message="Please sign in to view your collection.">
            <CollectionContainer />
          </AuthGate>
        }
      />
      <Route
        path="/settings"
        element={
          <AuthGate message="Please sign in to view and update your settings.">
            <SettingsContainer />
          </AuthGate>
        }
      />
      <Route
        path="/add"
        element={
          <AuthGate message="Please sign in to add cards to your collection.">
            <SearchContainer isEditingCollection={true} />
          </AuthGate>
        }
      />
      <Route path="/login" element={<AuthContainer />} />
      <Route path="*" element={<Navigate to="/collection" replace />} />
    </ReactRoute>
  );
}
