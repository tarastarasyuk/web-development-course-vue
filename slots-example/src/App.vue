<template>
  <List :items="users" :fields="['username', 'name']">
    <template #item="{ item: user }">
      {{ hello }} {{ user.name }} ({{ user.username }})
    </template>
  </List>
  <hr />
  <List :items="users" :fields="['username', 'name']">
    <template #item="slotProps">
      <User :item="slotProps.item" />
    </template>
  </List>
  <hr />
  <List :items="todos" :fields="['title']">
    <template #item="slotProps">
      <Todo :item="slotProps.item" />
    </template>
  </List>
</template>

<script>
import List from "./components/List.vue";
import User from "./components/User.vue";
import Todo from "./components/Todo.vue";

import { loadUsers, loadTodos } from "./api.js";
export default {
  name: "App",
  components: {
    User,
    List,
    Todo,
  },
  data() {
    return { users: [], todos: [], hello: "world" };
  },

  mounted() {
    loadUsers().then((users) => {
      this.users = users;
    });
    loadTodos().then((todos) => {
      this.todos = todos;
    });
  },
};
</script>

