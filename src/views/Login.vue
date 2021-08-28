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