<script context="module">
  export async function preload(page) {
    const pageNum = page.query.page;

    const r = await this.fetch(
      `${pageNum !== undefined && pageNum > 0 ? pageNum : 0}.json`
    );

    if (r.status === 200) {
      const json = await r.json();
      const res = { ...json, pageNum: parseInt(pageNum) };
      return { res };
    }

    this.error(r.status, r.statusText);
  }
</script>

<script>
  import Image from "../components/Image.svelte";
  export let res;
</script>

<svelte:head>
  <title>Blog</title>
</svelte:head>

<div class="posts">
  {#each res.posts as post}
    <div class="post-preview">
      <a href="/ui/{post.slug}">
        <Image image={post.image} />
      </a>
    </div>
  {/each}
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
</style>
