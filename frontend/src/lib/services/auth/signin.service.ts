import type { User } from "@/app/types/user";

import { httpClient } from "@/lib/http-client";

export type SignInResponse = {
  access_token: string;
  user: User;
};

export type SignInCredentials = {
  email: string;
  password: string;
};

/**
 * Sign in user with email and password
 * @param credentials - User sign in credentials
 * @returns Promise with access token
 */
export async function signIn(
  credentials: SignInCredentials
): Promise<SignInResponse> {
  return httpClient<SignInResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}
