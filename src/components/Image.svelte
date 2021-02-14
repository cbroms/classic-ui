<script>
  export let image;

  let loaded = false;
  let initial = true;

  const onLoad = () => {
    loaded = true;

    // remove the inital after the load in/out animation is complete
    setTimeout(() => {
      initial = false;
    }, 1000);
  };
</script>

<figure>
  <a class="image" href={image.href}>
    {#if initial}
      <img
        class="initial"
        class:unloaded={loaded}
        alt={image.text}
        src={image.tiny}
      />
    {/if}
    <picture>
      <source
        type="image/webp"
        srcset="{image.medium.webp} 400w, {image.large.webp}"
      />
      <source
        type="image/jpg"
        srcset="{image.medium.jpg} 400w, {image.large.jpg}"
      />
      <img class="final" alt={image.text} on:load={onLoad} class:loaded />
    </picture>
  </a>
  <figcaption>{image.title}</figcaption>
</figure>

<style>
  figure {
    margin: 80px auto;
  }

  img {
    width: 100%;
  }

  .image {
    width: 700px;
    max-width: 100%;
    margin-bottom: 10px;
    display: grid;
    grid-template: 1fr / 1fr;
    place-items: center;
  }

  .image > * {
    grid-column: 1 / 1;
    grid-row: 1 / 1;
  }

  .initial {
    filter: blur(20px);
    z-index: 1;
  }

  @keyframes blur-in {
    from {
      opacity: 0;
      filter: blur(20px);
    }
    to {
      opacity: 1;
      filter: blur(0px);
    }
  }

  @keyframes blur-out {
    from {
      opacity: 1;
      filter: blur(20px);
    }
    to {
      opacity: 0;
    }
  }

  .final {
    position: relative;
    display: none;
    z-index: 2;
  }

  .loaded {
    display: block;
    animation-name: blur-in;
    animation-duration: 0.5s;
    animation-timing-function: ease-in;
  }

  .unloaded {
    animation-delay: 0.5s;
    animation-name: blur-out;
    animation-duration: 0.5s;
    animation-timing-function: ease-out;
  }
</style>
