<nav>
  <a href="/">
    <picture>
      <source type="image/webp" srcset="logo.webp" />
      <source type="image/jpg" srcset="logo.jpg" />
      <img class="logo" alt="Classic Interfaces" />
    </picture>
  </a>
</nav>

<slot />

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
</style>
