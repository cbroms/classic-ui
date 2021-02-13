<script>
  export let image;

  let loaded = false;
  let initial = true;

  const onLoad = () => {
    loaded = true;
    setTimeout(() => {
      initial = false;
    }, 1000);
  };
</script>

<div class="image">
  {#if initial}
    <img class="initial" class:unloaded={loaded} src={image.tiny} />
  {/if}
  <picture>
    <source
      type="image/webp"
      srcset="{image.thumbnail} 375w, {image.thumbnail} 768w, {image.large} 1024w"
    />
    <img class="final" alt="fuji" on:load={onLoad} class:loaded />
  </picture>
</div>

<style>
  img {
    width: 700px;
    max-width: 100%;
  }

  .image {
    display: grid;
    grid-template: 1fr / 1fr;
    place-items: center;
    margin: 80px auto;
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
