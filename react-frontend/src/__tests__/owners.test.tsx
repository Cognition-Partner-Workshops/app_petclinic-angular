import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { beforeAll, afterAll, afterEach, describe, it, expect } from 'vitest';
import { server } from './mocks/server';
import OwnerList from '../components/OwnerList';
import OwnerDetail from '../components/OwnerDetail';
import OwnerForm from '../components/OwnerForm';

const API_BASE = 'http://localhost:9966/petclinic/api';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderWithRouter(ui: React.ReactElement, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/owners" element={<OwnerList />} />
        <Route path="/owners/add" element={<OwnerForm mode="add" />} />
        <Route path="/owners/:id" element={<OwnerDetail />} />
        <Route path="/owners/:id/edit" element={<OwnerForm mode="edit" />} />
        <Route path="*" element={ui} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Owner CRUD', () => {
  it('lists all owners', async () => {
    renderWithRouter(<OwnerList />, { route: '/owners' });
    await waitFor(() => {
      expect(screen.getByText(/George Franklin/)).toBeInTheDocument();
    });
    expect(screen.getByText(/Betty Davis/)).toBeInTheDocument();
  });

  it('searches owners by last name', async () => {
    renderWithRouter(<OwnerList />, { route: '/owners?lastName=Franklin' });
    await waitFor(() => {
      expect(screen.getByText(/George Franklin/)).toBeInTheDocument();
    });
    expect(screen.queryByText(/Betty Davis/)).not.toBeInTheDocument();
  });

  it('searches with no results', async () => {
    renderWithRouter(<OwnerList />, { route: '/owners?lastName=Nonexistent' });
    await waitFor(() => {
      expect(screen.getByText(/No owners found/)).toBeInTheDocument();
    });
  });

  it('views owner detail with nested pets and visits', async () => {
    renderWithRouter(<OwnerDetail />, { route: '/owners/1' });
    await waitFor(() => {
      expect(screen.getByText(/George Franklin/)).toBeInTheDocument();
    });
    expect(screen.getByText(/110 W. Liberty St./)).toBeInTheDocument();
    expect(screen.getByText(/Madison/)).toBeInTheDocument();
    expect(screen.getByText(/Leo/)).toBeInTheDocument();
    expect(screen.getByText(/annual checkup/)).toBeInTheDocument();
  });

  it('creates an owner', async () => {
    const user = userEvent.setup();
    renderWithRouter(<OwnerForm mode="add" />, { route: '/owners/add' });

    await user.type(screen.getByLabelText('First Name'), 'John');
    await user.type(screen.getByLabelText('Last Name'), 'Doe');
    await user.type(screen.getByLabelText('Address'), '123 Main St');
    await user.type(screen.getByLabelText('City'), 'Springfield');
    await user.type(screen.getByLabelText('Telephone'), '1234567890');
    await user.click(screen.getByRole('button', { name: /Create/ }));

    await waitFor(() => {
      expect(screen.getByText(/George Franklin/)).toBeInTheDocument();
    });
  });

  it('shows validation errors on create', async () => {
    server.use(
      http.post(`${API_BASE}/owners`, () => {
        return HttpResponse.json(
          { errors: [{ errorMessage: 'First name must not be empty' }] },
          {
            status: 400,
            headers: {
              errors: JSON.stringify([
                { errorMessage: 'First name must not be empty' },
              ]),
            },
          }
        );
      })
    );

    const user = userEvent.setup();
    renderWithRouter(<OwnerForm mode="add" />, { route: '/owners/add' });

    await user.click(screen.getByRole('button', { name: /Create/ }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        /First name must not be empty/
      );
    });
  });

  it('updates an owner', async () => {
    const user = userEvent.setup();
    renderWithRouter(<OwnerForm mode="edit" />, { route: '/owners/1/edit' });

    await waitFor(() => {
      expect(screen.getByLabelText('First Name')).toHaveValue('George');
    });

    await user.clear(screen.getByLabelText('First Name'));
    await user.type(screen.getByLabelText('First Name'), 'Updated');
    await user.click(screen.getByRole('button', { name: /Update/ }));

    await waitFor(() => {
      expect(screen.getByText(/George Franklin/)).toBeInTheDocument();
    });
  });

  it('deletes an owner', async () => {
    const user = userEvent.setup();
    renderWithRouter(<OwnerDetail />, { route: '/owners/1' });

    await waitFor(() => {
      expect(screen.getByText(/George Franklin/)).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /Delete Owner/ }));

    await waitFor(() => {
      expect(screen.getByText('Owners')).toBeInTheDocument();
    });
  });
});
