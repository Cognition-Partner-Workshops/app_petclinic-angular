import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVisitById, addVisit, updateVisit, deleteVisit } from '../api/visitApi';
import { Visit } from '../models/Visit';

export const useVisit = (id: number) =>
  useQuery({ queryKey: ['visits', id], queryFn: () => getVisitById(id), enabled: !!id });

export const useVisitMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['visits'] });
    queryClient.invalidateQueries({ queryKey: ['owners'] });
    queryClient.invalidateQueries({ queryKey: ['pets'] });
  };

  const addMutation = useMutation({
    mutationFn: ({ ownerId, petId, visit }: { ownerId: number; petId: number; visit: Partial<Visit> }) =>
      addVisit(ownerId, petId, visit),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, visit }: { id: number; visit: Partial<Visit> }) => updateVisit(id, visit),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteVisit(id),
    onSuccess: invalidate,
  });

  return { addMutation, updateMutation, deleteMutation };
};
