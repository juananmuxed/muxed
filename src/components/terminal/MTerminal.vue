<template>
  <div class="m-terminal">
    <div class="typed">
      <div v-for="(line, index) in terminal.lines" :key="index" class="line">
        <div v-if="line.type == 'prompt'" class="prompt">
          <span class="success">{{ terminal.user }}@MuXeD</span>:<span class="info">{{
            line.path
          }}</span>$
        </div>
        <div class="texted" :class="line.color" v-html="line.text" />
      </div>
      <div class="line">
        <div v-show="!terminal.disabledInput && !terminal.disconnected" class="prompt">
          <span class="success">{{ terminal.user }}@MuXeD</span>:<span class="info">{{
            terminal.actualUrl
          }}</span>$
        </div>
        <div v-show="!terminal.disabledInput && !terminal.disconnected" class="fake_input">
          <span>{{ terminal.inputText }}</span>
          <!-- TODO: update the keydown event without keys (internal) -->
          <input
            id="inputPrompt" type="text" :value="terminal.inputText"
            :disabled="terminal.disabledInput" @input="terminal.updateText"
            @keydown.enter="terminal.commandInput()" @keydown.tab="terminal.search"
            @keydown.up="terminal.prevCommand($event)" @keydown.down="terminal.nextCommand($event)"
          >
        </div>
      </div>
      <div v-show="terminal.showPotential" class="line potentials">
        <ul v-if="terminal.potentialCommands.length > 0">
          <li v-for="(com, index) in terminal.potentialCommands" :key="index">
            {{ com.name }}
          </li>
        </ul>
        <ul v-else>
          <li>{{ $t("no-search-results") }}</li>
        </ul>
      </div>
      <!-- TODO: button to reconnect -->
      <!-- TODO: input to questions in commands -->
    </div>
    <div class="overlay" />
  </div>
</template>

<script setup lang="ts">
import { useTerminal } from 'src/composables/Terminals';

const terminal = useTerminal();
</script>

<style scoped src="@/assets/scss/components/terminal.scss">
</style>
