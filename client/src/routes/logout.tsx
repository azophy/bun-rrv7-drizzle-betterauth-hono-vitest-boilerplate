import { signOut } from "@/lib/auth";
import { Form, Link, redirect } from "react-router";

export async function clientAction() {
	await signOut();
	return redirect("/login");
}

function LogoutRoute() {
	return (
		<main className="flex min-h-dvh items-center justify-center bg-gray-50 p-8">
			<div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-900/5">
				<h1 className="text-2xl font-bold text-gray-900">Sign out?</h1>
				<p className="mt-2 text-gray-600">Are you sure you want to sign out?</p>
				<div className="mt-6 flex justify-center gap-3">
					<Form method="post">
						<button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500" type="submit">
							Sign out
						</button>
					</Form>
					<Link className="rounded-md px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100" to="/">
						Cancel
					</Link>
				</div>
			</div>
		</main>
	);
}

export default LogoutRoute;
