export const state = () => ({
  post: {
    title: '',
    tags: [],
    status: '',
    due: '',
    markdownText: '# kkeisuke'
  },
  showMarkdownEditor: true
})

export const getters = {
  getshowMarkdownEditor(state) {
    return state.showMarkdownEditor
  }
}

export const mutations = {
  setPost(state, post) {
    state.post = post
  }
}

export const actions = {
  toggleShowMarkDownEditor(state) {
    console.log(state.showMarkdownEditor)
    state.showMarkdownEditor = !state.showMarkdownEditor
    console.log(state.showMarkdownEditor)
  }
}
