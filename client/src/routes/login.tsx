import { AuthLink, AuthPanel } from "@/components/AuthPanel";
import { redirectIfAuthenticated } from "@/lib/require-user";
import { signIn } from "@/lib/auth";
import { Form, redirect, useActionData, useNavigation } from "react-router";

type ClientActionArgs = {
	request: Request;
};

type ActionData = {
	error?: string;
};

export async function clientLoader() {
	return await redirectIfAuthenticated();
}

export async function clientAction({ request }: ClientActionArgs) {
	const formData = await request.formData();
	const email = String(formData.get("email") ?? "");
	const password = String(formData.get("password") ?? "");

	if (!email || !password) {
		return { error: "Email and password are required." } satisfies ActionData;
	}

	try {
		await signIn({ email, password });
		return redirect("/dashboard");
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : "Unable to sign in.",
		} satisfies ActionData;
	}
}

function LoginRoute() {
	const actionData = useActionData<ActionData>();
	const navigation = useNavigation();
	const isSubmitting = navigation.state === "submitting";

	return (
		<AuthPanel
			description="Log in to continue managing your team and dashboard."
			title="Sign in to your account"
		>
			<p className="text-gray-500">
				Don&apos;t have an account? <AuthLink to="/register">Register</AuthLink>
			</p>

			<Form className="mt-8 space-y-6" method="post">
				<div className="space-y-5 rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-900/5">
					{actionData?.error ? (
						<p className="rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">
							{actionData.error}
						</p>
					) : null}

					<div>
						<label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="email">
							Email address
						</label>
						<input
							className="mt-2 block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
							id="email"
							name="email"
							placeholder="you@company.com"
							required
							type="email"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="password">
							Password
						</label>
						<input
							className="mt-2 block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
							id="password"
							name="password"
							placeholder="••••••••"
							required
							type="password"
						/>
					</div>
				</div>

				<button
					className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
					disabled={isSubmitting}
					type="submit"
				>
					{isSubmitting ? "Signing in..." : "Sign In"}
				</button>
			</Form>
		</AuthPanel>
	);
}

export default LoginRoute;
