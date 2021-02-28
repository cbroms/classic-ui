<script>
  export let preview = false;
  export let image;
  export let hasCaption = false;

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

<figure class:tall={hasCaption && image.vertical}>
  <a
    class="image"
    href={hasCaption ? image.href : null}
    class:tall={hasCaption && image.vertical}
  >
    {#if initial}
      <img
        class="initial"
        class:preview
        class:unloaded={loaded}
        class:naturalHeight={image.horizontal}
        class:naturalWidth={image.vertical}
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
      <img
        class="final"
        class:preview
        class:big={hasCaption}
        alt={image.text}
        on:load={onLoad}
        class:loaded
      />
    </picture>
  </a>
  {#if hasCaption && image.title}
    <figcaption>{image.title}</figcaption>
  {/if}
</figure>

<style>
  figure {
    margin: 0;
    height: 100%;
  }
  img {
    width: 100%;
  }

  .tall {
    min-height: 400px;
  }

  .preview {
    max-height: 275px;
  }

  .image {
    width: 700px;
    max-width: 100%;
    margin-bottom: 10px;
    display: grid;
    grid-template: 1fr / 1fr;
    place-items: center;
    height: 100%;
  }

  .big {
    max-height: 400px;
    cursor: zoom-in;
  }

  .image > * {
    grid-column: 1 / 1;
    grid-row: 1 / 1;
  }

  .initial {
    filter: blur(10px);
    z-index: 1;

    height: auto;
    width: auto;
  }

  .naturalHeight {
    height: auto;
    width: 100%;
  }

  .naturalWidth {
    height: 100%;
    width: auto;
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
      filter: blur(10px);
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
