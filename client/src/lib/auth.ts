import { hcWithType } from "server/client";

const serverUrl =
	(import.meta.env.VITE_SERVER_URL as string | undefined) ??
	"http://localhost:3000";

const api = hcWithType(serverUrl, {
	init: {
		credentials: "include",
	},
});

type GetSessionEndpoint = typeof api.api.auth["get-session"]["$get"];
type SignInEmailEndpoint = typeof api.api.auth["sign-in"]["email"]["$post"];
type SignOutEndpoint = typeof api.api.auth["sign-out"]["$post"];
type SignUpEmailEndpoint = typeof api.api.auth["sign-up"]["email"]["$post"];

type HonoResponseBody<Endpoint extends (...args: never[]) => Promise<unknown>> =
	Awaited<ReturnType<Endpoint>> extends { json(): Promise<infer Body> }
		? Body
		: never;

export type AuthSession = HonoResponseBody<GetSessionEndpoint>;
export type AuthUser = NonNullable<AuthSession>["user"];
export type SignInResponse = HonoResponseBody<SignInEmailEndpoint>;
export type SignOutResponse = HonoResponseBody<SignOutEndpoint>;
export type SignUpResponse = HonoResponseBody<SignUpEmailEndpoint>;

export type SignInInput = {
	email: string;
	password: string;
};

export type SignUpInput = SignInInput & {
	name: string;
};

type AuthTransport = {
	getSession: () => ReturnType<GetSessionEndpoint>;
	signInEmail: (input: SignInInput) => ReturnType<SignInEmailEndpoint>;
	signOut: () => ReturnType<SignOutEndpoint>;
	signUpEmail: (input: SignUpInput) => ReturnType<SignUpEmailEndpoint>;
};

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
		}),
	signInEmail: (input) =>
		api.api.auth["sign-in"].email.$post(undefined, {
			init: jsonInit(input),
		}),
	signOut: () =>
		api.api.auth["sign-out"].$post(undefined, {
			init: jsonInit(),
		}),
	signUpEmail: (input) =>
		api.api.auth["sign-up"].email.$post(undefined, {
			init: jsonInit(input),
		}),
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

	return await response.json();
}

export async function signIn(input: SignInInput): Promise<SignInResponse> {
	const response = await authTransport.signInEmail(input);

	if (!response.ok) {
		throw new Error(await getErrorMessage(response, "Unable to sign in"));
	}

	return await response.json();
}

export async function signUp(input: SignUpInput): Promise<SignUpResponse> {
	const response = await authTransport.signUpEmail(input);

	if (!response.ok) {
		throw new Error(await getErrorMessage(response, "Unable to create account"));
	}

	return await response.json();
}

export async function signOut(): Promise<SignOutResponse> {
	const response = await authTransport.signOut();

	if (!response.ok) {
		throw new Error(await getErrorMessage(response, "Unable to sign out"));
	}

	return await response.json();
}
