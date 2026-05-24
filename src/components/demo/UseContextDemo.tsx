'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { DemoSection, CodeBlock } from './DemoShell';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

// ── Local demo context — scope, provider, consumer ───────────────────────────

interface LangContextValue {
  lang:    'en' | 'es' | 'fr';
  setLang: (l: 'en' | 'es' | 'fr') => void;
}

const LangContext = createContext<LangContextValue | null>(null);

function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be inside LangProvider');
  return ctx;
}

function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<'en' | 'es' | 'fr'>('en');
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

// ── Deeply nested consumer — no prop drilling ─────────────────────────────────

function DeepChild() {
  const { lang, setLang } = useLang();
  const greetings = { en: 'Hello!', es: '¡Hola!', fr: 'Bonjour!' };
  return (
    <div className="rounded-lg border border-dashed border-gray-300 p-3 dark:border-gray-600">
      <p className="mb-2 text-xs text-gray-400">DeepChild (3 levels deep — no props passed)</p>
      <p className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{greetings[lang]}</p>
      <div className="flex gap-2">
        {(['en', 'es', 'fr'] as const).map((l) => (
          <Button
            key={l}
            size="sm"
            variant={lang === l ? 'primary' : 'secondary'}
            onClick={() => setLang(l)}
          >
            {l.toUpperCase()}
          </Button>
        ))}
      </div>
    </div>
  );
}

function MiddleLayer() {
  return (
    <div className="rounded-lg border border-dashed border-gray-200 p-3 dark:border-gray-700">
      <p className="mb-2 text-xs text-gray-400">MiddleLayer (receives zero props)</p>
      <DeepChild />
    </div>
  );
}

export function UseContextDemo() {
  const { user }                          = useAuth();
  const { resolvedTheme, toggleTheme }    = useTheme();

  return (
    <DemoSection
      id="usecontext"
      title="useContext"
      badge="Context API"
      badgeColor="green"
      usedIn="AuthContext · ThemeContext · Header · withAuth HOC"
      description="Broadcasts a value to any descendant without threading props through every level. Consumer hook throws a clear error if used outside the provider — better than a silent undefined crash."
    >
      {/* Live AuthContext */}
      <div className="demo-card">
        <p className="demo-label">AuthContext — live session from this app</p>
        <div className="rounded-lg bg-gray-50 p-3 font-mono text-sm dark:bg-gray-900">
          {user ? (
            <>
              <p><span className="text-gray-400">user.name  </span><span className="text-green-600 dark:text-green-400">&quot;{user.name}&quot;</span></p>
              <p><span className="text-gray-400">user.email </span><span className="text-green-600 dark:text-green-400">&quot;{user.email}&quot;</span></p>
            </>
          ) : (
            <p className="text-gray-400">Not logged in — <a href="/login" className="text-blue-500 underline">sign in</a> to see user data</p>
          )}
        </div>
      </div>

      {/* ThemeContext */}
      <div className="demo-card">
        <p className="demo-label">ThemeContext — toggle dark mode</p>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Current theme: <b>{resolvedTheme}</b>
          </span>
          <Button variant="secondary" size="sm" onClick={toggleTheme}>
            Switch to {resolvedTheme === 'dark' ? '☀️ light' : '🌙 dark'}
          </Button>
        </div>
      </div>

      {/* Custom LangContext */}
      <div className="demo-card">
        <p className="demo-label">Custom LangContext — no prop drilling through middle layers</p>
        <LangProvider>
          <MiddleLayer />
        </LangProvider>
      </div>

      <CodeBlock>{`// 1. Create
const LangContext = createContext<LangContextValue | null>(null);

// 2. Provide
<LangContext.Provider value={{ lang, setLang }}>
  {children}
</LangContext.Provider>

// 3. Consume — throw if used outside provider
function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be inside LangProvider');
  return ctx;
}`}</CodeBlock>
    </DemoSection>
  );
}
