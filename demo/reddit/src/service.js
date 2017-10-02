const uri = 'https://www.reddit.com/';

function normalizeResults(results) {
	return results.map(x => ({
		id: x.data.id,
		author: x.data.author,
		comments: x.data.num_comments,
		created: x.data.created,
		score: x.data.score,
		subreddit: x.data.subreddit,
		title: x.data.title,
		url: x.data.url
	}));
}

export default {
	querySubreddit(sub, type) {
		const queryString = `/${type}.json?limit=10`;

		return fetch(uri + sub + queryString)
			.then(resp => resp.json())
			.then(res => normalizeResults(res.data.children))
			.catch(e => console.error(e));
	}
};
