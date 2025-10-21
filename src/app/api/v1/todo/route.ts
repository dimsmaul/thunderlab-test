import { prisma } from "@/lib/prisma";
import { readToken } from "@/lib/token";

export const GET = async (request: Request) => {
  const { search } = new URL(request.url);

  //   read token from header request
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }
  const user = readToken(token);
  if (!user) {
    return new Response("Invalid token", { status: 401 });
  }

  const data = await prisma.todo.findMany({
    where: {
      AND: [
        search
          ? {
              title: {
                contains: new URL(request.url).searchParams.get("search") || "",
                mode: "insensitive",
              },
            }
          : {},
        {
          userId: user.id,
        },
      ],
    },
    orderBy: {
      completed: "asc",
    },
  });

  return new Response(
    JSON.stringify({
      message: "Todos fetched successfully",
      data,
    }),
    { status: 200 }
  );
};

export const POST = async (request: Request) => {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }
  const user = readToken(token);
  if (!user) {
    return new Response("Invalid token", { status: 401 });
  }

  const { title, content, targetDate, actualDate, completed } =
    await request.json();

  const todo = await prisma.todo.create({
    data: {
      title,
      content,
      targetDate: targetDate ? new Date(targetDate) : null,
      actualDate: actualDate ? new Date(actualDate) : null,
      completed: completed ?? false,
      userId: user.id,
    },
  });

  return new Response(
    JSON.stringify({
      message: "Todo created successfully",
      data: todo,
    }),
    { status: 201 }
  );
};
