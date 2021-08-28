import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import axios from 'axios'

axios.interceptors.request.use(config => {
  if(config.url?.includes('login') || config.url?.includes('register')) {
    return config;
  }
  return {
    ...config, headers: {
      Authorization: localStorage.getItem("token")
    }
  }
}, error => {
  return Promise.reject(error);
})

const beforeEnter = (to:any,from:any,next:any) => {
  const token = localStorage.getItem('token')
  if(token){
    next()
    return true;
  }
  next({path:'/'})
  return false;
}

const routes: Array<RouteRecordRaw> = [
  { path: '/',      name: 'Home',     component: Home  },
  { path: '/about', name: 'About',    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue') },
  { path: '/login', name: 'Login',    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'), },
  { path: '/register',name:'Register',component:()=>import(/* webpackChunkName: "register" */ '../views/Register.vue')},
  { path: '/todos',name:'Todos',      component:()=>import(/* webpackChunkName: "todos" */ '../views/ToDos.vue'), beforeEnter },
  { path: '/todo-create', name: 'ToDoCreate', component: () => import(/* webpackChunkName: "todo" */ '../views/ToDoCreate.vue'), beforeEnter } ,
  { path: '/todo-edit/:id', name: 'ToDoEdit', component: () => import(/* webpackChunkName: "todoedit" */ '../views/ToDoEdit.vue'), beforeEnter } ,
]

const router = createRouter({
  //history: createWebHashHistory(process.env.BASE_URL),
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
