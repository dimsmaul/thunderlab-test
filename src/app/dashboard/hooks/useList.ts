import auth from "@/config/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { TodoListResponse } from "../types/type";

export const useList = () => {
  const [search, setSearch] = useState("");
  const list = useQuery({
    queryKey: ["todo-list", search],
    queryFn: () => request(search),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      updateStatusAsync(id, completed),
    onSuccess: () => {
      list.refetch();
    },
  });

  const deleteTodo = useMutation({
    mutationFn: (id: string) => deleteTodoAsync(id),
    onSuccess: () => {
      list.refetch();
    },
  });

  const updateStatus = (id: string, completed: boolean) => {
    mutation.mutateAsync({ id, completed });
  };

  return {
    list,
    setSearch,
    search,
    updateStatus,
    deleteTodo,
  };
};

const request = async (search: string) => {
  const req = await auth.get<TodoListResponse>("/v1/todo", {
    params: {
      search,
    },
  });
  return req.data;
};

const updateStatusAsync = async (id: string, completed: boolean) => {
  const req = await auth.patch<TodoListResponse>(`/v1/todo/${id}`, {
    completed,
  });
  return req.data;
};

const deleteTodoAsync = async (id: string) => {
  const req = await auth.delete<TodoListResponse>(`/v1/todo/${id}`);
  return req.data;
};
