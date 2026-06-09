import { AuthLink, AuthPanel } from "@/components/AuthPanel";
import { signUp } from "@/lib/auth";
import { redirectIfAuthenticated } from "@/lib/require-user";
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
	const name = String(formData.get("name") ?? "");
	const email = String(formData.get("email") ?? "");
	const password = String(formData.get("password") ?? "");

	if (!name || !email || !password) {
		return { error: "Name, email, and password are required." } satisfies ActionData;
	}

	try {
		await signUp({ name, email, password });
		return redirect("/dashboard");
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : "Unable to create account.",
		} satisfies ActionData;
	}
}

function RegisterRoute() {
	const actionData = useActionData<ActionData>();
	const navigation = useNavigation();
	const isSubmitting = navigation.state === "submitting";

	return (
		<AuthPanel
			description="Create your account to access the internal dashboard and manage your team."
			title="Create your account"
		>
			<p className="text-gray-500">
				Already registered? <AuthLink to="/login">Sign in</AuthLink>
			</p>

			<Form className="mt-8 space-y-6" method="post">
				<div className="space-y-5 rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-900/5">
					{actionData?.error ? (
						<p className="rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">
							{actionData.error}
						</p>
					) : null}

					<div>
						<label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="name">
							Full name
						</label>
						<input
							className="mt-2 block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
							id="name"
							name="name"
							placeholder="Jane Doe"
							required
							type="text"
						/>
					</div>

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
					{isSubmitting ? "Creating account..." : "Create Account"}
				</button>
			</Form>
		</AuthPanel>
	);
}

export default RegisterRoute;
