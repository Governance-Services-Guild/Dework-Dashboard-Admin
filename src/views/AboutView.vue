<script setup>
import { onMounted, ref } from "vue";
import { Configuration, OpenAIApi } from "openai";
import { supabase } from "../supabase";

const session = ref();

const response = ref(null);
const error = ref(null);
const isLoading = ref(false);

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session;
  });

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session;
  });
});

async function createEditRequest() {
  isLoading.value = true;
  error.value = null;

  const configuration = new Configuration({
    organization: "org-ZXR5qp3od1BTsq3fwII8t1Xx",
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  /*response.value = await openai.listEngines();
  console.log("response", response.value);
  isLoading.value = false;*/
  const editRequest = {
    model: "text-davinci-edit-001",
    input: "What day of the week is it?",
    instruction: "Fix the spelling mistakes",
  };

  try {
    const apiResponse = await openai.createEdit(editRequest);
    response.value = apiResponse.data;
    console.log("response", response.value);
  } catch (err) {
    if (err.response) {
      error.value = err.response.data.error.message;
    } else {
      error.value = "An unexpected error occurred";
    }
  } finally {
    isLoading.value = false;
  }
}
</script>
<template>
  <main class="main">
    <div>
      <p>About</p>
      <button @click="createEditRequest()">Get Request</button>
    </div>
  </main>
</template>

<style scoped>
.main {
  padding: 0.5rem;
}
</style>
