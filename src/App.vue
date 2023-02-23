<script setup lang="ts">
import AssemblyInput from "./components/AssemblyInput.vue";
import { Operations } from "./assembler";
</script>

<template>
  <header>
    <h1>ELEN 122 Assembler</h1>
    <p>
      Write an assembly language program, and have it converted to a
      <code>.mem</code>
      file automatically.
    </p>
  </header>
  <br />
  <main>
    <AssemblyInput></AssemblyInput>
  </main>

  <footer>
    <p>
      <b>Supported instructions:</b>
      <br />
      <code>{{ Object.keys(Operations).join(', ') }}</code>
    </p>
  </footer>
</template>

<style scoped>
header {
  display: block;
  line-height: 1.5;
  padding-bottom: 2rem;
}

header h1 {
  font-size: 2rem;
  font-weight: 700;
}

main {
  display: block;
}

footer {
  display: block;
  line-height: 1.5;
  padding-top: 2rem;
}
</style>
