
<template>
  <div>
    <!-- :to="post.postRoute" -->
    <v-card flat ref="post" v-for="post in posts" :key="post.postId">
      <v-layout row wrap :class="`project pb-0 pt-2 px-3 ${post.status}`">
        <v-flex xs12 sm6 md6 @click="toMarkdownPage(post)">
          <!-- 編集中は表示post.visiblityがtrue -->
          <div v-if="post.visiblity">
            <v-text-field class="title-edit" v-model="post.title" autofocus label="Title" flat></v-text-field>
            <p class="title-error" v-if="false">{{ 'Tittle must be less than 24 characters' }}</p>
          </div>
          <div class="post-title" v-if="!post.visiblity">{{ post.title }}</div>
        </v-flex>
        <!-- 編集中は"非"表示post.visiblity -->
        <v-flex xs6 sm2 md2 @click="toMarkdownPage(post)">
          <div class="post-due mt-4" v-if="!post.visiblity">
            <div>{{ post.due }}</div>
          </div>
          <div class="mt-o0 right" v-if="post.visiblity">
            <Calender :_due="post.due" @input="v => post.due=v"/>
            <!-- <p class="due-validate" v-show="errors.has('due-validate')">{{ post.due }}</p> -->
          </div>
        </v-flex>

        <v-flex xs6 sm2 md2>
          <div class="mt-3 mb-2" v-if="!post.visiblity">
            <v-chip
              small
              @click="changeStatus(post)"
              :class="`${post.status} white--text titile status-chip`"
            >{{ post.status }}</v-chip>
          </div>
          <div class="center pt-3 px-2" v-if="post.visiblity">
            <v-btn @click="setTitle(post)" color="orange" small>done</v-btn>
          </div>
        </v-flex>
        <v-flex xs12 sm2 md2>
          <div class="right pt-3 pb-2 edit-btn">
            <v-btn class="edit-icon" v-if="!post.visiblity" @click="editPost(post)" small fab>
              <v-icon>edit</v-icon>
            </v-btn>
            <v-dialog v-model="dialog" width="500">
              <v-btn
                class="delete-icon"
                v-if="!post.visiblity"
                slot="activator"
                small
                fab
                @click="selectPostToDelete(post)"
              >
                <v-icon>delete</v-icon>
              </v-btn>
              <v-card>
                <v-card-title
                  class="headline grey lighten-2"
                  primary-title
                >Delete This Post? {{postToDelete.title}}</v-card-title>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="grey" @click="dialog = false">Cancel</v-btn>
                  <v-btn color="red" @click="setDeletePost()">Delete</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </v-flex>
      </v-layout>
      <v-divider></v-divider>
    </v-card>
  </div>
</template>

<script>
import Calender from "@/components/Posts/Calender";
import { mapActions } from "vuex";
import format from "date-fns/format";
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
        due: null,
        date: null
      },
      tmp: "",
      dialog: false,
      deletePostId: null,
      postToDelete: {
        title: ""
      }
    };
  },
  methods: {
    // mapActionsはmethodsで定義
    ...mapActions("draft", [
      "createPost",
      "deletePost",
      "updateStatus",
      "updatePost"
    ]),
    setTitle(post) {
      // postが未入力ならば起票不可
      if (post.title === null) {
        return;
      }
      post.visiblity = false;
      post.date = format(Date.now(), "YYYY/MM/DD HH:mm:ss");
      post.postListid = this.$nuxt.$route.params.listId;

      //すでに存在するPostはDB更新
      if (post.fromDB) {
        this.updatePost({
          draft: post
        });
        return;
      }
      this.createPost({
        draft: post,
        uid: "name"
      }).then(id => {
        // 戻り値のPostIdを回収してメモ画面へのURLを追加
        post.postRoute = this.$nuxt.$route.params.listId + "/" + id;
      });
    },
    editPost(post) {
      post.visiblity = true;
    },
    toMarkdownPage(post) {
      if (post.visiblity) {
        return;
      }
      this.$router.push("/lists/" + post.postRoute);
    },
    changeStatus(post) {
      post.status = post.status == "ongoing" ? "complete" : "ongoing";
      const listPostId = post.postRoute.split("/");
      this.updateStatus({
        postToUpdate: post,
        listId: listPostId[0],
        postId: listPostId[1]
      })
        .then(() => {
          console.log("Success to change status: " + post.status);
        })
        .catch(error => {
          console.log("Failded to update Status");
          post.status = post.status == "ongoing" ? "complete" : "ongoing";
        });
    },

    setDeletePost() {
      this.deletePost({
        postToDelete: this.postToDelete
      })
        .then(() => {
          console.log("post: " + this.postToDelete.postId);
          this.posts = this.posts.filter(post_in_posts => {
            return post_in_posts.postId != this.postToDelete.postId;
          });
          this.dialog = false;
          // 削除した結果を親コンポーネントに渡す
          this.$emit("input", this.posts);
        })
        .catch(error => console.log("Could not delete a post"));
    },
    // Modal内でpostを選択すると選択できないので、Model表示ボタンでで削除対象をセット
    selectPostToDelete(post) {
      this.postToDelete = post;
    }
  }
};
</script>

<style>
.project {
  position: relative;
}
.project.complete {
  border-left: 4px solid #3cd1c2;
}

.project.ongoing {
  border-left: 4px solid orange;
}

.project.overdue {
  border-left: 4px solid tomato;
}

.v-chip .v-chip__content,
.post-title,
.post-due {
  cursor: pointer !important;
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
.v-btn:not(.v-btn--depressed):not(.v-btn--flat) {
  box-shadow: none;
  color: white;
  justify-content: center;
}

.edit-icon {
  height: 8px !important;
  width: 8px !important;
  color: #acacac !important;
}
.delete-icon {
  height: 8px !important;
  width: 8px !important;
  color: #acacac !important;
}
.theme--light.v-btn:not(.v-btn--icon):not(.v-btn--flat) {
  background-color: #f5f5f5;
}
.edit-btn {
  padding-top: 0px !important;
}

@media screen and (max-width: 1600px) {
  .title-edit {
    font-size: 25px !important;
  }
  .post-title {
    font-size: 25px;
    font-weight: 400;
    line-height: 30px !important;
    letter-spacing: normal !important;
    font-family: "Roboto", sans-serif !important;
  }
  .post-due {
    font-size: 16px;
    font-weight: 400;
    line-height: 25px !important;
    letter-spacing: normal !important;
    font-family: "Roboto", sans-serif !important;
  }
  .v-input__control {
    width: 90px !important;
  }
}
@media screen and (max-width: 770px) {
  .title-edit {
    font-size: 18px !important;
  }
  .post-title {
    font-size: 22px;
    font-weight: 500;
    line-height: 30px !important;
    letter-spacing: normal !important;
    font-family: "Roboto", sans-serif !important;
  }
  .post-due {
    font-size: 14px;
    font-weight: 500;
    line-height: 25px !important;
    letter-spacing: normal !important;
    font-family: "Roboto", sans-serif !important;
  }
}
</style>
