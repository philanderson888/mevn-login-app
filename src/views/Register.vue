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