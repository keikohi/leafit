<template>
  <v-menu>
    <v-text-field
      class="py-0"
      :value="formattedDate"
      slot="activator"
      label="マイルストーン"
      prepend-icon="date_range"
    ></v-text-field>
    <v-date-picker v-model="due" @click="pick"></v-date-picker>
  </v-menu>
</template>


<script>
import format from "date-fns/format";
import highlight from "highlight.js";
export default {
  data() {
    return {
      due: ""
    };
  },
  methods: {
    pick() {
      this.$event("input", this.due);
    }
  },
  computed: {
    formattedDate() {
      return this.due ? format(this.due, "Do MMM YYYY") : "";
    }
  }
};
</script>
