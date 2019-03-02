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
            <!-- <div id="container">
              <v-icon id="tag_icon">tag</v-icon>
              <md-chips id="tag_field" class="md-primary shake-on-error" v-model="post.tags">
                <label>tag</label>
              </md-chips>
            </div>-->
            <v-layout row>
              <v-flex xs12 sm6>
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
              </v-flex>
              <v-flex xs12 sm6>
                <v-select :items="statuses" v-model="post.status" label="Status"></v-select>
              </v-flex>
            </v-layout>
            <v-btn
              flat
              fav
              outline
              small
              color="indigo"
              @click="showMarkdownEditor = !showMarkdownEditor"
            >
              <v-icon>edit</v-icon>
            </v-btn>
          </v-form>
        </v-card-text>
        <v-btn @click="postDraft" small absolute dark fab bottom right class="green">
          <v-icon>done</v-icon>
        </v-btn>
      </v-card>
    </v-container>

    <transition name="editor">
      <v-layout row v-if="showMarkdownEditor">
        <v-flex xs6 height="300px">
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
    </transition>

    <!-- <v-text-field class="compiledtext" v-model="compiledMarkdown"></v-text-field> -->
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
        tags: [],
        status: "",
        due: "",
        markdownText: "# kkeisuke"
      },
      statuses: ["ongoing", "complete", "overdue"],
      isShowProperty: true,
      showMarkdownEditor: false
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
  created() {
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
.editor-enter-active {
  transition: all 0.3s ease;
}

.editor-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.editor-enter, .editor-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

#container {
  display: grid;
  grid-template-columns: 24px 1fr;
}

.md-chips.md-field {
  margin-left: 10px;
  margin-bottom: 20px;
}

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
  color: #e5e1dc;
}
.v-icon .md-layout-item .material-icons .theme--light {
  width: 24px;
}
.v-select{
    margin: 0;
    padding: 0;
}

</style>


<style lang="scss" scoped>
.shake-on-error /deep/ .md-duplicated {
  animation-name: shake;
  animation-duration: 0.5s;
}

@keyframes shake {
  0% {
    transform: translate(15px);
  }
  20% {
    transform: translate(-15px);
  }
  40% {
    transform: translate(7px);
  }
  60% {
    transform: translate(-7px);
  }
  80% {
    transform: translate(3px);
  }
  100% {
    transform: translate(0px);
  }
}
</style>

<style lang="css" scoped>
.pulse-on-error >>> .md-duplicated {
  animation-name: pulse;
  animation-duration: 5.5s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  animation-timing-function: ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(1.1, 1.1);
  }
  100% {
    transform: scale(0.9, 0.9);
  }
}
