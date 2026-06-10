import type {
	AuthSessionResponse,
	AuthSignInResponse,
	AuthSignOutResponse,
	AuthSignUpResponse,
} from "server/client";

const serverUrl =
	(import.meta.env.VITE_SERVER_URL as string | undefined) ??
	"http://localhost:3000";

type AuthResponse<Body = unknown> = {
	ok: boolean;
	headers: Headers;
	json(): Promise<Body>;
	text(): Promise<string>;
};

export type AuthSession = AuthSessionResponse;
export type AuthUser = NonNullable<AuthSession>["user"];
export type SignInResponse = AuthSignInResponse;
export type SignOutResponse = AuthSignOutResponse;
export type SignUpResponse = AuthSignUpResponse;

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

function authUrl(path: string) {
	return new URL(`/api/auth/${path}`, serverUrl).toString();
}

function authRequest<Body>(path: string, init?: RequestInit) {
	return fetch(authUrl(path), {
		credentials: "include",
		...init,
	}) as Promise<AuthResponse<Body>>;
}

function authJsonRequest<Body>(path: string, body: unknown) {
	return authRequest<Body>(path, {
		body: JSON.stringify(body),
		headers: { "content-type": "application/json" },
		method: "POST",
	});
}

export async function getSession(): Promise<AuthSession | null> {
	const response = await authRequest<AuthSession>("get-session");

	if (!response.ok) {
		return null;
	}

	return await response.json();
}

export function signIn(input: SignInInput): Promise<SignInResponse> {
	return readAuthJson(
		authJsonRequest<SignInResponse>("sign-in/email", input),
		"Unable to sign in",
	);
}

export function signUp(input: SignUpInput): Promise<SignUpResponse> {
	return readAuthJson(
		authJsonRequest<SignUpResponse>("sign-up/email", input),
		"Unable to create account",
	);
}

export function signOut(): Promise<SignOutResponse> {
	return readAuthJson(
		authRequest<SignOutResponse>("sign-out", { method: "POST" }),
		"Unable to sign out",
	);
}
