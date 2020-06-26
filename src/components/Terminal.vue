<template>
    <div class="color_chosed terminal">
        <div class="typed">
            <div class="line" v-for="(line,index) in lines" v-bind:key="index">
                <div class="prompt" v-if="line.type == 'prompt'">></div>
                <div class="texted">{{ line.text }}</div>
            </div>
            <div class="prompt">></div><input type="text" @keyup.enter="newLine(inputval)" @keydown.tab="search($event)" v-model="inputval.text" :disabled="disabledInput">
        </div>
        <div class="overlay"></div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            disabledInput:false,
            inputval:{
                type:'',
                text:''
            },
            lines:[
                {type:'system',text:'Command'},
                {type:'prompt',text:'Other'},
                {type:'echo',text:'Another'},
                {type:'error',text:'Error'}
            ]
        }
    },
    methods: {
        newLine(val) {
            if(val.text === '') {return}
            if(val.text === 'clear') {
                this.lines = []
            }
            else {
                let value = {type:'prompt', text:val.text}
                this.lines.push(value)
            }

            this.inputval.text = ''
            setTimeout(() => {
                window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
            }, 10);
        },
        search(e) {
            e.preventDefault();
        }
    },
}
</script>

<style lang="scss" scoped>
@import './../assets/fonts/fonts.scss';

.terminal{
    display: block;
    color:#2c852c;
    width: 100%;
    font-family: IBMVBA8 , monospace;
    font-size: 25px;
    min-height: 100%;
    & .prompt {
        width: auto;
        margin-right: .2em;
        float: left;
    }
    & .typed {
        padding: .8em;
    }
    & .overlay {
        background-color:#181818;
        position:fixed;
        width:100%;
        height:100%;
        top:0px;
        left:0px;
        z-index:-10;
    }
    &:focus-within > .overlay{
        background-color: #232323;
    }
    & .line{
        width: 90%;
    }
    & input{
        width: 90%;
        background: transparent;
        color: #43d443;
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