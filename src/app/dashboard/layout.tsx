"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { users } = useAuthStore();
  return (
    <div>
      {/* Mavnar */}
      <div className="flex w-screen border-b border-border justify-between items-center px-6 py-4 sticky top-0">
        <h1 className="text-2xl font-bold">Todo List App</h1>
        <div>
            <span className="mr-4">Hello, {users.data.name}</span>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default DashboardLayout;
