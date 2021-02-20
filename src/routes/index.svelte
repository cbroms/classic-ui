<script context="module">
  export async function preload(page) {
    const pageNum = page.query.page || 0;
    const { year, os, elts } = page.query;

    const r = await this.fetch(
      `${pageNum}.json?year=${year}&os=${os}&elts=${elts}`
    );

    if (r.status === 200) {
      const json = await r.json();
      const res = {
        ...json,
        pageNum: parseInt(pageNum),
        query: { year, os, elts },
      };
      return { res };
    }

    this.error(r.status, r.statusText);
  }
</script>

<script>
  import Filters from "../components/Filters.svelte";
  import Image from "../components/Image.svelte";
  export let res;
</script>

<svelte:head>
  <title>Blog</title>
</svelte:head>

<Filters filters={res.filters} query={res.query} />
<div class="posts">
  {#if res.message}
    <div class="no-results">
      <h2>No results!</h2>
      <p>Couldn't find any interfaces matching your filters.</p>
    </div>
  {:else}
    {#each res.posts as post}
      <div class="post-preview">
        <a href="/ui/{post.slug}">
          <Image image={post.image} />
        </a>
      </div>
    {/each}
  {/if}
</div>

{#if res.pageNum > 0}
  <a href="/?page={res.pageNum - 1}">Prev page</a>
{/if}

{#if res.isNextPage}
  <a href="/?page={res.pageNum + 1}">Next page</a>
{/if}

<style>
  .posts {
    max-width: 1100px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  .post-preview {
    width: 300px;
    margin: 20px;
  }
  .no-results {
    margin: 0 auto;
    max-width: 600px;
    width: 100%;
  }
</style>
