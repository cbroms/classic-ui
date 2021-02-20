import posts from './ui/_posts.js';
import {slugify} from "../utils/slugify"

const postsPerPage = 3;

// lookup for slug -> content 
const allContent = {}

// lookup for year -> [slugs]
const yearLookup = {}
// lookup for os (slugified) -> [slugs]
const osLookup = {}
// lookup for elt (slugified) -> [slugs]
const eltsLookup = {}

const contents = posts.map(post => {
    // add the slug to the lookup tables 
    if (post.year) {
        yearLookup[post.year] = yearLookup[post.year] ? [...yearLookup[post.year], post.slug] : [post.slug]
    }
    if (post.os) {
        const os = slugify(post.os)
        console.log(os)
        osLookup[os] = osLookup[os] ? [...osLookup[os], post.slug] : [post.slug]
    }
    if (post.elts) {
        for (let elt of post.elts) {
            elt = slugify(elt)
            eltsLookup[elt] = eltsLookup[elt] ? [...eltsLookup[elt], post.slug] : [post.slug]
        }
    }
    // add to the slug lookup 
    allContent[post.slug] = { title: post.title, image: post.image, slug: post.slug }
	return post.slug
});


const getMatching = (year, os, elts) => {
    if (!year && !os && !elts) return contents;

    // lookup with year, os, and elements
    const matchingYear = yearLookup[year] || [];
    const matchingOs = osLookup[os] || [];
    let matchingElts = []
    for (const elt of elts) {
        matchingElts = eltsLookup[elt] ? [...matchingElts, ...eltsLookup[elt]] : []
    }
    // remove all dupes 
   return [...new Set([...new Set(matchingElts), ...matchingYear, ...matchingOs])]
}

export function get(req, res) {

    const { year, os, elts} = req.query;
    const { pageNum } = req.params;

    const elements = elts !== undefined ? elts.split(",") : []
    // get a list of slugs we could return 
    const matchingContent = getMatching(year, os, elements)

    const start = pageNum * postsPerPage;
    // get the page from the list of all matching slugs, then convert slugs to page objects 
    const posts = matchingContent.slice(start, start + postsPerPage).map(slug => allContent[slug])
    const isNextPage = matchingContent[start + postsPerPage + 1] !== undefined;

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });

    if (posts !== undefined && posts.length > 0) {
        res.end(JSON.stringify({posts, isNextPage}));
    } else {
        res.end(JSON.stringify({message: "No results"}));
    }
}