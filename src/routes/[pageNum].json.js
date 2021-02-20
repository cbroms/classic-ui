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

// all the filter options 
const filters = {
    year: new Set(),
    os: new Set(),
    elts: new Set(),
}

const contents = posts.map(post => {
    // add the slug to the lookup tables 
    if (post.year) {
        filters.year.add(post.year)
        yearLookup[post.year] = yearLookup[post.year] ? [...yearLookup[post.year], post.slug] : [post.slug]
    }
    if (post.os) {
        const os = slugify(post.os)
        filters.os.add(post.os)
        osLookup[os] = osLookup[os] ? [...osLookup[os], post.slug] : [post.slug]
    }
    if (post.elts) {
        for (let elt of post.elts) {
            filters.elts.add(elt)
            elt = slugify(elt)
            eltsLookup[elt] = eltsLookup[elt] ? [...eltsLookup[elt], post.slug] : [post.slug]
        }
    }
    // add to the slug lookup 
    allContent[post.slug] = { title: post.title, image: post.image, slug: post.slug }
	return post.slug
});


const getMatching = (year, os, elts) => {

    if (year === "undefined" && os === "undefined" && elts.length === 0) return contents;

    // the number of times each result has appeared 
    const rankLookup = {}

    const toRankLookup = (results) => {
        // add results to ranking 
        return results.map(slug => {
            rankLookup[slug] = rankLookup[slug] ? rankLookup[slug] + 1 : 1
            return slug
        })
    }

    // lookup with year, os, and elements
    const matchingYear = toRankLookup(yearLookup[year] || [])
    const matchingOs = toRankLookup(osLookup[os] || [])
    let matchingElts = []
    for (const elt of elts) {
        matchingElts = eltsLookup[elt] ? [...matchingElts, ...eltsLookup[elt]] : []
    }
    toRankLookup(matchingElts)

    // remove all dupes 
   const results = [...new Set([...new Set(matchingElts), ...matchingYear, ...matchingOs])]
   // sort by number of times each has appeared 
   return results.sort((a, b) => rankLookup[a] < rankLookup[b]);
}

export function get(req, res) {

    const { year, os, elts} = req.query;
    const { pageNum } = req.params;

    const elements = elts !== "undefined" ? elts.split(",") : []

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
        res.end(JSON.stringify({posts, isNextPage, filters: {year: [...filters.year], os: [...filters.os], elts: [...filters.elts]}}));
    } else {
        res.end(JSON.stringify({message: "No results"}));
    }
}