<script setup>
import { useGetDework } from "../composables/getdeworkexport";

const { jsonData } = await useGetDework();

console.log("jsonData.value", jsonData.value);
</script>

<template>
  <main class="main">
    <div>
      <p>Home page</p>
    </div>
  </main>
</template>

<style scoped>
.main {
  padding: 0.5rem;
}
</style>
