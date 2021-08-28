<template>
  <div>
    <h1>{{ edit ? "Edit" : "Add" }} Todo</h1>
    <form @submit.prevent="submit">
      <div class="form-field">
        <label>Name</label>
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
import { APIURL } from "../constants.ts";

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
       console.log(`submitting to do form with values name=${name} and done=${done}`)
      if (!name) {
        return alert("Name is required");
      }
      if (this.edit) {
        const url = `${APIURL}/todos/${this.id}`
        console.log(`attempting to POST updated values for todo ${name} ${done} to url ${url}`)
        await axios.put(`${APIURL}/todos/${this.id}`, { name, done });
      } else {
        console.log(`adding a new to do item ${name} ${done}`)
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