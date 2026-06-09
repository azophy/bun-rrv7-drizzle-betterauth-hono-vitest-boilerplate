import { AppShell } from "@/components/AppShell";
import { requireUser } from "@/lib/require-user";
import { useLoaderData } from "react-router";

type LoaderData = Awaited<ReturnType<typeof clientLoader>>;

const users = [
	{ initials: "LM", name: "Lindsay Manning", role: "Admin", status: "Active" },
	{ initials: "CF", name: "Courtney Fisher", role: "Member", status: "Active" },
];

export async function clientLoader() {
	return await requireUser();
}

function UsersRoute() {
	const { user } = useLoaderData<LoaderData>();

	return (
		<AppShell title="User Management" user={user}>
			<div className="mb-6 sm:flex sm:items-center sm:justify-between">
				<div>
					<h2 className="text-2xl font-bold text-gray-900">Users</h2>
					<p className="mt-1 text-sm text-gray-500">Add, remove, and manage team member permissions.</p>
				</div>
				<button
					className="mt-4 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 sm:mt-0"
					type="button"
				>
					Add User
				</button>
			</div>

			<div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5">
				<table className="min-w-full divide-y divide-gray-300">
					<thead className="bg-gray-50">
						<tr>
							<th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6" scope="col">
								Name
							</th>
							<th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900" scope="col">
								Role
							</th>
							<th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900" scope="col">
								Status
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 bg-white">
						{users.map((teamUser) => (
							<tr key={teamUser.name}>
								<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
									<div className="flex items-center gap-x-3">
										<div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-600 text-xs font-bold text-white">
											{teamUser.initials}
										</div>
										<span>{teamUser.name}</span>
									</div>
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{teamUser.role}</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm">
									<span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
										{teamUser.status}
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</AppShell>
	);
}

export default UsersRoute;
