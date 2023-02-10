import { ref } from "vue";
import { useStore } from "../store/index";
import { supabase } from "../supabase";

export async function useUpdateTasks(jsondata) {
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

  const newData = ref();
  const store = useStore();

  async function uploadData() {
    newData.value = jsondata;
    console.log("newData", newData.value);
    for (let i in newData.value) {
      if (i > 0) {
        title.value.push(newData.value[i][0]);
        link.value.push(newData.value[i][1]);
        storypoints.value.push(newData.value[i][3] > 0 ? newData.value[i][3] : 0.0);
        status.value.push(newData.value[i][4]);
        due_date.value.push(newData.value[i][8]);
        activities.value.push(newData.value[i][9]);
        assignees.value.push(newData.value[i][5]);
        tags.value.push(newData.value[i][2]);
      }
    }
    return assignees.value;
  }

  async function checkTasks() {
    try {
      loading.value = true;

      let { data, error, status } = await supabase
        .from("tasks")
        .select(`task_id, title, group`);

      if (error && status !== 406) throw error;

      if (data) {
        for (let j in data) {
          task_id.value.push(data[j].task_id);
          title.value.push(data[j].title);
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
    for (let i in link.value) {
      try {
        loading.value = true;

        const updates = {
          title: title.value[i],
          link: link.value[i],
          storypoints: storypoints.value[i],
          status: status.value[i],
          updated_at: new Date(),
        };

        let { error } = await supabase.from("tasks").upsert(updates);

        if (error) throw error;
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    }
  }

  status2.value = await uploadData();
  await updateTasks();

  return { status2 };
}
