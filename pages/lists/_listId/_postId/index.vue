<template>
  <div class="draft">
    <!-- <v-container class="mb-5 mt-2"> -->
    <v-container px-0 py-0 mx-0 my-2>
      <v-card :class="`card ${post.status}`">
        <v-card-text
          @dblclick="editTitle"
          class="pa-3 my-0 post-title"
          prepend-icon="folder"
        >{{post.title}}</v-card-text>
        <v-chip
          small
          @click="changeStatus"
          :class="`${post.status} white--text titile status-chip mx-3 mt-1`"
        >{{ post.status }}</v-chip>
        <v-btn
          @click="editMarkDownEditor"
          v-if="isShowMarkdownEditor"
          absolute
          fab
          bottom
          right
          color="#3cd1c2"
        >
          <v-icon medium color="white">save</v-icon>
        </v-btn>
        <v-btn
          @click="editMarkDownEditor"
          v-if="!isShowMarkdownEditor"
          small
          absolute
          fab
          bottom
          right
          color="orange "
        >
          <v-icon color="white">edit</v-icon>
        </v-btn>
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
        status: "",
        due: "",
        markdownText: "",
        htmlText: "",
        checkbox: true
      },
      isShowMarkdownEditor: false
    };
  },
  methods: {
    ...mapActions("draft", ["updateStatus"]),
    postDraft() {
      this.$axios
        .$post("/post.json", this.post)
        .then(data => console.log(this.markdownText))
        .catch(error => console.log(error));
    },
    // update: _.debounce(e => {
    //   this.post.markdownText = e.target.value;
    // }, 1000),
    remove(item) {
      this.chips.splice(this.chips.indexOf(item), 1);
      this.chips = [...this.chips];
    },
    fetchPost() {
      const listid = this.$nuxt.$route.params.listId;
      const postId = this.$nuxt.$route.params.postId;
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
            if (this.post.markdownText === undefined) {
              this.post.markdownText = "";
            }
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
    editMarkDownEditor() {
      if (this.isShowMarkdownEditor) {
        this.updatePost();
      }
      this.isShowMarkdownEditor = !this.isShowMarkdownEditor;
    },
    changeStatus() {
      this.post.status = this.post.status == "ongoing" ? "complete" : "ongoing";
      this.updateStatus({
        postToUpdate: this.post,
        listId: this.$nuxt.$route.params.listId,
        postId: this.$nuxt.$route.params.postId
      })
        .then(() => {
          console.log("Success to change status: " + this.post.status);
        })
        .catch(error => {
          console.log("Failded to update Status");
          this.post.status =
            this.post.status == "ongoing" ? "complete" : "ongoing";
        });
    },
    updatePost() {
      const listid = this.$nuxt.$route.params.listId;
      const postId = this.$nuxt.$route.params.postId;
      console.log("this.post.markdownText: " + this.post.markdownText);

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
.card.complete {
  border-left: 4px solid #3cd1c2;
}
.card.ongoing {
  border-left: 4px solid orange;
}

.editor {
  position: relative;
  top: 18px;
  right: 0;
  bottom: 0;
  left: 0;
  height: 77%;
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

