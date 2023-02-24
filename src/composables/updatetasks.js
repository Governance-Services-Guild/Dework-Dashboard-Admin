import { ref } from "vue";
import { useStore } from "../store/index";
import { supabase } from "../supabase";

export async function useUpdateTasks(jsondata, project) {
  const status2 = ref("");

  const loading = ref(true);
  const task_id = ref([]);
  const updated_at = ref([]);
  const storypoints = ref([]);
  const group = ref([]);
  const title = ref([]);
  const status = ref([]);
  const link = ref([]);
  const backlog = ref([]);
  const to_do = ref([]);
  const in_progress = ref([]);
  const in_review = ref([]);
  const done = ref([]);
  const dework_created_on = ref([]);
  const dework_completed_on = ref([]);

  const due_date = ref([]);
  const activities = ref([]);

  const tags = ref([]);
  const assignees = ref([]);

  const prevStatus = ref([]);
  const prevTaskId = ref([]);
  const prevTitle = ref([]);
  const prevLink = ref([]);

  const newData = ref();
  const store = useStore();

  async function sortData() {
    newData.value = jsondata;
    console.log("newData", newData.value);
    for (let i in newData.value) {
      if (i > 0) {
        title.value.push(newData.value[i][0]);
        link.value.push(newData.value[i][1]);
        storypoints.value.push(
          newData.value[i][3] > 0 ? newData.value[i][3] : 0.0
        );
        status.value.push(newData.value[i][4]);
        due_date.value.push(newData.value[i][8]);
        activities.value.push(newData.value[i][9]);
        assignees.value.push(newData.value[i][5]);
        tags.value.push(newData.value[i][2]);
      }
    }
  }

  async function checkTasks() {
    try {
      loading.value = true;

      let { data, error, status } = await supabase
        .from("tasks")
        .select(`task_id, title, group, status, link`);

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

  async function updateTasks() {
    let actArr = [];
    for (let i in link.value) {
      actArr = activities.value[i];
      const dateRegEx = /[a-zA-Z]{3} \d{1,2}, \d{4} \d{1,2}:\d{2} [AP]M/g;
      // extract dates from the string using the regular expression
      const dates = actArr.match(dateRegEx);
      // convert the extracted date strings to Date objects
      const date1 = new Date(dates[0]);
      const date2 = new Date(dates[1]);
      console.log(date1); // Sat Jan 15 2023 15:28:00 GMT+0530 (India Standard Time)
      console.log(date2);
      console.log("actArr", actArr);
      
      try {
        loading.value = true;

        let updates = {
          title: title.value[i],
          link: link.value[i],
          tags: tags.value[i],
          assignees: assignees.value[i],
          storypoints: storypoints.value[i],
          status: status.value[i],
          group: project,
          due_date: due_date.value[i],
          dework_created_on: date1,
          dework_completed_on: date2,
          updated_at: new Date(),
        };
        if (status.value[i] == "BACKLOG") {
          updates.backlog = "";
          updates.backlog = new Date();
        } else if (status.value[i] == "TODO") {
          updates.to_do = "";
          updates.to_do = new Date();
        } else if (status.value[i] == "IN_PROGRESS") {
          updates.in_progress = "";
          updates.in_progress = new Date();
        } else if (status.value[i] == "IN_REVIEW") {
          updates.in_review = "";
          updates.in_review = new Date();
        } else if (status.value[i] == "DONE") {
          updates.done = "";
          updates.done = new Date();
        }

        for (let j in prevLink.value) {
          if (prevLink.value[j] == link.value[i]) {
            updates.task_id = "";
            updates.task_id = prevTaskId.value[j];
          }
        }
        let { error } = await supabase.from("tasks").upsert(updates);

        if (error) throw error;
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    }
  }

  await checkTasks();
  await sortData();
  await updateTasks();
  status2.value = "done"

  return { status2 };
}
