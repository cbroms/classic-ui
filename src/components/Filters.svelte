<script>
  import { afterUpdate } from "svelte";
  import { goto } from "@sapper/app";
  import { slugify } from "../utils/slugify";

  export let query;
  export let filters = { year: [], os: [], elts: [] };

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

<div>
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
