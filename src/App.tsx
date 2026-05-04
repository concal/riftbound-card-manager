import { UserSettingsProvider } from './context/UserSettingsContext';
import { CollectionProvider } from './context/CollectionContext';
import { Routes } from './Routes';
import { MobileFooterNav } from './components/nav/MobileFooterNav';
import { HeaderNav } from './components/nav/HeaderNav';

export function App() {
  return (
    <UserSettingsProvider>
      <CollectionProvider>
        <div className="min-h-screen flex flex-col">
          <HeaderNav />
          <main className="flex-1 flex flex-col pb-19 px-3 pt-3 sm:pb-0 sm:px-8 sm:pt-4 max-w-5xl w-full mx-auto">
            <Routes />
          </main>
          <MobileFooterNav />
        </div>
      </CollectionProvider>
    </UserSettingsProvider>
  );
}
