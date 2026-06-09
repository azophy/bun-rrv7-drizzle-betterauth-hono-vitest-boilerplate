import { Hono } from "hono";
import { cors } from "hono/cors";
import type { ApiResponse } from "shared";
import { auth } from "./auth";

const clientOrigin = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

const authHandler = (request: Request) => auth.handler(request);

export const app = new Hono()

.use(cors({
	origin: clientOrigin,
	credentials: true,
}))
.get("/api/auth/get-session", (c) => authHandler(c.req.raw))
.post("/api/auth/sign-in/email", (c) => authHandler(c.req.raw))
.post("/api/auth/sign-out", (c) => authHandler(c.req.raw))
.post("/api/auth/sign-up/email", (c) => authHandler(c.req.raw))
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