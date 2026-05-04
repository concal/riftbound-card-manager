import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import type { SortKey } from '@/types/sort';
import type { Theme } from '@/types/theme';
import { useUserSettingsContext } from '@/context/UserSettingsContext';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'price-desc', label: 'Price High → Low' },
  { value: 'price-asc', label: 'Price Low → High' },
  { value: 'name-asc', label: 'Name A → Z' },
  { value: 'name-desc', label: 'Name Z → A' },
];

const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: 'system', label: 'Device' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

function SettingRow({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <p className="text-sm font-medium">{label}</p>
      {children}
    </div>
  );
}

function SegmentedControl<T extends string>({
  onChange,
  options,
  value,
}: {
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  value: T;
}) {
  return (
    <div className="flex rounded-lg border border-input overflow-hidden text-sm">
      {options.map((opt) => (
        <button
          className={`px-3 py-1.5 transition-colors ${
            value === opt.value
              ? 'bg-primary text-primary-foreground'
              : 'bg-background text-muted-foreground hover:text-foreground'
          }`}
          key={opt.value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function SettingsContainer() {
  const { authData, updateUserPreferences, userPreferences } =
    useUserSettingsContext();

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 space-y-6">
      <h1 className="hidden sm:block text-3xl font-bold">Settings</h1>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Appearance
        </h2>
        <div className="rounded-xl border border-border divide-y divide-border">
          <SettingRow label="Theme">
            <SegmentedControl
              onChange={(theme) => updateUserPreferences({ theme })}
              options={THEME_OPTIONS}
              value={userPreferences!.theme}
            />
          </SettingRow>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Collection
        </h2>
        <div className="rounded-xl border border-border divide-y divide-border">
          <SettingRow label="Default sort">
            <select
              className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              onChange={(e) =>
                updateUserPreferences({
                  defaultSort: e.target.value as SortKey,
                })
              }
              value={userPreferences!.defaultSort}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </SettingRow>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Account
        </h2>
        <div className="rounded-xl border border-border divide-y divide-border">
          <SettingRow label="Email">
            <span className="text-sm text-muted-foreground">
              {authData?.user.email}
            </span>
          </SettingRow>
          <SettingRow label="Sign Out">
            <Button
              onClick={() => authClient.signOut()}
              size="sm"
              variant="outline"
            >
              Sign Out
            </Button>
          </SettingRow>
        </div>
      </section>
    </div>
  );
}
