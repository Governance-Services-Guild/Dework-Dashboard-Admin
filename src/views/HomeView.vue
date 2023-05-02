<script setup>
import { ref, onMounted } from "vue";
import { useGetProjects } from "../composables/getprojects";
//import { useGetDework } from "../composables/getdeworkexport";
import { useUpdateTasks } from "../composables/updatetasks";
import { fetchWorkspaceTasks } from "../api/workspace";
import { fetchTaskDetails } from "../api/task";

//const data = ref();
const deworkdata = ref();
const projectsR = ref([]);
const projectNames = ref([]);
const loading = ref(false);
const isNode = typeof process !== "undefined" && process.release && process.release.name === "node";
const ROLE_NAME = isNode ? process.env.VITE_ROLE_NAME : import.meta.env.VITE_ROLE_NAME;
const projectName = ref('Governance Guild')
const workspace = ref('f0cea521-d319-4f02-a20a-7439998dbf82')

async function getProject() {
  const { projects } = await useGetProjects();
  projectsR.value = projects.value;
  for (let i in projectsR.value) {
    projectNames.value.push(projectsR.value[i].name);
  }
  console.log("projectNames.value", projectNames.value);
}

async function getDeworkData() {
  const data = await fetchWorkspaceTasks(workspace.value);
  const taskId = "7475aab2-3d05-4ffa-9e3e-5e7f8f3d1f36";
  const data2 = await fetchTaskDetails(taskId);
  console.log(data);
  console.log(data2);
}

async function getData() {
  getDeworkData();
}

onMounted(() => {
  console.log("Loaded");
  setTimeout(function () {
    console.log("Get it");
  }, 1000);
});

async function uploadData(project) {
  const deworkData = await fetchWorkspaceTasks(workspace.value);
  console.log("deworkData", deworkData.data);
  deworkdata.value = deworkData.data.getWorkspace.tasks;
  const { status2 } = await useUpdateTasks(project, deworkdata.value, ROLE_NAME, workspace.value);
  console.log("Upload", status2.value);
}

async function uploadProjectData(project) {
  loading.value = true;
  //await getData(project);
  await uploadData(project);
  loading.value = false;
}
</script>

<template>
  <main class="main">
    <div v-if="loading" class="fade-in-out">Updating...</div>
    <div v-else>
      <p>Home page</p>
      <button
        @click="getData()"
      >
        Get {{ projectName }} Data
      </button>
      <button
        @click="uploadProjectData(projectName)"
      >
        Upload {{ projectName }} Data
      </button>
    </div>
  </main>
</template>

<style scoped>
.main {
  padding: 0.5rem;
}
/* Define the animation */
@keyframes fade-in-out {
  0% {
    opacity: 0;
  } /* Start with 0% opacity */
  50% {
    opacity: 1;
  } /* Fade in to 100% opacity */
  100% {
    opacity: 0;
  } /* Fade out to 0% opacity */
}

/* Apply the animation to the text element */
.fade-in-out {
  margin: 1em;
  font-size: 2.5em;
  animation: fade-in-out 2s ease-in-out infinite; /* Use the defined animation */
}
</style>
