export interface TodoListResponse {
  message: string;
  data: TodoListDatum[];
}

export interface TodoListDatum {
  id: string;
  title: string;
  content: string;
  targetDate: string;
  actualDate: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}