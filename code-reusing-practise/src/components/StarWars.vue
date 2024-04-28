<template>
  <div>
    <label>Search: <input v-model.lazy="search" type="text"></label>
    <hr/>
    <div>
      <button :disabled="page === 1" @click="page -= 1">Prev</button>
      {{ page }}
      <button @click="page += 1">Next</button>
    </div>
    <hr/>

    <ul>
      <!-- eslint-disable-next-line -->
      <li v-for="item in items">
        <a target="_blank" :href="item.link">{{ item.name }}</a>
      </li>
    </ul>
  </div>
</template>
<script>
import {getPlanets} from "@/api/swapi";

export default {
  data() {
    return {
      items: [],
      search: '',
      page: 1,
    };
  },

  methods: {

    async loadPlanets() {
      // using { results } is not safe, we do not handle requests exception to be focused on global problem
      const { results } = await getPlanets({
        page: this.page,
        search: this.search
      });
      this.items = results;
    },

    syncHash() {
      const urlParams = new URLSearchParams(window.location.hash.substring(1));
      const entries = Object.fromEntries(urlParams.entries());
      if (entries.page) {
        this.page = entries.page;
      }
      if (entries.search) {
        this.search = entries.search;
      }
    },

    updateHash() {
      const urlParams = new URLSearchParams();
      if (this.page !== 1) {
        urlParams.append("page", this.page);
      }
      if (this.search !== "") {
        urlParams.append("search", this.search);
      }

      window.location.hash = urlParams.toString();
    },
  },

  created() {
    window.addEventListener("hashchange", this.syncHash);
    this.syncHash();
    this.loadPlanets();
  },

  beforeUnmount() {
    window.removeEventListener("hashchange", this.syncHash);
  },

  watch: {
    page() {
      this.loadPlanets();
      this.updateHash();
    },
    search() {
      this.page = 1;
      this.loadPlanets();
      this.updateHash();
    },
  },
};
</script>