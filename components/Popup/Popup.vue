<template>
  <div class="popup">
    <v-dialog max-width="600px">
      <v-btn flat slot="activator" class="white">Add new project</v-btn>
      <v-card>
        <v-card-title>
          <h2>Add a New Projects</h2>
        </v-card-title>
        <v-card-text>
          <v-form class="px-3" ref="form">
            <v-text-field label="Title" v-model="title" prepend-icon="folder" :rules="inputRules"></v-text-field>
            <v-textarea
              label="Information"
              v-model="content"
              prepend-icon="edit"
              :rules="inputRules"
            ></v-textarea>

            <v-menu>
              <v-text-field
                :rules="inputRules"
                :value="formattedDate"
                slot="activator"
                label="Due date"
                prepend-icon="date_range"
              ></v-text-field>
              <v-date-picker :rules="inputRules" v-model="due"></v-date-picker>
            </v-menu>
            <v-spacer></v-spacer>
            <v-btn flat class="addProject mx-0 white--text" @click="submit">Add Project</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>


<script>
import format from "date-fns/format";
export default {
  data() {
    return {
      title: "",
      content: "",
      due: null,
      inputRules: [v => v.length >= 3 || "Minimum length is 3 characters"]
    };
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
      }
    }
  },
  computed: {
    formattedDate() {
      return this.due ? format(this.due, "Do MMM YYYY") : "";
    }
  }
};
</script>


<style>
.addProject {
  background: #3cd1c2;
}
</style>
