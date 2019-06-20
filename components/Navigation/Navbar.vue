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
    <div class="overlay" @click="minimizeDrawer" v-if="isTemporary*!mini"></div>
    <!-- stateless: これがないと、drawserを閉じたときに画面からdrawserが消失 -->
    <v-navigation-drawer
      app
      v-model="drawerVisiblity"
      :temporary="isTemporary"
      :mini-variant.sync="mini"
      stateless
      hide-overlay
      :class="`${this.drawerState} grey drawer`"
      v-on:swipeleft="swipe"
    >
      <v-list>
        <!-- メニューのアイコン表示 -->
        <v-list-tile>
          <v-list-tile-action>
            <v-btn icon @click.stop="minimizeDrawer">
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
            <!-- <Popup @input="title => tmpInputListName=title"/> -->
            <v-dialog v-model="createListDialog" max-width="600px">
              <v-btn icon small slot="activator" color="white">
                <i class="material-icons black--text bold">add</i>
              </v-btn>
              <v-card>
                <v-card-title>
                  <h2>Add a New List</h2>
                </v-card-title>
                <v-card-text>
                  <v-form class="px-3" ref="form">
                    <v-text-field
                      label="Title"
                      v-model="tmpInputListName"
                      prepend-icon="folder"
                      :rules="inputRules"
                    ></v-text-field>
                    <v-spacer></v-spacer>
                    <v-btn
                      dark
                      class="dark ma-3"
                      color="grey"
                      @click="createListDialog = false"
                    >Cancel</v-btn>
                    <v-btn dark class="dark ma-3" color="orange" @click="saveListName">OK</v-btn>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile class="white--text" single-line="true">New List</v-list-tile>
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
      drawerState: "min",
      isTextingList: false,
      tmpInputListName: "",
      links: [{ icon: "dashboard", text: "Dashbosrd", route: "/" }],
      postLists: [],
      width: window.innerWidth,
      height: window.innerHeight,
      isTemporary: false,
      isShowOverlay: true,
      listError: false,
      createListDialog: false,
      inputRules: [
        v => v.length <= 16 || "maximum length is 16 characters",
        v => v != "" || "Minimum length is 1 characters"
      ]
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
    minimizeDrawer() {
      this.mini = !this.mini;
      var drawerList = document.getElementsByClassName("drawer");
      const style = drawerList[0];
      if (this.mini) {
        this.drawerState = "mini";
        console.log(this.drawerState);
        return;
      }
      this.drawerState = "expand";
      console.log(this.drawerState);
    },
    // 非同期処理を待つ await を中で呼ぶ関数はasyncをつけなくてはならない
    saveListName() {
      if (this.$refs.form.validate()) {
        const trimedListName = this.tmpInputListName.trim();
        this.createPostList({
          listName: trimedListName,
          uid: "name"
          // TODO: uidを以下に直す
          // uid: this.$store.getters["user/getUid"]
        })
          .then(postId => {
            let list = {
              icon: "list",
              text: trimedListName,
              route: "/lists/" + postId
            };
            this.links.push(list);
            this.tmpInputListName = "";
            this.isTextingList = false;
            // ダイアログの非表示
            this.createListDialog = false;
          })
          .catch(error => console.log("Failed to save a list name"));
      }
    },
    createNewList() {},
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
    swipe() {
      console.log("swiped");
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

.drawer {
  /* mobileでswipeしても大丈夫なように */
  transform: translateX(0) !important;
}
.v-navigation-drawer--mini-variant{
  width: 48px !important;
}
.mini {
  /* !importantはスタイルの優先順位を無視して最優先適用 */
  width: 48px !important;
}
.expand {
  width: 200px !important;
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
    padding: 30px 0px 0px 35px !important;
  }
  .v-toolbar__content {
    padding-left: 80px !important;
  }
  .drawer {
    /* mobileでswipeしても大丈夫なように */
    transform: translateX(0) !important;
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
  opacity: 0.25;
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
