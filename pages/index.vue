<template>
  <div class="dashboad">
    <h1 class="subheading grey--text">keisuke</h1>
    <v-container class="my-5">
      <v-layout row class="mb-3">
        <!-- 投稿のタイトルでソート -->
        <v-tooltip top>
          <v-btn small flat color="grey" @click="sortBy('title')" slot="activator">
            <v-icon left small>folder</v-icon>
            <span class="caption text-lowercase">By project name</span>
          </v-btn>
          <span>Sort projects by project name</span>
        </v-tooltip>

        <!-- 投稿の日時でソート -->
        <v-tooltip top>
          <v-btn small flat color="grey" @click="sortBy('due')" slot="activator">
            <v-icon left small>person</v-icon>
            <span class="caption text-lowercase">By Due Date</span>
          </v-btn>
          <span>Sort projects by due date</span>
        </v-tooltip>
      </v-layout>

      <PostList :posts="projects"/>
    </v-container>
  </div>
</template>



<script>
import PostList from "@/components/Posts/PostList";
export default {
  components: {
    PostList
  },
  data() {
    return {
      projects: [
        {
          title: "Learing Vue and Nuxt and Firebase",
          person: "Keisuke",
          due: "Third, Feb 2019",
          status: "ongoing",
          content: "I live Rin chan"
        },
        {
          title: "I wanna kiss her",
          person: "Keisuke",
          due: "Third, Feb 2019",
          status: "ongoing",
          content: "I live Rin chan"
        },
        {
          title: "Bought Cofee in Dubai",
          person: "Keisuke",
          due: "Third, Feb 2018",
          status: "complete",
          content: "I live Rin chan"
        },
        {
          title: "Geeee",
          person: "Keisuke",
          due: "Third, Feb 2019",
          status: "complete",
          content: "I live Rin chan"
        },
        {
          title: "Ushishi",
          person: "Keisuke",
          due: "Third, Feb 2019",
          status: "overdue",
          content: "I live Rin chan"
        }
      ]
    };
  },
  methods: {
    sortBy(prop) {
      this.projects.sort((a, b) => (a[prop] < b[prop] ? -1 : 1));
    }
  }
};
</script>


