import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { server } from './setup';
import { owners } from './mocks/data';
import { OwnerList } from '../components/OwnerList';
import { OwnerDetail } from '../components/OwnerDetail';
import { OwnerForm } from '../components/OwnerForm';

// ─── List owners ────────────────────────────────────────────────────────────

describe('OwnerList', () => {
  it('renders all owners', async () => {
    render(
      <MemoryRouter>
        <OwnerList />
      </MemoryRouter>,
    );

    for (const o of owners) {
      await waitFor(() => {
        expect(screen.getByText(new RegExp(o.lastName))).toBeInTheDocument();
      });
    }
  });

  it('filters owners by lastName search', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <OwnerList />
      </MemoryRouter>,
    );

    await screen.findByText(/Franklin/);

    const input = screen.getByLabelText('Search by last name');
    await user.clear(input);
    await user.type(input, 'Davis');
    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByText(/Davis/)).toBeInTheDocument();
      expect(screen.queryByText(/Franklin/)).not.toBeInTheDocument();
    });
  });

  it('shows error on server failure', async () => {
    server.use(
      http.get('http://localhost:9966/petclinic/api/owners', () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    render(
      <MemoryRouter>
        <OwnerList />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/500/);
    });
  });
});

// ─── Get owner by ID ────────────────────────────────────────────────────────

describe('OwnerDetail', () => {
  it('renders owner details', async () => {
    render(
      <MemoryRouter initialEntries={['/owners/1']}>
        <Routes>
          <Route path="/owners/:id" element={<OwnerDetail />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/George Franklin/)).toBeInTheDocument();
      expect(screen.getByText(/110 W. Liberty St./)).toBeInTheDocument();
    });
  });

  it('shows error for non-existent owner', async () => {
    render(
      <MemoryRouter initialEntries={['/owners/999']}>
        <Routes>
          <Route path="/owners/:id" element={<OwnerDetail />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/404/);
    });
  });
});

// ─── Create owner ───────────────────────────────────────────────────────────

describe('OwnerForm — create', () => {
  it('creates a new owner', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <OwnerForm />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/first name/i), 'Alice');
    await user.type(screen.getByLabelText(/last name/i), 'Smith');
    await user.type(screen.getByLabelText(/address/i), '123 Elm St');
    await user.type(screen.getByLabelText(/city/i), 'Portland');
    await user.type(screen.getByLabelText(/telephone/i), '5551234567');
    await user.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Owner created');
    });
  });

  it('shows validation error when lastName is empty', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <OwnerForm />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/first name/i), 'Alice');
    // skip lastName
    await user.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        /lastName must not be empty/,
      );
    });
  });
});

// ─── Update owner ───────────────────────────────────────────────────────────

describe('OwnerForm — update', () => {
  it('updates an existing owner', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <OwnerForm owner={owners[0]} />
      </MemoryRouter>,
    );

    const firstNameInput = screen.getByLabelText(/first name/i);
    await user.clear(firstNameInput);
    await user.type(firstNameInput, 'Georgie');
    await user.click(screen.getByRole('button', { name: /update/i }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Owner updated');
    });
  });

  it('shows error when updating non-existent owner', async () => {
    const fakeOwner = { ...owners[0], id: 999 };
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <OwnerForm owner={fakeOwner} />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /update/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/404/);
    });
  });
});

// ─── Delete owner ───────────────────────────────────────────────────────────

describe('OwnerForm — delete', () => {
  it('deletes an existing owner', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <OwnerForm owner={owners[0]} />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Owner deleted');
    });
  });

  it('shows error when deleting non-existent owner', async () => {
    const fakeOwner = { ...owners[0], id: 999 };
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <OwnerForm owner={fakeOwner} />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/404/);
    });
  });
});
