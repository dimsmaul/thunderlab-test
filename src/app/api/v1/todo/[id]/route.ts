import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  const todo = await prisma.todo.findUnique({
    where: { id },
  });

  if (!todo) {
    return new Response(JSON.stringify({ message: "Todo not found" }), {
      status: 404,
    });
  }

  return new Response(
    JSON.stringify({ message: "Todo fetched successfully", data: todo }),
    { status: 200 }
  );
}

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const { title, content, targetDate, actualDate, completed } =
    await request.json();

  const todo = await prisma.todo.update({
    where: { id },
    data: {
      title,
      content,
      targetDate: targetDate ? new Date(targetDate) : null,
      actualDate: actualDate ? new Date(actualDate) : null,
      completed,
    },
  });

  return new Response(
    JSON.stringify({ message: "Todo updated successfully", data: todo }),
    { status: 200 }
  );
}

export async function DELETE(
  _request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  await prisma.todo.delete({ where: { id } });

  return new Response(
    JSON.stringify({ message: "Todo deleted successfully" }),
    { status: 200 }
  );
}
