import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function readToken(token: string): { id: string; email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
    };

    return {
      id: decoded.id,
      email: decoded.email,
    };
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}
