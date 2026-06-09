import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setAuthTransportForTesting, type AuthSession } from "./lib/auth";
import { clientLoader as dashboardLoader } from "./routes/dashboard";
import { clientAction as loginAction } from "./routes/login";
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

describe("client auth integration", () => {
	const transport = {
		getSession: vi.fn<() => Promise<Response>>(),
		signInEmail: vi.fn<(input: { email: string; password: string }) => Promise<Response>>(),
		signOut: vi.fn<() => Promise<Response>>(),
		signUpEmail: vi.fn<(input: { email: string; name: string; password: string }) => Promise<Response>>(),
	};

	beforeEach(() => {
		vi.resetAllMocks();
		setAuthTransportForTesting(transport);
	});

	afterEach(() => {
		setAuthTransportForTesting(null);
	});

	it("signs in through the mocked Hono auth transport", async () => {
		transport.signInEmail.mockResolvedValue(jsonResponse({ token: "token", user: testSession.user }));

		const result = await loginAction({
			request: formRequest("/login", {
				email: "jane@example.com",
				password: "CorrectHorseBatteryStaple123!",
			}),
		});

		expect(transport.signInEmail).toHaveBeenCalledWith({
			email: "jane@example.com",
			password: "CorrectHorseBatteryStaple123!",
		});
		expectRedirect(result as Response, "/dashboard");
	});

	it("surfaces sign in errors from the auth endpoint", async () => {
		transport.signInEmail.mockResolvedValue(jsonResponse({ message: "Invalid credentials" }, 401));

		const result = await loginAction({
			request: formRequest("/login", {
				email: "jane@example.com",
				password: "wrong-password",
			}),
		});

		expect(result).toEqual({ error: "Invalid credentials" });
	});

	it("signs up through the mocked Hono auth transport", async () => {
		transport.signUpEmail.mockResolvedValue(jsonResponse({ token: "token", user: testSession.user }));

		const result = await registerAction({
			request: formRequest("/register", {
				email: "jane@example.com",
				name: "Jane Doe",
				password: "CorrectHorseBatteryStaple123!",
			}),
		});

		expect(transport.signUpEmail).toHaveBeenCalledWith({
			email: "jane@example.com",
			name: "Jane Doe",
			password: "CorrectHorseBatteryStaple123!",
		});
		expectRedirect(result as Response, "/dashboard");
	});

	it("protects dashboard and users when no session exists", async () => {
		transport.getSession.mockImplementation(() => Promise.resolve(jsonResponse(null)));

		for (const loader of [dashboardLoader, usersLoader]) {
			try {
				await loader();
				throw new Error("Expected loader to redirect");
			} catch (error) {
				expectRedirect(error as Response, "/login");
			}
		}
	});

	it("allows protected routes when a session exists", async () => {
		transport.getSession.mockImplementation(() => Promise.resolve(jsonResponse(testSession)));

		await expect(dashboardLoader()).resolves.toEqual(testSession);
		await expect(usersLoader()).resolves.toEqual(testSession);
	});

	it("signs out and redirects to login", async () => {
		transport.signOut.mockResolvedValue(jsonResponse({ success: true }));

		const result = await logoutAction();

		expect(transport.signOut).toHaveBeenCalledOnce();
		expectRedirect(result as Response, "/login");
	});
});
