import { Hono } from "hono";
import { cors } from "hono/cors";
import type { ApiResponse } from "shared";
import { auth } from "./auth";

export const app = new Hono()

.use(cors({
	origin: process.env.BETTER_AUTH_URL ?? "http://localhost:5173",
	credentials: true,
}))
.on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw))

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