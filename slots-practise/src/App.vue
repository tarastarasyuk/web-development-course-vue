<template>
  <button @click="openPopup">Open window</button>
  <PopupWindow ref="confirmationPopup">
    Are you sure?
  </PopupWindow>

  <button @click="openDangerPopup">Open danger window</button>
  <PopupWindow ref="dangerConfirmationPopup">
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
      agreementInputText: ''
    }
  },

  CONFIRMATION_TEXT: 'Agree',

  methods: {

    async openPopup() {
      const popupResult = await this.$refs.confirmationPopup.open();

      if (popupResult) {
        this.popupConfirmed()
      }
    },

    popupConfirmed() {
      alert("Confirmed")
    },

    async openDangerPopup() {
      this.agreementInputText = ''

      const popupResult = await this.$refs.dangerConfirmationPopup.open();

      if (popupResult) {
        this.dangerPopupConfirmed()
      }
    },

    dangerPopupConfirmed() {
      alert("Danger Confirmed!")

      processDangerRequest()
    },

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
