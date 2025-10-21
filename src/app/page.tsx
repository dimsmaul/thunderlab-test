"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import unauth from "@/config/unauth";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useRouter } from "next/navigation";

const AuthPage = () => {
  const [tabs, setTabs] = React.useState<"sign-in" | "sign-up">("sign-in");
  const { setUsers } = useAuthStore();
  const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema | typeof signUpSchema>>({
    resolver: zodResolver(tabs === "sign-in" ? signInSchema : signUpSchema),
    defaultValues:
      tabs === "sign-in"
        ? {
            email: "john@gmail.com",
            password: "password",
          }
        : {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          },
  });

  const mutation = useMutation({
    mutationKey: ["auth", tabs],
    mutationFn: (data: z.infer<typeof signInSchema | typeof signUpSchema>) =>
      requestApi(data, tabs),
    onSuccess(data) {
      console.log("Auth Success:", data.data.data);
      if (tabs === "sign-in") {
        setUsers(data.data.data);
        router.push("/dashboard");
      } else {
        setTabs("sign-in");
      }
    },
  });

  const onSubmit = (
    data: z.infer<typeof signInSchema | typeof signUpSchema>
  ) => {
    mutation.mutateAsync(data);
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6 justify-center items-center"
        >
          <h1 className="text-3xl font-semibold text-center">
            Welcome to the
            <br />
            Todolist App
          </h1>

          <Card>
            <CardContent className="flex w-[400px]">
              <Tabs
                defaultValue="sign-in"
                value={tabs}
                onValueChange={(value) =>
                  setTabs(value as "sign-in" | "sign-up")
                }
                className="w-full"
              >
                <TabsList className="w-full">
                  <TabsTrigger value="sign-in">Sign In</TabsTrigger>
                  <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="sign-in" className="flex flex-col gap-4">
                  {/* NOTE: Sign In */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="input email" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="input password" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button>{tabs === "sign-in" ? "Sign In" : "Sign Up"}</Button>
                </TabsContent>
                <TabsContent value="sign-up" className="flex flex-col gap-4">
                  {/* NOTE: Sign Up */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="input name" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="input email" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="input password" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="input confirm password"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button>{tabs === "sign-in" ? "Sign In" : "Sign Up"}</Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default AuthPage;

const requestApi = async (
  data: z.infer<typeof signInSchema | typeof signUpSchema>,
  type: "sign-in" | "sign-up"
) => {
  const request = unauth.post(
    type === "sign-in" ? "/auth/sign-in" : "/auth/sign-up",
    data
  );
  return request;
};

const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

const signUpSchema = z
  .object({
    name: z.string().min(2),
    email: z.email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
