import Cookie from 'js-cookie'

export const state = () => ({
  state: {
    loadedPosts: [],
    token: null,
    idToken: null,
    user: null,
    status: false,
    num: 0
  }
})

export const mutations = {
  onAuthStateChanged(state, users) {
    state.user = users
  },
  setToken(state, token) {
    console.log(token)
    state.token = token
  },
  setIdToken(state, idToken) {
    console.log(idToken)
    state.idToken = idToken
  },
  add(state) {
    state.num++
  }
}

export const actions = {
  setCookie(vuexContext, result) {
    localStorage.setItem('token', result.idToken)
    localStorage.setItem(
      'tokenExpiration',
      new Date().getTime() + Number.parseInt(result.expiresIn) * 1000
    )
    Cookie.set('jwt', result.idToken)
    Cookie.set(
      'expirationDate',
      new Date().getTime + Number.parseInt(result.expiresIn) * 1000
    )
  }
}

export const getters = {
  user(state) {
    return state.user
  },
  token(state) {
    return state.token
  }
}
