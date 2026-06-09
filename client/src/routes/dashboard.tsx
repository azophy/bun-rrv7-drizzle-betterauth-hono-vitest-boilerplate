import { AppShell } from "@/components/AppShell";
import { requireUser } from "@/lib/require-user";
import { useLoaderData } from "react-router";

type LoaderData = Awaited<ReturnType<typeof clientLoader>>;

export async function clientLoader() {
	return await requireUser();
}

function DashboardRoute() {
	const { user } = useLoaderData<LoaderData>();

	return (
		<AppShell title="Dashboard Overview" user={user}>
			<div>
				<h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
				<p className="mt-2 text-gray-600">Welcome back, {user.name}. Here&apos;s what&apos;s happening today.</p>
			</div>

			<div className="mt-8 grid gap-6 md:grid-cols-3">
				{[
					["Total users", "2,450"],
					["Active teams", "18"],
					["Open tasks", "42"],
				].map(([label, value]) => (
					<div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5" key={label}>
						<p className="text-sm font-medium text-gray-500">{label}</p>
						<p className="mt-3 text-3xl font-bold text-gray-900">{value}</p>
					</div>
				))}
			</div>
		</AppShell>
	);
}

export default DashboardRoute;
