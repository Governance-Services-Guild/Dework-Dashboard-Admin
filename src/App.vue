<script setup>
import { RouterLink, RouterView } from "vue-router";
import NavBar from './components/NavBar.vue'
</script>

<template>
  <div>
    <div>
      <NavBar />
    </div>
    <RouterView class="main"/>
  </div>
</template>

<style scoped>
</style>
