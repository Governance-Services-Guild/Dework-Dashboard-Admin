import { ref } from "vue";
import axios from "axios";

export async function useGetDework() {
  const jsonData = ref([]);

  const orgEl = "Governance-Services-Guild";
  const repoEl = "Dework-Dashboard-Admin";

  async function readTextFile() {
    axios
      .get(
        `https://raw.githubusercontent.com/${orgEl}/${repoEl}/main/src/assets/dework-files/governance-guild/Governance-Guild-tasks-list.csv`
      )
      .then((response) => {
        const csvData = response.data;
        const lines = csvData.split("\n");
        const headers = lines[0].split(",");
        jsonData.value = [];

        for (let i = 1; i < lines.length; i++) {
          const currentLine = lines[i].split(",");
          let jsonObject = {};
          for (let j = 0; j < headers.length; j++) {
            jsonObject[headers[j]] = currentLine[j];
          }
          jsonData.value.push(jsonObject);
        }

        console.log(jsonData.value);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  await readTextFile();

  return { jsonData };
}
