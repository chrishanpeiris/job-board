'use client';

import { useReducer } from 'react';
import { DemoSection, CodeBlock } from './DemoShell';
import { Button } from '@/components/ui/Button';

// ── Types ──────────────────────────────────────────────────────────────────────

interface CartItem { id: number; name: string; price: number; qty: number; }

type CartAction =
  | { type: 'ADD';    item: Omit<CartItem, 'qty'> }
  | { type: 'REMOVE'; id: number }
  | { type: 'INC';    id: number }
  | { type: 'DEC';    id: number }
  | { type: 'CLEAR' };

// ── Pure reducer — no side-effects, easy to unit-test ─────────────────────────

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD':
      if (state.find((i) => i.id === action.item.id)) return state;
      return [...state, { ...action.item, qty: 1 }];
    case 'REMOVE':
      return state.filter((i) => i.id !== action.id);
    case 'INC':
      return state.map((i) => i.id === action.id ? { ...i, qty: i.qty + 1 } : i);
    case 'DEC':
      return state.map((i) =>
        i.id === action.id ? { ...i, qty: Math.max(1, i.qty - 1) } : i,
      );
    case 'CLEAR':
      return [];
  }
}

const PRODUCTS = [
  { id: 1, name: 'React Handbook', price: 29 },
  { id: 2, name: 'TypeScript Pro', price: 39 },
  { id: 3, name: 'Next.js Course',  price: 49 },
];

export function UseReducerDemo() {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <DemoSection
      id="usereducer"
      title="useReducer"
      badge="Core Hook"
      badgeColor="blue"
      usedIn="useJobFilters · useApplicationTracker"
      description="Like useState but for complex state logic. The reducer is a pure function — same input always gives same output — which makes it trivially unit-testable. All state transitions are explicit named actions."
    >
      {/* Products */}
      <div className="demo-card">
        <p className="demo-label">Products — dispatch ADD action</p>
        <div className="flex flex-wrap gap-2">
          {PRODUCTS.map((p) => (
            <Button
              key={p.id}
              variant="secondary"
              size="sm"
              onClick={() => dispatch({ type: 'ADD', item: p })}
              disabled={!!cart.find((i) => i.id === p.id)}
            >
              + {p.name} (${p.price})
            </Button>
          ))}
        </div>
      </div>

      {/* Cart */}
      <div className="demo-card">
        <p className="demo-label">Cart state — managed by reducer</p>
        {cart.length === 0 ? (
          <p className="text-sm text-gray-400">Cart is empty</p>
        ) : (
          <ul className="space-y-2">
            {cart.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="flex-1 font-medium text-gray-800 dark:text-gray-200">{item.name}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => dispatch({ type: 'DEC', id: item.id })}
                    className="demo-qty-btn">−</button>
                  <span className="w-6 text-center font-mono">{item.qty}</span>
                  <button onClick={() => dispatch({ type: 'INC', id: item.id })}
                    className="demo-qty-btn">+</button>
                </div>
                <span className="w-16 text-right text-gray-600 dark:text-gray-400">
                  ${item.price * item.qty}
                </span>
                <button
                  onClick={() => dispatch({ type: 'REMOVE', id: item.id })}
                  className="text-red-400 hover:text-red-600"
                >✕</button>
              </li>
            ))}
          </ul>
        )}
        {cart.length > 0 && (
          <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-600">
            <span className="font-semibold text-gray-900 dark:text-white">Total: ${total}</span>
            <Button variant="ghost" size="sm" onClick={() => dispatch({ type: 'CLEAR' })}>
              Clear cart
            </Button>
          </div>
        )}
      </div>

      <CodeBlock>{`// Discriminated union — TypeScript catches missing cases
type CartAction =
  | { type: 'ADD';    item: Product }
  | { type: 'REMOVE'; id: number }
  | { type: 'CLEAR' };

// Pure reducer — import and test it without React
function cartReducer(state: CartItem[], action: CartAction) {
  switch (action.type) {
    case 'ADD':    return [...state, { ...action.item, qty: 1 }];
    case 'REMOVE': return state.filter((i) => i.id !== action.id);
    case 'CLEAR':  return [];
  }
}

const [cart, dispatch] = useReducer(cartReducer, []);
dispatch({ type: 'ADD', item: product });`}</CodeBlock>
    </DemoSection>
  );
}
