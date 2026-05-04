import { createContext, useContext } from 'react';
import { authClient } from '@/lib/auth-client';
import { usePreferences, type Preferences } from '@/hooks/usePreferences';

type SessionData = NonNullable<ReturnType<typeof authClient.useSession>['data']>;

interface UserSettingsContextType {
  authData: SessionData | null;
  authPending: boolean;
  updateUserPreferences: (preferences: Partial<Preferences>) => void;
  userPreferences: Preferences | null;
}

const defaultUserSettingsContext: UserSettingsContextType = {
  authData: null,
  authPending: false,
  updateUserPreferences: () => {},
  userPreferences: null,
};

const UserSettingsContext = createContext<UserSettingsContextType>(
  defaultUserSettingsContext,
);

export function UserSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: authData, isPending: authPending } = authClient.useSession();
  const { preferences: userPreferences, update: updateUserPreferences } =
    usePreferences(authData?.user.id);

  return (
    <UserSettingsContext.Provider
      value={{ authPending, authData, userPreferences, updateUserPreferences }}
    >
      {!authPending && children}
    </UserSettingsContext.Provider>
  );
}

export function useUserSettingsContext() {
  const context = useContext(UserSettingsContext);
  if (!context) {
    throw new Error(
      'useUserSettingsContext must be used within a UserSettingsProvider',
    );
  }
  return context;
}
