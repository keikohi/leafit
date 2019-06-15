<template>
  <div class="draft">
    <!-- <v-container class="mb-5 mt-2"> -->
    <v-container px-0 py-0 mx-0 my-2>
      <v-card class="card">
        <v-card-title class="card-titlle">
          <v-layout row wrap>
            <v-flex xs12 sm12 md12 class="title-flex">
              <!-- <span class="post-list">{{post.title}}</span> -->
              <!-- 18字以内がよろしい -->
              <v-icon class="post-list-icon">folder</v-icon>
              <span class="post-list">あああああああああああああああああ</span>
              <span class="ddeadline_spacer"></span>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <div v-if="post.due">
                <v-icon class="post-due-icon">alarm</v-icon>
                <span class="post-due">{{post.due}}</span>
              </div>
            </v-flex>
          </v-layout>
        </v-card-title>
        <!-- <v-card-text class="py-0 my-0 " prepend-icon="folder" label="title"></v-card-text> -->
        <v-text-field
          class="py-0 my-0 px-3 post-list-field"
          v-model="post.title"
          @keypress.enter="saveTitleName"
          v-if="isEditingTittle"
        ></v-text-field>
        <v-card-text
          v-if="!isEditingTittle"
          @dblclick="editTitle"
          class="py-0 my-0 post-title"
          label="title"
          prepend-icon="folder"
        >{{post.title}}</v-card-text>

        <!-- <v-btn
          v-if="isShowMarkdownEditor"
          @click="updatePost"
          small
          absolute
          dark
          fab
          bottom
          right
          color="orange"
        >
          <v-icon>done</v-icon>
        </v-btn>-->

        <v-btn
          v-if="isEditingTittle"
          @click="saveTitleName"
          small
          absolute
          dark
          fab
          bottom
          right
          color="tomato"
        >
          <v-icon>done</v-icon>
        </v-btn>
        <v-speed-dial
          v-if="!isEditingTittle"
          v-model="fab"
          direction="bottom"
          dark
          transition="slide-y-reverse-transition"
        >
          <v-btn
            v-model="fab"
            slot="activator"
            color="blue darken-2"
            dark
            fab
            small
            absolute
            bottom
            right
          >
            <v-icon>account_circle</v-icon>
            <v-icon>close</v-icon>
          </v-btn>

          <v-btn fab dark small color="green" @click="editTitle" absolute bottom right>
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn fab dark small color="indigo">
            <v-icon>add</v-icon>
          </v-btn>
        </v-speed-dial>
      </v-card>
    </v-container>
    <Html v-if="!isShowMarkdownEditor" v-model="post.markdownText" class="htmlText"/>
    <!-- 
        MarkDowntextのcompiledのとこなおす
    -->
    <MarkDown v-if="isShowMarkdownEditor" v-model="post.markdownText" class="editor"/>
    <!-- <p>{{post.markdownText}}</p> -->
  </div>
</template>


<script>
import _ from "lodash";
import MarkDown from "@/components/MarkDown/Markdown";
import Html from "@/components/MarkDown/Html";
import Calender from "@/components/Posts/Calender";
import firebase from "@/plugins/firebase";
import { mapActions } from "vuex";
import marked from "marked";
export default {
  components: {
    MarkDown,
    Html,
    Calender
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
        markdownText: "",
        htmlText: "",
        checkbox: true
      },
      isShowMarkdownEditor: false,
      isEditingTittle: false,
      direction: "bottom",
      fab: false,
      fling: false,
      hover: false,
      tabs: null,
      top: false,
      right: true,
      bottom: true,
      left: false,
      transition: "slide-y-reverse-transition"
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
    },
    fetchPost() {
      const listid = this.$nuxt.$route.params.listId;
      const postId = this.$nuxt.$route.params.postId;
      // console.log(listId);
      console.log("list id:" + listid);
      console.log("post id:" + postId);

      const documentSnapshot = firebase
        .firestore()
        .collection("user_post")
        .doc("name")
        // TODO: Uidに置き換える
        // .doc(this.$store.getters["user/getUid"])
        .collection("post_list")
        .doc(listid)
        .collection("post")
        .doc(postId);

      documentSnapshot
        .get()
        .then(doc => {
          if (doc.exists) {
            this.post = doc.data();
            console.log("html: " + this.post.htmlText);

            this.isShowMarkdownEditor = this.post.htmlText == undefined;
          } else {
            console.log("No such document!");
          }
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        });
    },
    editTitle() {
      this.isEditingTittle = true;
    },
    saveTitleName() {
      this.isEditingTittle = false;
    },
    updatePost() {
      const listid = this.$nuxt.$route.params.listId;
      const postId = this.$nuxt.$route.params.postId;
      const documentSnapshot = firebase;

      firebase
        .firestore()
        .collection("user_post")
        .doc("name")
        .collection("post_list")
        .doc(listid)
        .collection("post")
        .doc(postId)
        .set({
          title: this.post.title,
          listId: listid,
          due: this.post.due,
          htmlText: this.compiledMarkdown,
          markdownText: this.post.markdownText
        })
        .then(function() {
          console.log("Document successfully written!");
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });
    }
  },
  mounted() {
    // setInterval(() => {

    // }, 10000);
    this.fetchPost();
  },
  computed: {
    compiledMarkdown() {
      if (this.post.markdownText == undefined) {
        return "";
      }
      console.log("undef: " + this.post.markdownText);

      return marked(this.post.markdownText, { sanitixe: true });
    },
    isShowMarkdownText() {
      return this.post.markdownText === "";
    },
    isHtmlText() {
      return this.post.markdownText !== "";
    }
  }
};
</script>

<style>
.editor {
  position: relative;
  top: 18px;
  right: 0;
  bottom: 0;
  left: 0;
  height: 77%;
}

@media screen and (min-width: 768px) {
  .post-title {
    /* font-size: 25px;
    font-weight: 400;
    line-height: 30px !important;
    letter-spacing: normal !important;
    font-family: "Roboto", sans-serif !important; */
  }
  .post-list .post-due {
    /* font-size: 18px;
    font-weight: 200;
    line-height: 25px !important;
    letter-spacing: normal !important;
    font-family: "Roboto", sans-serif !important; */
  }
  .title-due {
    /* height: 21px; */
  }
}
@media screen and (max-width: 600px) {
  /*　画面サイズが300pxからはここを読み込む　*/

  .post-list .post-due {
    font-size: 14px;
    font-weight: 100;
    line-height: 20px !important;
    letter-spacing: normal !important;
    font-family: "Roboto", sans-serif !important;
  }
  .post-list-icon {
    font-size: 18px !important;
  }
  .post-due-icon {
    font-size: 18px !important;
  }
}
.v-input .post-list-field .v-text-field .theme--light {
  font-size: 18px;
  height: 21px;
  font-weight: 200;
  line-height: 25px !important;
  letter-spacing: normal !important;
  font-family: "Roboto", sans-serif !important;
}
/* date picker の設定 */
.v-menu__content {
  max-width: 75%;
}
.v-date-picker-table {
  padding: 0 12px;
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
.ddeadline_spacer {
  width: 20px;
}
.card-titlle {
  padding-bottom: 8px;
}
.title-flex {
  height: 21px;
}
</style>

