<template>
  <v-menu>
    <v-text-field
      class="py-0"
      :value="formattedDate"
      slot="activator"
      label="マイルストーン"
      prepend-icon="date_range"
    ></v-text-field>
    <div @click="pick">
      <v-date-picker v-model="due"></v-date-picker>
    </div>
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
      this.$emit("input", this.due);
      this.deu = "";
    }
  },
  computed: {
    formattedDate() {
      return this.due ? format(this.due, "Do MMM YYYY") : "";
    }
  }
};
</script>
