'use client';

import { forwardRef, useRef, useState, type InputHTMLAttributes } from 'react';
import { DemoSection, CodeBlock } from './DemoShell';
import { Button } from '@/components/ui/Button';

// ── Custom input that exposes its DOM ref to the parent ───────────────────────
// forwardRef is required because React doesn't pass `ref` as a regular prop.
// Without it, the parent can't call .focus() or .select() on the element.

interface FancyInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?:   string;
  error?:   string;
}

const FancyInput = forwardRef<HTMLInputElement, FancyInputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        ref={ref}                  // ← forwarded ref attached to the real DOM node
        className={`demo-input w-full ${error ? 'border-red-500' : ''} ${className ?? ''}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  ),
);
FancyInput.displayName = 'FancyInput'; // required for React DevTools

// ── Parent that controls the child via ref ────────────────────────────────────

export function ForwardRefDemo() {
  const firstRef  = useRef<HTMLInputElement>(null);
  const secondRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  function validate() {
    const val = firstRef.current?.value ?? '';
    if (val.length < 3) {
      setError('Minimum 3 characters');
      firstRef.current?.focus();   // ← programmatic focus via ref
    } else {
      setError('');
      secondRef.current?.focus();  // ← move focus to next field on success
    }
  }

  function selectAll() {
    firstRef.current?.select();    // ← select all text via ref
  }

  return (
    <DemoSection
      id="forwardref"
      title="forwardRef"
      badge="Advanced Pattern"
      badgeColor="orange"
      usedIn="Button component"
      description="React doesn't pass ref as a prop — you must opt in with forwardRef(). This lets a parent component call DOM methods (focus, select, scroll) on a child's inner element imperatively, while the child still controls its own styling and behaviour."
    >
      <div className="demo-card">
        <p className="demo-label">Custom FancyInput — parent controls focus via ref</p>
        <div className="space-y-3">
          <FancyInput
            ref={firstRef}
            label="Username (min 3 chars)"
            placeholder="Type something..."
            error={error}
          />
          <FancyInput
            ref={secondRef}
            label="Email (gets focus on valid username)"
            placeholder="email@example.com"
          />
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={validate}>
              Validate → move focus
            </Button>
            <Button variant="ghost" size="sm" onClick={selectAll}>
              Select all in field 1
            </Button>
          </div>
        </div>
      </div>

      <CodeBlock>{`// Child wraps with forwardRef — ref becomes a second parameter
const FancyInput = forwardRef<HTMLInputElement, Props>(
  ({ label, error, ...props }, ref) => (
    <input ref={ref} {...props} />   // attach ref to the real DOM node
  ),
);
FancyInput.displayName = 'FancyInput';  // shows correctly in DevTools

// Parent gets a direct handle on the DOM node
const inputRef = useRef<HTMLInputElement>(null);
<FancyInput ref={inputRef} />

inputRef.current?.focus();   // call DOM methods imperatively
inputRef.current?.select();`}</CodeBlock>
    </DemoSection>
  );
}
