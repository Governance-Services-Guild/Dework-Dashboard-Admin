<script setup>
import { ref, onMounted } from "vue";
import { useGetProjects } from "../composables/getprojects";
import { useGetDework } from "../composables/getdeworkexport";
import { useUpdateTasks } from "../composables/updatetasks";

const data = ref();
const projectsR = ref([])
const projectNames = ref([])

async function getProject() {
  const { projects } = await useGetProjects();
  projectsR.value = projects.value;
  for (let i in projectsR.value) {
    projectNames.value.push(projectsR.value[i].name)
  }
  console.log("projectNames.value", projectNames.value);
}

async function getData(project) {
  const { jsonData } = await useGetDework(project);
  data.value = jsonData.value;
  console.log("data.value", data.value);
}

onMounted(() => {
  console.log("Loaded");
  setTimeout(function () {
    console.log("Get it");
    getProject();
  }, 1000);
});

async function uploadData(uploadData, project) {
  const { status2 } = await useUpdateTasks(uploadData, project);
  console.log("Upload", uploadData, status2.value);
}

async function uploadProjectData(project) {
  await getData(project);
  await uploadData(data.value, project);
}
</script>

<template>
  <main class="main">
    <div>
      <p>Home page</p>
      <button v-for="title in projectNames" :key="title" @click="getData(title)">Get {{title}} Data</button>
      <button v-for="title in projectNames" :key="title" @click="uploadProjectData(title)">Upload {{title}} Data</button>
    </div>
  </main>
</template>

<style scoped>
.main {
  padding: 0.5rem;
}
</style>
