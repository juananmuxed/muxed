<template>
  <div class="m-terminal">
    <div class="typed">
      <div v-for="(line, index) in terminal.lines.value" :key="index" class="line">
        <div v-if="line.type == 'prompt'" class="prompt">
          <span class="success">{{ line.user }}@MuXeD</span>:<span class="info">{{
            line.path
          }}</span>$
        </div>
        <div class="texted" :class="line.color" v-html="line.text" />
      </div>
      <div class="line">
        <div v-show="showPrompt" class="prompt">
          <span class="success">{{ terminal.user.value }}@MuXeD</span>:<span class="info">{{
            terminal.actualUrl.value
          }}</span>$
        </div>
        <div v-show="showPrompt" class="fake_input">
          <span>{{ terminal.inputText.value }}</span>
          <!-- TODO: update the keydown event without keys (internal) -->
          <input
            id="inputPrompt" type="text" :value="terminal.inputText.value"
            :disabled="terminal.disabledInput.value" @input="terminal.updateText"
            @keydown.enter="terminal.commandInput()" @keydown.tab="terminal.search"
            @keydown.up="terminal.prevCommand($event)" @keydown.down="terminal.nextCommand($event)"
          >
        </div>
      </div>
      <div v-show="terminal.showPotential.value" class="line potentials">
        <ul v-if="hasPotentialCommands">
          <li v-for="(com, index) in terminal.potentialCommands.value" :key="index">
            {{ com.name }}
          </li>
        </ul>
        <ul v-else>
          <li>{{ $t("others.noSearchResults") }}</li>
        </ul>
      </div>
      <button v-if="terminal.disconnected.value" @click="terminal.connect">
        {{ $t('buttons.reconnectBash') }}
      </button>
      <!-- TODO: input to questions in commands -->
    </div>
    <div class="overlay" />
  </div>
</template>

<script setup lang="ts">
import { useTerminal } from 'src/composables/UseTerminal';

const terminal = useTerminal();

const hasPotentialCommands = computed(() => terminal.potentialCommands.value.length > 0);
const showPrompt = computed(() => !terminal.disabledInput.value && !terminal.disconnected.value);

async function init() {
  await terminal.welcomeLines();
  terminal.setFocus();
}

init();
</script>

<style scoped src="@/assets/scss/components/terminal.scss" />
