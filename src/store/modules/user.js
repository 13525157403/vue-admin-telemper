import { login, logout, sysdict } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  user: {},
  privileges: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_PRIVILEGES: (state, privileges) => {
    state.privileges = privileges
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        if (response.data.idToken) {
          setToken(response.data.idToken)
        }
        if (response.success) {
          setToken(response.data.idToken)
          commit('SET_TOKEN', response.data.idToken)
          window.sessionStorage.setItem('sessionUser', JSON.stringify(response.data.sessionUser))

          var rolesArray = []

          response.data.authorityList.forEach(item => {
            rolesArray.push(item.code)
            if (item.children.length > 0) {
              item.children.forEach(items => {
                rolesArray.push(items.code)
                if (items.children.length > 0) {
                  items.children.forEach(itemS => {
                    rolesArray.push(itemS.code)
                  })
                }
              })
            }
          })
          sessionStorage.setItem('privileges', JSON.stringify(rolesArray))
          // sysdict('tagStatus').then((res)=>{
          //   console.log(res.data);
          //   sessionStorage.setItem('tagStatus',res.data)
          // })
          // sysdict('tagStatus').then((res)=>{
          //   console.log(res.data);
          //   sessionStorage.setItem('tagStatus',res.data)
          // })
          // sysdict('tagStatus').then((res)=>{
          //   console.log(res.data);
          //   sessionStorage.setItem('tagStatus',res.data)
          // })
          // sysdict('tagStatus').then((res)=>{
          //   console.log(res.data);
          //   sessionStorage.setItem('tagStatus',res.data)
          // })
          // sysdict('tagStatus').then((res)=>{
          //   console.log(res.data);
          //   sessionStorage.setItem('tagStatus',res.data)
          // })
        }

        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      var userRoles = JSON.parse(sessionStorage.getItem('privileges'))
      userRoles = userRoles || []
      const data = {
        roles: userRoles,
        introduction: '',
        avatar: require('@/assets/user.jpeg'),
        name: ''
      }

      const { roles, name, avatar, introduction } = data

      // roles must be a non-empty array
      if (!roles || roles.length <= 0) {
        reject('getInfo: roles must be a non-null array!')
      }
      commit('SET_ROLES', roles)
      commit('SET_NAME', name)
      commit('SET_AVATAR', avatar)
      commit('SET_INTRODUCTION', introduction)
      commit('SET_USER', state.user)
      resolve(data)
    }).catch(error => {
      // eslint-disable-next-line no-undef
      reject(error)
    })
    // })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
