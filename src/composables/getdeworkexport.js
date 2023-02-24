import { ref } from "vue";
import axios from "axios";
import Papa from "papaparse";

export async function useGetDework(project) {
  const jsonData = ref([]);
  const deworkFiles = ref([]);

  const orgEl = "Governance-Services-Guild";
  const repoEl = "Dework-Dashboard-Admin";

  async function readFolder() {
    await axios
      .get(
        `https://api.github.com/repos/${orgEl}/${repoEl}/contents/src/assets/dework-files/${project}`
      )
      .then((response) => {
        const data = response.data;
        for (let i in data) {
          deworkFiles.value.push(data[i]);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    console.log("deworkFiles.value",deworkFiles.value);
  }

  async function readTextFile() {
    await axios
      .get(
        `https://raw.githubusercontent.com/${orgEl}/${repoEl}/main/src/assets/dework-files/${project}/${deworkFiles.value[0].name}`
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

  await readFolder();
  await readTextFile();

  return { jsonData };
}
