<template>Specific User component: {{ item.name }} ({{ item.username }})</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>