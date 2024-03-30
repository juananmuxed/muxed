/* eslint-disable no-await-in-loop */
/* eslint-disable no-use-before-define */
import { ref } from 'vue';

import type { PromptLine } from '../types/PromptLine';

import { randomSpeed } from '../utils/Randomize';
import { controllerLog } from '../utils/Logger';
import { sleep } from '../utils/Await';
import { clearOption } from '../utils/Option';
import { deleteLS, getLS, setLS } from 'src/utils/Storage';
import { LOCAL_STORAGE } from 'src/constants/Keys';
import { APP_CONST } from 'src/constants/App';
import { FileType, TerminalFile } from 'src/types/Files';
import { FILE_FOLDERS } from './config/FileFolders';
import { COMMANDS } from './config/Commands';
import { Command } from 'src/types/Commands';

export const useTerminal = () => {
  const homeFolder = FILE_FOLDERS.find((value) => value.id === 0);
  const commandsStored = getLS(LOCAL_STORAGE.COMMANDS);
  const userStored = getLS(LOCAL_STORAGE.TERMINAL_USER);

  const lastCommands = ref(commandsStored ? JSON.parse(commandsStored) : []);
  const user = ref(userStored || 'guest');

  const disabledInput = ref(false);
  const actualUrl = ref(homeFolder?.name || '');
  const inputText = ref('');
  const showPotential = ref(false);
  const actualIndex = ref(-1);
  const temporalInputText = ref('');
  const disconnected = ref(false);

  watch(user, (newUser) => {
    if (!newUser) deleteLS(LOCAL_STORAGE.TERMINAL_USER);
    else setLS(LOCAL_STORAGE.TERMINAL_USER, newUser);
  });

  watch(lastCommands, (commands) => {
    setLS(LOCAL_STORAGE.COMMANDS, JSON.stringify(commands));
  }, { deep: true });

  const actualFolder = ref<TerminalFile | undefined>(homeFolder);
  const tempFolder = ref<TerminalFile | undefined>(homeFolder);

  const lines = ref<PromptLine[]>([]);
  const commands = ref<Command[]>(COMMANDS);

  const folders = ref<TerminalFile[]>(getFilesByTypes('D'));
  const files = ref<TerminalFile[]>(getFilesByTypes('F'));

  const potentialCommands = ref<Command[]>([]);

  function getFilesByTypes(type: FileType) {
    return FILE_FOLDERS.filter((value) => value.type === type);
  }

  function addLine(line: PromptLine) {
    lines.value.push(line);
  }

  function endCommand() {
    inputText.value = '';
  }

  function clearTerminal() {
    lines.value = [];
  }

  function setLastCommands(newCommands: string[]) {
    lastCommands.value = newCommands;
  }

  function addTextLastLine(string: string) {
    lines.value[lines.value.length - 1].text += string;
  }

  function changeLastLineColor(color: string) {
    lines.value[lines.value.length - 1].color = color;
  }

  function deleteLastLine() {
    lines.value.pop();
  }

  function changeStatePrompt() {
    disabledInput.value = !disabledInput.value;
  }

  function setFolder(folder?: TerminalFile) {
    actualFolder.value = folder;
  }

  function setActualUrl(url?: string) {
    actualUrl.value = url || homeFolder?.name || '';
  }

  function getTempFolderById(id: number | null) {
    [tempFolder.value] = folders.value.filter(
      (folder) => folder.id === id,
    );
  }

  function setInputText(value: string) {
    inputText.value = value;
  }

  function setTemporalInputText(value: string) {
    temporalInputText.value = value;
  }

  function initialActualIndex() {
    actualIndex.value = -1;
  }

  function setActualIndex(value: number) {
    actualIndex.value = value;
  }

  function changePotentialState(value: boolean = true) {
    showPotential.value = value;
  }

  function clearPotentialCommands() {
    potentialCommands.value = [];
  }

  function disconnectPrompt() {
    disconnected.value = true;
    user.value = 'guest';
  }

  function connectPrompt() {
    disconnected.value = false;
  }

  function updateText(inputEvent: Event) {
    const event = inputEvent as InputEvent;
    if (event.data == null) {
      setInputText(inputText.value.slice(0, -1));
    } else {
      setInputText(
        inputText.value
          + (event.target as HTMLInputElement).value[
            (event.target as HTMLInputElement).value.length - 1
          ],
      );
    }
  }

  function setFolderById(id: number = 0) {
    setFolder(folders.value.filter((value) => value.id === id)[0]);
  }

  function setActualPathUrl() {
    let url = actualFolder.value?.name;
    let parent = actualFolder.value?.parent;
    while (parent || parent === 0) {
      const parentFolder = folders.value.find(
        // eslint-disable-next-line no-loop-func
        (value) => value.id === parent,
      );
      parent = parentFolder?.parent;
      url = `${parentFolder?.name}/${url}`;
    }
    setActualUrl(url);
    setActualPathTitle(url);
  }

  function setActualPathTitle(url?: string) {
    document.title = `${user.value}@MuXeD:${url || homeFolder?.name}`;
  }

  async function commandInput() {
    try {
      changeStatePrompt();
      changePotentialState(false);

      const command: string = inputText.value.split(' ')[0];
      const params = inputText.value
        .substring(command.length + 1)
        .split(' ')
        .filter((value) => value !== '');

      if (command !== '') saveCommand();
      initialActualIndex();

      freezeLine();

      const existCommand = commands.value.find((_command) => _command.name === command);

      if (!existCommand) {
        controllerLog('The resistance is futile', 'warning');
        createErrorLine(`bash: ${command} command not found`);
        return finalCommand();
      }

      for (let index = 0; index < existCommand.executionsLines.length; index++) {
        const line = existCommand.executionsLines[index];
        if (!executableFunctions[line.function]) {
          controllerLog(
            'Command not added to executableFunctions Object.',
            'error',
          );
          return finalCommand();
        }
        if (line.async) {
          await executableFunctions[line.function](params);
        } else {
          executableFunctions[line.function](params);
        }
      }
      return finalCommand();
    } catch (error) {
      controllerLog(`Error: ${error}`, 'error');
      return () => setTimeout(() => {}, 1);
    }
  }

  function saveCommand() {
    lastCommands.value.push(inputText.value);

    if (lastCommands.value.length > APP_CONST.COMMANDS_MAX_LINES + 1) {
      lastCommands.value.shift();
    }
  }

  function prevCommand(event: KeyboardEvent) {
    if (
      actualIndex.value < 0
      || actualIndex.value === lastCommands.value.length
    ) {
      setTemporalInputText(inputText.value);
      setActualIndex(lastCommands.value.length);
    }
    setActualIndex(actualIndex.value - 1);
    if (actualIndex.value < 0) setActualIndex(0);
    setInputText(lastCommands.value[actualIndex.value]);
    event.preventDefault();
  }

  function nextCommand(event: KeyboardEvent) {
    setActualIndex(actualIndex.value + 1);
    if (actualIndex.value >= lastCommands.value.length) {
      if (actualIndex.value === lastCommands.value.length) setInputText(temporalInputText.value);
      setActualIndex(lastCommands.value.length);
    } else {
      setInputText(lastCommands.value[actualIndex.value]);
    }
    event.preventDefault();
  }

  function changePathByName(params: (string | undefined)[]) {
    const [firstParam] = params;
    if (firstParam) {
      if (firstParam === '.') {
        return;
      }
      let [folderName] = params;
      if (firstParam === '..' || firstParam === '/') {
        if (!actualFolder.value?.parent) {
          createErrorLine(
            'You have no permission to this folder',
          );
          return;
        }
        getTempFolderById(actualFolder.value.parent);
        folderName = tempFolder.value?.name || homeFolder?.name;
      }
      const folderValid = folders.value.find(
        (folder) => folder.name === folderName,
      );
      if (folderValid) {
        setFolder(folderValid);
        setActualPathUrl();
      } else {
        createErrorLine(
          `This folder not contain ${folderName} folder`,
        );
      }
    } else {
      const folderValid = folders.value.find(
        (folder) => folder.name === '~',
      );
      setFolder(folderValid);
      setActualPathUrl();
    }
  }

  function search(inputEvent: Event) {
    const event = inputEvent as InputEvent;
    event.preventDefault();
    checkPotentialCommands((event.target as HTMLInputElement).value);
    // TODO: check if commands is a special commands like "cd"
    // if (event.target.value.toLowerCase().startsWith("cd") && potentialCommands.length == 1)
  }

  function checkPotentialCommands(value: string) {
    clearPotentialCommands();
    commands.value.forEach((com) => {
      if (
        com.name.toLowerCase().startsWith(value.toLowerCase())
        && com.name !== ''
      ) {
        potentialCommands.value.push(com);
      }
    });
    if (potentialCommands.value.length > 1) {
      changePotentialState();
    } else if (potentialCommands.value.length === 1) {
      changePotentialState(false);
      setInputText(`${potentialCommands.value[0].name} `);
    } else {
      changePotentialState();
    }
  }

  async function typeText(params: string[]): Promise<void> {
    try {
      let _params = params;
      const colorOption = clearOption(params, 'c');
      const color = colorOption.value !== '' ? colorOption.value : 'info';
      _params = colorOption.params;
      const speedOption = clearOption(params, 's');
      const speed = speedOption.value !== '' ? speedOption.value : 0;
      _params = speedOption.params;
      if (params.length > 0) {
        createEmptyLine();
        changeLastLineColor(color);
        const stringType = params.join(' ');
        for (let i = 0; i < stringType.length; i++) {
          addTextLastLine(stringType[i]);
          await sleep(randomSpeed(Number(speed), Number(speed) + 60));
        }
      } else {
        createErrorLine('Add a text to type');
      }
    } catch (error) {
      controllerLog(`Error: ${error}`, 'error');
    }
  }

  function createErrorLine(text: string) {
    const errorLine: PromptLine = {
      type: 'echo',
      text,
      path: actualUrl.value,
      color: 'error-light',
    };
    addLine(errorLine);
  }

  function createEmptyLine() {
    const emptyLine: PromptLine = {
      type: 'echo',
      text: '',
      path: actualUrl.value,
    };
    addLine(emptyLine);
  }

  function freezeLine() {
    const line: PromptLine = {
      type: 'prompt',
      text: `${inputText.value}<br>`,
      path: actualUrl.value,
    };
    addLine(line);
    endCommand();
  }

  function finalCommand() {
    setTimeout(() => {
      window.scrollTo(
        0,
        document.body.scrollHeight
          || document.documentElement.scrollHeight,
      );
      changeStatePrompt();
      setTimeout(() => {
        setFocus();
      }, 10);
    }, 10);
  }

  function setFocus() {
    document.getElementById('inputPrompt')?.focus();
  }

  async function exit(): Promise<void> {
    const line: PromptLine = {
      type: 'info',
      text: 'Connection to muxed.dev closed.',
      path: actualUrl.value,
      color: 'info',
    };
    const lineLogout: PromptLine = {
      type: 'info',
      text: 'logout',
      path: actualUrl.value,
      color: 'info',
    };
    try {
      disconnectPrompt();
      addLine(lineLogout);
      await sleep(800);
      addLine(line);
    } catch (error) {
      controllerLog(`Error: ${error}`, 'error');
    }
  }

  function changeUserName() {
    // TODO: make su
  }

  function showFilesAndFolders() {
    // TODO: make ls
  }

  function getActualUser() {
    // TODO: make whoami
  }

  function executeFile() {
    // TODO: make sh and bash
  }

  const executableFunctions: { [key: string]: (params: string[])=> Promise<void> | void } = {
    clearTerminal,
    changePathByName,
    typeText,
    exit,
    // changeUserName: changeUserName,
    // showFilesAndFolders: showFilesAndFolders,
    // getActualUser: getActualUser,
    // executeFile: executeFile,
  };

  return {
    disabledInput,
    actualFolder,
    actualUrl,
    tempFolder,
    inputText,
    user,
    lines,
    commands,
    folders,
    files,
    showPotential,
    potentialCommands,
    lastCommands,
    actualIndex,
    temporalInputText,
    disconnected,
    commandInput,
    updateText,
    search,
    prevCommand,
    nextCommand,
  };
};
