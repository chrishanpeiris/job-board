// ─── JobFilters component tests ───────────────────────────────────────────────
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { JobFilters } from '@/components/jobs/JobFilters';
import type { JobFilters as FiltersType, JobSortKey } from '@/types';

const DEFAULT_FILTERS: FiltersType & { sort: JobSortKey } = {
  search: '', type: '', remote: null, location: '', sort: 'newest',
};

function renderFilters(overrides = {}) {
  const props = {
    filters:    { ...DEFAULT_FILTERS, ...overrides },
    onSearch:   vi.fn(),
    onType:     vi.fn(),
    onRemote:   vi.fn(),
    onLocation: vi.fn(),
    onSort:     vi.fn(),
    onReset:    vi.fn(),
  };
  const utils = render(<JobFilters {...props} />);
  return { ...utils, props };
}

describe('JobFilters', () => {
  it('renders sort, type, location, and work-location selects', () => {
    renderFilters();
    expect(screen.getByLabelText('Sort by')).toBeInTheDocument();
    expect(screen.getByLabelText('Job type')).toBeInTheDocument();
    expect(screen.getByLabelText('Work location')).toBeInTheDocument();
    expect(screen.getByLabelText('City / region')).toBeInTheDocument();
  });

  it('does NOT render "Clear all filters" when no filter is active', () => {
    renderFilters();
    expect(screen.queryByText('Clear all filters')).not.toBeInTheDocument();
  });

  it('renders "Clear all filters" when a search term is active', () => {
    renderFilters({ search: 'react' });
    expect(screen.getByText('Clear all filters')).toBeInTheDocument();
  });

  it('calls onType when job type select changes', () => {
    const { props } = renderFilters();
    fireEvent.change(screen.getByLabelText('Job type'), { target: { value: 'FULL_TIME' } });
    expect(props.onType).toHaveBeenCalledWith('FULL_TIME');
  });

  it('calls onRemote(true) when "Remote only" is selected', () => {
    const { props } = renderFilters();
    fireEvent.change(screen.getByLabelText('Work location'), { target: { value: 'true' } });
    expect(props.onRemote).toHaveBeenCalledWith(true);
  });

  it('calls onRemote(null) when "All locations" is selected', () => {
    const { props } = renderFilters({ remote: true });
    fireEvent.change(screen.getByLabelText('Work location'), { target: { value: 'all' } });
    expect(props.onRemote).toHaveBeenCalledWith(null);
  });

  it('calls onLocation when location input changes', () => {
    const { props } = renderFilters();
    fireEvent.change(screen.getByLabelText('City / region'), { target: { value: 'Austin' } });
    expect(props.onLocation).toHaveBeenCalledWith('Austin');
  });

  it('calls onSort when sort select changes', () => {
    const { props } = renderFilters();
    fireEvent.change(screen.getByLabelText('Sort by'), { target: { value: 'salary' } });
    expect(props.onSort).toHaveBeenCalledWith('salary');
  });

  it('calls onReset when "Clear all filters" is clicked', () => {
    const { props } = renderFilters({ type: 'CONTRACT' });
    fireEvent.click(screen.getByText('Clear all filters'));
    expect(props.onReset).toHaveBeenCalled();
  });
});
