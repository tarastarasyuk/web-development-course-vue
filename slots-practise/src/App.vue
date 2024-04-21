<template>
  <button @click="isPopupOpen = true">Open window</button>
  <PopupWindow
      :is-open="isPopupOpen"
      @ok="popupConfirmed"
      @close="isPopupOpen = false">
    Are you sure?
  </PopupWindow>
</template>

<script>
import PopupWindow from "@/components/PopupWindow.vue";

export default {
  components: {PopupWindow},

  data() {
    return {
      isPopupOpen: false
    }
  },

  methods: {
    popupConfirmed() {
      alert("Confirmed!")
    }
  }

}
</script>

<style>
</style>
