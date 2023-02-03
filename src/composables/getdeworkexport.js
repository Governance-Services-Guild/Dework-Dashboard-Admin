import { ref } from "vue";
import axios from "axios";
import Papa from "papaparse";

export async function useGetDework() {
  const jsonData = ref([]);

  const orgEl = "Governance-Services-Guild";
  const repoEl = "Dework-Dashboard-Admin";
  const githubToken = import.meta.env.VITE_GITHUB_TOKEN;

  async function readTextFile() {
    axios
      .get(
        `https://raw.githubusercontent.com/Governance-Services-Guild/Dework-Dashboard-Admin/main/src/assets/dework-files/governance-guild/Governance-Guild-tasks-list.csv`
      )
      .then((response) => {
        const csv = response.data;
        var data = Papa.parse(csv);
        console.log(data.data);
        const filteredData = (data.data).filter((row) => row[4] === "IN_PROGRESS");
        console.log(filteredData);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  await readTextFile();

  return { jsonData };
}
