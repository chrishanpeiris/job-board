'use client';

import { useState } from 'react';
import { DemoSection, CodeBlock } from './DemoShell';
import { Button } from '@/components/ui/Button';

export function UseStateDemo() {
  // ── 1. Primitive state ────────────────────────────────────────
  const [count, setCount] = useState(0);

  // ── 2. Object state — must spread to avoid mutation ──────────
  const [form, setForm] = useState({ name: '', email: '' });
  const handleField = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // ── 3. Boolean toggle ─────────────────────────────────────────
  const [on, setOn] = useState(false);

  return (
    <DemoSection
      id="usestate"
      title="useState"
      badge="Core Hook"
      badgeColor="blue"
      usedIn="login/page.tsx · AuthContext · ThemeContext · ApplicationCard"
      description="Stores a value inside a component. React re-renders whenever you call the setter. Three flavours: primitive, object, and boolean toggle."
    >
      {/* Counter */}
      <div className="demo-card">
        <p className="demo-label">Primitive — counter</p>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => setCount((c) => c - 1)}>−</Button>
          <span className="w-10 text-center text-2xl font-bold text-gray-900 dark:text-white">{count}</span>
          <Button variant="secondary" size="sm" onClick={() => setCount((c) => c + 1)}>+</Button>
          <Button variant="ghost" size="sm" onClick={() => setCount(0)}>Reset</Button>
        </div>
      </div>

      {/* Object state */}
      <div className="demo-card">
        <p className="demo-label">Object state — spread to update one field</p>
        <div className="flex flex-col gap-2">
          {(['name', 'email'] as const).map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field}
              value={form[field]}
              onChange={handleField}
              className="demo-input"
            />
          ))}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Value: <code className="demo-code">{JSON.stringify(form)}</code>
          </p>
        </div>
      </div>

      {/* Boolean toggle */}
      <div className="demo-card">
        <p className="demo-label">Boolean toggle</p>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => setOn((v) => !v)}>
            {on ? 'Turn Off' : 'Turn On'}
          </Button>
          <span className={`font-semibold ${on ? 'text-green-600' : 'text-gray-400'}`}>
            {on ? '🟢 ON' : '⚫ OFF'}
          </span>
        </div>
      </div>

      <CodeBlock>{`const [count, setCount] = useState(0);

// Functional updater — always safe, uses latest state
setCount((prev) => prev + 1);

// Object state — spread to avoid mutation
const [form, setForm] = useState({ name: '', email: '' });
setForm((prev) => ({ ...prev, name: 'Alice' }));`}</CodeBlock>
    </DemoSection>
  );
}
