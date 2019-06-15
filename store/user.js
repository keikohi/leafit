import firebase from '@/plugins/firebase'

export const state = () => ({
  name: null,
  uid: null,
  email: null,
  token: null
})

export const getters = {
  // 認証されているときはTrue
  isAuthenticated(state) {
    console.log('called')
    return state.token != null
    // state.user != null
  },
  getToken(state) {
    return state.token
  },
  getName(state) {
    return state.name
  },
  getUid(state) {
    return state.uid
  }
}

export const mutations = {
  /* ただのsetter */
  setName(state, name) {
    state.name = name
  },
  setUid(state, uid) {
    state.uid = uid
  },
  setEmail(state, email) {
    state.email = email
  },
  setTokenX(state, tokenX) {
    state.tokenX = tokenX
  },
  setToken(state, token) {
    state.token = token
  }
}

const googleProvider = new firebase.auth.GoogleAuthProvider()
export const actions = {
  login({ commit }) {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signInWithRedirect(googleProvider)
        .then(() => resolve())
        .catch(err => reject(err))
    })
  },
  fetchToken() {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .getRedirectResult()
        .then(result => {
          if (result.credential) {
            const token = result.credential.accessToken
            resolve(token)
          }
        })
        .catch(err => reject(err))
    })
  },
  /* メソッドの中でcommitを使う場合はメソッドの引数に{ commit }を記述 */
  setUser({ commit }, { name, uid, email }) {
    commit('setName', name)
    commit('setUid', uid)
    commit('setEmail', email)
  },
  setToken({ commit }, token) {
    commit('setToken', token)
  }
}
