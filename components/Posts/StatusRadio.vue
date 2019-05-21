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
          id: 1,
          status: "とりあえず残す",
          color: "orange"
        },
        complete: {
          id: 2,
          status: "Complete",
          color: "#3cd1c2"
        }
      },
      selectedStatus: {
        id: 1,
        status: "とりあえず残す",
        color: "orange"
      }
    };
  },
  methods: {
    pick() {
      this.$emit("input", this.selectedStatus);
    }
  }
};
</script>
