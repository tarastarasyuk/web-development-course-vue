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
      <input v-model="agreementInputText" type="text" :placeholder="confirmationInfoMessage">
      <button @click="confirm" :disabled="!isConfirmationCorrect">Ok</button>
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

  CONFIRMATION_TEXT: 'Agree',

  methods: {
    popupConfirmed() {
      alert("Confirmed!")
      this.isPopupOpen = false
    },

    dangerPopupConfirmed() {
      alert("Danger Confirmed!")

      processDangerRequest()

      this.isDangerPopupOpen = false
    }
  },

  computed: {
    confirmationInfoMessage() {
      return `Enter '${this.$options.CONFIRMATION_TEXT}'`
    },

    isConfirmationCorrect() {
      return this.agreementInputText === this.$options.CONFIRMATION_TEXT
    }
  }

}
</script>

<style>
</style>
