import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";

const isTest = process.env.NODE_ENV === "test" || process.env.VITEST === "true";

export const auth = betterAuth({
	appName: "BHVR Experiment",
	secret: process.env.BETTER_AUTH_SECRET ?? "test-secret-at-least-32-characters-long",
	baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),
	emailAndPassword: {
		enabled: true,
	},
	trustedOrigins: [
		process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
		"http://localhost:5173",
	],
	advanced: {
		useSecureCookies: !isTest && process.env.NODE_ENV === "production",
	},
});

export type Auth = typeof auth;
