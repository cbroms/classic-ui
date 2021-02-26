<script>
  import { slide } from "svelte/transition";
  import { goto } from "@sapper/app";
  import { slugify } from "../utils/slugify";

  export let query;
  export let filters = { year: [], os: [], elts: [] };
  export let results = 0;

  let open = false;
  let randomNum = Math.floor(Math.random() * 5) + 1;

  const closeFilters = () => {
    open = !open;
    randomNum = Math.floor(Math.random() * 5) + 1;
  };

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
  <div
    class="filters nice-background"
    transition:slide
    style="--background: url(backgrounds/{randomNum}.png)"
  >
    <div class="filter-content">
      <div class="filter-content-stacked">
        <div class="filter-item stacked">
          <h3>Year Released</h3>
          <div class="filter-options">
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
        </div>

        <div class="filter-item stacked">
          <h3>Operating System</h3>
          <div class="filter-options">
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
        </div>
      </div>
      <div class="filter-item">
        <h3>UI Elements</h3>
        <div class="filter-options">
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
  </div>
{/if}

<div class="filter-toggle-button">
  <div class="num-results">{results} interface{results === 1 ? "" : "s"}</div>
  <button on:click={closeFilters}>{open ? "Browse results" : "Filter"}</button>
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
    background-color: white;
    border: 2px solid;
    width: 210px;
    margin: 10px;
  }

  .filter-content-stacked {
    display: flex;
    flex-wrap: wrap;
    width: 210px;
  }

  /* .stacked:first-child {
    margin-bottom: 20px;
  } */

  h3 {
    margin: 0;
    padding: 10px 20px;
    border-bottom: 2px solid;
  }

  .filter-options {
    padding: 0 20px;
  }

  .num-results {
    padding: 10px 20px;
  }

  .filter-content {
    max-width: 700px;
    margin: 0 auto;
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  label {
    display: block;
  }
</style>
