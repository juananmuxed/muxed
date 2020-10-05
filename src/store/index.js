import Vue from 'vue'
import Vuex from 'vuex'
import commands from  './config/commands.json'
//import helps from  './config/helps.json'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    terminal: {
      disabledInput: false,
      actualpath: '~',
      inputval: {
        type: '',
        text: '',
        faketext:''
      },
      lines: [],
      commands: commands
    },
    sleep:(ms) => {return new Promise(resolve => setTimeout(resolve, ms))}
  },
  mutations: {
    addLine: (state, line) => {
      state.terminal.lines.push(line)
    },
    endCommand: (state) => {state.terminal.inputval.text = ''},
    clearTerminal: (state) => {state.terminal.lines = []},
    changePath: (state,newPath) => {
      let path = '~'
      if(newPath.param01) {
        let firstLetter = newPath.param01.substring(0,1)
        if(firstLetter == '/') {
          path = newPath.param01
        }
        else{
          path = state.terminal.actualpath + '/' + newPath.param01
        }
      }
      state.terminal.actualpath = path
    },
    changeStatePrompt: (state) => {state.terminal.disabledInput = !state.terminal.disabledInput},
    editTextLastLine: (state,newText) => {state.terminal.lines[state.terminal.lines.length-1].text = newText},
    addTextLastLine: (state,word) => {state.terminal.lines[state.terminal.lines.length-1].text += word},
    deleteTextLastLine: (state,number) => {state.terminal.lines[state.terminal.lines.length-1].text = state.terminal.lines[state.terminal.lines.length-1].text.substring(0,state.terminal.lines[state.terminal.lines.length-1].text.length - number)},
    addKeyToFake:(state) => {
      let newKey = state.terminal.inputval.faketext;
      state.terminal.inputval.faketext = ''
      state.terminal.inputval.text += newKey;
    },
    delKeyToFake:(state) => {
      state.terminal.inputval.text = state.terminal.inputval.text.substring(0,state.terminal.inputval.text.length - 1);
    },
 
  },
  actions: {
    async commandInput({state,commit,dispatch},line) {

      commit('changeStatePrompt');

      const actualPath = state.terminal.actualpath
      const command = line.text.split(' ')[0]
      const param01 = line.text.split(' ')[1]

      commit('addLine',{ line_type: 'prompt', text: line.text + '<br>', path: actualPath })
      commit('endCommand')
      
      let com = {}
      for (let x = 0; x < state.terminal.commands.length; x++) {
        if(state.terminal.commands[x].name == command) {
          com = state.terminal.commands[x]
        }
      }

      if(Object.entries(com).length === 0) {
        commit('addLine',{ line_type: 'echo', text: 'muxbash: ' + command + ' command not found', path: actualPath , color:'error-light'})
        return dispatch('finalCommand')
      }

      if((com.param1 && !param01) || param01 == 'help' || param01 == '-h' || param01 == '--help') {
        await dispatch('helpText',com.name);
        return dispatch('finalCommand')
      }

      for (let y = 0; y < com.lines.length; y++) {
        const line = com.lines[y];
        if(line.type == 'commit') {
          commit(line.function,{line_type:line.line_type,text:line.text,path:actualPath,color:line.color,param01:param01,speed:line.speed})
        }
        if(line.type == 'dispatch') {
          if(line.async) {
            await dispatch(line.function,{line_type:line.line_type,text:line.text,path:actualPath,color:line.color,param01:param01,speed:line.speed})
          }
          else {
            dispatch(line.function,{line_type:line.line_type,text:line.text,path:actualPath,color:line.color,param01:param01,speed:line.speed})
          }
        }
      }

      dispatch('finalCommand')

    },

    finalCommand({commit}) {
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
        commit('changeStatePrompt');
      }, 10);
    },

    search(e) {
      e.preventDefault();
    },
    async typetext({state,commit},params){
      let empty_line_echo = { line_type: 'echo', text: '', path: state.terminal.actualpath , color:params.color }
      commit('addLine',empty_line_echo)
      let stringArray = params.param01.split('')
      let text_line_echo = ''
      for (let x = 0; x < stringArray.length; x++) {
        text_line_echo += stringArray[x]
        empty_line_echo.text = text_line_echo
        commit('editTextLastLine',empty_line_echo.text)
        await state.sleep(params.speed)
      }
    },
    async loadingEffect({state,commit},params){
      let stringArray = params.text.split('')
      for (let y = 0; y < params.repeats; y++) {
        for (let x = 0; x < stringArray.length; x++) {
          commit('addTextLastLine',stringArray[x])
          await state.sleep(params.speed)
        }
        commit('deleteTextLastLine',stringArray.length)
        await state.sleep(params.speed)
      }
    }
  },
  modules: {
  }
})
