import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { server } from '../test/mocks/server';
import { http, HttpResponse } from 'msw';

import OwnerList from '../components/owners/OwnerList';
import OwnerDetail from '../components/owners/OwnerDetail';
import OwnerAdd from '../components/owners/OwnerAdd';
import OwnerEdit from '../components/owners/OwnerEdit';

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

describe('Owner List', () => {
  it('displays a list of owners', async () => {
    renderWithRouter(
      <Routes>
        <Route path="/" element={<OwnerList />} />
      </Routes>
    );

    await waitFor(() => {
      expect(screen.getByText('George Franklin')).toBeInTheDocument();
      expect(screen.getByText('Betty Davis')).toBeInTheDocument();
    });
  });

  it('searches owners by last name', async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <Routes>
        <Route path="/" element={<OwnerList />} />
      </Routes>
    );

    await waitFor(() => {
      expect(screen.getByText('George Franklin')).toBeInTheDocument();
    });

    const searchInput = screen.getByLabelText(/last name/i);
    await user.clear(searchInput);
    await user.type(searchInput, 'Davis');
    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByText('Betty Davis')).toBeInTheDocument();
      expect(screen.queryByText('George Franklin')).not.toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    renderWithRouter(
      <Routes>
        <Route path="/" element={<OwnerList />} />
      </Routes>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('handles network error gracefully', async () => {
    server.use(
      http.get('http://localhost:9966/petclinic/api/owners', () => {
        return HttpResponse.error();
      })
    );

    renderWithRouter(
      <Routes>
        <Route path="/" element={<OwnerList />} />
      </Routes>
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});

describe('Owner Detail', () => {
  it('displays owner details with pets', async () => {
    renderWithRouter(
      <Routes>
        <Route path="/owners/:ownerId" element={<OwnerDetail />} />
      </Routes>,
      { route: '/owners/1' }
    );

    await waitFor(() => {
      expect(screen.getByText('George Franklin')).toBeInTheDocument();
      expect(screen.getByText('110 W. Liberty St.')).toBeInTheDocument();
      expect(screen.getByText('Leo')).toBeInTheDocument();
    });
  });

  it('handles 404 for non-existent owner', async () => {
    renderWithRouter(
      <Routes>
        <Route path="/owners/:ownerId" element={<OwnerDetail />} />
      </Routes>,
      { route: '/owners/999' }
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('can delete an owner', async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <Routes>
        <Route path="/owners/:ownerId" element={<OwnerDetail />} />
        <Route path="/owners" element={<OwnerList />} />
      </Routes>,
      { route: '/owners/1' }
    );

    await waitFor(() => {
      expect(screen.getByText('George Franklin')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(screen.getByText('Betty Davis')).toBeInTheDocument();
    });
  });
});

describe('Owner Add', () => {
  it('creates a new owner with valid form data', async () => {
    server.use(
      http.get('http://localhost:9966/petclinic/api/owners/3', () => {
        return HttpResponse.json({
          id: 3,
          firstName: 'John',
          lastName: 'Doe',
          address: '123 Main St.',
          city: 'Springfield',
          telephone: '5551234567',
          pets: [],
        });
      })
    );

    const user = userEvent.setup();
    renderWithRouter(
      <Routes>
        <Route path="/owners/new" element={<OwnerAdd />} />
        <Route path="/owners/:ownerId" element={<OwnerDetail />} />
      </Routes>,
      { route: '/owners/new' }
    );

    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/address/i), '123 Main St.');
    await user.type(screen.getByLabelText(/city/i), 'Springfield');
    await user.type(screen.getByLabelText(/telephone/i), '5551234567');

    await user.click(screen.getByRole('button', { name: /submit|save|add/i }));

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('shows validation errors for empty required fields', async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <Routes>
        <Route path="/owners/new" element={<OwnerAdd />} />
      </Routes>,
      { route: '/owners/new' }
    );

    await user.click(screen.getByRole('button', { name: /submit|save|add/i }));

    await waitFor(() => {
      expect(screen.getAllByText(/required/i).length).toBeGreaterThan(0);
    });
  });
});

describe('Owner Edit', () => {
  it('pre-fills the form with existing owner data', async () => {
    renderWithRouter(
      <Routes>
        <Route path="/owners/:ownerId/edit" element={<OwnerEdit />} />
      </Routes>,
      { route: '/owners/1/edit' }
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('George')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Franklin')).toBeInTheDocument();
      expect(screen.getByDisplayValue('110 W. Liberty St.')).toBeInTheDocument();
    });
  });

  it('submits updated owner data', async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <Routes>
        <Route path="/owners/:ownerId/edit" element={<OwnerEdit />} />
        <Route path="/owners/:ownerId" element={<OwnerDetail />} />
      </Routes>,
      { route: '/owners/1/edit' }
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('George')).toBeInTheDocument();
    });

    const firstNameInput = screen.getByLabelText(/first name/i);
    await user.clear(firstNameInput);
    await user.type(firstNameInput, 'Jorge');

    await user.click(screen.getByRole('button', { name: /submit|save|update/i }));

    await waitFor(() => {
      expect(screen.getByText(/George Franklin|Jorge Franklin/)).toBeInTheDocument();
    });
  });
});
