<script setup>
import { ref, onMounted } from "vue";
import { useGetDework } from "../composables/getdeworkexport";
import { useUpdateTasks } from "../composables/updatetasks";

const data = ref();

async function getData() {
  const { jsonData } = await useGetDework();
  data.value = jsonData.value;
  console.log("jsonData.value", data.value);
}

onMounted(() => {
  console.log("Loaded");
  setTimeout(function () {
    console.log("Get it");
    getData();
  }, 1000);
});

async function uploadData(uploadData) {
  const { status2 } = await useUpdateTasks(uploadData);
  console.log("Upload", uploadData, status2.value);
}
</script>

<template>
  <main class="main">
    <div>
      <p>Home page</p>
      <button @click="uploadData(data)">Upload</button>
    </div>
  </main>
</template>

<style scoped>
.main {
  padding: 0.5rem;
}
</style>
