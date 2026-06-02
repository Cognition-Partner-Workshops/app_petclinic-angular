import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { server } from './setup';
import { pets, owners } from './mocks/data';
import { PetList } from '../components/PetList';
import { PetForm } from '../components/PetForm';

// ─── List pets ──────────────────────────────────────────────────────────────

describe('PetList', () => {
  it('renders all pets', async () => {
    render(
      <MemoryRouter>
        <PetList />
      </MemoryRouter>,
    );

    for (const p of pets) {
      await waitFor(() => {
        expect(screen.getByText(p.name)).toBeInTheDocument();
      });
    }
  });

  it('shows error on server failure', async () => {
    server.use(
      http.get('http://localhost:9966/petclinic/api/pets', () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    render(
      <MemoryRouter>
        <PetList />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/500/);
    });
  });
});

// ─── Get pet by ID ──────────────────────────────────────────────────────────

describe('PetForm — get by ID', () => {
  it('fetches and displays pet detail', async () => {
    render(
      <MemoryRouter initialEntries={['/owners/1/pets/add']}>
        <Routes>
          <Route
            path="/owners/:ownerId/pets/add"
            element={<PetForm pet={pets[0]} />}
          />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('pet-detail')).toHaveTextContent('Leo');
    });
  });

  it('shows error for non-existent pet', async () => {
    const fakePet = { ...pets[0], id: 999 };
    render(
      <MemoryRouter initialEntries={['/owners/1/pets/add']}>
        <Routes>
          <Route
            path="/owners/:ownerId/pets/add"
            element={<PetForm pet={fakePet} />}
          />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/404/);
    });
  });
});

// ─── Add pet to owner (POST /owners/{ownerId}/pets) ─────────────────────────

describe('PetForm — create', () => {
  it('creates a new pet for an owner', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/owners/1/pets/add']}>
        <Routes>
          <Route path="/owners/:ownerId/pets/add" element={<PetForm />} />
        </Routes>
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/name/i), 'Fluffy');
    await user.type(screen.getByLabelText(/birth date/i), '2022-05-01');
    await user.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Pet created');
    });
  });

  it('shows error when owner does not exist', async () => {
    server.use(
      http.post(
        'http://localhost:9966/petclinic/api/owners/:ownerId/pets',
        () => {
          return new HttpResponse(null, { status: 404 });
        },
      ),
    );

    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/owners/999/pets/add']}>
        <Routes>
          <Route path="/owners/:ownerId/pets/add" element={<PetForm />} />
        </Routes>
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/name/i), 'Fluffy');
    await user.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/404/);
    });
  });
});

// ─── Update pet ─────────────────────────────────────────────────────────────

describe('PetForm — update', () => {
  it('updates an existing pet', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <PetForm pet={pets[0]} />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('pet-detail')).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Leon');
    await user.click(screen.getByRole('button', { name: /update/i }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Pet updated');
    });
  });

  it('shows error when updating non-existent pet', async () => {
    const fakePet = { ...pets[0], id: 999 };
    server.use(
      http.get('http://localhost:9966/petclinic/api/pets/999', () => {
        return new HttpResponse(null, { status: 404 });
      }),
    );

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <PetForm pet={fakePet} />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/404/);
    });
  });
});

// ─── Delete pet ─────────────────────────────────────────────────────────────

describe('PetForm — delete', () => {
  it('deletes an existing pet', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <PetForm pet={pets[0]} />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('pet-detail')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Pet deleted');
    });
  });

  it('shows error when deleting non-existent pet', async () => {
    server.use(
      http.delete('http://localhost:9966/petclinic/api/pets/:petId', () => {
        return new HttpResponse(null, { status: 404 });
      }),
    );

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <PetForm pet={pets[0]} />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('pet-detail')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/404/);
    });
  });
});
