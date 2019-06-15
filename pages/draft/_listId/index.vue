<template>
  <div class="draft">
    <!-- <v-container class="mb-5 mt-2"> -->
    <v-container px-0 py-0 mx-0 my-2>
      <v-card class="card">
        <v-card-text class="pt-3 pb-0 px-4">
          <v-text-field
            class="py-0 my-0 display-1"
            label="title"
            v-model="post.title"
            prepend-icon="folder"
          ></v-text-field>
          <v-layout row class="px-0 py-0 mx-0 my-0">
            <v-flex xs12 sm3 class="px-0 py-0 mx-0 my-0">
              <!-- カレンダーの表示 -->
              <Calender @input="v => post.due=v"/>
            </v-flex>
            <v-flex xs12 sm1></v-flex>
            <v-flex xs12 sm2>
              <v-checkbox v-model="checkbox" label="Ongoing"></v-checkbox>
            </v-flex>
            <v-flex xs12 sm2>
              <v-checkbox v-model="checkbox" label="Complete"></v-checkbox>
            </v-flex>
            <v-flex xs12 sm4></v-flex>
          </v-layout>
          <!-- <v-btn
                    block
                    color="secondary"
                    dark
                    @click="isShowMarkdownEditor =!isShowMarkdownEditor"
          >テキストも書く</v-btn>-->
        </v-card-text>
        <v-btn @click="postDraft" absolute dark fab bottom right color="orange">
          <v-icon>done</v-icon>
        </v-btn>
      </v-card>
    </v-container>
    <MarkDown class="editor"/>

    <transition name="editor">
      <!-- <v-layout row v-if="isShowMarkdownEditor"> -->
      <!-- <v-layout row>
        <MarkDown/>
      </v-layout>-->
    </transition>
  </div>
</template>


<script>
import _ from "lodash";
import MarkDown from "@/components/MarkDown/Markdown";
import Calender from "@/components/Posts/Calender";
import { mapActions } from "vuex";
export default {
  components: {
    MarkDown,
    Calender,
  },
  data() {
    return {
      post: {
        title: "",
        status: {
          id: 1,
          status: "とりあえず残す",
          color: "orange"
        },
        due: "",
        markdownText: "# kkeisuke",
        checkbox: true
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
.editor {
  position: relative;
  top: 12px;
  right: 0;
  bottom: 0;
  left: 0;
  height: 77%;
}

@media screen and (min-width: 300px) {
  /*　画面サイズが480pxからはここを読み込む　*/
  input {
    font-size: 16px;
  }
  .v-input__control {
    width: 90px;
  }
}
@media screen and (min-width: 768px) {
  /*　画面サイズが480pxからはここを読み込む　*/
  input {
    font-size: 24px;
  }
  .v-input__control {
    width: 140px;
  }
}

/* containerのサイズを開放 */
.container {
  max-width: 100% !important;
  position: relative;
  height: 18%;
}
.draft {
  height: 100%;
}

@media screen and (min-width: 768px) {
  /*　画面サイズが480pxからはここを読み込む　*/
  input {
    font-size: 24px;
  }
  .v-input__control {
    width: 140px;
  }
}
</style>

