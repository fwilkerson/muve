const uri = 'https://www.reddit.com/';
const lastIds = {};
const mapListing = listing => {
	return new Promise(res => {
		const mapped = listing.map(x => ({
			id: x.data.id,
			author: x.data.author,
			comments: x.data.num_comments,
			created: x.data.created,
			score: x.data.score,
			subreddit: x.data.subreddit,
			title: x.data.title,
			url: x.data.url
		}));

		const last = mapped[mapped.length - 1];
		if (last) lastIds[last.subreddit] = last.id;
		res(mapped);
	});
};

export default {
	get(sub, type, more) {
		let queryString = `/${type}.json?limit=10`;
		if (more) {
			const id = lastIds[sub.slice(sub.indexOf('/') + 1)];
			if (id) queryString = `/${type}.json?after=${id}&limit=10`;
		}

		return fetch(uri + sub + queryString)
			.then(resp => resp.json())
			.then(({data}) => mapListing(data.children))
			.catch(e => console.error(e));
	}
};
