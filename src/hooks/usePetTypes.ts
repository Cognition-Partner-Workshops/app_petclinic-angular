import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPetTypes, getPetTypeById, addPetType, updatePetType, deletePetType } from '../api/petTypeApi';
import { PetType } from '../models/PetType';

export const usePetTypes = () =>
  useQuery({ queryKey: ['pettypes'], queryFn: getPetTypes });

export const usePetType = (id: number) =>
  useQuery({ queryKey: ['pettypes', id], queryFn: () => getPetTypeById(id), enabled: !!id });

export const usePetTypeMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['pettypes'] });

  const addMutation = useMutation({
    mutationFn: (petType: Partial<PetType>) => addPetType(petType),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, petType }: { id: number; petType: Partial<PetType> }) => updatePetType(id, petType),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deletePetType(id),
    onSuccess: invalidate,
  });

  return { addMutation, updateMutation, deleteMutation };
};
