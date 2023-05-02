import { ref } from "vue";
import { createSupabaseClient } from "../supabase";

export async function useGetData(role, workspace) {
  const loading = ref(true);
  const all_tasks = ref([]);
  const supabaseWithRole = createSupabaseClient(role);

  async function getProjectData() {
    // still busy building and testing
    try {
      loading.value = true;
      let { data, error, status } = await supabaseWithRole
        .from("tasks")
        .select(
          `task_id, storypoints, title, status, link, backlog, to_do, in_progress, in_review, done, dework_created_on, dework_completed_on, due_date, assignees, tags, description`
        )
        .eq("workspace", workspace);

      if (error && status !== 406) throw error;
      if (data) {
        all_tasks.value = data;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      loading.value = false;
    }
  }

  await getProjectData();

  return { all_tasks };
}
