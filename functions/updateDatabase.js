// import axios from 'axios'
import { supabase } from "../src/supabase";
import { fetchWorkspaceTasks } from "../src/api/workspace";
import { useUpdateTasks } from "../src/composables/updatetasks";

const deworkdata = {};
const project = 'governance-guild';

async function uploadData(project) {
  const deworkData = await fetchWorkspaceTasks();
  console.log("deworkData", deworkData.data);
  deworkdata.value = deworkData.data.getWorkspace.tasks;
  const { status2 } = await useUpdateTasks(project, deworkdata.value);
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
