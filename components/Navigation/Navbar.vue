<template>
  <div>
    <v-toolbar flat app>
      <v-toolbar-title class="grey--text">
        <span class="font-weight-light">Leafit</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <!-- drawerがtemporaryで大きくなるときはoverlayを表示 -->
    <!-- overlayをクリックしたときもdrawerが閉じるように変更 -->
    <div class="overlay" @click="mini=!mini" v-if="isTemporary*!mini"></div>
    <!-- stateless: これがないと、drawserを閉じたときに画面からdrawserが消失 -->
    <v-navigation-drawer
      app
      v-model="drawerVisiblity"
      :temporary="isTemporary"
      :mini-variant.sync="mini"
      stateless
      hide-overlay
      class="grey"
    >
      <v-list>
        <!-- メニューのアイコン表示 -->
        <v-list-tile>
          <v-list-tile-action>
            <v-btn icon @click.stop="mini = !mini">
              <v-icon class="white--text bold">menu</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
        <!-- メニューのアイコン表示 -->
        <v-list-tile v-for="link in links" :key="link.text" router :to="link.route">
          <v-list-tile-action>
            <v-icon class="white--text">{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile class="white--text" single-line="true">{{ link.text }}</v-list-tile>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <Popup/>
        </v-list-tile>
        <!-- 作成したリストの表示 -->
        <v-list-tile v-for="list in postLists" :key="list.text" router :to="list.route">
          <v-list-tile-action id="icon">
            <v-icon class="white--text">{{ list.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile class="white--text" single-line="true">{{ list.name }}</v-list-tile>
          </v-list-tile-content>
        </v-list-tile>
        <!-- DBから取得してきたリスト一覧 -->
        <v-list-tile>
          <v-list-tile-action>
            <v-btn icon @click="inputText">
              <i class="material-icons white--text bold">add</i>
            </v-btn>
          </v-list-tile-action>
          <v-list-tile-content v-if="!isTextingList">
            <v-list-tile class="white--text" single-line="true">New List</v-list-tile>
          </v-list-tile-content>
          <v-list-tile-content v-if="isTextingList">
            <v-text-field
              placeholder=" New List"
              background-color="white"
              class="body-2 ma-1"
              @keypress.enter="saveListName"
              v-model="tmpInputListName"
            ></v-text-field>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import Popup from "@/components/Popup/Popup";
import firebase from "@/plugins/firebase";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      drawerVisiblity: true,
      mini: true,
      isTextingList: false,
      tmpInputListName: "",
      links: [
        { icon: "dashboard", text: "Dashbosrd", route: "/dashboard" },
        { icon: "folder", text: "My Projects", route: "/projects" },
        { icon: "person", text: "Team", route: "/team" }
      ],
      postLists: [],
      width: window.innerWidth,
      height: window.innerHeight,
      isTemporary: false,
      isShowOverlay: true,
      listError: false
    };
  },
  mounted() {
    this.getListName();
    // イベントリスナの登録
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    ...mapActions("draft", ["createPostList"]),
    addList() {
      let list = {
        icon: "list",
        text: "",
        route: "/"
      };
      this.links.push(list);
    },
    inputText() {
      this.isTextingList = !this.isTextingList;
    },
    // 非同期処理を待つ await を中で呼ぶ関数はasyncをつけなくてはならない
    async saveListName() {
      const trimedListName = this.tmpInputListName.trim();
      if (trimedListName === "") {
        return;
      }
      if (trimedListName.length >= 16) {
        this.listError = true;
        return;
      }

      let postId = await this.createPostList({
        listName: trimedListName,
        uid: "name"
        // TODO: uidを以下に直す
        // uid: this.$store.getters["user/getUid"]
      });

      let list = {
        icon: "list",
        text: trimedListName,
        route: "/lists/" + postId
      };
      this.links.push(list);
      this.tmpInputListName = "";
      this.isTextingList = false;
    },
    getListName() {
      console.log("userId:" + this.$store.getters["user/getUid"]);
      firebase
        .firestore()
        .collection("user_post_list")
        .doc("name")
        // TODO: Uidに置き換える
        // .doc(this.$store.getters["user/getUid"])
        .collection("post_list")
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            let data = doc.data();

            let list = {
              icon: "list",
              name: data.list_name,
              id: doc,
              route: "/lists/" + doc.id
            };
            this.postLists.push(list);
            // let date = format(Date.now(), 'Do MMM YYYY')
          });
        });
    },
    switchOverlay() {
      this.isShowOverlay = !this.isShowOverlay;
      console.log("clicked!!!");
    },
    handleResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      console.log(this.width);
      console.log(this.isTemporary);

      if (this.width < 770) {
        this.isTemporary = true;
      } else {
        this.isTemporary = false;
      }
    }
  },
  components: {
    Popup
  }
};
</script>


<style>
.v-list__tile .theme--light {
  text-overflow: ellipsis;
  white-space: nowrap;
}

.v-text-field {
  width: 100%;
}
.v-navigation-drawer--open {
  /* !importantはスタイルの優先順位を無視して最優先適用 */
  width: 200px !important;
}

.v-navigation-drawer--mini-variant {
  /* !importantはスタイルの優先順位を無視して最優先適用 */
  width: 48px !important;
}
.v-list__tile__action {
  min-width: initial;
  width: 48px !important;
}
.v-list__tile__action {
  justify-content: center !important;
}

.v-navigation-drawer > .v-list:not(.v-list--dense) .v-list__tile {
  font-size: 14px;
  text-decoration: none;
}

@media screen and (max-width: 770px) {
  /*　画面サイズがmax-widthまではここを読み込む　*/
  .v-content {
    padding: 56px 0px 0px 35px !important;
  }
  .v-toolbar__content {
    padding-left: 80px !important;
  }
}
.v-navigation-drawer--temporary:not(.v-navigation-drawer--close),
.v-navigation-drawer--is-mobile:not(.v-navigation-drawer--close) {
  box-shadow: none !important;
}
.v-navigation-drawer > .v-list:not(.v-list--dense) .v-list__tile {
  padding: 0;
}
.overlay {
  opacity: 0.46;
  background-color: #212121;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  z-index: 5;
}
.v-navigation-drawer[data-booted="true"] {
  transition: none !important;
}

aside {
  overflow-y: scroll !important;
  padding-right: 10px;
}
aside::-webkit-scrollbar {
  display: none;
}
</style>
