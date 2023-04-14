<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "../store/index";
import { useGetData } from "../composables/usegetdata";
import { useSortData } from "../composables/usesortdata";

const taskData = ref([]);
const sortedData2 = ref([]);
const sortedData = ref({});
const chartData = ref({});
let everyTask = [];
const store = useStore();
let lastRefresh = 0;

let tasksDone = ref();
let decisionsMade = ref();

/*
onMounted(async () => {
  lastRefresh = parseInt(localStorage.getItem("refreshtime"))
    ? parseInt(localStorage.getItem("refreshtime"))
    : 0;
  //localStorage.removeItem("alltasks");
  if (parseInt(lastRefresh) < parseInt(Date.now()) - 300000) {
    localStorage.setItem("refreshtime", Date.now());
    lastRefresh = Date.now();
    console.log("Reloading", everyTask, Date.now());
    localStorage.removeItem("alltasks");
    await getData();
  }
  everyTask = JSON.parse(localStorage.getItem("alltasks"));
  store.changeTasks(everyTask);
  if (everyTask == null) {
    // all_projects == null
    console.log("all_projects == null -> Reloading")
    await getData();
  } else {
    await getStats();
  }
});*/

async function getData() {
  const { all_tasks } = await useGetData();
  taskData.value = all_tasks.value;
  //console.log("test", taskData.value);
  const { sortedData } = await getStats();
  chartData.value = sortedData.value;
  await createChart(chartData.value);
  await createChart2(chartData.value);
}

async function statsButton() {
  await createChart();
  /*const { sorted_data } = await getStats();
  sortedData2.value = sorted_data.value
  console.log('stats', sortedData2.value)
  const str = JSON.stringify(sortedData2);
  navigator.clipboard.writeText(str);*/
}

async function getStats() {
  const { sorted_data } = await useSortData();
  sortedData.value = sorted_data.value;
  console.log("sortedData.value", sortedData.value);
  if (localStorage.getItem("alltasks") == null) {
    localStorage.setItem("alltasks", JSON.stringify(sortedData.value));
  }
  return { sortedData };
}

async function createChart(sorted_data) {
  let projectLabels = [];
  let projectLabelsData = [];
  for (let i in sorted_data.taskTypes) {
    if (i != "Audited" && i != "Decision") {
      projectLabels.push(i);
      projectLabelsData.push(sorted_data.taskTypes[i].tasks);
    } else if (i == "Decision") {
      decisionsMade.value = sorted_data.taskTypes[i].tasks;
    }
  }
  console.log("projectLabels", projectLabels, projectLabelsData);
}
async function createChart2(sorted_data) {
  let projectLabels = [];
  let projectLabelsData = [];
  let tasks_backlog = 0;
  let tasks_todo = 0;
  let tasks_in_progress = 0;
  let tasks_in_review = 0;
  let tasks_done = 0;

  projectLabels = ["Backlog", "Todo", "In Progress", "In review"];
  tasks_backlog = tasks_backlog + sorted_data.tasks.backlog;
  tasks_todo = tasks_todo + sorted_data.tasks.todo;
  tasks_in_progress = tasks_in_progress + sorted_data.tasks.in_progress;
  tasks_in_review = tasks_in_review + sorted_data.tasks.in_review;
  tasks_done = tasks_done + sorted_data.tasks.done;
  tasksDone.value = tasks_done;
  projectLabelsData = [
    tasks_backlog,
    tasks_todo,
    tasks_in_progress,
    tasks_in_review,
  ];

  console.log("projectLabels", projectLabels, projectLabelsData);
}
</script>

<template>
  <main class="main">
    <div>
      <p>Home page</p>
      <button @click="getData()">Get Data</button>
      <button @click="statsButton()">Get Stats</button>
    </div>
    <div>
      <div>
        <p>Tasks done {{ tasksDone }}</p>
        <p>Decisions made {{ decisionsMade }}</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.main {
  padding: 0.5rem;
}
.stat1 {
  border-radius: 8px;
  padding: 0.8em;
  margin: 0.8em;
  min-height: 300px;
  min-width: 500px;
}
.charts {
  display: flex;
}
</style>
