import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import VisitAdd from '../components/visits/VisitAdd';
import VisitList from '../components/visits/VisitList';
import type { Visit, Pet } from '../types';

const sampleVisits: Visit[] = [
  { id: 1, date: '2023-01-01', description: 'rabies shot', pet: {} as Pet, petId: 1 },
  { id: 2, date: '2023-06-15', description: 'checkup', pet: {} as Pet, petId: 1 },
];

describe('Visit creation', () => {
  it('renders visit form with date and description fields', async () => {
    render(
      <MemoryRouter initialEntries={['/pets/1/visits/add']}>
        <Routes>
          <Route path="/pets/:id/visits/add" element={<VisitAdd />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    });
  });

  it('shows current pet info', async () => {
    render(
      <MemoryRouter initialEntries={['/pets/1/visits/add']}>
        <Routes>
          <Route path="/pets/:id/visits/add" element={<VisitAdd />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Leo')).toBeInTheDocument();
      expect(screen.getByText('cat')).toBeInTheDocument();
    });
  });

  it('submits visit and navigates to owner detail', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/pets/1/visits/add']}>
        <Routes>
          <Route path="/pets/:id/visits/add" element={<VisitAdd />} />
          <Route path="/owners/:id" element={<div>Owner Detail Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/date/i), '2024-03-15');
    await user.type(screen.getByLabelText(/description/i), 'annual checkup');
    await user.click(screen.getByRole('button', { name: /add visit/i }));

    await waitFor(() => {
      expect(screen.getByText('Owner Detail Page')).toBeInTheDocument();
    });
  });
});

describe('Visit history display', () => {
  it('renders a list of visits with dates and descriptions', () => {
    render(
      <MemoryRouter>
        <VisitList visits={sampleVisits} />
      </MemoryRouter>
    );

    expect(screen.getByText('2023-01-01')).toBeInTheDocument();
    expect(screen.getByText('rabies shot')).toBeInTheDocument();
    expect(screen.getByText('2023-06-15')).toBeInTheDocument();
    expect(screen.getByText('checkup')).toBeInTheDocument();
  });

  it('shows "No visits" when list is empty', () => {
    render(
      <MemoryRouter>
        <VisitList visits={[]} />
      </MemoryRouter>
    );

    expect(screen.getByText(/no visits/i)).toBeInTheDocument();
  });

  it('provides edit and delete buttons for each visit', () => {
    render(
      <MemoryRouter>
        <VisitList visits={sampleVisits} />
      </MemoryRouter>
    );

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });
});
