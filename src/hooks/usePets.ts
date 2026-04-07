import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPetById, addPet, updatePet, deletePet } from '../api/petApi';
import { Pet } from '../models/Pet';

export const usePet = (id: number) =>
  useQuery({ queryKey: ['pets', id], queryFn: () => getPetById(id), enabled: !!id });

export const usePetMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['pets'] });
    queryClient.invalidateQueries({ queryKey: ['owners'] });
  };

  const addMutation = useMutation({
    mutationFn: ({ ownerId, pet }: { ownerId: number; pet: Partial<Pet> }) => addPet(ownerId, pet),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, pet }: { id: number; pet: Partial<Pet> }) => updatePet(id, pet),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deletePet(id),
    onSuccess: invalidate,
  });

  return { addMutation, updateMutation, deleteMutation };
};
