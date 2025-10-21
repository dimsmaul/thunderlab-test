import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const POST = async (req: Request) => {
  const { name, email, password } = await req.json();

  const existingUser = await prisma.user.findFirst({
    where: { email },
  });

  if (existingUser) {
    return new Response(JSON.stringify({ message: "User already exists" }), {
      status: 409,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return new Response(
    JSON.stringify({
      message: "User created successfully",
    }),
    {
      status: 201,
    }
  );
};
