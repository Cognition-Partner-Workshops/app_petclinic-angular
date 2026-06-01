import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PetAdd from '../components/pets/PetAdd';
import PetEdit from '../components/pets/PetEdit';

describe('Pet add with type selection', () => {
  it('renders pet form with type dropdown populated from API', async () => {
    render(
      <MemoryRouter initialEntries={['/owners/1/pets/add']}>
        <Routes>
          <Route path="/owners/:id/pets/add" element={<PetAdd />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/birth date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      const typeSelect = screen.getByLabelText(/type/i) as HTMLSelectElement;
      const options = Array.from(typeSelect.options).map((o) => o.text);
      expect(options).toContain('cat');
      expect(options).toContain('dog');
      expect(options).toContain('lizard');
    });
  });

  it('shows the owner name from the route parameter', async () => {
    render(
      <MemoryRouter initialEntries={['/owners/1/pets/add']}>
        <Routes>
          <Route path="/owners/:id/pets/add" element={<PetAdd />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/George Franklin/)).toBeInTheDocument();
    });
  });

  it('submits new pet and navigates to owner detail', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/owners/1/pets/add']}>
        <Routes>
          <Route path="/owners/:id/pets/add" element={<PetAdd />} />
          <Route path="/owners/:id" element={<div>Owner Detail Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      const typeSelect = screen.getByLabelText(/type/i) as HTMLSelectElement;
      expect(typeSelect.options.length).toBeGreaterThan(1);
    });

    await user.type(screen.getByLabelText(/name/i), 'Buddy');
    await user.type(screen.getByLabelText(/birth date/i), '2022-05-15');
    await user.selectOptions(screen.getByLabelText(/type/i), '2');
    await user.click(screen.getByRole('button', { name: /add pet/i }));

    await waitFor(() => {
      expect(screen.getByText('Owner Detail Page')).toBeInTheDocument();
    });
  });
});

describe('Pet edit', () => {
  it('loads existing pet data into form', async () => {
    render(
      <MemoryRouter initialEntries={['/pets/1/edit']}>
        <Routes>
          <Route path="/pets/:id/edit" element={<PetEdit />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Leo')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2020-09-07')).toBeInTheDocument();
    });
  });

  it('updates pet and navigates to owner detail', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/pets/1/edit']}>
        <Routes>
          <Route path="/pets/:id/edit" element={<PetEdit />} />
          <Route path="/owners/:id" element={<div>Owner Detail Page</div>} />
          <Route path="/owners" element={<div>Owners List</div>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Leo')).toBeInTheDocument();
    });

    const nameInput = screen.getByDisplayValue('Leo');
    await user.clear(nameInput);
    await user.type(nameInput, 'Leopold');
    await user.click(screen.getByRole('button', { name: /update pet/i }));

    await waitFor(() => {
      expect(
        screen.getByText('Owner Detail Page') || screen.getByText('Owners List')
      ).toBeTruthy();
    });
  });
});
