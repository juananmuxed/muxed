<template>
    <div class="color_chosed terminal">
        <div class="typed">
            <div class="line" v-for="(line,index) in terminal.lines" v-bind:key="index">
                <div class="prompt" v-if="line.line_type == 'prompt'">
                    <span class="success">guest@MuXeD</span>:<span class="info">{{ line.path }}</span>$
                </div>
                <div class="texted" v-bind:class="line.color" v-html="line.text"></div>
            </div>
            <div class="line">
                <div class="prompt" v-if="!terminal.disabledInput">
                    <span class="success">guest@MuXeD</span>:<span class="info">{{ terminal.actualpath }}</span>$
                </div>
                <div class="fakeinput" v-html="terminal.inputval.text" v-show="!terminal.disabledInput"></div>
                <input id="inputPrompt" type="text" @keyup="addKeyToFake()" @keydown.delete="delKeyToFake()" @keyup.enter="commandInput(terminal.inputval)" @keydown.tab="search($event)" v-model="terminal.inputval.faketext" :disabled="terminal.disabledInput">
            </div>
        </div>
        <div class="overlay"></div>
    </div>
</template>

<script>
import { mapActions , mapState, mapMutations } from 'vuex'

export default {
    async created() {
        this.terminal.lines = []
        this.changeStatePrompt()
        await this.typetext({param01:"== Primary Events ==",speed:30,color:'success'})
        await this.typetext({param01:"<br>",speed:0,color: 'info'})
        await this.startingProccess({process: 'Demonology', minspeed: 25, maxspeed: 50})
        await this.startingProccess({process: 'H4CK1NG', minspeed: 20, maxspeed: 30})
        await this.typetext({param01:"<br>",speed:0,color: 'info'})
        await this.typetext({param01:"== Secondary Events ==",speed:30,color:'success'})
        await this.typetext({param01:"<br>",speed:0,color: 'info'})
        await this.sleep(60)
        await this.loadingProccess({process: 'Meditation', minspeed: 30, maxspeed: 400})
        await this.loadingProccess({process: 'Tyrany', minspeed: 30, maxspeed: 400})
        await this.typetext({param01:"<br>",speed:0,color: 'info'})
        await this.typetext({param01:"========================",speed:10,color: 'info'})
        await this.typetext({param01:"== Welcome to the web ==",speed:10,color: 'info'})
        await this.typetext({param01:"========================",speed:10,color: 'info'})
        await this.typetext({param01:"<br>",speed:0,color: 'info'})
        this.changeStatePrompt()  
    },
    computed: {
        ...mapState(['terminal','sleep'])
    },
    methods: {
        ...mapActions(['commandInput','search','typetext','startingProccess','loadingProccess']),
        ...mapMutations(['changeStatePrompt','addKeyToFake','delKeyToFake'])
    },
}
</script>

<style lang="scss" scoped>
@import './../assets/terminal.scss';
</style>