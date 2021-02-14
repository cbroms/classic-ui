<script context="module">
  export async function preload({ params }) {
    // the `slug` parameter is available because
    // this file is called [slug].svelte
    const res = await this.fetch(`ui/${params.slug}.json`);
    const data = await res.json();

    if (res.status === 200) {
      return { post: data };
    } else {
      this.error(res.status, data.message);
    }
  }
</script>

<script>
  import Image from "../../components/Image.svelte";
  export let post;
</script>

<svelte:head>
  <title>{post.title}</title>
</svelte:head>

<div class="content">
  {#each post.html as section, i}
    {@html section}
    {#if i < post.images.length}
      <Image image={post.images[i]} hasCaption />
    {/if}
  {/each}
</div>

<style>
  .content {
    margin: 0 auto;
    padding: 20px;
    max-width: 700px;
    width: 100%;
  }
</style>
