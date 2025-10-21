import { prisma } from "@/lib/prisma";
import { NextApiRequest } from "next";

export const GET = async (
  _: Request,
  { params }: { params: { id: string } }
) => {
  const todo = await prisma.todo.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!todo) {
    return new Response(
      JSON.stringify({
        message: "Todo not found",
      }),
      { status: 404 }
    );
  }

  return new Response(
    JSON.stringify({
      message: "Todo fetched successfully",
      data: todo,
    }),
    { status: 200 }
  );
};

export const PATCH = async (
  request: Request,
  {
    params,
  }: {
    params: { id: string };
  }
) => {
  const { title, content, targetDate, actualDate, completed } =
    await request.json();

  const todo = await prisma.todo.update({
    where: {
      id: params.id,
    },
    data: {
      title,
      content,
      targetDate: targetDate ? new Date(targetDate) : null,
      actualDate: actualDate ? new Date(actualDate) : null,
      completed,
    },
  });

  return new Response(
    JSON.stringify({
      message: "Todo updated successfully",
      data: todo,
    }),
    { status: 200 }
  );
};

export const DELETE = async (
  _: Request,
  { params }: { params: { id: string } }
) => {
  await prisma.todo.delete({
    where: {
      id: params.id,
    },
  });

  return new Response(
    JSON.stringify({
      message: "Todo deleted successfully",
    }),
    { status: 200 }
  );
};
