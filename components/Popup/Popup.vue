<template>
  <v-dialog max-width="600px">
    <v-btn icon small slot="activator" color="white">
      <i class="material-icons black--text bold">add</i>
    </v-btn>
    <v-card>
      <v-card-title>
        <h2>Add a New List</h2>
      </v-card-title>
      <v-card-text>
        <v-form class="px-3" ref="form">
          <v-text-field label="Title" v-model="title" prepend-icon="folder" :rules="inputRules"></v-text-field>
          <v-spacer></v-spacer>
          <v-btn dark class="dark ma-3" color="orange" @click="createNewList">OK</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>


<script>
export default {
  data() {
    return {
      title: "",
      inputRules: [
        v => v.length <= 16 || "maximum length is 16 characters",
        v => v != "" || "Minimum length is 1 characters"
      ]
    };
  },
  methods: {
    createNewList() {
      if (this.$refs.form.validate()) {
        this.$emit("input", this.title);
      }
    }
  }
};
</script>


<style>
.addProject {
  background: #3cd1c2;
}
</style>
