<template>
  <div>
    <h1>Todos</h1>
    <button @click="$router.push(`/todo-create`)">Add Todo</button>
    <button @click="logOut">Logout</button>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Done</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="t of todos" :key="t._id">
          <td>{{ t.name }}</td>
          <td>{{ t.done }}</td>
          <td>
            <button @click="$router.push(`/todo-edit/${t._id}`)">Edit</button>
          </td>
          <td>
            <button @click="deleteTodo(t._id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
import { APIURL } from "../constants.ts";

export default {
  data() {
    return {
      todos: [],
    };
  },
  methods: {
    async getTodos() {
      const { data: todos } = await axios.get(`${APIURL}/todos`);
      this.todos = todos;
    },
    async deleteTodo(id) {
      await axios.delete(`${APIURL}/todos/${id}`);
      this.getTodos();
    },
    logOut() {
      localStorage.clear();
      this.$router.push("/");
    },
  },
  beforeMount() {
    this.getTodos();
  },
};
</script>

<style scoped>
th:first-child,
td:first-child {
  width: 60%;
}

th {
  text-align: left;
}
</style>