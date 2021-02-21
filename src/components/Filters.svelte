<script>
  import { slide } from "svelte/transition";
  import { goto } from "@sapper/app";
  import { slugify } from "../utils/slugify";

  export let query;
  export let filters = { year: [], os: [], elts: [] };
  export let results = 0;

  let open = false;

  const valueChanged = (e, ...args) => {
    if (!e.target.checked) {
      // remove the query from the URL
      removeQueryFromURL(...args);
    } else {
      addQueryToURL(...args);
    }
  };

  const addQueryToURL = (query, value) => {
    const newUrl = new URL(window.location);
    if (newUrl.searchParams.has(query)) {
      const currentValues = newUrl.searchParams.get(query).split(",");
      // remove the old query, add the new value to the existing list, then add the query back
      newUrl.searchParams.delete(query);
      currentValues.push(value);
      newUrl.searchParams.set(query, currentValues.join(","));
    } else {
      newUrl.searchParams.set(query, value);
    }
    goto(newUrl);
  };

  const removeQueryFromURL = (query, value) => {
    const newUrl = new URL(window.location);
    if (newUrl.searchParams.has(query)) {
      let currentValues = newUrl.searchParams.get(query).split(",");
      // remove the query
      newUrl.searchParams.delete(query);
      currentValues = currentValues.filter((v) => v !== value);
      if (currentValues.length > 0) {
        // in the case there were other values for the same param, reconstruct the query
        // minus the value we removed
        newUrl.searchParams.set(query, currentValues.join(","));
      }
      goto(newUrl);
    }
  };
</script>

{#if open}
  <div class="filters" transition:slide>
    <div class="filter-content">
      <div class="filter-item">
        <h3>Year Released</h3>
        {#each filters.year as year}
          <label>
            <input
              type="checkbox"
              checked={query.year && query.year.includes(year)}
              on:change={(e) => valueChanged(e, "year", year.toString())}
            />
            {year}
          </label>
        {/each}
      </div>
      <div class="filter-item">
        <h3>Operating System</h3>
        {#each filters.os as os}
          <label>
            <input
              type="checkbox"
              checked={query.os && query.os.includes(slugify(os))}
              on:change={(e) => valueChanged(e, "os", slugify(os))}
            />
            {os}
          </label>
        {/each}
      </div>
      <div class="filter-item">
        <h3>UI Elements</h3>
        {#each filters.elts as elt}
          <label>
            <input
              type="checkbox"
              checked={query.elts && query.elts.includes(slugify(elt))}
              on:change={(e) => valueChanged(e, "elts", slugify(elt))}
            />
            {elt}
          </label>
        {/each}
      </div>
    </div>
  </div>
{/if}

<div class="filter-toggle-button">
  <div class="num-results">{results} interface{results === 1 ? "" : "s"}</div>
  <button on:click={() => (open = !open)}
    >{open ? "Browse results" : "Filter"}</button
  >
</div>

<style>
  .filters {
    background-color: rgb(230, 230, 230);
  }

  .filter-toggle-button {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    justify-content: flex-end;
    padding: 20px;
  }

  .filter-item {
    padding: 0px 20px;
  }

  .num-results {
    padding: 10px 20px;
  }

  .filter-content {
    max-width: 1100px;
    margin: 0 auto;
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
  }

  label {
    display: block;
  }
</style>
