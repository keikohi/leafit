<template>
  <div>
    <v-flex xs6 height="300px">
      <v-textarea box label="MarkDown Text" class="textArea" no-resize v-model="markdownText"></v-textarea>
    </v-flex>
    <v-flex xs6>
      <v-card height="324px" flat>
        <v-card-text class="compiledtext" v-html="compiledMarkdown"></v-card-text>
      </v-card>
    </v-flex>
  </div>
</template>


<script>
import marked from "marked";
import highlight from "highlight.js";
export default {
  methods: {},
  data() {
    return {
      markdownText: ""
    };
  },

  // 一定時間ごとにMarkDownの内容をUpaDate
  mounted() {
    setInterval(() => {}, 3000);
  },
  computed: {
    compiledMarkdown() {
      return marked(this.markdownText, { sanitixe: true });
    }
  },
  created() {
    marked.setOptions({
      langPrefix: "",
      highlight: function(code, lang) {
        return highlight.highlightAuto(code, [lang]).value;
      }
    });
  }
};
</script>

<style>
#container {
  display: grid;
  grid-template-columns: 24px 1fr;
}

.md-chips.md-field {
  margin-left: 10px;
  margin-bottom: 20px;
}

.v-icon .md-layout-item .material-icons .theme--light {
  width: 24px;
}
.v-select {
  margin: 0;
  padding: 0;
}

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
  animation-duration: 1.0s;
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
