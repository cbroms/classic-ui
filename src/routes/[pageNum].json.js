import posts from "./ui/_posts.js";
import { slugify } from "../utils/slugify";

const postsPerPage = 9;

// lookup for slug -> content
const allContent = {};

// lookup for year -> [slugs]
const yearLookup = {};
// lookup for os (slugified) -> [slugs]
const osLookup = {};
// lookup for elt (slugified) -> [slugs]
const eltsLookup = {};
// lookup for program (slugified) -> [slugs]
const progLookup = {};

// all the filter options
const filters = {
  year: new Set(),
  os: new Set(),
  elts: new Set(),
  prog: new Set(),
};

const contents = posts.map((post) => {
  // add the slug to the lookup tables
  if (post.year) {
    filters.year.add(post.year);
    yearLookup[post.year] = yearLookup[post.year]
      ? [...yearLookup[post.year], post.slug]
      : [post.slug];
  }
  if (post.os) {
    const os = slugify(post.os);
    filters.os.add(post.os);
    osLookup[os] = osLookup[os] ? [...osLookup[os], post.slug] : [post.slug];
  }
  if (post.program) {
    const prog = slugify(post.program);
    filters.prog.add(post.program);
    progLookup[prog] = progLookup[prog]
      ? [...progLookup[prog], post.slug]
      : [post.slug];
  }
  if (post.elts) {
    for (let elt of post.elts) {
      filters.elts.add(elt);
      elt = slugify(elt);
      eltsLookup[elt] = eltsLookup[elt]
        ? [...eltsLookup[elt], post.slug]
        : [post.slug];
    }
  }
  // add to the slug lookup
  allContent[post.slug] = {
    title: post.title,
    image: post.image,
    slug: post.slug,
  };
  return post.slug;
});

const getMatching = (years, oses, elts, progs) => {
  if (
    years.length === 0 &&
    oses.length === 0 &&
    elts.length === 0 &&
    progs.length === 0
  )
    return contents;

  // the number of times each result has appeared
  //   const rankLookup = {};

  // if we're doing filters like this OR that, rather than this AND that
  //   const toRankLookup = (results) => {
  //     // add results to ranking
  //     return results.map((slug) => {
  //       rankLookup[slug] = rankLookup[slug] ? rankLookup[slug] + 1 : 1;
  //       return slug;
  //     });
  //   };

  const lookup = (list, lookupTable) => {
    if (list.length === 0) return null;

    let matching = {};
    for (const item of list) {
      const res = lookupTable[item] ? lookupTable[item] : [];
      res.map((id) => (matching[id] = matching[id] ? (matching[id] += 1) : 1));
    }

    const allMatched = [];

    for (const id in matching) {
      if (matching[id] === list.length) allMatched.push(id);
    }

    //const res = toRankLookup(matching);
    // return [...new Set(res)];

    return allMatched;
  };

  // remove all dupes
  //   const results = [
  //     ...new Set([
  //       ...lookup(years, yearLookup),
  //       ...lookup(oses, osLookup),
  //       ...lookup(elts, eltsLookup),
  //       ...lookup(progs, progLookup),
  //     ]),
  //   ];

  const yRes = lookup(years, yearLookup);
  const oRes = lookup(oses, osLookup);
  const eRes = lookup(elts, eltsLookup);
  const pRes = lookup(progs, progLookup);

  // filter out everything that isn't in all lists
  const common = (yRes !== null ? yRes : contents).filter(
    (e) =>
      (oRes !== null ? oRes.includes(e) : true) &&
      (eRes !== null ? eRes.includes(e) : true) &&
      (pRes !== null ? pRes.includes(e) : true)
  );

  // sort by number of times each has appeared
  //return results.sort((a, b) => rankLookup[a] < rankLookup[b]);
  return common;
};

export function get(req, res) {
  const { year, os, elts, progs } = req.query;
  const { pageNum } = req.params;

  const yearsList = year && year !== "undefined" ? year.split(",") : [];
  const eltsList = elts && elts !== "undefined" ? elts.split(",") : [];
  const osesList = os && os !== "undefined" ? os.split(",") : [];
  const progsList = progs && progs !== "undefined" ? progs.split(",") : [];

  // get a list of slugs we could return
  const matchingContent = getMatching(yearsList, osesList, eltsList, progsList);

  const start = pageNum * postsPerPage;
  // get the page from the list of all matching slugs, then convert slugs to page objects
  const posts = matchingContent
    .slice(start, start + postsPerPage)
    .map((slug) => allContent[slug]);
  const isNextPage = matchingContent[start + postsPerPage + 1] !== undefined;

  const defaultResponse = {
    filters: {
      year: [...filters.year],
      os: [...filters.os],
      elts: [...filters.elts],
      progs: [...filters.prog],
    },
  };

  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  if (posts !== undefined && posts.length > 0) {
    res.end(
      JSON.stringify({
        ...defaultResponse,
        posts,
        isNextPage,
        numResults: matchingContent.length,
      })
    );
  } else {
    res.end(JSON.stringify({ ...defaultResponse, message: "No results" }));
  }
}
