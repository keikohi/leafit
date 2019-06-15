<template>
  <div>
    <v-btn @click="doLogin">login</v-btn>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import firebase from "@/plugins/firebase";
export default {
  methods: {
    /*
     user.jsにあるloginメソッドをマッピング
     this.$store.dispatch('user/login')
     と記述してもよいが、ここはマッピングを使用したほうが見やすい
     */
    ...mapActions("user", ["login", "setUser", "fetchToken", "setToken"]),
    doLogin() {
      this.login()
        .then(() => console.log("resloved"))
        .catch(err => console.log(err));
    }
  },
  async mounted() {
    console.log("mounted");
    /* awaitは非同期処理が終わるまで待つ */
    let user = await new Promise((resolve, reject) => {
      /* resolve(xxx)はxxxを結果として返す */
      firebase.auth().onAuthStateChanged(user => resolve(user));
    });
    let token = await this.fetchToken();
    if (token) {
      this.setToken(token);
    }
    if (user) {
      this.setUser({
        name: user.displayName,
        uid: user.uid,
        email: user.email
      });
      this.$router.push("/");
    }
  }
};
</script>
