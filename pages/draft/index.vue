<template>
  <div class="draft">
    <v-container class="mb-5 mt-2" >
      <v-card>
        <v-card-title class="pb-0">
          <span>
            <v-icon>edit</v-icon>
          </span>
          <h3>とりあえずのめも...</h3>
        </v-card-title>
        <v-card-text class="py-1">
          <v-form class="px-3 my-1" ref="form">
            <v-text-field class="py-0" label="title" v-model="post.title" prepend-icon="folder"></v-text-field>
            <v-text-field class="py-0" label="tag" v-model="post.tags" prepend-icon="tag"></v-text-field>
            <v-layout row>
              <v-flex xs12 sm6>
                <StatusRadio @input="v => post.status=v"/>
              </v-flex>
              <v-flex xs12 sm6>
                <!-- カレンダーの表示 -->
                <Calender @input="v => post.due=v"/>
              </v-flex>
            </v-layout>
            <v-btn
              block
              color="secondary"
              dark
              @click="isShowMarkdownEditor =!isShowMarkdownEditor"
            >テキストも書く</v-btn>
          </v-form>
        </v-card-text>
        <v-btn @click="postDraft" absolute dark fab top right color=orange>
          <v-icon>done</v-icon>
        </v-btn>
      </v-card>
    </v-container>

    <transition name="editor">
      <v-layout row v-if="isShowMarkdownEditor">
        <MarkDown/>
      </v-layout>
    </transition>
  </div>
</template>


<script>
import _ from "lodash";
import MarkDown from "@/components/MarkDown/Markdown";
import Calender from "@/components/Posts/Calender";
import StatusRadio from "@/components/Posts/StatusRadio";
import { mapActions } from "vuex";
export default {
  components: {
    MarkDown,
    Calender,
    StatusRadio
  },
  data() {
    return {
      post: {
        title: "",
        tags: [],
        status: "",
        due: "",
        markdownText: "# kkeisuke"
      },
      isShowMarkdownEditor: false
    };
  },
  methods: {
    postDraft() {
      this.$axios
        .$post("/post.json", this.post)
        .then(data => console.log(this.markdownText))
        .catch(error => console.log(error));
    },
    update: _.debounce(e => {
      this.post.markdownText = e.target.value;
    }, 1000),
    remove(item) {
      this.chips.splice(this.chips.indexOf(item), 1);
      this.chips = [...this.chips];
    }
  }
};
</script>


<style>
#container {
  display: grid;
  grid-template-columns: 24px 1fr;
}

.md-chips.md-field {
  margin-left: 10px;
  margin-bottom: 20px;
}

.v-icon .md-layout-item .material-icons .theme--light {
  width: 24px;
}
.v-select {
  margin: 0;
  padding: 0;
}
</style>

