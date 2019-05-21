
<template>
  <div>
    <v-card flat v-for="(post,index) in posts" :key="index">
      <v-layout row wrap :class="`project pa-2 px-3 ${post.status}`">
        <v-flex xs12 sm8 md8>
          <!-- 編集中は表示post.visiblity -->
          <div v-if="post.visiblity">
            <v-text-field v-model="input.title" autofocus label flat></v-text-field>
            <Calender @input="v => input.due=v"/>
            <button @click="setTitle(index)">done</button>
          </div>
          <div class="title" v-if="!post.visiblity">{{ post.title }}</div>
        </v-flex>
        <!-- 編集中は"非"表示post.visiblity -->
        <v-flex xs6 sm2 md2 v-if="!post.visiblity">
          <div class="left mt-4">
            <div>{{ post.due }}</div>
          </div>
        </v-flex>
        <v-flex xs6 sm2 md2 v-if="!post.visiblity">
          <div class="right mt-3 mb-2">
            <v-chip small :class="`${post.status} white--text titile `">{{ post.status }}</v-chip>
          </div>
        </v-flex>
      </v-layout>
      <v-divider></v-divider>
    </v-card>
  </div>
</template>

<script>
import Calender from "@/components/Posts/Calender";
export default {
  components: {
    Calender
  },
  props: {
    posts: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      input: {
        title: null,
        visiblity: true,
        due: null
      },
      tmp: ""
    };
  },
  methods: {
    setTitle(index) {
      console.log(index);
      if (this.input.title !== null) {
        this.posts[index].title = this.input.title;
        this.input.title = null;
        this.posts[index].visiblity = false;
        this.posts[index].status = "ongoing";
        this.posts[index].due = this.input.due;
      }
    }
  }
};
</script>

<style>
.project.complete {
  border-left: 4px solid #3cd1c2;
}

.project.ongoing {
  border-left: 4px solid orange;
}

.project.overdue {
  border-left: 4px solid tomato;
}

.v-chip.complete {
  background: #3cd1c2;
}

.v-chip.ongoing {
  background: orange;
}

.v-chip.overdue {
  background: tomato;
}
</style>
