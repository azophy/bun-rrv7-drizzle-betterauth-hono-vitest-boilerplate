import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AuthSession } from "./lib/auth";
import { clientLoader as homeLoader } from "./routes/_index";
import {
	clientAction as loginAction,
	clientLoader as loginLoader,
} from "./routes/login";
import { clientAction as logoutAction } from "./routes/logout";
import { clientAction as registerAction } from "./routes/register";
import { clientLoader as usersLoader } from "./routes/users";

const testSession: AuthSession = {
	user: {
		id: "user_123",
		email: "jane@example.com",
		name: "Jane Doe",
	},
	session: {
		id: "session_123",
		expiresAt: new Date(Date.now() + 60_000).toISOString(),
		userId: "user_123",
	},
};

type AuthFetch = (
	...args: Parameters<typeof fetch>
) => ReturnType<typeof fetch>;

type SignInBody = {
	email: string;
	password: string;
};

type SignUpBody = SignInBody & {
	name: string;
};

function jsonResponse(body: unknown, status = 200) {
	return new Response(JSON.stringify(body), {
		headers: { "content-type": "application/json" },
		status,
	});
}

function formRequest(path: string, fields: Record<string, string>) {
	const formData = new FormData();

	for (const [key, value] of Object.entries(fields)) {
		formData.set(key, value);
	}

	return new Request(`http://localhost${path}`, {
		body: formData,
		method: "POST",
	});
}

function expectRedirect(response: Response, location: string) {
	expect(response.status).toBe(302);
	expect(response.headers.get("Location")).toBe(location);
}

function getPathname(input: RequestInfo | URL) {
	return new URL(input instanceof Request ? input.url : String(input)).pathname;
}

function readJsonBody(init?: RequestInit) {
	return typeof init?.body === "string" ? JSON.parse(init.body) : undefined;
}

describe("client auth integration", () => {
	const authHandlers = {
		getSession: vi.fn<() => Promise<Response>>(),
		signInEmail: vi.fn<(input: SignInBody) => Promise<Response>>(),
		signOut: vi.fn<() => Promise<Response>>(),
		signUpEmail: vi.fn<(input: SignUpBody) => Promise<Response>>(),
	};

	const authFetch: AuthFetch = async (input, init) => {
		const method =
			init?.method ?? (input instanceof Request ? input.method : "GET");
		const route = `${method} ${getPathname(input)}`;

		switch (route) {
			case "GET /api/auth/get-session":
				return await authHandlers.getSession();
			case "POST /api/auth/sign-in/email":
				return await authHandlers.signInEmail(readJsonBody(init) as SignInBody);
			case "POST /api/auth/sign-out":
				return await authHandlers.signOut();
			case "POST /api/auth/sign-up/email":
				return await authHandlers.signUpEmail(readJsonBody(init) as SignUpBody);
			default:
				return jsonResponse({ message: `Unhandled auth request: ${route}` }, 404);
		}
	};

	beforeEach(() => {
		vi.resetAllMocks();
		vi.stubGlobal("fetch", authFetch);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("signs in through the mocked Hono auth fetch layer", async () => {
		authHandlers.signInEmail.mockResolvedValue(
			jsonResponse({ token: "token", user: testSession.user }),
		);

		const result = await loginAction({
			request: formRequest("/login", {
				email: "jane@example.com",
				password: "CorrectHorseBatteryStaple123!",
			}),
		});

		expect(authHandlers.signInEmail).toHaveBeenCalledWith({
			email: "jane@example.com",
			password: "CorrectHorseBatteryStaple123!",
		});
		expectRedirect(result as Response, "/");
	});

	it("redirects authenticated users away from login to the homepage", async () => {
		authHandlers.getSession.mockResolvedValue(jsonResponse(testSession));

		try {
			await loginLoader();
			throw new Error("Expected loader to redirect");
		} catch (error) {
			expectRedirect(error as Response, "/");
		}
	});

	it("surfaces sign in errors from the auth endpoint", async () => {
		authHandlers.signInEmail.mockResolvedValue(
			jsonResponse({ message: "Invalid credentials" }, 401),
		);

		const result = await loginAction({
			request: formRequest("/login", {
				email: "jane@example.com",
				password: "wrong-password",
			}),
		});

		expect(result).toEqual({ error: "Invalid credentials" });
	});

	it("signs up through the mocked Hono auth fetch layer", async () => {
		authHandlers.signUpEmail.mockResolvedValue(
			jsonResponse({ token: "token", user: testSession.user }),
		);

		const result = await registerAction({
			request: formRequest("/register", {
				email: "jane@example.com",
				name: "Jane Doe",
				password: "CorrectHorseBatteryStaple123!",
			}),
		});

		expect(authHandlers.signUpEmail).toHaveBeenCalledWith({
			email: "jane@example.com",
			name: "Jane Doe",
			password: "CorrectHorseBatteryStaple123!",
		});
		expectRedirect(result as Response, "/");
	});

	it("protects homepage and users when no session exists", async () => {
		authHandlers.getSession.mockImplementation(() => Promise.resolve(jsonResponse(null)));

		for (const loader of [homeLoader, usersLoader]) {
			try {
				await loader();
				throw new Error("Expected loader to redirect");
			} catch (error) {
				expectRedirect(error as Response, "/login");
			}
		}
	});

	it("allows protected routes when a session exists", async () => {
		authHandlers.getSession.mockImplementation(() =>
			Promise.resolve(jsonResponse(testSession)),
		);

		await expect(homeLoader()).resolves.toEqual(testSession);
		await expect(usersLoader()).resolves.toEqual(testSession);
	});

	it("signs out and redirects to login", async () => {
		authHandlers.signOut.mockResolvedValue(jsonResponse({ success: true }));

		const result = await logoutAction();

		expect(authHandlers.signOut).toHaveBeenCalledOnce();
		expectRedirect(result as Response, "/login");
	});
});
