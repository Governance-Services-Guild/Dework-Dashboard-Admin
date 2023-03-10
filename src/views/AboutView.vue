<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { Configuration, OpenAIApi } from "openai";
import { supabase } from "../supabase";

const session = ref();

//const response = ref(null);
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
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
  };

  const data = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: "Hello!" }],
  };

  axios
    .post("https://api.openai.com/v1/chat/completions", data, { headers })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
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
