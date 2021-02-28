<script context="module">
  export async function preload({ params }) {
    // the `slug` parameter is available because
    // this file is called [slug].svelte
    const res = await this.fetch(`ui/${params.slug}.json`);
    const post = await res.json();

    if (res.status === 200) {
      for (const i in post.images) {
        const rmeta = await this.fetch(post.images[i].meta);
        const meta = await rmeta.json();
        post.images[i] = { ...post.images[i], ...meta };
      }
      return { post };
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
  <link rel="canonical" href="https://classicinterfaces.com/ui/{post.slug}" />
  <title>{post.title} - Classic Interfaces</title>
  <meta name="title" content="{post.title} - Classic Interfaces" />
  <meta
    name="description"
    content="{post.title} from {post.os} released in {post.year}. Find this classic interface and more."
  />

  <meta property="og:type" content="website" />
  <meta
    property="og:url"
    content="https://classicinterfaces.com/ui/{post.slug}"
  />
  <meta property="og:title" content="{post.title} - Classic Interfaces" />
  <meta
    property="og:description"
    content="{post.title} from {post.os} released in {post.year}. Find this classic interface and more."
  />
  <meta
    property="og:image"
    content="https://classicinterfaces.com{post.image.large.jpg}"
  />

  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://classicinterfaces.com/" />
  <meta property="twitter:title" content="{post.title} - Classic Interfaces" />
  <meta
    property="twitter:description"
    content="{post.title} from {post.os} released in {post.year}. Find this classic interface and more."
  />
  <meta
    property="twitter:image"
    content="https://classicinterfaces.com{post.image.large.jpg}"
  />
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
    min-height: 500px;
  }

  .image-wrapper {
    margin-bottom: 80px;
    height: 100%;
  }

  .attributes {
    margin: 0 auto;
    padding: 20px 0;
    display: flex;
    justify-content: center;
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
