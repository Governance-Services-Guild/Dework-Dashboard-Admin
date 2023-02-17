import { ref } from "vue";
import axios from "axios";
import Papa from "papaparse";

export async function useGetDework(project) {
  const jsonData = ref([]);

  const orgEl = "Governance-Services-Guild";
  const repoEl = "Dework-Dashboard-Admin";

  async function readTextFile() {
    await axios
      .get(
        `https://raw.githubusercontent.com/${orgEl}/${repoEl}/main/src/assets/dework-files/${project}/Governance-Guild-tasks-list.csv`
      )
      .then((response) => {
        const csv = response.data;
        var data = Papa.parse(csv);
        jsonData.value = data.data;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  await readTextFile();

  return { jsonData };
}
