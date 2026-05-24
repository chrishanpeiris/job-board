'use client';

import { useState } from 'react';
import { DemoSection, CodeBlock } from './DemoShell';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

export function PortalDemo() {
  const [open, setOpen] = useState(false);

  return (
    <DemoSection
      id="portal"
      title="createPortal"
      badge="Advanced Pattern"
      badgeColor="orange"
      usedIn="Modal component"
      description="Renders children into a different DOM node than where the component lives in the React tree. Solves the z-index / overflow:hidden problem — a modal rendered deep inside a clipping container can still appear on top of everything by escaping to document.body."
    >
      <div className="demo-card">
        <p className="demo-label">Modal rendered outside this component&apos;s DOM — into document.body</p>

        {/* Visual of the containment problem */}
        <div className="mb-4 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-900/40"
          style={{ position: 'relative' }}>
          <p className="mb-2 text-xs font-medium text-gray-500">
            Parent with <code className="demo-code">overflow: hidden</code>
          </p>
          <p className="text-xs text-gray-400 mb-3">
            Without a portal, a modal rendered here would be clipped by this container.
            With createPortal it escapes to document.body — no clipping possible.
          </p>
          <Button onClick={() => setOpen(true)}>Open Portal Modal</Button>
        </div>

        <p className="text-xs text-gray-400">
          Inspect the DOM — the modal div is a direct child of <code className="demo-code">&lt;body&gt;</code>,
          not nested inside this section.
        </p>
      </div>

      {/* The actual modal — rendered via createPortal in Modal.tsx */}
      <Modal open={open} onClose={() => setOpen(false)} title="I escaped to document.body">
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            This content is rendered via <code className="demo-code">createPortal(children, document.body)</code>.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Open DevTools → Elements and look for this <code className="demo-code">&lt;div role=&quot;dialog&quot;&gt;</code>
            — it&apos;s a direct child of <code className="demo-code">&lt;body&gt;</code>.
          </p>
          <div className="rounded-lg bg-gray-100 p-3 font-mono text-xs dark:bg-gray-900">
            {`createPortal(\n  <div role="dialog">...</div>,\n  document.body\n)`}
          </div>
          <Button onClick={() => setOpen(false)} className="w-full">Close</Button>
        </div>
      </Modal>

      <CodeBlock>{`import { createPortal } from 'react-dom';

function Modal({ open, children }) {
  if (!open) return null;

  // Renders children at document.body level —
  // no overflow:hidden or z-index parent can clip it
  return createPortal(
    <div role="dialog" aria-modal="true">
      <div className="backdrop" />
      <div className="panel">{children}</div>
    </div>,
    document.body,   // ← target DOM node
  );
}`}</CodeBlock>
    </DemoSection>
  );
}
