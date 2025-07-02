import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    admin?: boolean;
    email: string | null;
  }

  interface Session {
    user?: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultUser {
    admin?: boolean;
  }
}
