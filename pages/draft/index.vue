<template>
  <div class="draft">
    <v-container class="mb-5 mt-2" v-if="isShowProperty">
      <v-card>
        <v-card-title class="pb-0">
          <span>
            <v-icon>edit</v-icon>
          </span>
          <h2>Add a New Memo...</h2>
        </v-card-title>
        <v-card-text class="py-1">
          <v-form class="px-3 my-1" ref="form">
            <v-text-field class="py-0" label="title" v-model="post.title" prepend-icon="folder"></v-text-field>
            <v-text-field class="py-0" label="tag" v-model="post.tags" prepend-icon="tag"></v-text-field>
            <v-menu>
              <v-text-field
                class="py-0"
                :value="formattedDate"
                slot="activator"
                label="Due date"
                prepend-icon="date_range"
              ></v-text-field>
              <v-date-picker v-model="post.due"></v-date-picker>
            </v-menu>
          </v-form>
        </v-card-text>
      </v-card>

      
        <v-chip close @input="remove(item)">
          <strong>{{ chips[1] }}</strong>&nbsp;
          <span>(interest)</span>
        </v-chip>
      

      <v-btn @click="postDraft" absolute dark fab bottom right class="mb-5 green">
        <v-icon>done</v-icon>
      </v-btn>
    </v-container>
    <v-layout row>
      <v-flex xs6 height="300px">
        <!-- <v-card height="300px" flat>
          <v-textarea v-model="post.markdownText"></v-textarea>
        </v-card>-->
        <v-textarea
          box
          label="MarkDown Text"
          class="textArea"
          no-resize
          v-model="post.markdownText"
        ></v-textarea>
      </v-flex>
      <v-flex xs6>
        <v-card height="324px" flat>
          <v-card-text class="compiledtext" v-html="compiledMarkdown"></v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <div class="compiledtext" v-html="compiledMarkdown"></div>
  </div>
</template>


<script>
import format from "date-fns/format";
import marked from "marked";
import _ from "lodash";
import highlight from "highlight.js";
export default {
  head() {
    return {
      //   link: [{ rel: "stylesheet", href: "highlight.js/styles/github-gist.css'" }]
    };
  },
  data() {
    return {
      post: {
        title: "",
        tags: "",
        due: null,
        markdownText: "# kkeisuke"
      },
      isShowProperty: true,
      chips: [
        "Programming",
        "Playing video games",
        "Watching movies",
        "Sleeping"
      ],
      items: ["Streaming", "Eating"]
    };
  },
  methods: {
    postDraft() {
      this.$axios
        .$post("/post.json", this.post)
        .then(data => console.log(this.markdownText))
        .catch(error => console.log(this.markdownText));
    },
    update: _.debounce(function(e) {
      this.post.markdownText = e.target.value;
    }, 500),
    remove(item) {
      this.chips.splice(this.chips.indexOf(item), 1);
      this.chips = [...this.chips];
    }
  },
  created: function() {
    marked.setOptions({
      langPrefix: "",
      highlight: function(code, lang) {
        return highlight.highlightAuto(code, [lang]).value;
      }
    });
  },
  computed: {
    formattedDate() {
      return this.post.due ? format(this.post.due, "Do MMM YYYY") : "";
    },
    compiledMarkdown() {
      return marked(this.post.markdownText, { sanitixe: true });
    }
  }
};
</script>


<style>
.compiledtext {
  word-wrap: break-word;
  overflow: scroll;
  height: 324px;
}
.v-textarea--no-resize textarea {
  height: 300px;
  padding: 0;
}
code {
  background: #232323;
  width: 100%;
  padding: 20px 10px;
}
</style>
