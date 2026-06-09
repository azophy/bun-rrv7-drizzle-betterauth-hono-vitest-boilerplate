import { Hono } from "hono";
import { cors } from "hono/cors";
import type { TypedResponse } from "hono";
import type { ApiResponse } from "shared";
import { auth } from "./auth";

const clientOrigin = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

type Jsonify<T> = T extends Date
	? string
	: T extends Array<infer Item>
		? Jsonify<Item>[]
		: T extends object
			? { [Key in keyof T]: Jsonify<T[Key]> }
			: T;

type AuthSessionResponse = Jsonify<typeof auth.$Infer.Session> | null;
type AuthSignInResponse = Jsonify<Awaited<ReturnType<typeof auth.api.signInEmail>>>;
type AuthSignOutResponse = Jsonify<Awaited<ReturnType<typeof auth.api.signOut>>>;
type AuthSignUpResponse = Jsonify<Awaited<ReturnType<typeof auth.api.signUpEmail>>>;

const authHandler = <ResponseBody>(request: Request) =>
	auth.handler(request) as unknown as Promise<TypedResponse<ResponseBody, 200, "json">>;

export const app = new Hono()

.use(cors({
	origin: clientOrigin,
	credentials: true,
}))
.get("/api/auth/get-session", (c) => authHandler<AuthSessionResponse>(c.req.raw))
.post("/api/auth/sign-in/email", (c) => authHandler<AuthSignInResponse>(c.req.raw))
.post("/api/auth/sign-out", (c) => authHandler<AuthSignOutResponse>(c.req.raw))
.post("/api/auth/sign-up/email", (c) => authHandler<AuthSignUpResponse>(c.req.raw))
.on(["GET", "POST"], "/api/auth/*", (c) => authHandler(c.req.raw))

.get("/", (c) => {
	return c.text("Hello Hono!");
})

.get("/hello", async (c) => {
	const data: ApiResponse = {
		message: "Hello BHVR!",
		success: true,
	};

	return c.json(data, { status: 200 });
});

export default app;