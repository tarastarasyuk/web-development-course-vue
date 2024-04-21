<template>
  <button @click="isPopupOpen = true">Open window</button>
  <PopupWindow
      :is-open="isPopupOpen"
      @confirm="popupConfirmed"
      @close="isPopupOpen = false">
    Are you sure?
  </PopupWindow>

  <button @click="isDangerPopupOpen = true">Open danger window</button>
  <PopupWindow
      :is-open="isDangerPopupOpen"
      @confirm="dangerPopupConfirmed"
      @close="isDangerPopupOpen = false">
    Danger: Are you sure?
    <template #actions>
      <input type="text" placeholder="Enter 'Agree'">
      <!--  FIXME: Confirm event does not work   -->
      <button @click="confirm">Ok</button>
    </template>
  </PopupWindow>
</template>

<script>
import PopupWindow from "@/components/PopupWindow.vue";

export default {
  components: {PopupWindow},

  data() {
    return {
      isPopupOpen: false,
      isDangerPopupOpen: false
    }
  },

  methods: {
    popupConfirmed() {
      alert("Confirmed!")
      this.isPopupOpen = false
    },

    dangerPopupConfirmed() {
      alert("Danger Confirmed!")
      this.isDangerPopupOpen = false
    }
  }

}
</script>

<style>
</style>
