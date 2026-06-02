import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { server } from '../test/mocks/server';
import { http, HttpResponse } from 'msw';

import PetList from '../components/pets/PetList';
import PetAdd from '../components/pets/PetAdd';
import PetEdit from '../components/pets/PetEdit';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderWithRouter(ui: React.ReactElement, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      {ui}
    </MemoryRouter>
  );
}

describe('Pet List', () => {
  it('displays a list of pets', async () => {
    renderWithRouter(
      <Routes>
        <Route path="/" element={<PetList />} />
      </Routes>
    );

    await waitFor(() => {
      expect(screen.getByText('Leo')).toBeInTheDocument();
      expect(screen.getByText('Basil')).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    renderWithRouter(
      <Routes>
        <Route path="/" element={<PetList />} />
      </Routes>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('handles network error gracefully', async () => {
    server.use(
      http.get('http://localhost:9966/petclinic/api/pets', () => {
        return HttpResponse.error();
      })
    );

    renderWithRouter(
      <Routes>
        <Route path="/" element={<PetList />} />
      </Routes>
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});

describe('Pet Add', () => {
  it('creates a new pet for an owner', async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <Routes>
        <Route path="/owners/:ownerId/pets/new" element={<PetAdd />} />
        <Route path="/owners/:ownerId" element={<div>Owner Detail</div>} />
      </Routes>,
      { route: '/owners/1/pets/new' }
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/name/i), 'Rex');
    await user.type(screen.getByLabelText(/birth date/i), '2020-01-15');

    const typeSelect = screen.getByLabelText(/type/i);
    await user.selectOptions(typeSelect, 'cat');

    await user.click(screen.getByRole('button', { name: /submit|save|add/i }));

    await waitFor(() => {
      expect(screen.getByText('Owner Detail')).toBeInTheDocument();
    });
  });

  it('shows validation errors for empty required fields', async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <Routes>
        <Route path="/owners/:ownerId/pets/new" element={<PetAdd />} />
      </Routes>,
      { route: '/owners/1/pets/new' }
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /submit|save|add/i }));

    await waitFor(() => {
      expect(screen.getAllByText(/required/i).length).toBeGreaterThan(0);
    });
  });
});

describe('Pet Edit', () => {
  it('pre-fills the form with existing pet data', async () => {
    renderWithRouter(
      <Routes>
        <Route path="/pets/:petId/edit" element={<PetEdit />} />
      </Routes>,
      { route: '/pets/1/edit' }
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Leo')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2010-09-07')).toBeInTheDocument();
    });
  });

  it('submits updated pet data', async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <Routes>
        <Route path="/pets/:petId/edit" element={<PetEdit />} />
        <Route path="/owners/:ownerId" element={<div>Owner Detail</div>} />
      </Routes>,
      { route: '/pets/1/edit' }
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Leo')).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Leonard');

    await user.click(screen.getByRole('button', { name: /submit|save|update/i }));

    await waitFor(() => {
      expect(screen.getByText('Owner Detail')).toBeInTheDocument();
    });
  });

  it('can delete a pet', async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <Routes>
        <Route path="/pets/:petId/edit" element={<PetEdit />} />
        <Route path="/owners/:ownerId" element={<div>Owner Detail</div>} />
      </Routes>,
      { route: '/pets/1/edit' }
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Leo')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(screen.getByText('Owner Detail')).toBeInTheDocument();
    });
  });
});
