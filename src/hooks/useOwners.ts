import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOwners, getOwnerById, addOwner, updateOwner, deleteOwner, searchOwners } from '../api/ownerApi';
import { Owner } from '../models/Owner';

export const useOwners = () =>
  useQuery({ queryKey: ['owners'], queryFn: getOwners });

export const useOwner = (id: number) =>
  useQuery({ queryKey: ['owners', id], queryFn: () => getOwnerById(id), enabled: !!id });

export const useSearchOwners = (lastName: string) =>
  useQuery({ queryKey: ['owners', 'search', lastName], queryFn: () => searchOwners(lastName) });

export const useOwnerMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['owners'] });

  const addMutation = useMutation({
    mutationFn: (owner: Partial<Owner>) => addOwner(owner),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, owner }: { id: number; owner: Partial<Owner> }) => updateOwner(id, owner),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteOwner(id),
    onSuccess: invalidate,
  });

  return { addMutation, updateMutation, deleteMutation };
};
