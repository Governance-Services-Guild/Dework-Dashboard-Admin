/* global process */
// import axios from 'axios'
import { fetchWorkspaceTasks } from "../src/api/workspace";

const deworkdata = {};
const project = 'Governance Guild';
const workspace = 'f0cea521-d319-4f02-a20a-7439998dbf82'

async function uploadData(project) {
  const deworkData = await fetchWorkspaceTasks(workspace);
  console.log("deworkData", deworkData.data);
  deworkdata.value = deworkData;
  return deworkdata.value;
}

export async function handler(event, context) {
  try {
    // Fetch data from the external API
    const result = await uploadData(project);
    // Return a response object with a status code and a body
    // If you don't have any specific data to return, you can return a simple success message
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Data uploaded successfully", data: result }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
