/* global process */
import axios from 'axios';

export async function fetchWorkspaceTasks(workspace) {
    const query = `
    query GetWorkspaceTasksQuery {
        getWorkspace(id: "${workspace}") {
        id
        tasks {
          id
          name
          applicationCount
          assignees {
            id
            username
          }
          createdAt
          creator {
            id
            username
          }
          deletedAt
          description
          doneAt
          dueDate
          gating
          maxWinners
          number
          openToBids
          owners {
            id
            username
          }
          parentTaskId
          priority
          sectionId
          sortKey
          status
          storyPoints
          submissionCount
          subtasks {
            id
            name
            status
          }
          tags {
            id
            label
            color
          }
          template
          templateTaskId
          workspaceId
          workspace { name }
          __typename
        }
      }
    }
  `;

  const isNode = typeof process !== "undefined" && process.release && process.release.name === "node";
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': isNode ? process.env.VITE_DEWORK_AUTH : import.meta.env.VITE_DEWORK_AUTH, 
  };

  try {
    const response = await axios.post('https://api.deworkxyz.com/graphql?op=GetWorkspaceTasksQuery', {
      query,
    }, {
      headers,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}