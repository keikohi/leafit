<template>
  <div class="single-post-page">
    <v-container>
      <v-card height="324px" flat>
        <v-card-title class="display-1"></v-card-title>
        <v-chip disabled label small text-color="black" class="ml-2 font-weight-thin">
          <v-icon left>label</v-icon>
        </v-chip>
        <v-card-text class="compiledtext" v-html="compiledMarkdown"></v-card-text>
      </v-card>
    </v-container>
  </div>
</template>


<script>
import marked from "marked";
import _ from "lodash";
import highlight from "highlight.js";
export default {
  data() {
    return {};
  },
  methods: {},
  asyncData(context) {
    return context.app.$axios
      .$get("/post/" + context.params.postId + ".json")
      .then(data => {
        console.log(data);
        return {
          loadedPost: data
        };
      })
      .catch(error => console.log(error));
  },
  created(context) {
    console.log(context);
  },
  computed: {
    compiledMarkdown() {
      return marked(this.loadedPost.markdownText, { sanitixe: true });
    },
    tags() {
      return this.loadedPost.tags.split(",");
    }
  }
};
</script>



<style>
/* .title{
    font-size: 4rem;
    font-weight: 700;
    margin-bottom: 16px;
    font-feature-settings: "palt";
    line-height: 1.4;
} */
</style>
