<template>
  <div class="post">
    <h1 class="heading grey--text">@{{ $route.params.userName }}</h1>
    <v-container class="my-5">
      <v-card flat>
        <v-card-title>
          <v-icon large color="#3cd1c2">more_horiz</v-icon>
          <span class="title font-weight-light" style="font-size:1.2em">{{ loadedPost.title }}</span>
        </v-card-title>

        <v-divider light inset></v-divider>
        <v-card-text class="py-4" style="font-size:1.1em">{{ loadedPost.content }}</v-card-text>
      </v-card>

        <!-- <v-spacer></v-spacer> -->
      <v-flex right xs1 sm1 >
          <v-select :items="statusList" v-model="selectedStatus"></v-select>
      </v-flex>
    </v-container>
  </div>
</template>


<script>
export default {
  data() {
    return {
      status: "",
      selectedStatus: '',
      statusList: ["ongoing", "complete"]
    };
  },
  asyncData(context) {
    return (
      context.app.$axios
        .$get(context.params.userName + "/posts" + ".json")
        .then(data => {
          return {
            loadedPost: data
          };
        })
        //   .then(data => {
        //     console.log(data);
        //   })
        .catch(error => console.log(error))
    );
  },
  methods: {}
};
</script>


<style>
.post.content {
  font-size: 10.6em;
}
</style>
