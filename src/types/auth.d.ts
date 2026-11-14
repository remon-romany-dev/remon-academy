import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: "student" | "admin";
  }

  interface Session {
    user: {
      id: string;
      role: "student" | "admin";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "student" | "admin";
  }
}
