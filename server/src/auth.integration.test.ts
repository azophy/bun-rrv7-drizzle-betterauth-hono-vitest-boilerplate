import { migrate } from "drizzle-orm/postgres-js/migrator";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const databaseUrl = process.env.TEST_DATABASE_URL
	?? process.env.DATABASE_URL
	?? "postgres://postgres:postgres@localhost:5432/postgres";

const cookieHeader = (response: Response) => response.headers.get("set-cookie")?.split(", ").filter(Boolean).join("; ");

const jsonRequest = (body?: unknown, cookie?: string) => ({
	method: "POST",
	headers: {
		"content-type": "application/json",
		...(cookie ? { cookie } : {}),
	},
	body: body === undefined ? undefined : JSON.stringify(body),
});

describe("Better Auth integration", () => {
	let app: (path: string, init?: RequestInit) => Response | Promise<Response>;
	let closeDb: () => Promise<void>;

	beforeAll(async () => {
		process.env.NODE_ENV = "test";
		process.env.DATABASE_URL = databaseUrl;
		process.env.BETTER_AUTH_SECRET ??= "test-secret-at-least-32-characters-long";
		process.env.BETTER_AUTH_URL ??= "http://localhost:3000";

		const setupSql = postgres(databaseUrl, { max: 1 });
		await setupSql`DROP TABLE IF EXISTS "account", "session", "verification", "user" CASCADE`;
		await setupSql`DROP SCHEMA IF EXISTS "drizzle" CASCADE`;
		await migrate(drizzle(setupSql), { migrationsFolder: "./drizzle" });
		await setupSql.end();

		const server = await import("./index");
		const db = await import("./db");
		app = (path, init) => server.app.request(path, init);
		closeDb = () => db.sql.end();
	});

	afterAll(async () => {
		await closeDb?.();
	});

	const signUpUser = async (email: string, password = "CorrectHorseBatteryStaple123!") => {
		const response = await app("/api/auth/sign-up/email", jsonRequest({
			email,
			password,
			name: "Integration Test",
		}));
		expect(response.status).toBe(200);
		return response;
	};

	it("signs up, signs in, and signs out with email/password", async () => {
		const email = `integration-${Date.now()}@example.com`;
		const password = "CorrectHorseBatteryStaple123!";

		const signUp = await app("/api/auth/sign-up/email", jsonRequest({
			email,
			password,
			name: "Integration Test",
		}));
		expect(signUp.status).toBe(200);
		const signUpBody = await signUp.json() as { token?: string; user?: { email?: string } };
		expect(signUpBody.token).toBeTruthy();
		expect(signUpBody.user?.email).toBe(email);

		const signIn = await app("/api/auth/sign-in/email", jsonRequest({ email, password }));
		expect(signIn.status).toBe(200);
		const signInCookie = cookieHeader(signIn);
		expect(signInCookie).toBeTruthy();
		const signInBody = await signIn.json() as { token?: string; user?: { email?: string } };
		expect(signInBody.token).toBeTruthy();
		expect(signInBody.user?.email).toBe(email);

		const session = await app("/api/auth/get-session", {
			headers: { cookie: signInCookie! },
		});
		expect(session.status).toBe(200);
		const sessionBody = await session.json() as { user?: { email?: string } } | null;
		expect(sessionBody?.user?.email).toBe(email);

		const signOut = await app("/api/auth/sign-out", jsonRequest(undefined, signInCookie));
		expect(signOut.status).toBe(200);
		expect(await signOut.json()).toEqual({ success: true });

		const signedOutSession = await app("/api/auth/get-session", {
			headers: { cookie: signInCookie! },
		});
		expect(signedOutSession.status).toBe(200);
		expect(await signedOutSession.json()).toBeNull();
	});

	it("rejects sign in with the wrong password", async () => {
		const email = `wrong-password-${Date.now()}@example.com`;
		const password = "CorrectHorseBatteryStaple123!";
		await signUpUser(email, password);

		const signIn = await app("/api/auth/sign-in/email", jsonRequest({
			email,
			password: "DefinitelyWrongPassword123!",
		}));

		expect(signIn.status).toBe(401);
		expect(cookieHeader(signIn)).toBeFalsy();
	});

	it("rejects sign in with an unknown email", async () => {
		const signIn = await app("/api/auth/sign-in/email", jsonRequest({
			email: `unknown-${Date.now()}@example.com`,
			password: "CorrectHorseBatteryStaple123!",
		}));

		expect(signIn.status).toBe(401);
		expect(cookieHeader(signIn)).toBeFalsy();
	});

	it("rejects invalid email input", async () => {
		const invalidSignUp = await app("/api/auth/sign-up/email", jsonRequest({
			email: "not-an-email",
			password: "CorrectHorseBatteryStaple123!",
			name: "Invalid Email",
		}));
		expect(invalidSignUp.status).toBe(400);

		const invalidSignIn = await app("/api/auth/sign-in/email", jsonRequest({
			email: "not-an-email",
			password: "CorrectHorseBatteryStaple123!",
		}));
		expect(invalidSignIn.status).toBe(400);
	});

	it("rejects duplicate signup for the same email", async () => {
		const email = `duplicate-${Date.now()}@example.com`;
		await signUpUser(email);

		const duplicateSignUp = await app("/api/auth/sign-up/email", jsonRequest({
			email,
			password: "CorrectHorseBatteryStaple123!",
			name: "Duplicate User",
		}));

		expect(duplicateSignUp.status).toBe(422);
	});

	it("handles unauthenticated signout without creating a session", async () => {
		const signOut = await app("/api/auth/sign-out", jsonRequest());

		expect(signOut.status).toBe(200);
		expect(await signOut.json()).toEqual({ success: true });

		const session = await app("/api/auth/get-session");
		expect(session.status).toBe(200);
		expect(await session.json()).toBeNull();
	});
});
