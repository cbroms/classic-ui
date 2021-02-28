<script context="module">
  export async function preload(page) {
    const pageNum = page.query.page || 0;
    const { year, os, elts, progs } = page.query;

    const r = await this.fetch(
      `${pageNum}.json?year=${year}&os=${os}&elts=${elts}&progs=${progs}`
    );

    if (r.status === 200) {
      const json = await r.json();
      const res = {
        ...json,
        pageNum: parseInt(pageNum),
        query: { year, os, elts, progs },
      };
      return { res };
    }

    this.error(r.status, r.statusText);
  }
</script>

<script>
  import Filters from "../components/Filters.svelte";
  import Image from "../components/Image.svelte";
  import Pagination from "../components/Pagination.svelte";
  export let res;
</script>

<svelte:head>
  <link rel="canonical" href="https://classicinterfaces.com/" />
  <title>Classic Interfaces</title>
  <meta name="title" content="Classic Interfaces" />
  <meta
    name="description"
    content="Classic user interfaces from 1980's and 1990's operating systems. Includes interfaces from MacOS System 6, 7, and Windows 3. MacPaint, Calculator, Control Panel, and many more. "
  />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://classicinterfaces.com/" />
  <meta property="og:title" content="Classic Interfaces" />
  <meta
    property="og:description"
    content="Classic user interfaces from 1980's and 1990's operating systems. Includes interfaces from MacOS System 6, 7, and Windows 3. MacPaint, Calculator, Control Panel, and many more. "
  />
  <meta
    property="og:image"
    content="https://classicinterfaces.com/images/paint1/large.jpg"
  />

  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://classicinterfaces.com/" />
  <meta property="twitter:title" content="Classic Interfaces" />
  <meta
    property="twitter:description"
    content="Classic user interfaces from 1980's and 1990's operating systems. Includes interfaces from MacOS System 6, 7, and Windows 3. MacPaint, Calculator, Control Panel, and many more. "
  />
  <meta
    property="twitter:image"
    content="https://classicinterfaces.com/images/paint1/large.jpg"
  />
</svelte:head>

<Filters filters={res.filters} query={res.query} results={res.numResults} />
<div class="posts">
  {#if res.message}
    <div class="no-results">
      <h2>No results!</h2>
      <p>Couldn't find any interfaces matching your filters.</p>
    </div>
  {:else}
    {#each res.posts as post (post.slug)}
      <div class="post-preview">
        <a href="/ui/{post.slug}">
          <Image image={post.image} preview />
        </a>
      </div>
    {/each}
  {/if}
</div>
<Pagination isNextPage={res.isNextPage} pageNum={res.pageNum} />

<style>
  .posts {
    max-width: 1100px;
    width: 100%;
    margin: 40px auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
  .post-preview {
    width: 326px;
    margin: 20px;
  }
  .no-results {
    margin: 0 auto;
    max-width: 600px;
    width: 100%;
  }
</style>
