import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { server } from './setup';
import { vets } from './mocks/data';
import { VetList } from '../components/VetList';
import { VetForm } from '../components/VetForm';

// ─── List vets ──────────────────────────────────────────────────────────────

describe('VetList', () => {
  it('renders all vets', async () => {
    render(
      <MemoryRouter>
        <VetList />
      </MemoryRouter>,
    );

    for (const v of vets) {
      await waitFor(() => {
        expect(
          screen.getByText(new RegExp(`${v.firstName} ${v.lastName}`)),
        ).toBeInTheDocument();
      });
    }
  });

  it('renders specialties for vets that have them', async () => {
    render(
      <MemoryRouter>
        <VetList />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/radiology/)).toBeInTheDocument();
      expect(screen.getByText(/surgery, dentistry/)).toBeInTheDocument();
    });
  });

  it('shows error on server failure', async () => {
    server.use(
      http.get('http://localhost:9966/petclinic/api/vets', () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    render(
      <MemoryRouter>
        <VetList />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/500/);
    });
  });
});

// ─── Get vet by ID ──────────────────────────────────────────────────────────

describe('VetForm — get by ID', () => {
  it('fetches and displays vet detail', async () => {
    render(
      <MemoryRouter>
        <VetForm vet={vets[0]} />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('vet-detail')).toHaveTextContent('James Carter');
    });
  });

  it('shows error for non-existent vet', async () => {
    const fakeVet = { ...vets[0], id: 999 };
    render(
      <MemoryRouter>
        <VetForm vet={fakeVet} />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/404/);
    });
  });
});

// ─── Add vet ────────────────────────────────────────────────────────────────

describe('VetForm — create', () => {
  it('creates a new vet', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <VetForm />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/first name/i), 'New');
    await user.type(screen.getByLabelText(/last name/i), 'Vet');
    await user.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Vet created');
    });
  });

  it('shows error on server failure', async () => {
    server.use(
      http.post('http://localhost:9966/petclinic/api/vets', () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <VetForm />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/first name/i), 'New');
    await user.type(screen.getByLabelText(/last name/i), 'Vet');
    await user.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/500/);
    });
  });
});

// ─── Update vet ─────────────────────────────────────────────────────────────

describe('VetForm — update', () => {
  it('updates an existing vet', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <VetForm vet={vets[0]} />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('vet-detail')).toBeInTheDocument();
    });

    const firstNameInput = screen.getByLabelText(/first name/i);
    await user.clear(firstNameInput);
    await user.type(firstNameInput, 'Jimmy');
    await user.click(screen.getByRole('button', { name: /update/i }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Vet updated');
    });
  });

  it('shows error when updating non-existent vet', async () => {
    const fakeVet = { ...vets[0], id: 999 };
    render(
      <MemoryRouter>
        <VetForm vet={fakeVet} />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/404/);
    });
  });
});

// ─── Delete vet ─────────────────────────────────────────────────────────────

describe('VetForm — delete', () => {
  it('deletes an existing vet', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <VetForm vet={vets[0]} />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('vet-detail')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Vet deleted');
    });
  });

  it('shows error when deleting non-existent vet', async () => {
    server.use(
      http.delete('http://localhost:9966/petclinic/api/vets/:vetId', () => {
        return new HttpResponse(null, { status: 404 });
      }),
    );

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <VetForm vet={vets[0]} />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('vet-detail')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/404/);
    });
  });
});
