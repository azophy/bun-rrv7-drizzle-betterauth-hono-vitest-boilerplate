import { Hono } from "hono";
import { cors } from "hono/cors";
import type { ApiResponse } from "shared";
import { auth } from "./auth";

const clientOrigin = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

export const app = new Hono()
	.use(cors({
		origin: clientOrigin,
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