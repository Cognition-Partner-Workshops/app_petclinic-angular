import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { beforeAll, afterAll, afterEach, describe, it, expect } from 'vitest';
import { server } from './mocks/server';
import VisitList from '../components/VisitList';
import VisitDetail from '../components/VisitDetail';
import VisitForm from '../components/VisitForm';

const API_BASE = 'http://localhost:9966/petclinic/api';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderWithRouter(ui: React.ReactElement, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/visits" element={<VisitList />} />
        <Route path="/visits/:id" element={<VisitDetail />} />
        <Route path="/visits/:id/edit" element={<VisitForm mode="edit" />} />
        <Route
          path="/owners/:ownerId/pets/:petId/visits/add"
          element={<VisitForm mode="add" />}
        />
        <Route path="*" element={ui} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Visit Management', () => {
  it('lists all visits', async () => {
    renderWithRouter(<VisitList />, { route: '/visits' });
    await waitFor(() => {
      expect(screen.getByText(/annual checkup/)).toBeInTheDocument();
    });
    expect(screen.getByText(/2024-01-15/)).toBeInTheDocument();
  });

  it('views visit detail', async () => {
    renderWithRouter(<VisitDetail />, { route: '/visits/1' });
    await waitFor(() => {
      expect(screen.getByText(/annual checkup/)).toBeInTheDocument();
    });
    expect(screen.getByText(/2024-01-15/)).toBeInTheDocument();
  });

  it('creates a visit under owner pet', async () => {
    const user = userEvent.setup();
    renderWithRouter(<VisitForm mode="add" />, {
      route: '/owners/1/pets/1/visits/add',
    });

    await user.type(screen.getByLabelText('Visit Date'), '2024-06-01');
    await user.type(screen.getByLabelText('Description'), 'vaccination');
    await user.click(screen.getByRole('button', { name: /Create/ }));

    await waitFor(() => {
      expect(screen.getByText('Visit created')).toBeInTheDocument();
    });
  });

  it('updates a visit', async () => {
    let updateCalled = false;
    server.use(
      http.put(`${API_BASE}/visits/:visitId`, () => {
        updateCalled = true;
        return new HttpResponse(null, { status: 204 });
      })
    );

    const response = await fetch(`${API_BASE}/visits/1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 1,
        date: '2024-01-15',
        description: 'updated description',
      }),
    });

    expect(response.status).toBe(204);
    expect(updateCalled).toBe(true);
    const body = await response.text();
    expect(body).toBe('');
  });

  it('deletes a visit', async () => {
    let deleteCalled = false;
    server.use(
      http.delete(`${API_BASE}/visits/:visitId`, () => {
        deleteCalled = true;
        return new HttpResponse(null, { status: 204 });
      })
    );

    const response = await fetch(`${API_BASE}/visits/1`, { method: 'DELETE' });
    expect(response.status).toBe(204);
    expect(deleteCalled).toBe(true);
    const body = await response.text();
    expect(body).toBe('');
  });
});
