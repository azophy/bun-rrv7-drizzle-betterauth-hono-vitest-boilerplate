import type { ReactNode } from "react";
import { Link } from "react-router";

type AuthPanelProps = {
	children: ReactNode;
	description: string;
	title: string;
};

export function AuthPanel({ children, description, title }: AuthPanelProps) {
	return (
		<main className="flex min-h-dvh bg-gray-50">
			<section className="hidden w-1/2 items-center justify-center bg-indigo-600 p-12 lg:flex">
				<div className="max-w-md text-white">
					<ShieldIcon className="mb-6 h-12 w-12" />
					<h1 className="mb-4 text-4xl font-bold">Acme Admin</h1>
					<p className="text-lg text-indigo-200">{description}</p>
				</div>
			</section>

			<section className="flex w-full items-center justify-center p-8 lg:w-1/2">
				<div className="w-full max-w-md space-y-8">
					<div className="lg:hidden">
						<ShieldIcon className="h-10 w-10 text-indigo-600" />
					</div>
					<div>{title && <h2 className="text-3xl font-bold text-gray-900">{title}</h2>}</div>
					{children}
				</div>
			</section>
		</main>
	);
}

export function AuthLink({ to, children }: { children: ReactNode; to: string }) {
	return (
		<Link className="font-medium text-indigo-600 hover:text-indigo-500" to={to}>
			{children}
		</Link>
	);
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
