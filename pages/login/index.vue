

<template>
  <v-form v-model="valid" @submit.prevent="exec">
    <v-container>
      <v-layout>
        <v-flex xs12 md4>
          <v-text-field
            v-model="firstname"
            :rules="nameRules"
            :counter="10"
            label="First name"
            required
          ></v-text-field>
        </v-flex>

        <v-flex xs12 md4>
          <v-text-field
            v-model="lastname"
            :rules="nameRules"
            :counter="10"
            label="Last name"
            required
          ></v-text-field>
        </v-flex>

        <v-flex xs12 md4>
          <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
        </v-flex>
      </v-layout>
      <v-btn @click="signIn">submit</v-btn>
    </v-container>
    <v-btn @click="logout">logout</v-btn>
  </v-form>
</template>




<script>
import firebase from "firebase";
import Cookie from "js-cookie";
export default {
  middleware: "vertify-auth",
  data: () => ({
    valid: false,
    firstname: "",
    lastname: "",

    nameRules: [
      v => !!v || "Name is required",
      v => v.length <= 10 || "Name must be less than 10 characters"
    ],
    email: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+/.test(v) || "E-mail must be valid"
    ]
  }),
  created() {},

  methods: {
    exec() {
      console.log(this.firstname);
    },
    signIn() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithRedirect(provider);
    },
    logout() {
      console.log("you logged out");
      firebase.auth().signOut();
    },
    setCookie(result) {
      Cookie.set("jwt", result.idToken);
      Cookie.set(
        "expiration",
        new Date().getTime + Number.parseInt(result.expiresIn) * 1000
      );
      console.log('you set cookie!');
      
    }
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        firebase
          .auth()
          .getRedirectResult()
          .then(result => {
            if (result.credential) {
              const token = result.credential.accessToken;
              console.log('You have credential')
              console.log(result);

              this.$store.commit("setToken", token);
              this.$store.commit("setIdToken", result.credential.idToken);
              this.$store.dispatch('setCookie', result);
            } else {
              this.valid = !valid;
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        console.log("you didnt login");
      }
    });
  }
};
</script>