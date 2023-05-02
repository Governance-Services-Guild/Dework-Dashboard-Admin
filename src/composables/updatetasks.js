import { ref } from "vue";
import { createSupabaseClient } from "../supabase";
import { useSortData } from "../composables/usesortdata";

export async function useUpdateTasks(org, deworkdata, role, workspace) {
  const status2 = ref("");
  const loading = ref(true);
  const prevTagId = ref([]);
  const prevTags = ref([]);
  const prevNameId = ref([]);
  const prevNames = ref([]);
  const updated_at = ref([]);
  const storypoints = ref([]);
  const title = ref([]);
  const status = ref([]);
  const link = ref([]);
  const due_date = ref([]);
  const description = ref([]);
  const creator = ref([]);
  const created_at = ref([]);
  const completed_at = ref([]);
  
  const supabaseWithRole = createSupabaseClient(role);

  const tags = ref([]);
  const assignees = ref([]);

  const prevStatus = ref([]);
  const prevTaskId = ref([]);
  const prevTitle = ref([]);
  const prevLink = ref([]);
  const deworkData = ref();
  const deworkDataWorkspace = ref([]);

  async function sortData() {
    deworkData.value = deworkdata;
    //newData.value = jsondata;
    console.log("deworkData", deworkData.value);
    for (let j in deworkData.value) {
      deworkDataWorkspace.value.push(deworkData.value[j].workspace.name)
      console.log("deworkData", deworkData.value[j].name);
      title.value.push(deworkData.value[j].name);
      link.value.push(deworkData.value[j].id);
      storypoints.value.push(deworkData.value[j].storyPoints);
      status.value.push(deworkData.value[j].status);
      description.value.push(deworkData.value[j].description);
      creator.value.push(deworkData.value[j].creator.username);
      due_date.value.push(deworkData.value[j].dueDate);
      created_at.value.push(deworkData.value[j].createdAt);
      completed_at.value.push(deworkData.value[j].doneAt);
      let newAssignees = [];
      for (let k in deworkData.value[j].assignees) {
        newAssignees.push(deworkData.value[j].assignees[k].username);
      }
      assignees.value.push(newAssignees.join(","));
      let newTags = [];
      for (let l in deworkData.value[j].tags) {
        newTags.push(deworkData.value[j].tags[l].label);
      }
      tags.value.push(newTags.join(","));
    }
  }

  async function checkTasks() {
    try {
      loading.value = true;

      let { data, error, status } = await supabaseWithRole
        .from("tasks")
        .select(`task_id, title, group, status, link`)
        .eq("workspace", workspace);

      if (error && status !== 406) throw error;

      if (data) {
        for (let j in data) {
          prevTaskId.value.push(data[j].task_id);
          prevTitle.value.push(data[j].title);
          prevLink.value.push(data[j].link);
          prevStatus.value.push(data[j].status);
          updated_at.value.push(new Date(data[j].updated_at).valueOf());
        }
      }
    } catch (error) {
      alert(error.message);
    } finally {
      loading.value = false;
    }
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

  async function updateTasks() {
    for (let i in link.value) {
      try {
        loading.value = true;
        console.log("tags.value[i]", tags.value[i]);

        let updates = {
          title: title.value[i],
          link: link.value[i],
          tags: tags.value[i],
          assignees: assignees.value[i],
          storypoints: storypoints.value[i],
          description: description.value[i],
          creator: creator.value[i],
          status: status.value[i],
          group: org,
          workspace_name: deworkDataWorkspace.value[i],
          workspace: workspace,
          due_date: due_date.value[i],
          dework_created_on: created_at.value[i],
          dework_completed_on: completed_at.value[i],
          updated_at: new Date(),
        };

        for (let j in prevLink.value) {
          if (prevLink.value[j] == link.value[i]) {
            updates.task_id = "";
            updates.task_id = prevTaskId.value[j];
            if (status.value[i] == "BACKLOG" && prevStatus.value[j] != "BACKLOG") {
              updates.backlog = "";
              updates.backlog = new Date();
            } else if (status.value[i] == "TODO" && prevStatus.value[j] != "TODO") {
              updates.to_do = "";
              updates.to_do = new Date();
            } else if (status.value[i] == "IN_PROGRESS" && prevStatus.value[j] != "IN_PROGRESS") {
              updates.in_progress = "";
              updates.in_progress = new Date();
            } else if (status.value[i] == "IN_REVIEW" && prevStatus.value[j] != "IN_REVIEW") {
              updates.in_review = "";
              updates.in_review = new Date();
            } else if (status.value[i] == "DONE" && prevStatus.value[j] != "DONE") {
              updates.done = "";
              updates.done = new Date();
            }
          } 
        }
        let { error } = await supabaseWithRole.from("tasks").upsert(updates);

        if (error) throw error;
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    }
  }

  async function updateAssignees() {
    let assignee = "";
    let assigneest = [];
    let taskassignees = [];
    for (let i in link.value) {
      if (assignees.value[i]) {
        taskassignees = assignees.value[i].split(",");
      } else {
        continue;
      }

      for (let k in taskassignees) {
        assignee = taskassignees[k];
        if (!assigneest.includes(assignee)) {
          assigneest.push(assignee);
        }
      }
    }

    for (let j in assigneest) {
      try {
        loading.value = true;

        let updates = {
          name: assigneest[j],
          workspace: workspace
        };

        for (let i in prevNames.value) {
          if (prevNames.value[i] == assigneest[j]) {
            updates.id = "";
            updates.id = prevNameId.value[i];
          }
        }

        let { error } = await supabaseWithRole.from("assignees").upsert(updates);

        if (error) throw error;
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    }
  }

  async function updateTags() {
    let tag = "";
    let tagst = [];
    let tasktags = [];
    for (let i in link.value) {
      if (tags.value[i]) {
        tasktags = tags.value[i].split(",");
      } else {
        continue;
      }

      for (let k in tasktags) {
        tag = tasktags[k];
        if (!tagst.includes(tag)) {
          tagst.push(tag);
        }
      }
    }

    for (let j in tagst) {
      try {
        loading.value = true;

        let updates = {
          tag: tagst[j],
          workspace: workspace
        };

        for (let i in prevTags.value) {
          if (prevTags.value[i] == tagst[j]) {
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

  await checkTasks();
  await checkTags();
  await checkAssignees();
  await sortData();
  await updateTasks();
  await updateTags();
  await updateAssignees();
  const { sorted_data } = await useSortData(role, workspace);
  console.log(sorted_data.value);
  status2.value = "done";

  return { status2 };
}
