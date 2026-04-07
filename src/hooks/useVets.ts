import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVets, getVetById, addVet, updateVet, deleteVet } from '../api/vetApi';
import { Vet } from '../models/Vet';

export const useVets = () =>
  useQuery({ queryKey: ['vets'], queryFn: getVets });

export const useVet = (id: number) =>
  useQuery({ queryKey: ['vets', id], queryFn: () => getVetById(id), enabled: !!id });

export const useVetMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['vets'] });

  const addMutation = useMutation({
    mutationFn: (vet: Partial<Vet>) => addVet(vet),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, vet }: { id: number; vet: Partial<Vet> }) => updateVet(id, vet),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteVet(id),
    onSuccess: invalidate,
  });

  return { addMutation, updateMutation, deleteMutation };
};
