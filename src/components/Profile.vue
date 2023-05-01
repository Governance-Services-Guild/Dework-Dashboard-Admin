<script setup>
/* global process */
  import { onMounted, ref } from 'vue'
  import Account from './Account.vue'
  import Auth from './Auth.vue'
  import { createSupabaseClient } from '../supabase'

  const session = ref()
  const isNode = typeof process !== "undefined" && process.release && process.release.name === "node";
  const ROLE_NAME = isNode ? process.env.VITE_ROLE_NAME : import.meta.env.VITE_ROLE_NAME;
  const supabaseWithRole = createSupabaseClient(ROLE_NAME);

  onMounted(() => {
    supabaseWithRole.auth.getSession().then(({ data }) => {
      session.value = data.session
    })

    supabaseWithRole.auth.onAuthStateChange((_, _session) => {
      session.value = _session
    })
  })
</script>

<template>
  <div class="container">
    <Account v-if="session" :session="session" />
    <Auth v-else />
  </div>
</template>