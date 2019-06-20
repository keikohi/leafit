<template>
  <div class="dashboad">
    <h1 class="subheading grey--text">namae</h1>
    <v-container class="my-5">
      <!-- <v-progress-circular
        class="pa-5"
        :rotate="360"
        :size="120"
        :width="30"
        value="12"
        color="#3cd1c2"
      >{{ completeFraction }}</v-progress-circular>-->
      <v-card flat class="progress py-4 px-2" >
        <v-layout row wrap>
          <v-flex xs6 sm6 md6>
            <h1 class="ongoing-progress">
              Ongoing:
              <span class="ongoing-progress__rate">{{100 - parseInt(completeRatio)}}%</span>
            </h1>
          </v-flex>
          <v-flex xs6 sm6 md6>
            <h1 class="complete-progress">
              Complete:
              <span class="complete-progress__rate">{{parseInt(completeRatio)}}%</span>
            </h1>
          </v-flex>
        </v-layout>

        <v-progress-linear
          background-color="#3cd1c2"
          color="orange"
          height="25"
          :value="100-parseInt(completeRatio)"
        ></v-progress-linear>
      </v-card>
      <PostList class="mt-3" :posts="posts" @input="v => posts=v"/>
    </v-container>
  </div>
</template>

<script>
import firebase from "@/plugins/firebase";
import PostList from "@/components/Posts/PostList";
export default {
  components: {
    PostList
  },
  data() {
    return {
      posts: [],
      allPosts: [],
      completeRatio: 50
    };
  },
  methods: {
    sortPostsByDue() {
      this.posts.sort((a, b) => (a.due < b.due ? -1 : 1));
    },
    jumpPostPage(index) {
      this.$router.push({ name: `posts-postId`, params: { postId: index } });
    },
    filterOngoingPosts() {
      this.posts = this.allPosts.filter(post => {
        return post.status == "ongoing" || post.status == "overdue";
      });
    },
    getPosts() {
      firebase
        .firestore()
        .collection("user_all_posts")
        .doc("name")
        // TODO: Uidに置き換える
        // .doc(this.$store.getters["user/getUid"])
        .collection("all_posts")
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            let data = doc.data();
            const post = {
              title: data.title,
              due: data.due,
              date: data.date,
              status: data.status,
              postId: data.postId,
              listId: data.listId,
              postRoute: data.listId+'/'+data.postId,
              fromDB: true
            };
            this.allPosts.push(post);
          });
        })
        .then(() => {
          this.filterOngoingPosts();
          this.sortPostsByDue();
          this.completeRatio =
            (100 * (this.allPosts.length - this.posts.length)) /
            this.allPosts.length;
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  computed: {
    nCompletePost() {
      let nComplete = 2;
      // Object.keys(this.loadedPosts).forEach(key => {
      //   if (this.loadedPosts[key].status === "complete") {
      //     nComplete++;
      //   }
      // });
      return nComplete;
    },
    completeRate() {
      // let numPosts = Object.keys(this.loadedPosts).length;
      // return (this.nCompletePost / numPosts)*100;
      return 5;
    },
    completeFraction() {
      // return this.nCompletePost + "/" + Object.keys(this.loadedPosts).length;
      return 12;
    }
  },
  mounted() {
    this.getPosts();
  }
};
</script>


<style>
.link {
  text-decoration-style: none;
  color: #3cd1c2;
}
.link:hover {
  text-decoration: none;
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

.v-chip.complete {
  background: #3cd1c2;
}

.v-chip.ongoing {
  background: orange;
}

.v-chip.overdue {
  background: tomato;
}

.ongoing-progress,
.ongoing-progress__rate,
.complete-progress,
.complete-progress__rate {
  font-family: Helvetica;
}

.ongoing-progress,
.complete-progress {
  font-size: 25px;
  font-weight: 300;
}
.ongoing-progress__rate,
.complete-progress__rate {
  font-size: 40px;
  text-shadow: none;
  font-weight: 400;
}

.ongoing-progress {
  color: orange;
}

.complete-progress {
  color: #3cd1c2;
}
</style>