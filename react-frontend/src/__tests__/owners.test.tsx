import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import OwnerList from '../components/owners/OwnerList';
import OwnerAdd from '../components/owners/OwnerAdd';
import OwnerDetail from '../components/owners/OwnerDetail';
import OwnerEdit from '../components/owners/OwnerEdit';

function renderWithRouter(ui: React.ReactElement, { route = '/' } = {}) {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
}

describe('Owner search', () => {
  it('displays all owners on initial load', async () => {
    renderWithRouter(<OwnerList />);
    await waitFor(() => {
      expect(screen.getByText('George Franklin')).toBeInTheDocument();
      expect(screen.getByText('Betty Davis')).toBeInTheDocument();
    });
  });

  it('filters owners by last name', async () => {
    const user = userEvent.setup();
    renderWithRouter(<OwnerList />);

    await waitFor(() => expect(screen.getByText('George Franklin')).toBeInTheDocument());

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'Davis');
    await user.click(screen.getByRole('button', { name: /find owner/i }));

    await waitFor(() => {
      expect(screen.getByText('Betty Davis')).toBeInTheDocument();
      expect(screen.queryByText('George Franklin')).not.toBeInTheDocument();
    });
  });

  it('shows message when no owners match', async () => {
    const user = userEvent.setup();
    renderWithRouter(<OwnerList />);

    await waitFor(() => expect(screen.getByText('George Franklin')).toBeInTheDocument());

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'Zzzzz');
    await user.click(screen.getByRole('button', { name: /find owner/i }));

    await waitFor(() => {
      expect(screen.getByText(/No owners with LastName starting with/)).toBeInTheDocument();
    });
  });
});

describe('Owner create', () => {
  it('renders the new owner form with required fields', () => {
    renderWithRouter(<OwnerAdd />);
    expect(screen.getByText('New Owner')).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/telephone/i)).toBeInTheDocument();
  });

  it('validates first name pattern (letters only)', async () => {
    const user = userEvent.setup();
    renderWithRouter(<OwnerAdd />);

    const firstNameInput = screen.getByLabelText(/first name/i);
    await user.type(firstNameInput, '123');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/first name must consist of letters only/i)).toBeInTheDocument();
    });
  });

  it('submits form and navigates to owners list', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/owners/add']}>
        <Routes>
          <Route path="/owners/add" element={<OwnerAdd />} />
          <Route path="/owners" element={<div>Owners List Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/address/i), '123 Main St');
    await user.type(screen.getByLabelText(/city/i), 'Springfield');
    await user.type(screen.getByLabelText(/telephone/i), '1234567890');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText('Owners List Page')).toBeInTheDocument();
    });
  });
});

describe('Owner edit', () => {
  it('loads owner data and displays in form', async () => {
    render(
      <MemoryRouter initialEntries={['/owners/1/edit']}>
        <Routes>
          <Route path="/owners/:id/edit" element={<OwnerEdit />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('George')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Franklin')).toBeInTheDocument();
    });
  });
});

describe('Owner detail', () => {
  it('displays owner information and pets', async () => {
    render(
      <MemoryRouter initialEntries={['/owners/1']}>
        <Routes>
          <Route path="/owners/:id" element={<OwnerDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('George Franklin')).toBeInTheDocument();
      expect(screen.getByText('110 W. Liberty St.')).toBeInTheDocument();
      expect(screen.getByText('Madison')).toBeInTheDocument();
      expect(screen.getByText('6085551023')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Leo')).toBeInTheDocument();
    });
  });

  it('shows Edit Owner and Add New Pet buttons', async () => {
    render(
      <MemoryRouter initialEntries={['/owners/1']}>
        <Routes>
          <Route path="/owners/:id" element={<OwnerDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /edit owner/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add new pet/i })).toBeInTheDocument();
    });
  });
});

describe('Owner delete', () => {
  it('owner detail shows back button to navigate to list', async () => {
    render(
      <MemoryRouter initialEntries={['/owners/1']}>
        <Routes>
          <Route path="/owners/:id" element={<OwnerDetail />} />
          <Route path="/owners" element={<div>Owners List Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: /back/i }));

    await waitFor(() => {
      expect(screen.getByText('Owners List Page')).toBeInTheDocument();
    });
  });
});
