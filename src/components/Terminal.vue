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
                <input type="text" @keyup="addKeyToFake()" @keydown.delete="delKeyToFake()" @keyup.enter="commandInput(terminal.inputval)" @keydown.tab="search($event)" v-model="terminal.inputval.faketext" :disabled="terminal.disabledInput">
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
        await this.typetext({param01:'Starting server',speed:30,color:'info'})
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
@import './../assets/fonts/fonts.scss';
@import './../assets/scss/variables.scss';
@import './../assets/scss/keyframes.scss';

.terminal{
    display: block;
    color:$color_text;
    width: 100%;
    font-family: IBMVBA8 , monospace;
    font-size: 25px;
    min-height: 100%;
    .prompt {
        width: auto;
        margin-right: .4em;
        float: left;
    }
    .typed {
        padding: .8em;
    }
    .overlay {
        background-color:$color_bg;
        position:fixed;
        width:100%;
        height:100%;
        top:0px;
        left:0px;
        z-index:-10;
        transition: $effect_background_color;
        -o-transition: $effect_background_color;
        -moz-transition: $effect_background_color;
        -webkit-transition: $effect_background_color;
    }
    &:focus-within > .overlay{
        background-color: $color_bg_light;
    }
    .line{
        width: 100%;
        .texted{
            word-break: break-all;
        }
        .fakeinput {
            word-break: break-all;
            float: left;
            &:after {
                content: "";
                display: inline-block;
                width: .5em;
                background-color: #cccccc;
                height: 1.4rem;
                vertical-align: text-top;
                margin-left: .2em;
            }
        }
    }
    &:focus-within .fakeinput:after{
        animation: blinkerMadaFaka 1.2s linear infinite;
        -webkit-animation: blinkerMadaFaka 1.2s linear infinite;
        width: .2em!important;
    }
    div,span {
        &.info{
            color:$color_info!important
        }
        &.success{
            color:$color_success!important
        }
        &.error{
            color:$color_error!important
        }
        &.error-light{
            color:$color_error_light!important
        }
    }
    input{
        width: auto;
        background: transparent;
        color: transparent;
        border: 0;
        padding: 0;
        display: block;
        float: left;
        font-family: IBMVBA8 , monospace;
        font-size: 25px;
        &:focus{
            outline: none;
        }
    }
}
</style>