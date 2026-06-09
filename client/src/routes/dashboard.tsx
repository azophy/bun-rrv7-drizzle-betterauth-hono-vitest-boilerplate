import HtmlDesignRoute from "@/components/HtmlDesignRoute";
import html from "@/designs/dashboard.html?raw";

function DashboardRoute() {
	return <HtmlDesignRoute title="Dashboard design" html={html} />;
}

export default DashboardRoute;
