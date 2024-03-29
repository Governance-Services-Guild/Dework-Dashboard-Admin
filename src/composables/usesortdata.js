import { ref } from "vue";
import { createSupabaseClient } from "../supabase";
import { useGetData } from "../composables/usegetdata";

export async function useSortData(role, workspace) {
  const loading = ref(true);
  const { all_tasks } = await useGetData(role, workspace);
  let done = ref(0);
  let inprogress = ref(0);
  let todo = ref(0);
  let backlog = ref(0);
  let inreview = ref(0);
  let storypoints = ref(0);
  const sorted_data = ref({});
  const assignees = ref([]);
  const tags = ref([]);
  const prevTagId = ref([]);
  const prevTags = ref([]);
  const prevNameId = ref([]);
  const prevNames = ref([]);

  const supabaseWithRole = createSupabaseClient(role);

  async function sortData() {
    sorted_data.value["tasks"] = {};
    sorted_data.value["tasks"]["backlog"] = 0;
    sorted_data.value["tasks"]["todo"] = 0;
    sorted_data.value["tasks"]["in_progress"] = 0;
    sorted_data.value["tasks"]["in_review"] = 0;
    sorted_data.value["tasks"]["done"] = 0;
    done.value = 0;
    storypoints.value = 0;
    // still busy building and testing
    console.log("all_tasks.value", all_tasks.value);
    for (let i in all_tasks.value) {
      storypoints.value = storypoints.value + all_tasks.value[i].storypoints;
      switch (all_tasks.value[i].status) {
        case "DONE":
          done.value++;
          break;
        case "IN_PROGRESS":
          inprogress.value++;
          break;
        case "TODO":
          todo.value++;
          break;
        case "BACKLOG":
          backlog.value++;
          break;
        case "IN_REVIEW":
          inreview.value++;
          break;
        default:
          console.log("Nothing happened");
          break;
      }
      console.log(all_tasks.value[i].status, done.value);
    }
    console.log("storypoints", storypoints.value, done.value, todo.value);
    sorted_data.value["tasks"]["backlog"] = backlog.value;
    sorted_data.value["tasks"]["todo"] = todo.value;
    sorted_data.value["tasks"]["in_progress"] = inprogress.value;
    sorted_data.value["tasks"]["in_review"] = inreview.value;
    sorted_data.value["tasks"]["done"] = done.value;
    //sorted_data.value = all_tasks.value
  }

  async function getAssignees() {
    // still busy building and testing
    try {
      loading.value = true;
      let { data, error, status } = await supabaseWithRole
        .from("assignees")
        .select(`name`)
        .eq("workspace", workspace);

      if (error && status !== 406) throw error;
      if (data) {
        for (let i in data) {
          assignees.value.push(data[i].name);
          sorted_data.value[data[i].name] = {};
          sorted_data.value[data[i].name]["storypoints"] = 0;
          sorted_data.value[data[i].name]["tasks"] = 0;
          sorted_data.value[data[i].name]["tasks_done"] = 0;
        }
        console.log(assignees.value, "data", data);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      loading.value = false;
    }
  }

  async function getTags() {
    // still busy building and testing
    try {
      loading.value = true;
      let { data, error, status } = await supabaseWithRole
        .from("tags")
        .select(`tag`)
        .eq("workspace", workspace);

      if (error && status !== 406) throw error;
      if (data) {
        sorted_data.value["taskTypes"] = {};
        for (let i in data) {
          if (data[i].tag != "github issue" && data[i].tag != "") {
            tags.value.push(data[i].tag);
            sorted_data.value["taskTypes"][data[i].tag] = {};
            sorted_data.value["taskTypes"][data[i].tag]["storypoints"] = 0;
            sorted_data.value["taskTypes"][data[i].tag]["tasks"] = 0;
            sorted_data.value["taskTypes"][data[i].tag]["tasks_done"] = 0;
            sorted_data.value["taskTypes"][data[i].tag]["tasks_backlog"] = 0;
            sorted_data.value["taskTypes"][data[i].tag]["tasks_todo"] = 0;
            sorted_data.value["taskTypes"][data[i].tag][
              "tasks_in_progress"
            ] = 0;
            sorted_data.value["taskTypes"][data[i].tag]["tasks_in_review"] = 0;
          }
        }
        console.log(tags.value, "data", data);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      loading.value = false;
    }
  }

  async function buildAssignees() {
    try {
      loading.value = true;

      // Fetch all data from the "tasks" table
      let { data, error, status } = await supabaseWithRole
        .from("tasks")
        .select()
        .eq("workspace", workspace);

      if (error && status !== 406) throw error;
      console.log("data assignees.value", data, assignees.value);
      for (let i in assignees.value) {
        let filteredData = data.filter((task) =>
          task.assignees.split(",").includes(assignees.value[i])
        );

        for (let j in filteredData) {
          sorted_data.value[assignees.value[i]].storypoints =
            sorted_data.value[assignees.value[i]].storypoints +
            filteredData[j].storypoints;
          sorted_data.value[assignees.value[i]].tasks =
            sorted_data.value[assignees.value[i]].tasks + 1;
          if (filteredData[j].status == "DONE") {
            sorted_data.value[assignees.value[i]].tasks_done =
              sorted_data.value[assignees.value[i]].tasks_done + 1;
          }
        }
        console.log("assignees.value[i]", assignees.value[i], filteredData);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      loading.value = false;
    }

    console.log("sorted_data.value", sorted_data.value, tags.value);
  }

  async function buildTags() {
    // still busy building and testing
    let name = "";
    //sorted_data.value = store.sortedData
    for (let i in tags.value) {
      try {
        loading.value = true;
        let { data, error, status } = await supabaseWithRole
          .from("tasks")
          .select()
          .eq("workspace", workspace)
          .ilike("tags", `%${tags.value[i]}%`);

        if (error && status !== 406) throw error;
        if (data) {
          for (let j in data) {
            sorted_data.value["taskTypes"][tags.value[i]].storypoints =
              sorted_data.value["taskTypes"][tags.value[i]].storypoints +
              data[j].storypoints;
            sorted_data.value["taskTypes"][tags.value[i]].tasks =
              sorted_data.value["taskTypes"][tags.value[i]].tasks + 1;
            if (data[j].status == "DONE") {
              sorted_data.value["taskTypes"][tags.value[i]].tasks_done =
                sorted_data.value["taskTypes"][tags.value[i]].tasks_done + 1;
            }
            if (data[j].status == "BACKLOG") {
              sorted_data.value["taskTypes"][tags.value[i]].tasks_backlog =
                sorted_data.value["taskTypes"][tags.value[i]].tasks_backlog + 1;
            }
            if (data[j].status == "TODO") {
              sorted_data.value["taskTypes"][tags.value[i]].tasks_todo =
                sorted_data.value["taskTypes"][tags.value[i]].tasks_todo + 1;
            }
            if (data[j].status == "IN_PROGRESS") {
              sorted_data.value["taskTypes"][tags.value[i]].tasks_in_progress =
                sorted_data.value["taskTypes"][tags.value[i]]
                  .tasks_in_progress + 1;
            }
            if (data[j].status == "IN_REVIEW") {
              sorted_data.value["taskTypes"][tags.value[i]].tasks_in_review =
                sorted_data.value["taskTypes"][tags.value[i]].tasks_in_review +
                1;
            }
          }
          console.log("tags.value[i]", tags.value[i], data);
        }
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    }
    console.log("sorted_data.value", sorted_data.value, tags.value);
  }

  async function checkTags() {
    try {
      loading.value = true;

      let { data, error, status } = await supabaseWithRole
        .from("tags")
        .select(`id, tag`)
        .eq("workspace", workspace);

      if (error && status !== 406) throw error;

      if (data) {
        for (let j in data) {
          prevTagId.value.push(data[j].id);
          prevTags.value.push(data[j].tag);
        }
      }
    } catch (error) {
      alert(error.message);
    } finally {
      loading.value = false;
    }
    console.log("prevTags.value", prevTags.value);
  }

  async function updateTags() {
    for (let j in sorted_data.value.taskTypes) {
      try {
        loading.value = true;

        let updates = {
          tag: j,
          workspace: workspace,
          storypoints: sorted_data.value.taskTypes[j].storypoints,
          tasks: sorted_data.value.taskTypes[j].tasks,
          tasks_backlog: sorted_data.value.taskTypes[j].tasks_backlog,
          tasks_done: sorted_data.value.taskTypes[j].tasks_done,
          tasks_in_progress: sorted_data.value.taskTypes[j].tasks_in_progress,
          tasks_in_review: sorted_data.value.taskTypes[j].tasks_in_review,
          tasks_todo: sorted_data.value.taskTypes[j].tasks_todo,
          updated_at: new Date(),
        };

        for (let i in prevTags.value) {
          if (prevTags.value[i] == j) {
            updates.id = "";
            updates.id = prevTagId.value[i];
          }
        }

        let { error } = await supabaseWithRole.from("tags").upsert(updates);

        if (error) throw error;
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    }
  }

  async function checkAssignees() {
    try {
      loading.value = true;

      let { data, error, status } = await supabaseWithRole
        .from("assignees")
        .select(`id, name`)
        .eq("workspace", workspace);

      if (error && status !== 406) throw error;

      if (data) {
        for (let j in data) {
          prevNameId.value.push(data[j].id);
          prevNames.value.push(data[j].name);
        }
      }
    } catch (error) {
      alert(error.message);
    } finally {
      loading.value = false;
    }
  }

  async function updateAssignees() {
    for (let j in prevNames.value) {
      try {
        loading.value = true;

        let updates = {
          id: prevNameId.value[j],
          name: prevNames.value[j],
          workspace: workspace,
          storypoints: sorted_data.value[prevNames.value[j]].storypoints,
          tasks: sorted_data.value[prevNames.value[j]].tasks,
          tasks_done: sorted_data.value[prevNames.value[j]].tasks_done,
          updated_at: new Date(),
        };

        let { error } = await supabaseWithRole
          .from("assignees")
          .upsert(updates);

        if (error) throw error;
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    }
  }

  await sortData();
  await getAssignees();
  await getTags();
  await buildAssignees();
  await buildTags();
  await checkTags();
  await updateTags();
  await checkAssignees();
  await updateAssignees();

  return { sorted_data };
}
