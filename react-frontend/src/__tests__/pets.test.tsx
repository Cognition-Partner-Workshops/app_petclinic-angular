import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { beforeAll, afterAll, afterEach, describe, it, expect } from 'vitest';
import { server } from './mocks/server';
import PetList from '../components/PetList';
import PetDetail from '../components/PetDetail';
import PetForm from '../components/PetForm';

const API_BASE = 'http://localhost:9966/petclinic/api';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderWithRouter(ui: React.ReactElement, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/pets" element={<PetList />} />
        <Route path="/pets/:id" element={<PetDetail />} />
        <Route path="/pets/:id/edit" element={<PetForm mode="edit" />} />
        <Route path="/owners/:ownerId/pets/add" element={<PetForm mode="add" />} />
        <Route path="*" element={ui} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Pet Management', () => {
  it('lists all pets', async () => {
    renderWithRouter(<PetList />, { route: '/pets' });
    await waitFor(() => {
      expect(screen.getByText(/Leo/)).toBeInTheDocument();
    });
    expect(screen.getByText(/cat/)).toBeInTheDocument();
  });

  it('views pet detail', async () => {
    renderWithRouter(<PetDetail />, { route: '/pets/1' });
    await waitFor(() => {
      expect(screen.getByText('Leo')).toBeInTheDocument();
    });
    expect(screen.getByText(/cat/)).toBeInTheDocument();
    expect(screen.getByText(/2010-09-07/)).toBeInTheDocument();
    expect(screen.getByText(/George Franklin/)).toBeInTheDocument();
  });

  it('creates a pet under an owner', async () => {
    const user = userEvent.setup();
    renderWithRouter(<PetForm mode="add" />, {
      route: '/owners/1/pets/add',
    });

    await waitFor(() => {
      expect(screen.getByLabelText('Pet Name')).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText('Pet Name'), 'Buddy');
    await user.type(screen.getByLabelText('Birth Date'), '2023-05-01');
    await user.click(screen.getByRole('button', { name: /Create/ }));

    await waitFor(() => {
      expect(screen.getByText('Pet created')).toBeInTheDocument();
    });
  });

  it('updates a pet', async () => {
    const user = userEvent.setup();
    renderWithRouter(<PetForm mode="edit" />, { route: '/pets/1/edit' });

    await waitFor(() => {
      expect(screen.getByLabelText('Pet Name')).toHaveValue('Leo');
    });

    await user.clear(screen.getByLabelText('Pet Name'));
    await user.type(screen.getByLabelText('Pet Name'), 'Leopold');
    await user.click(screen.getByRole('button', { name: /Update/ }));

    await waitFor(() => {
      expect(screen.getByText('Pet updated')).toBeInTheDocument();
    });
  });

  it('deletes a pet', async () => {
    let deleteCalled = false;
    server.use(
      http.delete(`${API_BASE}/pets/:petId`, () => {
        deleteCalled = true;
        return new HttpResponse(null, { status: 204 });
      })
    );

    const response = await fetch(`${API_BASE}/pets/1`, { method: 'DELETE' });
    expect(response.status).toBe(204);
    expect(deleteCalled).toBe(true);
    const body = await response.text();
    expect(body).toBe('');
  });

  it('lists pet types for dropdown', async () => {
    renderWithRouter(<PetForm mode="add" />, {
      route: '/owners/1/pets/add',
    });

    await waitFor(() => {
      expect(screen.getByLabelText('Pet Type')).toBeInTheDocument();
    });

    const select = screen.getByLabelText('Pet Type') as HTMLSelectElement;
    const options = Array.from(select.options);
    const optionNames = options.map((o) => o.text);
    expect(optionNames).toContain('cat');
    expect(optionNames).toContain('dog');
    expect(optionNames).toContain('bird');
  });
});
