import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getUsersWithOverrides,
  updateUser,
  type UpdateUserInput,
} from "../api/dashboardApi";
import type { User } from "../types";

export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getUsersWithOverrides,
  });
};

export const useUpdateUser = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateUserInput }) =>
      updateUser(id, input),
    onMutate: async ({ id, input }) => {
      await client.cancelQueries({ queryKey: ["users"] });
      const previous = client.getQueryData<User[]>(["users"]);
      client.setQueryData<User[]>(["users"], (users = []) =>
        users.map((user) => (user.id === id ? { ...user, ...input } : user)),
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) client.setQueryData(["users"], context.previous);
    },
    onSettled: () => client.invalidateQueries({ queryKey: ["users"] }),
  });
};
