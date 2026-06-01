import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import VetList from '../components/vets/VetList';

describe('Vet list', () => {
  it('displays all vets on load', async () => {
    render(
      <MemoryRouter>
        <VetList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('James Carter')).toBeInTheDocument();
      expect(screen.getByText('Helen Leary')).toBeInTheDocument();
      expect(screen.getByText('Linda Douglas')).toBeInTheDocument();
    });
  });

  it('shows specialties for each vet', async () => {
    render(
      <MemoryRouter>
        <VetList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('radiology')).toBeInTheDocument();
      expect(screen.getByText('surgery')).toBeInTheDocument();
      expect(screen.getByText('dentistry')).toBeInTheDocument();
    });
  });

  it('filters vets by specialty name', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <VetList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('James Carter')).toBeInTheDocument();
    });

    const filterInput = screen.getByPlaceholderText(/type a specialty name/i);
    await user.type(filterInput, 'radiology');

    await waitFor(() => {
      expect(screen.getByText('Helen Leary')).toBeInTheDocument();
      expect(screen.queryByText('James Carter')).not.toBeInTheDocument();
      expect(screen.queryByText('Linda Douglas')).not.toBeInTheDocument();
    });
  });

  it('shows all vets when filter is cleared', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <VetList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('James Carter')).toBeInTheDocument();
    });

    const filterInput = screen.getByPlaceholderText(/type a specialty name/i);
    await user.type(filterInput, 'surgery');

    await waitFor(() => {
      expect(screen.queryByText('James Carter')).not.toBeInTheDocument();
    });

    await user.clear(filterInput);

    await waitFor(() => {
      expect(screen.getByText('James Carter')).toBeInTheDocument();
      expect(screen.getByText('Helen Leary')).toBeInTheDocument();
      expect(screen.getByText('Linda Douglas')).toBeInTheDocument();
    });
  });

  it('provides Edit and Delete buttons for each vet', async () => {
    render(
      <MemoryRouter>
        <VetList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('James Carter')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByRole('button', { name: /edit vet/i });
    const deleteButtons = screen.getAllByRole('button', { name: /delete vet/i });
    expect(editButtons).toHaveLength(3);
    expect(deleteButtons).toHaveLength(3);
  });
});
