import type { DefaultSession } from "next-auth";

export type Rol = "admin" | "guest";

declare module "next-auth" {
  interface Session {
    user: {
      role: Rol;
    } & DefaultSession["user"];
  }

  interface User {
    role?: Rol;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Rol;
  }
}
