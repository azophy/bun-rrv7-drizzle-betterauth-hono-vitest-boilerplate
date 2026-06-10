import { redirect } from "react-router";
import { getSession } from "./auth";

export async function requireUser() {
	const session = await getSession();

	if (!session?.user) {
		throw redirect("/login");
	}

	return session;
}

export async function redirectIfAuthenticated(redirectTo = "/") {
	const session = await getSession();

	if (session?.user) {
		throw redirect(redirectTo);
	}

	return null;
}
