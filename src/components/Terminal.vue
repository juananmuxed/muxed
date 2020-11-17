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
        await this.typetext({param01:"Starting proccess",speed:30,color:'info'})
        await this.sleep(120)
        await this.typetext({param01:"Meditating",speed:35,color:'success'})
        await this.sleep(120)
        await this.loadingEffect({text:'...',speed:200,repeats:2})
        await this.sleep(40)
        await this.typetext({param01:"Starting servers",speed:35,color:'info'})
        await this.sleep(120)
        await this.loadingEffect({text:'...',speed:200,repeats:2})
        await this.sleep(40)
        this.changeStatePrompt()  
    },
    computed: {
        ...mapState(['terminal','sleep'])
    },
    methods: {
        ...mapActions(['commandInput','search','typetext','loadingEffect']),
        ...mapMutations(['changeStatePrompt','addKeyToFake','delKeyToFake'])
    },
}
</script>

<style lang="scss" scoped>
@import './../assets/terminal.scss';
</style>