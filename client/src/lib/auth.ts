import { hcWithType } from "server/client";

const serverUrl =
	(import.meta.env.VITE_SERVER_URL as string | undefined) ??
	"http://localhost:3000";

export type AuthUser = {
	id: string;
	name: string;
	email: string;
	emailVerified?: boolean;
	image?: string | null;
};

export type AuthSession = {
	user: AuthUser;
	session?: {
		id: string;
		expiresAt: string | Date;
		token?: string;
		userId: string;
	};
};

export type SignInInput = {
	email: string;
	password: string;
};

export type SignUpInput = SignInInput & {
	name: string;
};

type AuthTransport = {
	getSession: () => Promise<Response>;
	signInEmail: (input: SignInInput) => Promise<Response>;
	signOut: () => Promise<Response>;
	signUpEmail: (input: SignUpInput) => Promise<Response>;
};

const api = hcWithType(serverUrl, {
	init: {
		credentials: "include",
	},
});

const jsonInit = (body?: unknown): RequestInit => ({
	body: body === undefined ? undefined : JSON.stringify(body),
	credentials: "include",
	headers: {
		"content-type": "application/json",
	},
});

const honoAuthTransport: AuthTransport = {
	getSession: () =>
		api.api.auth["get-session"].$get(undefined, {
			init: { credentials: "include" },
		}) as Promise<Response>,
	signInEmail: (input) =>
		api.api.auth["sign-in"].email.$post(undefined, {
			init: jsonInit(input),
		}) as Promise<Response>,
	signOut: () =>
		api.api.auth["sign-out"].$post(undefined, {
			init: jsonInit(),
		}) as Promise<Response>,
	signUpEmail: (input) =>
		api.api.auth["sign-up"].email.$post(undefined, {
			init: jsonInit(input),
		}) as Promise<Response>,
};

let authTransport = honoAuthTransport;

export function setAuthTransportForTesting(transport: AuthTransport | null) {
	authTransport = transport ?? honoAuthTransport;
}

async function getErrorMessage(response: Response, fallback: string) {
	const contentType = response.headers.get("content-type") ?? "";

	if (contentType.includes("application/json")) {
		const body = await response.json().catch(() => null) as
			| { message?: string; error?: string; code?: string }
			| null;
		return body?.message ?? body?.error ?? body?.code ?? fallback;
	}

	return (await response.text().catch(() => "")) || fallback;
}

export async function getSession() {
	const response = await authTransport.getSession();

	if (!response.ok) {
		return null;
	}

	return await response.json() as AuthSession | null;
}

export async function signIn(input: SignInInput) {
	const response = await authTransport.signInEmail(input);

	if (!response.ok) {
		throw new Error(await getErrorMessage(response, "Unable to sign in"));
	}

	return await response.json() as { token?: string; user: AuthUser };
}

export async function signUp(input: SignUpInput) {
	const response = await authTransport.signUpEmail(input);

	if (!response.ok) {
		throw new Error(await getErrorMessage(response, "Unable to create account"));
	}

	return await response.json() as { token?: string; user: AuthUser };
}

export async function signOut() {
	const response = await authTransport.signOut();

	if (!response.ok) {
		throw new Error(await getErrorMessage(response, "Unable to sign out"));
	}

	return await response.json() as { success: boolean };
}
