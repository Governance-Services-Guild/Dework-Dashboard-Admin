import { ref } from "vue";
import axios from "axios";

export async function useGetProjects() {
  const projects = ref([]);

  const orgEl = "Governance-Services-Guild";
  const repoEl = "Dework-Dashboard-Admin";

  async function readFolder() {
    await axios
      .get(
        `https://api.github.com/repos/${orgEl}/${repoEl}/contents/src/assets/dework-files`
      )
      .then((response) => {
        const data = response.data;
        for (let i in data) {
          projects.value.push(data[i]);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  await readFolder();

  return { projects };
}
