<template>
 <div>
  <div class="button--display" @click="togglePopup">
   <span class="button--display text">{{ currentOption.iso | upcase }}</span>
   <i class="icon--dropdown"></i>
   <popup
    v-show="isActive"
    :classes="'display__popup'"
    :show-text="true"
    :is-link="false"
    :options="options"
   ></popup>
  </div>
 </div>
</template>

<script>
import { eventHub } from "../../packs/application.js"
import mixinPopupCloseListeners from "../../mixins/mixin-popup-close-listeners"
import Popup from "./Popup.vue"

export default {
 name: "DisplayButtonWithDropdown",
 components: {
  Popup,
 },
 mixins: [
  mixinPopupCloseListeners({
   closeCallback: "togglePopup",
   toggleVariable: "isActive",
  }),
 ],
 props: {
  options: {
   type: Array,
   required: true,
  },
  selectedOption: {
   type: Object,
   required: true,
  },
 },
 mounted() {
  eventHub.$on("option-selected", this.changeSelection)
 },
 data() {
  return {
   isActive: false,
   currentOption: this.selectedOption,
  }
 },
 filters: {
  upcase(value) {
   if (!value) {
    return ""
   }
   return value.toString().toUpperCase()
  },
 },
 methods: {
  togglePopup() {
   this.isActive = !this.isActive
  },
  changeSelection(option) {
   this.currentOption = option
  },
 },
}
</script>