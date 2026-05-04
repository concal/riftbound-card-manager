import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Library, Settings as SettingsIcon } from 'lucide-react';

export function MobileFooterNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  let location;
  switch (pathname) {
    case '/search':
      location = 'search';
      break;
    case '/settings':
      location = 'settings';
      break;
    default:
      location = 'collection';
  }

  return (
    <nav className="sm:hidden fixed bottom-0 inset-x-0 border-t border-border bg-background flex">
      <button
        onClick={() => {
          navigate('/collection');
        }}
        className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs transition-colors ${location === 'collection' ? 'text-foreground' : 'text-muted-foreground'}`}
      >
        <Library className="w-5 h-5" />
        <span>Collection</span>
      </button>
      <button
        onClick={() => navigate('/search')}
        className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs transition-colors ${location === 'search' ? 'text-foreground' : 'text-muted-foreground'}`}
      >
        <Search className="w-5 h-5" />
        <span>Search</span>
      </button>
      <button
        onClick={() => navigate('/settings')}
        className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs transition-colors ${location === 'settings' ? 'text-foreground' : 'text-muted-foreground'}`}
      >
        <SettingsIcon className="w-5 h-5" />
        <span>Settings</span>
      </button>
    </nav>
  );
}
