import type { InferResponseType } from "hono/client";
import { hcWithType } from "server/client";

const serverUrl =
	(import.meta.env.VITE_SERVER_URL as string | undefined) ??
	"http://localhost:3000";

const authApi = hcWithType(serverUrl, {
	init: {
		credentials: "include",
	},
}).api.auth;

type AuthResponse<Body = unknown> = {
	ok: boolean;
	headers: Headers;
	json(): Promise<Body>;
	text(): Promise<string>;
};

export type AuthSession = InferResponseType<
	typeof authApi["get-session"]["$get"]
>;
export type AuthUser = NonNullable<AuthSession>["user"];
export type SignInResponse = InferResponseType<
	typeof authApi["sign-in"]["email"]["$post"]
>;
export type SignOutResponse = InferResponseType<
	typeof authApi["sign-out"]["$post"]
>;
export type SignUpResponse = InferResponseType<
	typeof authApi["sign-up"]["email"]["$post"]
>;

export type SignInInput = {
	email: string;
	password: string;
};

export type SignUpInput = SignInInput & {
	name: string;
};

async function getErrorMessage(response: AuthResponse, fallback: string) {
	const contentType = response.headers.get("content-type") ?? "";

	if (contentType.includes("application/json")) {
		const body = (await response.json().catch(() => null)) as
			| { message?: string; error?: string; code?: string }
			| null;
		return body?.message ?? body?.error ?? body?.code ?? fallback;
	}

	return (await response.text().catch(() => "")) || fallback;
}

async function readAuthJson<Body>(
	responsePromise: Promise<AuthResponse<Body>>,
	fallback: string,
): Promise<Body> {
	const response = await responsePromise;

	if (!response.ok) {
		throw new Error(await getErrorMessage(response, fallback));
	}

	return await response.json();
}

export async function getSession(): Promise<AuthSession | null> {
	const response = await authApi["get-session"].$get();

	if (!response.ok) {
		return null;
	}

	return await response.json();
}

export function signIn(input: SignInInput): Promise<SignInResponse> {
	return readAuthJson(
		authApi["sign-in"].email.$post({ json: input }),
		"Unable to sign in",
	);
}

export function signUp(input: SignUpInput): Promise<SignUpResponse> {
	return readAuthJson(
		authApi["sign-up"].email.$post({ json: input }),
		"Unable to create account",
	);
}

export function signOut(): Promise<SignOutResponse> {
	return readAuthJson(authApi["sign-out"].$post(), "Unable to sign out");
}
