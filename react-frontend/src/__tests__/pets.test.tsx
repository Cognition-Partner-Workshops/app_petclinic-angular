import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PetList from '../pages/pets/PetList';
import PetAdd from '../pages/pets/PetAdd';
import PetEdit from '../pages/pets/PetEdit';

function renderWithRouter(ui: React.ReactElement, { route = '/' } = {}) {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
}

describe('PetList', () => {
  it('should display all pets fetched from the API', async () => {
    renderWithRouter(
      <Routes>
        <Route path="/" element={<PetList />} />
      </Routes>,
    );

    await waitFor(() => {
      expect(screen.getByText('Leo')).toBeInTheDocument();
    });
    expect(screen.getByText('Basil')).toBeInTheDocument();
  });

  it('should display pet type information', async () => {
    renderWithRouter(
      <Routes>
        <Route path="/" element={<PetList />} />
      </Routes>,
    );

    await waitFor(() => {
      expect(screen.getByText('cat')).toBeInTheDocument();
    });
    expect(screen.getByText('hamster')).toBeInTheDocument();
  });
});

describe('Pet Detail (by ID)', () => {
  it('should display a single pet with owner and visit data', async () => {
    renderWithRouter(
      <Routes>
        <Route path="/pets/:id" element={<PetEdit />} />
      </Routes>,
      { route: '/pets/1' },
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Leo')).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue('2020-09-07')).toBeInTheDocument();
  });
});

describe('PetAdd', () => {
  it('should render the add pet form and submit under an owner', async () => {
    const user = userEvent.setup();

    renderWithRouter(
      <Routes>
        <Route path="/owners/:ownerId/pets/add" element={<PetAdd />} />
      </Routes>,
      { route: '/owners/1/pets/add' },
    );

    await waitFor(() => {
      expect(
        screen.getByRole('textbox', { name: /name/i }),
      ).toBeInTheDocument();
    });

    await user.type(
      screen.getByRole('textbox', { name: /name/i }),
      'Buddy',
    );

    const dateInput = screen.getByLabelText(/birth date/i);
    await user.clear(dateInput);
    await user.type(dateInput, '2022-05-15');

    const submitButton = screen.getByRole('button', { name: /save|submit|add/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
  });
});

describe('PetEdit', () => {
  it('should pre-populate pet data and allow editing', async () => {
    const user = userEvent.setup();

    renderWithRouter(
      <Routes>
        <Route path="/pets/:id/edit" element={<PetEdit />} />
      </Routes>,
      { route: '/pets/1/edit' },
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Leo')).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue('2020-09-07')).toBeInTheDocument();

    const nameInput = screen.getByDisplayValue('Leo');
    await user.clear(nameInput);
    await user.type(nameInput, 'Leonardo');

    const submitButton = screen.getByRole('button', { name: /save|update|submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
  });
});

describe('Pet Delete', () => {
  it('should delete a pet when the delete action is triggered', async () => {
    const user = userEvent.setup();

    renderWithRouter(
      <Routes>
        <Route path="/pets" element={<PetList />} />
      </Routes>,
      { route: '/pets' },
    );

    await waitFor(() => {
      expect(screen.getByText('Leo')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText('Leo')).not.toBeInTheDocument();
    });
  });
});
