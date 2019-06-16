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
import firebase from '@/plugins/firebase'
export const actions = {
  toggleShowMarkDownEditor(state) {
    state.showMarkdownEditor = !state.showMarkdownEditor
  },
  createPostList({ store }, { listName, uid }) {
    return new Promise((resolve, reject) => {
      // const postId = db.collection('hoge').doc().id
      // addメソッド：ドキュメントの作成"(ユニークIDが振られる)
      // setメソッド: コレクション作成

      //TODO: nameをuidに置き換える
      uid = 'name'
      firebase
        .firestore()
        .collection('user_post_list')
        .doc(uid)
        .collection('post_list')
        .add({
          list_name: listName
        })
        .then(ref => resolve(ref.id))
        .catch(error => console.log(error))
    })
  },
  createPost({ store }, { draft, uid }) {
    return new Promise((resolve, reject) => {
      //TODO: nameをuidに置き換える
      uid = 'name'
      console.log('draft: ' + draft.title + draft.due)
      console.log('uid: ' + uid)
      firebase
        .firestore()
        .collection('user_post')
        .doc(uid)
        .collection('post_list')
        .doc(draft.postListid)
        .collection('post')
        .add({
          title: draft.title,
          due: draft.due,
          date: draft.date,
          status: 'ongoing'
        })
        .then(ref => resolve(ref.id))
        .catch(error => console.log(error))
    })
  },
  updatePost({ store }, { draft }) {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection('user_post')
        .doc('name')
        .collection('post_list')
        .doc(draft.postListid)
        .collection('post')
        .doc(draft.postId)
        .update({
          title: draft.title,
          due: draft.due,
          date: draft.date
        })
        .then(() => resolve())
        .catch(error => console.log(error))
    })
  },
  deletePost({ store }, { postToDelete }) {
    return new Promise((resolve, reject) => {
      // はじめの要素にリストID, ２つ目にポスト ID
      console.log(postToDelete)
      const listPostId = postToDelete.postRoute.split('/')
      firebase
        .firestore()
        .collection('user_post')
        .doc('name')
        .collection('post_list')
        .doc(listPostId[0])
        .collection('post')
        .doc(listPostId[1])
        .delete()
        .then(() => {
          resolve()
        })
        .catch(error => {
          console.error('Error removing document: ', error)
        })
    })
  },
  renameListName({ store }, { listId, listNewName }) {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection('user_post_list')
        .doc('name')
        .collection('post_list')
        .doc(listId)
        .set({
          list_name: listNewName
        })
        .then(() => {
          resolve()
        })
        .catch(error => {
          reject()
        })
    })
  },
  updateStatus({ store }, { postToUpdate, listId, postId }) {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection('user_post')
        .doc('name')
        .collection('post_list')
        .doc(listId)
        .collection('post')
        .doc(postId)
        .update({
          status: postToUpdate.status
        })
        .then(() => {
          resolve()
        })
        .catch(error => {
          console.error('Error removing document: ', error)
        })
    })
  }
}
