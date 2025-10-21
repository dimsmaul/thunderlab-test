"use client";

import InputSearchDebounce from "@/components/search";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Edit, Eye, Plus, Trash } from "lucide-react";
import React, { useState } from "react";
import { useList } from "../hooks/useList";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import TodoAction from "../components/action";
import Details from "../components/details";

const DashboardPage = () => {
  const [action, setAction] = useState({
    open: false,
    id: undefined as string | undefined,
  });
  const [detail, setDetail] = useState({
    open: false,
    id: "" as string,
  });
  const { list, setSearch, search, updateStatus, deleteTodo } = useList();
  return (
    <div className="flex justify-center items-center p-4">
      <Card className="w-[50vw]">
        <CardHeader className="flex flex-row justify-between items-center">
          <h2 className="text-xl font-bold">Todo</h2>
          <div className="flex flex-row items-center gap-2">
            <InputSearchDebounce defaultValue={search} onChange={setSearch} />
            <Button
              size={"icon"}
              className=""
              onClick={() => setAction({ open: true, id: undefined })}
            >
              <Plus />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {list.data?.data?.map((item, index) => (
              <div key={index} className="border border-border rounded-md p-3">
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-row items-center">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() =>
                        updateStatus(item.id, !item.completed)
                      }
                    />
                    <span
                      className={cn(
                        item.completed && "line-through",
                        "ml-2 font-medium"
                      )}
                    >
                      {item.title}
                    </span>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <Button
                      variant={"outline"}
                      size={"icon"}
                      onClick={() => setDetail({ open: true, id: item.id })}
                    >
                      <Eye />
                    </Button>
                    <Button
                      variant={"outline"}
                      size={"icon"}
                      onClick={() => setAction({ open: true, id: item.id })}
                    >
                      <Edit />
                    </Button>
                    <Button
                      variant={"destructive"}
                      size={"icon"}
                      onClick={() => deleteTodo.mutateAsync(item.id)}
                    >
                      <Trash />
                    </Button>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Target :{' '}
                    {item.targetDate
                      ? dayjs(item.targetDate || "").format("DD MMMM YYYY")
                      : "-"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Details
        open={detail.open}
        id={detail.id}
        onClose={() => setDetail({ open: false, id: "" })}
      />
      <TodoAction
        onSuccess={() => {
          list.refetch();
          setAction({
            open: false,
            id: undefined,
          });
        }}
        open={action.open}
        onClose={() =>
          setAction({
            open: false,
            id: undefined,
          })
        }
        id={action.id}
      />
    </div>
  );
};

export default DashboardPage;
