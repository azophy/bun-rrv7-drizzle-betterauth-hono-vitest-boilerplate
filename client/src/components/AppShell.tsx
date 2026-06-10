import type { ReactNode } from "react";
import { Form, Link, NavLink } from "react-router";
import type { AuthUser } from "@/lib/auth";

type AppShellProps = {
	children: ReactNode;
	title: string;
	user: AuthUser;
};

const navigation = [
	{ href: "/", label: "Dashboard" },
	{ href: "/users", label: "Users" },
];

export function AppShell({ children, title, user }: AppShellProps) {
	return (
		<div className="flex h-dvh overflow-hidden bg-gray-50">
			<aside className="hidden w-64 flex-col overflow-y-auto border-r border-gray-200 bg-white lg:flex">
				<Link className="flex h-16 shrink-0 items-center border-b border-gray-200 px-6" to="/">
					<ShieldIcon className="h-8 w-8 text-indigo-600" />
					<span className="ml-3 text-xl font-bold text-gray-900">Acme</span>
				</Link>

				<nav className="flex-1 space-y-1 px-4 py-6">
					{navigation.map((item) => (
						<NavLink
							className={({ isActive }) =>
								`flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium leading-6 transition-colors ${
									isActive
										? "bg-indigo-50 text-indigo-700"
										: "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
								}`
							}
							key={item.href}
							to={item.href}
						>
							<span>{item.label}</span>
						</NavLink>
					))}
				</nav>
			</aside>

			<div className="flex flex-1 flex-col overflow-hidden">
				<header className="flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 sm:gap-x-6 sm:px-6 lg:px-8">
					<div className="flex flex-1 items-center gap-x-4">
						<h1 className="text-lg font-semibold text-gray-900">{title}</h1>
					</div>
					<div className="flex items-center gap-x-4">
						<div className="flex items-center gap-x-3">
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
								{getInitials(user.name)}
							</div>
							<span className="hidden text-sm font-medium text-gray-900 sm:block">
								{user.name}
							</span>
						</div>
						<Form method="post" action="/logout">
							<button className="rounded-md px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100" type="submit">
								Sign out
							</button>
						</Form>
					</div>
				</header>

				<main className="flex-1 overflow-y-auto bg-gray-50 p-6 lg:p-8">{children}</main>
			</div>
		</div>
	);
}

function getInitials(name: string) {
	return name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join("") || "U";
}

function ShieldIcon({ className }: { className?: string }) {
	return (
		<svg
			aria-hidden="true"
			className={className}
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
		</svg>
	);
}
