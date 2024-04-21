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
    <template #actions="{confirm}">
<!--      the same logic - different syntax -->
<!--    <template v-slot:actions="{confirm}">-->
      <input v-model="agreementInputText" type="text" placeholder="Enter 'Agree'">
      <button @click="confirm">Ok</button>
    </template>
  </PopupWindow>
</template>

<script>
import PopupWindow from "@/components/PopupWindow.vue";
import {processDangerRequest} from "@/api";

export default {
  components: {PopupWindow},

  data() {
    return {
      isPopupOpen: false,
      isDangerPopupOpen: false,
      agreementInputText: ''
    }
  },

  methods: {
    popupConfirmed() {
      alert("Confirmed!")
      this.isPopupOpen = false
    },

    dangerPopupConfirmed() {
      if (this.agreementInputText === "Agree") {
        alert("Danger Confirmed!")

        processDangerRequest()

        this.isDangerPopupOpen = false
      } else {
        alert("Enter 'Agree' in the input field!")
      }
    }
  }

}
</script>

<style>
</style>
