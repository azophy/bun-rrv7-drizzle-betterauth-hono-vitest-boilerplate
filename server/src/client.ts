import { hc } from "hono/client";
import type { auth } from "./auth";
import type { app } from "./index";

type Jsonify<T> = T extends Date
	? string
	: T extends Array<infer Item>
		? Jsonify<Item>[]
		: T extends object
			? { [Key in keyof T]: Jsonify<T[Key]> }
			: T;

export type AuthSessionResponse = Jsonify<typeof auth.$Infer.Session> | null;
export type AuthSignInResponse = Jsonify<
	Awaited<ReturnType<typeof auth.api.signInEmail>>
>;
export type AuthSignOutResponse = Jsonify<
	Awaited<ReturnType<typeof auth.api.signOut>>
>;
export type AuthSignUpResponse = Jsonify<
	Awaited<ReturnType<typeof auth.api.signUpEmail>>
>;

export type AppType = typeof app;
export type Client = ReturnType<typeof hc<AppType>>;

export const hcWithType = (...args: Parameters<typeof hc>): Client =>
	hc<AppType>(...args);
