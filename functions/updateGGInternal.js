/* global process */
// import axios from 'axios'
import { fetchWorkspaceTasks } from "../src/api/workspace";
import { useUpdateTasks } from "../src/composables/updatetasks";

const deworkdata = {};
const project = 'Governance Guild';
const workspace = 'f0cea521-d319-4f02-a20a-7439998dbf82'
const isNode = typeof process !== "undefined" && process.release && process.release.name === "node";
const ROLE_NAME = isNode ? process.env.VITE_ROLE_NAME : import.meta.env.VITE_ROLE_NAME;

async function uploadData(project) {
  const deworkData = await fetchWorkspaceTasks(workspace);
  console.log("deworkData", deworkData.data);
  deworkdata.value = deworkData.data.getWorkspace.tasks;
  const { status2 } = await useUpdateTasks(project, deworkdata.value, ROLE_NAME, workspace);
  console.log("Upload", status2.value);
}

export async function handler(event, context) {
  try {
    // Fetch data from the external API
    await uploadData(project);
    // Return a response object with a status code and a body
    // If you don't have any specific data to return, you can return a simple success message
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Data uploaded successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
