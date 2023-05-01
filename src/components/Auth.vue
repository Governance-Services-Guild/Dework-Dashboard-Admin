<script setup>
/* global process */
import { ref } from "vue";
import { createSupabaseClient } from "../supabase";

const loading = ref(false);
const email = ref("");
const isNode = typeof process !== "undefined" && process.release && process.release.name === "node";
const ROLE_NAME = isNode ? process.env.VITE_ROLE_NAME : import.meta.env.VITE_ROLE_NAME;
const supabaseWithRole = createSupabaseClient(ROLE_NAME);

async function signInWithDiscord() {
  const { data, error } = await supabaseWithRole.auth.signInWithOAuth({
    provider: "discord",
  });
}
</script>

<template>
  <div class="container">
    <form @submit.prevent="signInWithDiscord()">
      <div>
        <div>
          <input
            type="submit"
            class="discordbutton"
            :value="loading ? 'Loading' : 'Login with Discord'"
            :disabled="loading"
          />
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
form {
  padding-top: 1em;
}
.discordbutton:hover {
  background-color: black;
  border-radius: 5px;
  cursor: pointer;
}
.discordbutton {
  background-color: #444ca3;
  border-radius: 5px;
  padding: 0.6em;
  margin-bottom: 0.9em;
  outline: 2px auto -webkit-focus-ring-color;
}
</style>
