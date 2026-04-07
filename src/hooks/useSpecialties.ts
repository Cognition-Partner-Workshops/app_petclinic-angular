import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSpecialties, getSpecialtyById, addSpecialty, updateSpecialty, deleteSpecialty } from '../api/specialtyApi';
import { Specialty } from '../models/Specialty';

export const useSpecialties = () =>
  useQuery({ queryKey: ['specialties'], queryFn: getSpecialties });

export const useSpecialty = (id: number) =>
  useQuery({ queryKey: ['specialties', id], queryFn: () => getSpecialtyById(id), enabled: !!id });

export const useSpecialtyMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['specialties'] });

  const addMutation = useMutation({
    mutationFn: (specialty: Partial<Specialty>) => addSpecialty(specialty),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, specialty }: { id: number; specialty: Partial<Specialty> }) => updateSpecialty(id, specialty),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteSpecialty(id),
    onSuccess: invalidate,
  });

  return { addMutation, updateMutation, deleteMutation };
};
