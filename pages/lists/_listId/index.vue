<template>
  <div class="dashboad">
    <h1 class="pt-5 px-3 grey--text list-name">
      <v-icon class="grey--text list-icon">list</v-icon>
      {{listName}}
      <!-- リスト名の編集モーダル -->
      <v-dialog v-model="renameListDialog" width="500">
        <v-btn class="delete-icon" slot="activator" small fab>
          <v-icon>edit</v-icon>
        </v-btn>
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>Rename the List?</v-card-title>
          <v-divider></v-divider>
          <v-card-actions>
            <v-text-field v-model="newListName" class="title-edit" autofocus label="Title" flat></v-text-field>
            <v-spacer></v-spacer>
          </v-card-actions>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" @click="renameListDialog = false">Cancel</v-btn>
            <v-btn color="red" @click="renameList">Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- リスト名の削除モーダル -->
      <v-dialog v-model="deleteListDialog" width="500">
        <v-btn class="delete-icon" slot="activator" small fab>
          <v-icon>delete</v-icon>
        </v-btn>
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>Delete this List?</v-card-title>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" @click="deleteListDialog = false">Cancel</v-btn>
            <v-btn color="red" @click="_deleteList">Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </h1>

    <v-container class="my-2">
      <v-layout row class="mb-3">
        <!-- 投稿のタイトルでソート -->
        <!-- <v-tooltip top>
          <v-btn small flat color="grey" @click="sortBy('title')" slot="activator">
            <v-icon left small>folder</v-icon>
            <span class="caption text-lowercase">By project name</span>
          </v-btn>
          <span>Sort projects by project name</span>
        </v-tooltip>-->

        <!-- 投稿の日時でソート -->
        <!-- <v-tooltip top>
          <v-btn small flat color="grey" @click="sortBy('due')" slot="activator">
            <v-icon left small>person</v-icon>
            <span class="caption text-lowercase">By Due Date</span>
          </v-btn>
          <span>Sort projects by due date</span>
        </v-tooltip>-->

        <v-tooltip top>
          <v-btn flat color="grey" @click="addMemo" slot="activator">
            <v-icon left>add</v-icon>
            <span class="text-lowercase">add Memo</span>
          </v-btn>
        </v-tooltip>
        <!-- <DeletePost/> -->
      </v-layout>
      <PostList :posts="posts" @input="v => posts=v"/>
    </v-container>
  </div>
</template>



<script>
import PostList from "@/components/Posts/PostList";
import DatePicker from "@/components/Posts/DatePicker";
import { mapActions } from "vuex";
import firebase from "@/plugins/firebase";

export default {
  components: {
    PostList,
    DatePicker
  },
  data() {
    return {
      posts: [],
      listName: null,
      newListName: null,
      dialog: false,
      renameListDialog: false,
      deleteListDialog: false
    };
  },
  mounted() {
    this.getPosts();
    this.getListName();
  },
  methods: {
    ...mapActions("draft", ["renameListName", "deleteList"]),
    sortBy(prop) {
      this.projects.sort((a, b) => (a[prop] < b[prop] ? -1 : 1));
    },
    addMemo() {
      //   if (this.posts.slice(-1)[0].title === null) return;
      let emptyPost = {
        title: null,
        person: null,
        due: "",
        status: "ongoing",
        content: null,
        visiblity: true,
        fromDB: false
      };
      this.posts.push(emptyPost);
    },
    getListName() {
      const listId = this.$nuxt.$route.params.listId;
      firebase
        .firestore()
        .collection("user_post_list")
        .doc("name")
        // TODO: Uidに置き換える
        // .doc(this.$store.getters["user/getUid"])
        .collection("post_list")
        .doc(listId)
        .get()
        .then(doc => {
          let data = doc.data();
          this.listName = data.list_name;
          this.newListName = data.list_name;
          console.log(data);
        })
        .catch(error => {
          console.log(error);
        });
    },
    renameList() {
      this.renameListName({
        listId: this.$nuxt.$route.params.listId,
        listNewName: this.newListName
      })
        .then(() => {
          this.listName = this.newListName;
          this.renameListDialog = false;
        })
        .catch(() => {
          console.log("Failed to rename the list");
        });
    },
    _deleteList() {
      this.deleteList({
        listId: this.$nuxt.$route.params.listId,
      })
        .then(() => {
          this.listName = this.newListName;
          this.deleteListDialog = false;
          console.log("Success to delete the list");
          this.$router.push("/");
        })
        .catch(() => {
          console.log("Failed to delete the list");
        });
    },
    getPosts() {
      // console.log("userId:" + this.$store.getters["user/getUid"]);
      const listId = this.$nuxt.$route.params.listId;
      firebase
        .firestore()
        .collection("user_post")
        .doc("name")
        // TODO: Uidに置き換える
        // .doc(this.$store.getters["user/getUid"])
        .collection("post_list")
        .doc(listId)
        .collection("post")
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            let data = doc.data();
            const post = {
              title: data.title,
              due: data.due,
              status: data.status,
              visiblity: false,
              postId: doc.id,
              postRoute: listId + "/" + doc.id,
              markdownText: "",
              fromDB: true
            };
            this.posts.push(post);
            console.log(data);
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>


<style>
.v-card > *:first-child:not(.v-btn):not(.v-chip) {
  text-decoration: none;
}
.md-theme-default a:not(.md-button) {
  text-decoration: none;
  color: black;
}
.list-icon {
  font-size: 30px !important;
}
@media screen and (max-width: 1600px) {
  /*　画面サイズが300pxからはここを読み込む　*/
  .v-input__control {
    width: 90px !important;
  }
}

@media screen and (max-width: 768px) {
  .list-name {
    font-size: 23px !important;
    font-weight: 500;
    line-height: 30px !important;
    letter-spacing: normal !important;
    font-family: "Roboto", sans-serif !important;
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
</style>
