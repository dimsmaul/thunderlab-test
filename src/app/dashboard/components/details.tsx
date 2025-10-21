import Preview from "@/components/preview";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import auth from "@/config/auth";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { TodoListDatum } from "../types/type";
import dayjs from "dayjs";

export interface DetailsProps {
  open: boolean;
  id: string;
  onClose: () => void;
}

const Details: React.FC<DetailsProps> = ({ open, id, onClose }) => {
  const data = useQuery({
    queryKey: ["todo-details", id, open],
    queryFn: () => details(id),
  });

  const dt: TodoListDatum = data?.data?.data;

  return (
    <div>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Todo Details</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Preview label={"Title"} children={dt?.title} />
            <Preview label={"Content"} children={dt?.content} />
            <Preview label={"Date Target"} children={dt?.targetDate ? dayjs(dt?.targetDate).format("DD MMMM YYYY"): "-"} />
            <Preview label={"Actual Date"} children={dt?.actualDate ? dayjs(dt?.actualDate).format("DD MMMM YYYY"): "-"} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Details;

export const details = async (id: string) => {
  const response = await auth(`/v1/todo/${id}`);
  return response.data;
};
