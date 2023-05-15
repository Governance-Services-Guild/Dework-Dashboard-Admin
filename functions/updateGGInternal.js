/* global process */
// import axios from 'axios'
import { useUpdateTasks } from "../src/composables/updatetasks";

const project = 'Governance Guild';
const workspace = 'f0cea521-d319-4f02-a20a-7439998dbf82'
const isNode = typeof process !== "undefined" && process.release && process.release.name === "node";
const ROLE_NAME = isNode ? process.env.VITE_ROLE_NAME : import.meta.env.VITE_ROLE_NAME;

async function uploadData(project, inputData) {
  // inputData is the data received from the first function
  console.log("Input data from first function:", inputData);

  const { status2 } = await useUpdateTasks(project, inputData.data.getWorkspace.tasks, ROLE_NAME, workspace);
  console.log("Upload", status2.value);
}

export async function handler(event, context) {
  try {
    // Fetch data from the external API
    // event.body contains the data passed from Step 1
    const inputData = JSON.parse(event.body);
    await uploadData(project, inputData);
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
