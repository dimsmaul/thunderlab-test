import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const POST = async (req: Request) => {
  const { email, password } = await req.json();

  const validate = await prisma.user.findFirstOrThrow({
    where: { email },
  });

  if (!validate) {
    return new Response(JSON.stringify({ message: "Invalid credentials" }), {
      status: 401,
    });
  }

  const isValidPassword = await bcrypt.compare(password, validate.password);
  if (!isValidPassword) {
    return new Response(JSON.stringify({ message: "Invalid credentials" }), {
      status: 401,
    });
  }

  const token = jwt.sign(
    { id: validate.id, email: validate.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  const { password: pwd, ...rest } = validate;

  return new Response(
    JSON.stringify({
      message: "Login successful",
      data: {
        data: rest,
        token,
      },
    }),
    {
      status: 200,
    }
  );
};
