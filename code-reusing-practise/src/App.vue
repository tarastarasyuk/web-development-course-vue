<template>
  <div id="app">
    <select v-model="selectedTab">
      <option value="techcrunch">TechCrunch</option>
      <option value="starwars">StarWars</option>
    </select>
    <hr />
    <TechCrunch v-if="selectedTab === 'techcrunch'" />
    <StarWars v-if="selectedTab === 'starwars'" />
  </div>
</template>

<script>
import TechCrunch from "./components/TechCrunch.vue";
import StarWars from "./components/StarWars.vue";

export default {
  name: "App",
  components: {
    TechCrunch,
    StarWars,
  },
  data() {
    return {
      selectedTab: "techcrunch",
    };
  },

  watch: {
    selectedTab() {
      window.location.hash = "";
    },
  },
};
</script>

<style></style>

<!-- TODO:
 1. Fix strings/decimals in pages pagination functionality
 2. Keep 'page' parameter un url after page reload (the same as for 'category')-->