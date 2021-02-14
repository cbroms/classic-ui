<script context="module">
  export function preload() {
    return this.fetch(`index.json`)
      .then((r) => r.json())
      .then((posts) => {
        return { posts };
      });
  }
</script>

<script>
  import Image from "../components/Image.svelte";
  export let posts;
</script>

<svelte:head>
  <title>Blog</title>
</svelte:head>

<div class="posts">
  {#each posts as post}
    <div class="post-preview">
      <a href="/ui/{post.slug}">
        <Image image={post.image} />
      </a>
    </div>
  {/each}
</div>

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
