import { Link } from "react-router";

const routes = [
	{ path: "/dashboard", label: "Dashboard" },
	{ path: "/login", label: "Login" },
	{ path: "/register", label: "Register" },
	{ path: "/users", label: "Users" },
	{ path: "/logout", label: "Logout" },
];

function IndexRoute() {
	return (
		<main className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center gap-8 px-6 py-12">
			<div>
				<p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
					File-based routes
				</p>
				<h1 className="mt-3 text-4xl font-black tracking-tight text-gray-950">
					Sample admin designs
				</h1>
				<p className="mt-3 text-gray-600">
					Sign up or sign in to access protected dashboard and user routes.
				</p>
			</div>

			<nav className="grid gap-3 sm:grid-cols-2">
				{routes.map((route) => (
					<Link
						key={route.path}
						to={route.path}
						className="rounded-xl border border-gray-200 bg-white p-5 font-semibold text-gray-900 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
					>
						{route.label}
						<span className="mt-1 block text-sm font-normal text-gray-500">
							{route.path}
						</span>
					</Link>
				))}
			</nav>
		</main>
	);
}

export default IndexRoute;
