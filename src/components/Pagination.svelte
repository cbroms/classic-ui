<script>
  import { afterUpdate } from "svelte";

  export let pageNum;
  export let isNextPage;

  let url = null;

  afterUpdate(() => {
    url = new URL(window.location);
  });

  const makePage = (pageNum, url) => {
    if (url) {
      const newUrl = new URL(window.location);
      newUrl.searchParams.set("page", pageNum);
      return newUrl;
    }
    return "";
  };
</script>

<div class="pagination-controls">
  <a class="left" href={pageNum > 0 ? makePage(pageNum - 1, url) : null}
    ><button disabled={pageNum <= 0}>&larr; Prev page</button></a
  >
  <a href={isNextPage ? makePage(pageNum + 1, url) : null}
    ><button disabled={!isNextPage}> Next page &rarr;</button></a
  >
</div>

<style>
  .pagination-controls {
    display: flex;
    justify-content: center;
  }
  .left {
    margin-right: 20px;
  }
</style>
