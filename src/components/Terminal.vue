<template>
  <div class="color_chosen terminal">
    <div class="typed">
      <div class="line" v-for="(line, index) in terminal.lines" :key="index">
        <div class="prompt" v-if="line.type == 'prompt'">
          <span class="success">{{ terminal.user }}@MuXeD</span>:<span class="info">{{
            line.path
          }}</span
          >$
        </div>
        <div class="texted" :class="line.color" v-html="line.text"></div>
      </div>
      <div class="line">
        <div class="prompt" v-show="!terminal.disabledInput">
          <span class="success">{{ terminal.user }}@MuXeD</span>:<span class="info">{{
            terminal.actualUrl
          }}</span
          >$
        </div>
        <div class="fake_input" v-show="!terminal.disabledInput">
          <span>{{ terminal.inputText }}</span>
          <input
            id="inputPrompt"
            type="text"
            @input="terminal.updateText"
            @keyup.enter="terminal.commandInput()"
            @keydown.tab="terminal.search($event)"
            @keyup.up="terminal.prevCommand()"
            @keyup.down="terminal.nextCommand()"
            :value="terminal.inputText"
            :disabled="terminal.disabledInput"
          />
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
    </div>
    <div class="overlay"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import TerminalModule from "@/store/module/terminal";
import * as Cookies from "@/utils/cookies";
import { Constants } from "@/store/config/constants";

@Component
export default class Terminal extends Vue {
  public terminal = getModule(TerminalModule, this.$store);

  created() {
    const commandsCookie = Cookies.getCookie(
      `${Constants.COOKIE_NAME}_${Constants.COOKIE_NAME_COMMANDS}`
    );
    const parsedCommands =
      commandsCookie != null && typeof commandsCookie == "string"
        ? JSON.parse(commandsCookie)
        : [];
    this.terminal.setLastCommands(parsedCommands);
  }
}
// export default {
//     async created() {
//         this.terminal.lines = []
//         this.changeStatePrompt()
//         await this.typetext({param01:"== Primary Events ==",speed:30,color:'success'})
//         await this.typetext({param01:"<br>",speed:0,color: 'info'})
//         await this.startingProccess({process: 'Demonology', minspeed: 25, maxspeed: 50})
//         await this.startingProccess({process: 'H4CK1NG', minspeed: 20, maxspeed: 30})
//         await this.startingProccess({process: 'Condemor de la Pradera', minspeed: 20, maxspeed: 30})
//         await this.typetext({param01:"<br>",speed:0,color: 'info'})
//         await this.typetext({param01:"== Secondary Events ==",speed:30,color:'success'})
//         await this.typetext({param01:"<br>",speed:0,color: 'info'})
//         await this.sleep(60)
//         await this.loadingProccess({process: 'Meditation', minspeed: 30, maxspeed: 400})
//         await this.loadingProccess({process: 'Tyrany', minspeed: 30, maxspeed: 400})
//         await this.typetext({param01:"<br>",speed:0,color: 'info'})
//         await this.typetext({param01:"========================",speed:10,color: 'info'})
//         await this.typetext({param01:"== Welcome to the web ==",speed:10,color: 'info'})
//         await this.typetext({param01:"========================",speed:10,color: 'info'})
//         await this.typetext({param01:"<br>",speed:0,color: 'info'})
//         this.changeStatePrompt()
//     },
//     computed: {
//         ...mapState(['terminal','sleep'])
//     },
//     methods: {
//         ...mapActions(['commandInput','search','typetext','startingProccess','loadingProccess']),
//         ...mapMutations(['changeStatePrompt'])
//     },
// }
</script>

<style lang="scss" scoped>
@import "./../assets/terminal.scss";
</style>
