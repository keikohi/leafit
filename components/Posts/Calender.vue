<template>
  <v-menu>
    <v-text-field
      class="due-edit"
      :value="formattedDate"
      slot="activator"
      label="Deadline"
      prepend-icon="add_alarm"
    >
      <v-btn small color="#3CD1C2">
        <v-icon>alarm</v-icon>
      </v-btn>
    </v-text-field>
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
      this.$emit("input", this.formattedDate);
      this.deu = "";
    }
  },
  computed: {
    formattedDate() {
      return this.due ? format(this.due, "MM/DD/YYYY") : "";
    }
  }
};
</script>


<style>
@media screen and (max-width: 1600px) {
  .due-edit {
    font-size: 16px;
  }
}
</style>
