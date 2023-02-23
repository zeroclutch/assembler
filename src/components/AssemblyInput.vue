<!-- eslint-disable prettier/prettier -->
<script lang="ts">
import { computed, ref } from "vue";
import { assemble } from "../assembler";

const INITIAL_CODE = `add r0 r1 r2; // r0 = r1 + r2`

export default {
  setup() {
    const assemblyInput = ref(INITIAL_CODE);

    const assembledCode = computed(() => {
      let result: string;
      try {
        result = assemble(assemblyInput.value)
      } catch (e: any) {
        return [e.message ?? 'Unknown error', true];
      }
      return [result, false];
    });

    const lastAssembledCode = ref(assembledCode.value[0]);

    const currentAssembledCode = ref(() => {
      if(!assembledCode.value[1]) {
        lastAssembledCode.value = assembledCode.value[0];
        return assembledCode.value[0];
      }
      else return lastAssembledCode.value;
    });

    return {
      assemblyInput,
      assembledCode,
      currentAssembledCode,
      lastAssembledCode,
    };
  },

  methods: {
    copy() {
      if(!navigator.clipboard) return;
      let el = document.querySelector(".assembly-output")
      if(!el) return;
      navigator.clipboard.writeText(el.textContent ?? '');
    },
  },
};
</script>

<template>
  <div class="columns">
    <div class="column">
      <h6>CODE</h6>
      <textarea
        placeholder="Write your assembly code here..."
        name="assembly-input"
        class="assembly-input"
        v-model="assemblyInput"
      ></textarea>
    </div>
    <div class="column">
      <h6>INSTRUCTIONS.MEM <a @click="copy()">COPY</a></h6>
      <code class="assembly-output" v-html="currentAssembledCode()"></code>
      <aside
        class="error-message"
        :class="{ errored: assembledCode[1] }"
        v-if="assembledCode[1]"
      >
        {{ assembledCode[0] }}
      </aside>
    </div>
  </div>
</template>

<style scoped>
.columns {
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr;
}

.column {
  display: block;
}

.assembly-input {
  width: 100%;
  height: 400px;
  color: var(--color-text);
  resize: none;
  border: none;
  outline: none;
  padding: 1rem;
  font-family: monospace;
  font-size: 1rem;
  line-height: 1.5;
  background-color: var(--color-background-soft);
}

h6 {
  color: #555558;
  font-weight: bold;
  padding: 0.5rem 1rem;
}

.errored {
  color: red;
}

.assembly-output {
  display: block;
  padding: 1rem;
  max-height: 400px;
  overflow: scroll;
}

.error-message {
  padding-left: 1rem;
}

a {
  cursor: pointer;
}
</style>
