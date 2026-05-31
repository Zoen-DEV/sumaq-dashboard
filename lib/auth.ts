import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { Rol } from "@/types/next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "credentials",
      credentials: {
        email:    { label: "Email",      type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const email    = credentials?.email    as string;
        const password = credentials?.password as string;

        if (
          email    === process.env.AUTH_USER_EMAIL &&
          password === process.env.AUTH_USER_PASSWORD
        ) {
          return { id: "1", email, name: "Admin", role: "admin" };
        }
        return null;
      },
    }),

    // Acceso de demostración. No valida credenciales: siempre concede una sesión
    // efímera marcada como `guest`. La capa de datos del invitado vive en el cliente
    // (store en sessionStorage); este rol solo sirve para que el servidor sepa que
    // NO debe tocar Mongo ni aceptar escrituras vía API.
    Credentials({
      id: "guest",
      name: "Invitado",
      credentials: {},
      async authorize() {
        return { id: "guest", name: "Invitado", role: "guest" };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
    jwt({ token, user }) {
      if (user) token.role = (user as { role?: Rol }).role ?? "admin";
      return token;
    },
    session({ session, token }) {
      if (session.user) session.user.role = (token.role as Rol) ?? "admin";
      return session;
    },
  },
});
