type HtmlDesignRouteProps = {
	title: string;
	html: string;
};

function HtmlDesignRoute({ title, html }: HtmlDesignRouteProps) {
	return (
		<iframe
			title={title}
			srcDoc={html}
			className="block h-dvh w-full border-0 bg-white"
			sandbox="allow-forms allow-same-origin allow-scripts"
		/>
	);
}

export default HtmlDesignRoute;
