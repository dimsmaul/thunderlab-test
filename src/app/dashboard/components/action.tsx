"use client";
import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import auth from "@/config/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { details } from "./details";

export interface TodoActionProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  id?: string;
}

const TodoAction: React.FC<TodoActionProps> = ({
  open,
  onClose,
  id,
  onSuccess,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      targetDate: undefined,
      actualDate: undefined,
    },
  });

  const query = useQuery({
    queryKey: ["todo-edit", id, open],
    queryFn: () => details(id!),
    enabled: !!id && open,
  });

  useEffect(() => {
    if (id) {
      const dt = query?.data?.data;
      form.setValue("title", dt?.title || "");
      form.setValue("content", dt?.content || "");
      form.setValue(
        "targetDate",
        dt?.targetDate ? new Date(dt?.targetDate) : undefined
      );
      form.setValue(
        "actualDate",
        dt?.actualDate ? new Date(dt?.actualDate) : undefined
      );
    }
  }, [id, open, query.data]);

  const mutation = useMutation({
    mutationKey: ["todo", id],
    mutationFn: (data: z.infer<typeof formSchema>) => handleSave(data, id),
    onSuccess() {
      onSuccess();
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutation.mutate(data);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Todo</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="input title" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Input placeholder="input content" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          placeholder="input target date"
                          date={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />{" "}
                <FormField
                  control={form.control}
                  name="actualDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Actual Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          placeholder="input actual date"
                          date={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button className="flex w-full" type="submit">
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TodoAction;

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  targetDate: z.date().optional(),
  actualDate: z.date().optional(),
});

const handleSave = async (data: z.infer<typeof formSchema>, id?: string) => {
  if (id) {
    const response = await auth.patch(`/v1/todo/${id}`, data);
    return response.data;
  } else {
    const response = await auth.post("/v1/todo", data);
    return response.data;
  }
};
