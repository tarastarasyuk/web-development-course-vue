<template>
  <div>
    <label>Search: <input v-model.lazy="filters.search" type="text"></label>
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
import {filterableMixin} from "@/components/mixins/filterable";

export default {
  mixins: [filterableMixin],

  data() {
    return {
      items: [],
      page: 1,
    };
  },

  methods: {

    async loadItems() {
      // using { results } is not safe, we do not handle requests exception to be focused on global problem
      const { results } = await getPlanets({
        page: this.page,
        ...this.filters,
      });
      this.items = results;
    },
  },
};
</script>