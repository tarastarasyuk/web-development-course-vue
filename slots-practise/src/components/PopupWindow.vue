<template>
  <div v-if="isOpen" class="backdrop" @click="close">
    <div class="popup" @click.stop>
      <h1>Warning!</h1>
      <hr/>
      <slot></slot>
      <hr/>
      <div class="footer">
        <slot name="actions" :close="close" :confirm="confirm">
          <!-- Content inside slot - means default slot content.
          It can be overridden by specifying the slot in the invocation place.         -->
          <button @click="close">Cancel</button>
          &nbsp;
          <button @click="confirm">Ok</button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },

  emits: {
    // null - because events does not have arguments
    // (example with arguments - this.$emit("close", someData))
    close: null,
    confirm: null,
  },

  mounted() {
    document.addEventListener('keydown', this.handleKeydown)
  },

  // it is a good practise to clean listeners to not leave rubbish
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeydown)
  },

  methods: {
    close() {
      this.$emit("close")
    },

    confirm() {
      this.$emit("confirm")
    },

    handleKeydown() {
      return e => {
        if (this.isOpen && e.key === 'Escape') {
          this.close()
        }
      };
    }
  }

}
</script>

<style>
.popup {
  top: 50px;
  padding: 20px;
  left: 50%;
  transform: translateX(-50%);
  position: fixed;
  z-index: 101;
  background-color: white;
  border-radius: 10px;
}

.popup h1 {
  text-align: center;
  margin: 0;
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 100;
}

.footer {
  text-align: right;
}
</style>
