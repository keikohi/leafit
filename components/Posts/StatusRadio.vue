<template>
  <v-radio-group v-model="selectedStatus" row @click="pick">
    <v-radio
      v-for="(status, i) in statuses"
      :key="i"
      :color="status.color"
      :label="status.status"
      :value="status"
    ></v-radio>
  </v-radio-group>
</template>


<script>
export default {
  data() {
    return {
      statuses: {
        ongoing: {
          status: "とりあえず残す",
          color: "orange"
        },
        complete: {
          status: "Complete",
          color: "#3cd1c2"
        }
      },
      selectedStatus: ""
    };
  },
  methods: {
    pick() {
      this.$emit("input", this.selectedStatus);
    }
  }
};
</script>
