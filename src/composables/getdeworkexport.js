import { ref } from "vue";
import axios from "axios";
import Papa from "papaparse";

export async function useGetDework() {
  const jsonData = ref([]);

  const orgEl = "Governance-Services-Guild";
  const repoEl = "Dework-Dashboard-Admin";

  async function readTextFile() {
    await axios
      .get(
        `https://raw.githubusercontent.com/${orgEl}/${repoEl}/main/src/assets/dework-files/governance-guild/Governance-Guild-tasks-list.csv`
      )
      .then((response) => {
        const csv = response.data;
        var data = Papa.parse(csv);
        console.log("data.data", data.data);
        /*const filteredData = data.data.filter(
          (row) => row[4] === "IN_PROGRESS"
        );
        console.log("filteredData", filteredData);*/
        jsonData.value = data.data;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  await readTextFile();

  return { jsonData };
}
