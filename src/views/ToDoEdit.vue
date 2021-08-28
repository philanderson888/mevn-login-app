<template>
  <div>
    <ToDoCreateComponent edit :id='$route.params.id'></ToDoCreateComponent>
  </div>
</template>

<script>
import ToDoCreateComponent from "@/components/ToDoCreateComponent";

export default {
  components: {
    ToDoCreateComponent,
  },
};
</script>