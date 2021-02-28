<nav>
  <a href="/">
    <picture>
      <source type="image/webp" srcset="logo.webp" />
      <source type="image/jpg" srcset="logo.jpg" />
      <img class="logo" alt="Classic Interfaces" />
    </picture>
  </a>
</nav>
<main>
  <slot />
</main>
<footer>
  <div>Built by <a href="https://christianbroms.com">CB</a></div>
  <div>
    All Images &copy; original owners, reproduced under <a
      href="https://en.wikipedia.org/wiki/Fair_use">fair use</a
    >
  </div>
  <div>
    View this website's <a href="https://github.com/cbroms/classic-ui"
      >source code</a
    >
  </div>
</footer>

<style>
  nav {
    padding: 20px;
    display: flex;
    justify-content: center;
  }

  .logo {
    max-width: 600px;
    width: 100%;
  }

  footer {
    max-width: 1100px;
    width: 100%;
    margin: 40px auto 0 auto;
    padding: 20px;

    display: flex;
    justify-content: center;
  }

  main {
    min-height: 80vh;
  }

  footer > div {
    margin-right: 40px;
  }
</style>
