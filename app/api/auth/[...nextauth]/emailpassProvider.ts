import CredentialsProvider from "next-auth/providers/credentials";
import {login} from "~/core/api/auth"
import { useQuery } from '@tanstack/react-query'

export const emailpassProvider = CredentialsProvider({
  id: "emailpass",
  credentials: {
    email: { type: "text" },
    password: { type: "password" },
  },
  async authorize(creds, req) {

    if (!creds?.email) {
      throw new Error(`Trường email đang rỗng.`);
    }

    if (!creds?.password) {
      throw new Error(`Trường password đang rỗng.`);
    }

    const loginResponse = await login({
      username: creds.email,
      password: creds.password,
    });

   // Kiểm tra nếu có token trong response
   if (loginResponse?.token) {
    return {
      admin: true,
      id: '',
      name: '',
      image: '',
      email: '',
      access_token: loginResponse.token, // Lưu token trong session
      refresh_token: loginResponse.refreshToken,
      expires_in: loginResponse.expires_in,
      refresh_expires_in: loginResponse.refresh_expires_in
    };
  }
    throw new Error(`Không tìm thấy thông tin của email ${creds?.email}`);
  },
});
