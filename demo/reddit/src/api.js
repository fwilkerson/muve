const uri = 'https://www.reddit.com/';
const lastIds = {};
const mapListing = listing => {
	return new Promise(res => {
		const mapped = listing.map(x => ({
			id: `${x.kind}_${x.data.id}`,
			created: x.data.created,
			subreddit: x.data.subreddit,
			title: x.data.title,
			url: x.data.url
		}));

		const last = mapped[mapped.length - 1];
		lastIds[last.subreddit] = last.id;
		res(mapped);
	});
};

export default (sub, type, more) => {
	let queryString = `/${type}.json?limit=15`;
	if (more) {
		const id = lastIds[sub.slice(sub.indexOf('/') + 1)];
		if (id) queryString = `/${type}.json?after=${id}&limit=15`;
	}

	return fetch(uri + sub + queryString)
		.then(resp => resp.json())
		.then(({data}) => mapListing(data.children))
		.catch(e => console.error(e));
};
