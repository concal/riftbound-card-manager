import { Button } from '@/components/ui/button';
import { ChevronLeft, Settings as SettingsIcon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export function HeaderNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  let location;
  let mobileTitle;
  switch (pathname) {
    case '/search':
      location = 'search';
      mobileTitle = 'Search';
      break;
    case '/settings':
      location = 'settings';
      mobileTitle = 'Settings';
      break;
    case '/add':
      location = 'add';
      mobileTitle = 'Add Cards';
      break;
    default:
      location = 'collection';
      mobileTitle = 'Collection';
  }
  return (
    <header className="relative border-b border-border px-4 sm:px-6 py-6 sm:py-3 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        {location === 'add' && (
          <button
            className="sm:hidden text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Back to collection"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <span className="font-semibold hidden sm:block shrink-0">
          Riftbound Collection Manager
        </span>
        <nav className="hidden sm:flex gap-1">
          <Button
            variant={location === 'search' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => navigate('/search')}
          >
            Search
          </Button>
          <Button
            variant={location === 'collection' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => navigate('/collection')}
          >
            Collection
          </Button>
        </nav>
      </div>
      <span className="sm:hidden absolute left-1/2 -translate-x-1/2 font-semibold text-xl pointer-events-none">
        {mobileTitle}
      </span>
      <div className="invisible sm:visible flex items-center gap-2 sm:gap-3 shrink-0">
        <Button
          variant={location === 'settings' ? 'secondary' : 'ghost'}
          size="icon-sm"
          onClick={() => navigate('/settings')}
          aria-label="Settings"
        >
          <SettingsIcon className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
