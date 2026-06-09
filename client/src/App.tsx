import type { ComponentType } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

type RouteModule = {
	default: ComponentType;
};

const routeModules = import.meta.glob("./routes/**/*.tsx", {
	eager: true,
}) as Record<string, RouteModule>;

const fileRoutes = Object.entries(routeModules)
	.map(([filePath, module]) => ({
		path: routePathFromFilePath(filePath),
		Component: module.default,
	}))
	.sort((a, b) => a.path.localeCompare(b.path));

function routePathFromFilePath(filePath: string) {
	const routePath = filePath
		.replace("./routes", "")
		.replace(/\.tsx$/, "")
		.replace(/\/index$/, "/")
		.replace(/\[([^/]+?)\]/g, ":$1");

	return routePath === "" ? "/" : routePath;
}

function App() {
	return (
		<BrowserRouter>
			<Routes>
				{fileRoutes.map(({ path, Component }) => (
					<Route key={path} path={path} element={<Component />} />
				))}
			</Routes>
		</BrowserRouter>
	);
}

export default App;
