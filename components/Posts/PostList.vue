
<template>
  <div>
    <v-card flat v-for="post in posts" :key="post.title">
      <v-layout row wrap :class="`project pa-3 ${post.status}`">
        <v-flex xs12 md6>
          <div>{{ post.title }}</div>
        </v-flex>
        <v-flex xs6 sm4 md2>
          <div>{{ post.person }}</div>
        </v-flex>
        <v-flex xs6 sm4 md2>
          <div>{{ post.due }}</div>
        </v-flex>
        <v-flex xs6 sm4 md2>
          <div class="right">
            <v-chip small :class="`${post.status} white--text caption my-2`">{{ post.status }}</v-chip>
          </div>
        </v-flex>
      </v-layout>
      <v-divider></v-divider>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    posts: {
      type: Array,
      required: true
    }
  }
};
</script>

<style>
.project.complete {
  border-left: 4px solid #3cd1c2;
}

.project.ongoing{
  border-left: 4px solid orange;
}

.project.overdue{
  border-left: 4px solid tomato;
}

.v-chip.complete {
  background: #3cd1c2;
}

.v-chip.ongoing{
  background: orange;
}

.v-chip.overdue{
  background: tomato;
}

</style>
