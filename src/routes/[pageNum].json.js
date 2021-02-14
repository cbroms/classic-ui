import posts from './ui/_posts.js';

const postsPerPage = 3;

const contents = posts.map(post => {
	return {
        title: post.title,
        image: post.image,
		slug: post.slug
	};
});

export function get(req, res) {

    const {pageNum} = req.params;

    const start = pageNum * postsPerPage;
    const posts = contents.slice(start, start + postsPerPage)
    const isNextPage = contents[start + postsPerPage + 1] !== undefined

    if (posts !== undefined && posts.length > 0) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
    
        res.end(JSON.stringify({posts, isNextPage}));
    } else {
        res.writeHead(404, {
			'Content-Type': 'application/json'
		});
		res.end(JSON.stringify({
			message: `Not found`
		}));
    }
}