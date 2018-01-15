export const Route = props => props;

export function Router(props) {
	if (!props.children) return; // Error?

	if (!window.onpopstate) window.onpopstate = props.routeChanged;

	const match = props.children.find(matchRoute);

	if (match) {
		return match.view(props.model);
	} else {
		// Not Found?
	}
}

function matchRoute(route) {
	const currentPath = window.location.pathname;

	if (route.exact) {
		return currentPath === route.path;
	}

	return currentPath.match(/[^\/]+/g)[0] === route.path.match(/[^\/]+/g)[0];
}
