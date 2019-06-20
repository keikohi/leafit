<template>
  <div class="dashboad">
    <v-container class="my-2">
      <h1 class="pt-5 pb-3 px-3 grey--text list-name">
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
      <v-layout row wrap class="mb-3">

        <v-flex xs6 sm3 md2>
            <v-btn flat color="grey" @click="addMemo" >
              <v-icon left>add</v-icon>
              <span class="text-lowercase">add</span>
            </v-btn>
        </v-flex>

        <v-flex xs6 sm3 md2>
            <v-btn flat color="grey" @click="filterOngoingPosts">
              <v-icon left>alarm</v-icon>
              <span class="text-lowercase">Ongoing</span>
            </v-btn>
        </v-flex>

        <v-flex xs6 sm3 md2>
            <v-btn flat color="grey" @click="filterCompletePosts">
              <v-icon left>done</v-icon>
              <span class="text-lowercase">Complete</span>
            </v-btn>
        </v-flex>
        <v-flex xs6 sm3 md6></v-flex>

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
      notFilteredPosts: [],
      listName: null,
      newListName: null,
      dialog: false,
      renameListDialog: false,
      deleteListDialog: false,
      filteringCompletePosts: false,
      filteringOngoingPosts: false,
      filteringOverduePosts: false
    };
  },
  mounted() {
    this.getPosts();
    this.getListName();
  },
  methods: {
    ...mapActions("draft", ["renameListName", "deleteList"]),
    sortByPostDate() {
      this.posts.sort((a, b) => (a.date < b.date ? -1 : 1));
    },
    sortByDue() {
      this.posts.sort((a, b) => (a.due < b.due ? -1 : 1));
    },
    filterCompletePosts() {
      if (this.filteringCompletePosts) {
        this.posts = this.notFilteredPosts;
        this.filteringCompletePosts = false;
        return;
      }
      this.posts = this.notFilteredPosts.filter(post => {
        return post.status == "complete";
      });
      this.filteringCompletePosts = true;
    },
    filterOngoingPosts() {
      if (this.filteringOngoingPosts) {
        this.posts = this.notFilteredPosts;
        this.filteringOngoingPosts = false;
        return;
      }
      this.posts = this.notFilteredPosts.filter(post => {
        return post.status == "ongoing" || post.status == "overdue";
      });
      this.filteringOngoingPosts = true;
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
        listId: this.$nuxt.$route.params.listId
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
        .then(() => {
          this.sortByDue();
          this.notFilteredPosts = this.posts;
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
