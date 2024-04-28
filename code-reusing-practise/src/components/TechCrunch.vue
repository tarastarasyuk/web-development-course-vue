<template>
  <div>
    <label
      >Category:
      <select v-model="filters.categories">
        <!-- eslint-disable-next-line -->
        <option v-for="category in availableCategories" :value="category.id">{{ category.name }}</option>
      </select>
    </label>
    <hr />
    <div>
      <button :disabled="page === 1" @click="page -= 1">Prev</button>
      {{ page }}
      <button @click="page += 1">Next</button>
    </div>
    <hr />

    <ul>
      <!-- eslint-disable-next-line -->
      <li v-for="item in items">
        <a target="_blank" :href="item.link" v-html="item.title.rendered"></a>
      </li>
    </ul>
  </div>
</template>
<script>
import { getPosts, getCategories } from "@/api/techcrunch";
import {filterableMixin} from "@/components/mixins/filterable";

export default {
  mixins: [filterableMixin],

  data() {
    return {
      categories: [],
    };
  },
  computed: {
    availableCategories() {
      return [{ id: null, name: "(no category)" }, ...this.categories];
    },
  },
  methods: {
    async loadCategories() {
      this.categories = await getCategories();
    },

    async loadItems() {
      this.items = await getPosts({
        page: this.page,
        filters: this.filters,
      });
    },
  },

  // component life-cycle hooks works together with mixins
  // 1 - called mixin hooks
  // 2 - called component hooks
  created() {
    this.loadCategories()
  },

};
</script>