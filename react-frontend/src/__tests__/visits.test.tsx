import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { server } from './setup';
import { visits } from './mocks/data';
import { VisitList } from '../components/VisitList';
import { VisitForm } from '../components/VisitForm';

// ─── List visits ────────────────────────────────────────────────────────────

describe('VisitList', () => {
  it('renders all visits', async () => {
    render(
      <MemoryRouter>
        <VisitList />
      </MemoryRouter>,
    );

    for (const v of visits) {
      await waitFor(() => {
        expect(screen.getByText(v.description)).toBeInTheDocument();
      });
    }
  });

  it('shows error on server failure', async () => {
    server.use(
      http.get('http://localhost:9966/petclinic/api/visits', () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    render(
      <MemoryRouter>
        <VisitList />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/500/);
    });
  });
});

// ─── Get visit by ID ────────────────────────────────────────────────────────

describe('VisitForm — get by ID', () => {
  it('fetches and displays visit detail', async () => {
    render(
      <MemoryRouter>
        <VisitForm visit={visits[0]} />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('visit-detail')).toHaveTextContent('rabies shot');
    });
  });

  it('shows error for non-existent visit', async () => {
    const fakeVisit = { ...visits[0], id: 999 };
    render(
      <MemoryRouter>
        <VisitForm visit={fakeVisit} />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/404/);
    });
  });
});

// ─── Create visit (POST /owners/{ownerId}/pets/{petId}/visits) ──────────────

describe('VisitForm — create', () => {
  it('creates a new visit', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <VisitForm ownerId={1} petId={1} />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/date/i), '2024-06-01');
    await user.type(screen.getByLabelText(/description/i), 'annual checkup');
    await user.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Visit created');
    });
  });

  it('shows error when pet does not exist', async () => {
    server.use(
      http.post(
        'http://localhost:9966/petclinic/api/owners/:ownerId/pets/:petId/visits',
        () => {
          return new HttpResponse(null, { status: 404 });
        },
      ),
    );

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <VisitForm ownerId={1} petId={999} />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/description/i), 'test');
    await user.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/404/);
    });
  });
});

// ─── Update visit ───────────────────────────────────────────────────────────

describe('VisitForm — update', () => {
  it('updates an existing visit', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <VisitForm visit={visits[0]} />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('visit-detail')).toBeInTheDocument();
    });

    const descInput = screen.getByLabelText(/description/i);
    await user.clear(descInput);
    await user.type(descInput, 'updated checkup');
    await user.click(screen.getByRole('button', { name: /update/i }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Visit updated');
    });
  });

  it('shows error when updating non-existent visit', async () => {
    const fakeVisit = { ...visits[0], id: 999 };
    render(
      <MemoryRouter>
        <VisitForm visit={fakeVisit} />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/404/);
    });
  });
});

// ─── Delete visit ───────────────────────────────────────────────────────────

describe('VisitForm — delete', () => {
  it('deletes an existing visit', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <VisitForm visit={visits[0]} />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('visit-detail')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Visit deleted');
    });
  });

  it('shows error when deleting non-existent visit', async () => {
    server.use(
      http.delete('http://localhost:9966/petclinic/api/visits/:visitId', () => {
        return new HttpResponse(null, { status: 404 });
      }),
    );

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <VisitForm visit={visits[0]} />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('visit-detail')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/404/);
    });
  });
});
