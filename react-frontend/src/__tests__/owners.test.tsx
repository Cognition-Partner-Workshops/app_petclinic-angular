import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import OwnerList from '../pages/owners/OwnerList';
import OwnerDetail from '../pages/owners/OwnerDetail';
import OwnerAdd from '../pages/owners/OwnerAdd';
import OwnerEdit from '../pages/owners/OwnerEdit';

function renderWithRouter(ui: React.ReactElement, { route = '/' } = {}) {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
}

describe('OwnerList', () => {
  it('should display all owners fetched from the API', async () => {
    renderWithRouter(
      <Routes>
        <Route path="/" element={<OwnerList />} />
      </Routes>,
    );

    await waitFor(() => {
      expect(screen.getByText('George')).toBeInTheDocument();
    });
    expect(screen.getByText('Franklin')).toBeInTheDocument();
    expect(screen.getByText('Betty')).toBeInTheDocument();
    expect(screen.getByText('Davis')).toBeInTheDocument();
    expect(screen.getByText('Eduardo')).toBeInTheDocument();
    expect(screen.getByText('Rodriguez')).toBeInTheDocument();
  });

  it('should search owners by last name', async () => {
    const user = userEvent.setup();

    renderWithRouter(
      <Routes>
        <Route path="/" element={<OwnerList />} />
      </Routes>,
    );

    await waitFor(() => {
      expect(screen.getByText('George')).toBeInTheDocument();
    });

    const searchInput = screen.getByRole('textbox');
    await user.clear(searchInput);
    await user.type(searchInput, 'Davis');

    const searchButton = screen.getByRole('button', { name: /search/i });
    await user.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Betty')).toBeInTheDocument();
    });
    expect(screen.queryByText('George')).not.toBeInTheDocument();
  });
});

describe('OwnerDetail', () => {
  it('should display owner details when navigating to /owners/:id', async () => {
    renderWithRouter(
      <Routes>
        <Route path="/owners/:id" element={<OwnerDetail />} />
      </Routes>,
      { route: '/owners/1' },
    );

    await waitFor(() => {
      expect(screen.getByText('George')).toBeInTheDocument();
    });
    expect(screen.getByText('Franklin')).toBeInTheDocument();
    expect(screen.getByText('110 W. Liberty St.')).toBeInTheDocument();
    expect(screen.getByText('Madison')).toBeInTheDocument();
    expect(screen.getByText('6085551023')).toBeInTheDocument();
  });

  it('should display pets belonging to the owner', async () => {
    renderWithRouter(
      <Routes>
        <Route path="/owners/:id" element={<OwnerDetail />} />
      </Routes>,
      { route: '/owners/1' },
    );

    await waitFor(() => {
      expect(screen.getByText('Leo')).toBeInTheDocument();
    });
  });
});

describe('OwnerAdd', () => {
  it('should render the add owner form and submit new owner data', async () => {
    const user = userEvent.setup();

    renderWithRouter(
      <Routes>
        <Route path="/owners/add" element={<OwnerAdd />} />
      </Routes>,
      { route: '/owners/add' },
    );

    await waitFor(() => {
      expect(
        screen.getByRole('textbox', { name: /first name/i }),
      ).toBeInTheDocument();
    });

    await user.type(
      screen.getByRole('textbox', { name: /first name/i }),
      'Harold',
    );
    await user.type(
      screen.getByRole('textbox', { name: /last name/i }),
      'Thompson',
    );
    await user.type(
      screen.getByRole('textbox', { name: /address/i }),
      '123 Main St.',
    );
    await user.type(
      screen.getByRole('textbox', { name: /city/i }),
      'Springfield',
    );
    await user.type(
      screen.getByRole('textbox', { name: /telephone/i }),
      '5551234567',
    );

    const submitButton = screen.getByRole('button', { name: /save|submit|add/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
  });
});

describe('OwnerEdit', () => {
  it('should pre-populate owner data and allow editing', async () => {
    const user = userEvent.setup();

    renderWithRouter(
      <Routes>
        <Route path="/owners/:id/edit" element={<OwnerEdit />} />
      </Routes>,
      { route: '/owners/1/edit' },
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('George')).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue('Franklin')).toBeInTheDocument();
    expect(screen.getByDisplayValue('110 W. Liberty St.')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Madison')).toBeInTheDocument();
    expect(screen.getByDisplayValue('6085551023')).toBeInTheDocument();

    const firstNameInput = screen.getByDisplayValue('George');
    await user.clear(firstNameInput);
    await user.type(firstNameInput, 'Jorge');

    const submitButton = screen.getByRole('button', { name: /save|update|submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
  });
});

describe('Owner Delete', () => {
  it('should delete an owner when the delete action is triggered', async () => {
    const user = userEvent.setup();

    renderWithRouter(
      <Routes>
        <Route path="/owners/:id" element={<OwnerDetail />} />
      </Routes>,
      { route: '/owners/1' },
    );

    await waitFor(() => {
      expect(screen.getByText('George')).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText('George')).not.toBeInTheDocument();
    });
  });
});
