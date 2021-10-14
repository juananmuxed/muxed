import Vue from 'vue';
import Vuex from 'vuex';
import Terminal from '@/store/module/terminal';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    terminal: Terminal
  }
  // mutations: {
  //   editTextLastLine: (state,newText) => {state.terminal.lines[state.terminal.lines.length-1].text = newText},
  //   addTextLastLine: (state,word) => {state.terminal.lines[state.terminal.lines.length-1].text += word},
  //   deleteTextLastLine: (state,number) => {state.terminal.lines[state.terminal.lines.length-1].text = state.terminal.lines[state.terminal.lines.length-1].text.substring(0,state.terminal.lines[state.terminal.lines.length-1].text.length - number)},
  //   deleteLastLine:(state) => {
  //     state.terminal.lines.pop();
  //   },
  //   changeLastLineColor:(state,color) => {
  //     state.terminal.lines[state.terminal.lines.length - 1].color = color
  //   }
 
  // },
  // actions: {

  //   search(e) {
  //     e.preventDefault();
  //   },
    
  //   async typetext({state,commit},params){
  //     let empty_line_echo = { line_type: 'echo', text: '', path: state.terminal.actualpath , color:params.color }
  //     commit('addLine',empty_line_echo)
  //     let stringArray = params.param01.split('')
  //     let text_line_echo = ''
  //     for (let x = 0; x < stringArray.length; x++) {
  //       text_line_echo += stringArray[x]
  //       empty_line_echo.text = text_line_echo
  //       commit('editTextLastLine',empty_line_echo.text)
  //       await state.sleep(params.minspeed && params.maxspeed ? state.randomSpeed(params.minspeed,params.maxspeed) : params.speed)
  //     }
  //   },

  //   async loadingEffect({state,commit},params){
  //     let stringArray = params.text.split('')
  //     for (let y = 0; y < params.repeats; y++) {
  //       for (let x = 0; x < stringArray.length; x++) {
  //         commit('addTextLastLine',stringArray[x])
  //         await state.sleep(params.minspeed && params.maxspeed ? state.randomSpeed(params.minspeed,params.maxspeed) : params.speed)
  //       }
  //       commit('deleteTextLastLine',stringArray.length)
  //       await state.sleep(params.speed)
  //     }
  //   },

  //   async startingProccess({state, commit, dispatch}, params) {
  //     try {
  //       if( !params.process ) throw ('You need more pylons!');
  //       if( !params.minspeed || !params.maxspeed ) throw ('Wololo!');
  //       await dispatch('typetext',{param01:params.process + ' => Starting',speed:state.randomSpeed(params.minspeed,params.maxspeed),color:'success'})
  //       await state.sleep(120)
  //       await dispatch('loadingEffect',{text:'...',speed:200,repeats:2})
  //       await state.sleep(40)
  //       commit('deleteLastLine')
  //       commit('addLine', { line_type: 'echo', text: params.process + ' => Started<br>', path: state.terminal.actualPath, color:'info' })
  //       await state.sleep(40)
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   },

  //   async loadingProccess({state, commit, dispatch}, params) {
  //     try {
  //       if( !params.process ) throw ('You need more pylons!');
  //       if( !params.minspeed || !params.maxspeed ) throw ('Wololo!');
  //       await dispatch('typetext',{param01:params.process + ' => ',speed:params.minspeed,color:'success'})
  //       await state.sleep(120)
  //       await dispatch('loadingEffect',{text:'[■■■■■■■■■■■■■■■■■■■■■■■■■■]',minspeed:params.minspeed,maxspeed:params.maxspeed,repeats:1})
  //       await state.sleep(40)
  //       commit('addTextLastLine', "Success")
  //       commit('changeLastLineColor', 'info')
  //       await state.sleep(40)
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   },
  // },
  // modules: {
  // }
})

export default store;