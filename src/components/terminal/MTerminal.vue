<template>
    <div class="m-terminal">
        <div class="typed">
            <div class="line" v-for="(line, index) in terminal.lines" :key="index">
                <div class="prompt" v-if="line.type == 'prompt'">
                    <span class="success">{{ terminal.user }}@MuXeD</span>:<span class="info">{{
                            line.path
                    }}</span>$
                </div>
                <div class="texted" :class="line.color" v-html="line.text"></div>
            </div>
            <div class="line">
                <div class="prompt" v-show="!terminal.disabledInput && !terminal.disconnected">
                    <span class="success">{{ terminal.user }}@MuXeD</span>:<span class="info">{{
                            terminal.actualUrl
                    }}</span>$
                </div>
                <div class="fake_input" v-show="!terminal.disabledInput && !terminal.disconnected">
                    <span>{{ terminal.inputText }}</span>
                    <input id="inputPrompt" type="text" @input="terminal.updateText"
                        @keydown.enter="terminal.commandInput()" @keydown.tab="terminal.search"
                        @keydown.up="terminal.prevCommand($event)" @keydown.down="terminal.nextCommand($event)"
                        :value="terminal.inputText" :disabled="terminal.disabledInput" />
                </div>
            </div>
            <div class="line potentials" v-show="terminal.showPotential">
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
        <div class="overlay"></div>
    </div>
</template>

<script setup lang="ts">
import { useTerminalStore } from '@/stores/terminal';

const terminal = useTerminalStore();
</script>

<style scoped src="@/assets/scss/components/terminal.scss">
</style>