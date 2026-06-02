import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { server } from '../test/mocks/server';
import { http, HttpResponse } from 'msw';

import VisitList from '../components/visits/VisitList';
import VisitAdd from '../components/visits/VisitAdd';

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

describe('Visit List', () => {
  it('displays a list of visits', async () => {
    renderWithRouter(
      <Routes>
        <Route path="/" element={<VisitList />} />
      </Routes>
    );

    await waitFor(() => {
      expect(screen.getByText('Annual checkup')).toBeInTheDocument();
      expect(screen.getByText('2023-01-01')).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    renderWithRouter(
      <Routes>
        <Route path="/" element={<VisitList />} />
      </Routes>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('handles network error gracefully', async () => {
    server.use(
      http.get('http://localhost:9966/petclinic/api/visits', () => {
        return HttpResponse.error();
      })
    );

    renderWithRouter(
      <Routes>
        <Route path="/" element={<VisitList />} />
      </Routes>
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});

describe('Visit Add', () => {
  it('creates a new visit for a pet', async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <Routes>
        <Route path="/owners/:ownerId/pets/:petId/visits/new" element={<VisitAdd />} />
        <Route path="/owners/:ownerId" element={<div>Owner Detail</div>} />
      </Routes>,
      { route: '/owners/1/pets/1/visits/new' }
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/date/i), '2023-06-15');
    await user.type(screen.getByLabelText(/description/i), 'Vaccination');

    await user.click(screen.getByRole('button', { name: /submit|save|add/i }));

    await waitFor(() => {
      expect(screen.getByText('Owner Detail')).toBeInTheDocument();
    });
  });

  it('shows validation errors for empty required fields', async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <Routes>
        <Route path="/owners/:ownerId/pets/:petId/visits/new" element={<VisitAdd />} />
      </Routes>,
      { route: '/owners/1/pets/1/visits/new' }
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /submit|save|add/i }));

    await waitFor(() => {
      expect(screen.getAllByText(/required/i).length).toBeGreaterThan(0);
    });
  });

  it('handles API error on submit', async () => {
    server.use(
      http.post('http://localhost:9966/petclinic/api/owners/:ownerId/pets/:petId/visits', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    const user = userEvent.setup();
    renderWithRouter(
      <Routes>
        <Route path="/owners/:ownerId/pets/:petId/visits/new" element={<VisitAdd />} />
      </Routes>,
      { route: '/owners/1/pets/1/visits/new' }
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/date/i), '2023-06-15');
    await user.type(screen.getByLabelText(/description/i), 'Vaccination');

    await user.click(screen.getByRole('button', { name: /submit|save|add/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
