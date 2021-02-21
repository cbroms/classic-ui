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
  <title>{post.title} - Classic Interfaces</title>
</svelte:head>

<div class="attributes">
  <div class="attribute">
    <h4>Program</h4>
    <div>{post.program}</div>
  </div>
  <div class="attribute">
    <h4>Operating System</h4>
    <div>{post.os}</div>
  </div>
  <div class="attribute">
    <h4>Release Year</h4>
    <div>{post.year}</div>
  </div>
  <div class="attribute">
    <h4>Emulator</h4>
    <div><a href={post.url}>Run it online</a></div>
  </div>
</div>

<div class="content">
  {#each post.html as section, i}
    {@html section}
    {#if i < post.images.length}
      <div class="image-wrapper">
        <Image image={post.images[i]} hasCaption />
      </div>
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

  .image-wrapper {
    margin-bottom: 80px;
  }

  .attributes {
    margin: 0 auto;
    padding: 20px 0;
    display: flex;
    max-width: 700px;
    width: 100%;
  }

  .attribute {
    padding: 0 20px;
  }

  h4 {
    margin: 10px 0;
  }
</style>
