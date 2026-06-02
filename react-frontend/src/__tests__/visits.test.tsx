import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import VisitList from '../pages/visits/VisitList';
import VisitAdd from '../pages/visits/VisitAdd';
import VisitEdit from '../pages/visits/VisitEdit';

function renderWithRouter(ui: React.ReactElement, { route = '/' } = {}) {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
}

describe('VisitList', () => {
  it('should display all visits fetched from the API', async () => {
    renderWithRouter(
      <Routes>
        <Route path="/" element={<VisitList />} />
      </Routes>,
    );

    await waitFor(() => {
      expect(screen.getByText('Rabies shot')).toBeInTheDocument();
    });
    expect(screen.getByText('Annual checkup')).toBeInTheDocument();
  });

  it('should display visit dates', async () => {
    renderWithRouter(
      <Routes>
        <Route path="/" element={<VisitList />} />
      </Routes>,
    );

    await waitFor(() => {
      expect(screen.getByText('2024-03-10')).toBeInTheDocument();
    });
    expect(screen.getByText('2024-05-20')).toBeInTheDocument();
  });
});

describe('Visit Detail (by ID)', () => {
  it('should display a single visit with pet information', async () => {
    renderWithRouter(
      <Routes>
        <Route path="/visits/:id/edit" element={<VisitEdit />} />
      </Routes>,
      { route: '/visits/1/edit' },
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Rabies shot')).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue('2024-03-10')).toBeInTheDocument();
  });
});

describe('VisitAdd', () => {
  it('should render the add visit form and submit for a specific pet', async () => {
    const user = userEvent.setup();

    renderWithRouter(
      <Routes>
        <Route
          path="/owners/:ownerId/pets/:petId/visits/add"
          element={<VisitAdd />}
        />
      </Routes>,
      { route: '/owners/1/pets/1/visits/add' },
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    });

    const dateInput = screen.getByLabelText(/date/i);
    await user.clear(dateInput);
    await user.type(dateInput, '2024-06-01');

    const descInput = screen.getByRole('textbox', { name: /description/i });
    await user.type(descInput, 'Vaccination booster');

    const submitButton = screen.getByRole('button', { name: /save|submit|add/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
  });
});

describe('VisitEdit', () => {
  it('should pre-populate visit data and allow editing', async () => {
    const user = userEvent.setup();

    renderWithRouter(
      <Routes>
        <Route path="/visits/:id/edit" element={<VisitEdit />} />
      </Routes>,
      { route: '/visits/1/edit' },
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Rabies shot')).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue('2024-03-10')).toBeInTheDocument();

    const descInput = screen.getByDisplayValue('Rabies shot');
    await user.clear(descInput);
    await user.type(descInput, 'Updated rabies shot description');

    const submitButton = screen.getByRole('button', { name: /save|update|submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
  });
});

describe('Visit Delete', () => {
  it('should delete a visit when the delete action is triggered', async () => {
    const user = userEvent.setup();

    renderWithRouter(
      <Routes>
        <Route path="/" element={<VisitList />} />
      </Routes>,
    );

    await waitFor(() => {
      expect(screen.getByText('Rabies shot')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText('Rabies shot')).not.toBeInTheDocument();
    });
  });
});
