# login-03

## contents

- [login-03](#login-03)
  - [contents](#contents)
  - [introduction](#introduction)
  - [continue building out our front end application](#continue-building-out-our-front-end-application)
  - [add ToDo vue component](#add-todo-vue-component)
  - [add in login view](#add-in-login-view)
  - [register users](#register-users)
  - [incomplete tutorial](#incomplete-tutorial)
  - [registering a user](#registering-a-user)


## introduction

this app is `login-03` which builds on `login-01` and `login-02` which build out
- login-01 builds the back end database running on port 3000
- login-02 adds in the vue front end application running on port 8080.  This is just the bare bones application and has nothing in it yet
  

## continue building out our front end application

clone folder `login/login-02` as `login/login-03` so we create a working version 2 and start to build version 3 of our app which will add some proper front-end logic to it.

once we have cloned folder `login/login-03` open up a terminal in `VSCode` and, as before, 

start the database

```js
mongod
```

start the back end (in a new terminal shell) on port 3000 (navigate in browser to `http://localhost:3000` to view this running)

```js
cd mevn/projects/login/login-03/api
nodemon
```

start the front end (in a third terminal shell)

```js
cd mevn/projects/login/login-03/app
yarn serve
```

so we have the database running, the api running and the front end running!  In real life we could move the database to a secure location like `aws` or `mongodb.com` or `mlab.com`, and the api and front end we could host for free at `netlify.com`. For now though everything is local so is totally under our control, for free.

## add ToDo vue component

Let us begin by adding `app\src\components\ToDoCreateComponent.vue`

```js
<template>
  <div>
    <h1>{{ edit ? "Edit" : "Add" }} Todo</h1>
    <form @submit.prevent="submit">
      <div class="form-field">
        <label>Name</label>
        <br />
        <input v-model="form.name" />
      </div>
      <div>
        <label>Done</label>
        <input type="checkbox" v-model="form.done" />
      </div>
      <div>
        <input type="submit" value="Submit" />
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { APIURL } from "../constants";

export default {
  name: "TodoForm",
  data() {
    return {
      form: { name: "", done: false },
    };
  },
  props: {
    edit: Boolean,
    id: String,
  },
  methods: {
    async submit() {
      const { name, done } = this.form;
      if (!name) {
        return alert("Name is required");
      }
      if (this.edit) {
        await axios.put(`${APIURL}/todos/${this.id}`, { name, done });
      } else {
        await axios.post(`${APIURL}/todos`, { name, done });
      }
      this.$router.push("/todos");
    },
    async getTodo() {
      const { data } = await axios.get(`${APIURL}/todos/${this.id}`);
      this.form = data;
    },
  },
  beforeMount() {
    if (this.edit) {
      this.getTodo();
    }
  },
};
</script>
```

and the corresponding `view` in `app\src\views\ToDoCreate.vue`

```js
<template>
  <div>
    <ToDoCreateComponent></ToDoCreateComponent>
  </div>
</template>

<script>
import ToDoCreateComponent from "@/components/ToDoCreateComponent.vue";

export default {
  components: {
    ToDoCreateComponent,
  },
};
</script>
```

this refers to a `constants.ts` file so let's add it in the `app\src` root folder

```js
export const APIURL = 'http://localhost:3000'
```

and let's tie this in to the router so it becomes visible as a route in `router\index.ts`

```js
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  { path: '/',      name: 'Home',  component: Home  },
  { path: '/about', name: 'About', component: () => import(/* webpackChunkName: "about" */ '../views/About.vue') },
  { path: '/todo-create', name: 'ToDoCreate', component: () => import(/* webpackChunkName: "todo" */ '../views/ToDoCreate.vue') }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
```

we should be able now to see our third page in `App.vue` with a crude login page.  We can fix this later with some styling.

```js
<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> | 
    <router-link to="/todo-create">Add ToDo</router-link>
  </div>
  <router-view/>
</template>
```

you should be able to see these two views now, `add todo` and `edit todo` although they are not working yet

## add in login view

next let's add in a login view at `app\src\views\Login.vue`

```js
<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div class="form-field">
        <label>Username</label>
        <br />
        <input v-model="form.name" type="text" />
      </div>
      <div class="form-field">
        <label>Password</label>
        <br />
        <input v-model="form.password" type="password" />
      </div>
      <div>
        <input type="submit" value="Log in" />
        <button type="button" @click="$router.push('/register')">
          Register
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { APIURL } from "../constants";

export default {
  data() {
    return {
      form: { name: "", password: "" },
    };
  },
  methods: {
    async login() {
      const { name, password } = this.form;
      if (!name || !password) {
        alert("Username and password are required");
      }
      try {
        const {
          data: { token },
        } = await axios.post(`${APIURL}/users/login`, {
          name,
          password,
        });
        localStorage.setItem("token", token);
        this.$router.push("/todos");
      } catch (error) {
        alert("Invalid username or password.");
      }
    },
  },
};
</script>
```

and a new route in `routes\index.ts`

```js
{ path: '/login', name: 'Login', component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue') },
```

and a hyperlink in `App.vue`

```js
<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> | 
    <router-link to="/login">Log In</router-link> | 
    <router-link to="/todo-create">Add ToDo</router-link> |
    <router-link to="/todo-edit">Edit ToDo</router-link> 
  </div>
  <router-view/>
</template>
```

at this stage you should be able to see your login form although it does not yet work practically.

## register users

let's also add in a form `views\Register.vue` to register new users into our database

```js
<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="register">
      <div class="form-field">
        <label>Username</label>
        <br />
        <input v-model="form.name" type="text" />
      </div>
      <div class="form-field">
        <label>Password</label>
        <br />
        <input v-model="form.password" type="password" />
      </div>
      <div>
        <input type="submit" value="Register" />
        <button type="button" @click="$router.push('/login')">Login</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { APIURL } from "../constants.ts";

export default {
  data() {
    return {
      form: { name: "", password: "" },
    };
  },
  methods: {
    async register() {
      const { name, password } = this.form;
      if (!name || !password) {
        alert("Username and password are required");
      }
      try {
        await axios.post(`${APIURL}/users/register`, {
          name,
          password,
        });
        alert("Registration successful");
      } catch (error) {
        alert("Registration failed.");
      }
    },
  },
};
</script>
```

## incomplete tutorial

the tutorial i am following is slightly incomplete at this stage, and because i am using a more updated version of vue than the author i am having a few problems at the moment so the following steps are real troubleshooting steps i am taking to get my app to work.

## registering a user

i seem to have user registration all working now after a few tweaks, not sure if I have tweaked something but not documented it. 

let's just dig down then into the database to see exactly what is happening, and how.

if we open up a shell and type

```js
show dbs
/*
mevn-example    41 kB
*/
use mevn-example
/* 
switched to db mevn-example 
*/
show collections
/*
todos
users
*/
db.users.find()
/*
mevn-example> db.users.find()
[  
  {
    _id: ObjectId("6120bb923476c31a68ee2629"),
    name: 'administrator',
    password: '$2b$10$.CvtXAJpwgXcZYoW0Y1Ve.XOmITlIry3Y52Y65oRmDopay/RwY.yq',
    __v: 0
  }
]
*/
db.users.find()
/*
mevn-example> db.todos.find()
[  
  {
    _id: ObjectId("6120bf483476c31a68ee2631"),
    name: 'asdf',
    done: false,
    user: ObjectId("6120bb923476c31a68ee2629"),
    __v: 0
  }
]
*/
```

we can see that we have data in both the users and todos database which is a good start.

also if i register a new user it's also being stored in the database

```js
/*
  {
    _id: ObjectId("6120c1af3476c31a68ee264b"),
    name: 'administrator2',
    password: '$2b$10$DDVbiFo1mYVPAvl7yNISkegjwdRktXdTvLquKW4liuJuPQbzY6mo6',
    __v: 0
  }
*/
```


