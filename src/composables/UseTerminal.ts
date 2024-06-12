/* eslint-disable no-await-in-loop */
/* eslint-disable no-use-before-define */
import { ref } from 'vue';

import type { PromptColor, PromptLine, PromptLineFixed } from '../types/PromptLine';

import { randomSpeed } from '../utils/Randomize';
import { controllerLog } from '../utils/Logger';
import { emptyPromise, sleep } from '../utils/Await';
import { TerminalOptions } from '../utils/Option';
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
  const showPotentialFolders = ref(false);
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

  const lines = ref<PromptLineFixed[]>([]);
  const commands = ref<Command[]>(COMMANDS);

  const folders = ref<TerminalFile[]>(getFilesByTypes('D'));
  const files = ref<TerminalFile[]>(getFilesByTypes('F'));

  const potentialCommands = ref<Command[]>([]);
  const potentialFolders = ref<TerminalFile[]>([]);

  const command = computed(() => inputText.value.split(' ')[0]);
  const commandOptions = computed(() => inputText.value
    .substring(command.value.length + 1)
    .split(' ')
    .filter((value) => value !== ''));
  const commandHasFileSearch = computed(() => commands.value
    .some((_command) => _command.name === command.value && _command.searchFiles));
  const hasOptions = computed(() => commandOptions.value.length > 0);

  function getFilesByTypes(type: FileType) {
    return FILE_FOLDERS.filter((value) => value.type === type);
  }

  function addLine(line: PromptLine) {
    lines.value.push({ ...line, user: user.value });
  }

  function endCommand() {
    inputText.value = '';
  }

  function clearTerminal() {
    lines.value = [];
  }

  function addTextLastLine(string: string) {
    lines.value[lines.value.length - 1].text += string;
  }

  function changeLastLineColor(color: PromptColor) {
    lines.value[lines.value.length - 1].color = color;
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

  function getTempFolderById(id?: number) {
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

  function changePotentialFolderState(value: boolean = true) {
    showPotentialFolders.value = value;
  }

  function clearPotentialCommands() {
    potentialCommands.value = [];
  }

  function clearPotentialFolders() {
    potentialFolders.value = [];
  }

  function disconnectPrompt() {
    disconnected.value = true;
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

  function getChildFoldersFiles(id: number = 0) {
    return FILE_FOLDERS.filter((folder) => folder.parent === id);
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
      changePotentialFolderState(false);

      const existCommand = commands.value.find((_command) => _command.name === command.value);

      if (command.value !== '') saveCommand();
      initialActualIndex();
      freezeLine();

      if (!existCommand) {
        controllerLog('The resistance is futile', 'warning');
        createErrorLine(`bash: ${command.value} command not found`);
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
          await executableFunctions[line.function]();
        } else {
          executableFunctions[line.function]();
        }
      }
      return finalCommand();
    } catch (error) {
      controllerLog(`Error: ${error}`, 'error');
      return emptyPromise;
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

  function changePathByName() {
    const [firstParam] = commandOptions.value;
    if (firstParam) {
      if (firstParam === '.') {
        return;
      }

      const [commandOption] = commandOptions.value;
      const foldersNames = commandOption.split('/').filter((_command) => _command !== '');
      let folderName = foldersNames[foldersNames.length - 1];

      if (firstParam === '..' || firstParam === '/') {
        if (actualFolder.value?.parent === undefined) {
          createErrorLine(
            'You have no permission to this folder',
          );
          return;
        }
        getTempFolderById(actualFolder.value?.parent);
        folderName = tempFolder.value?.name || homeFolder?.name || '';
      }

      const folderValid = folders.value.find(
        (folder) => folder.name === folderName.replace(/\/$/, ''),
      );

      if (folderValid) {
        setFolder(folderValid);
        setActualPathUrl();
      } else {
        createErrorLine(
          `This folder not contain '${folderName}' folder`,
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

    if (!hasOptions.value) {
      checkPotentialCommands();
      return;
    }
    if (commandHasFileSearch.value) {
      checkPotentialFolders();
    }
  }

  function setLastCommand() {
    if (potentialCommands.value.length === 0) {
      const commandComplete = commands.value.find((_command) => _command.name === command.value);
      commandComplete && potentialCommands.value.push(commandComplete);
    }
  }

  function checkPotentialFolders() {
    clearPotentialFolders();
    setLastCommand();

    // TODO: use temporal path
    potentialFolders.value = getChildFoldersFiles(actualFolder.value?.id)
      .filter((folder) => folder.name.toLowerCase()
        .startsWith(commandOptions.value[0].toLowerCase())
        && folder.name !== '');

    if (potentialFolders.value.length === 1) {
      changePotentialFolderState(false);
      setInputText(`${potentialCommands.value[0].name} ${potentialFolders.value[0].name}/`);
      clearPotentialFolders();
    } else {
      changePotentialFolderState();
    }
  }

  function checkPotentialCommands() {
    clearPotentialCommands();

    potentialCommands.value = commands.value.filter((com) => com.name.toLowerCase()
      .startsWith(command.value.toLowerCase())
        && com.name !== '');

    if (potentialCommands.value.length === 1) {
      changePotentialState(false);
      setInputText(`${potentialCommands.value[0].name} `);
      clearPotentialCommands();
    } else {
      changePotentialState();
    }
  }

  async function typeText() {
    try {
      const options = new TerminalOptions(commandOptions.value);
      const colorOption = options.getOption('c', true);
      const speedOption = options.getOption('s', true);
      if (commandOptions.value.length > 0) {
        createEmptyLine();
        changeLastLineColor((colorOption?.value || 'info') as PromptColor);
        const stringType = options.getParamsWithoutOptions().join(' ');
        for (let i = 0; i < stringType.length; i++) {
          addTextLastLine(stringType[i]);
          await sleep(randomSpeed(Number(speedOption?.value || 0), Number(speedOption?.value || 0) + 60));
        }
      } else {
        createErrorLine('Add a text to type');
      }
    } catch (error) {
      controllerLog(`Error: ${error}`, 'error');
    }
  }

  function createErrorLine(text: string) {
    addLine({
      type: 'echo',
      text,
      path: actualUrl.value,
      color: 'error-light',
    });
  }

  function createEmptyLine() {
    addLine({
      type: 'echo',
      text: '',
      path: actualUrl.value,
    });
  }

  function freezeLine() {
    addLine({
      type: 'prompt',
      text: `${inputText.value}<br>`,
      path: actualUrl.value,
    });
  }

  function finalCommand() {
    setTimeout(() => {
      window.scrollTo(
        0,
        document.body.scrollHeight
          || document.documentElement.scrollHeight,
      );
      endCommand();
      changeStatePrompt();
      setTimeout(() => {
        setFocus();
      }, 10);
    }, 10);
  }

  function setFocus() {
    document.getElementById('inputPrompt')?.focus();
  }

  async function exit() {
    try {
      addLine({
        type: 'info',
        text: 'logout',
        path: actualUrl.value,
        color: 'info',
      });
      await sleep(800);
      addLine({
        type: 'info',
        text: 'Connection to muxed.dev closed.',
        path: actualUrl.value,
        color: 'info',
      });
      disconnectPrompt();
    } catch (error) {
      controllerLog(`Error: ${error}`, 'error');
    }
  }

  async function connect() {
    user.value = 'guest';
    connectPrompt();
    await welcomeLines();

    await sleep(10);
    setFocus();
  }

  async function welcomeLines() {
    changeStatePrompt();
    addLine({
      type: 'info',
      text: 'Connecting...',
      color: 'error',
    });
    await sleep(1400);
    addLine({
      type: 'info',
      text: 'Welcome to muxed.dev',
      color: 'info',
    });
    addLine({
      type: 'info',
      text: `User: ${user.value}`,
      color: 'success',
    });
    changeStatePrompt();
  }

  function changeUserName() {
    const [firstParam] = commandOptions.value;
    if (!firstParam) {
      createErrorLine('Using \'su\' command add param user \'su user\'');
    } else {
      user.value = firstParam;
    }
    setActualPathUrl();
  }

  function showFilesAndFolders() {
    changeStatePrompt();
    const options = new TerminalOptions(commandOptions.value);
    const childFiles = getChildFoldersFiles(actualFolder.value?.id);
    const allFiles = options.getOption('a');
    const complex = options.getOption('l');
    if (allFiles) {
      addLine({
        type: 'info',
        text: !complex ? './' : 'drwxr-xr-- MuXeD 4096 Apr 28 ./',
        color: 'info',
      });
      addLine({
        type: 'info',
        text: !complex ? '../' : 'drwxr-xr-- MuXeD 4096 Apr 28 ../',
        color: 'info',
      });
    }
    childFiles.forEach((file) => {
      const completeName = file.type === 'D' ? `${file.name}/` : `${file.name}.${file.extension}`;
      const isDirectory = file.type === 'D' ? 'd' : '-';
      const permits = isDirectory + file.permits.join('');
      const date = `${file.creationDate.toLocaleString('en', { month: 'short' })} ${file.creationDate.getDate()}`;
      const text = `${permits} ${file.owner} ${file.size} ${date} ${completeName}`;
      addLine({
        type: 'info',
        text: !complex ? completeName : text,
        color: file.type === 'D' ? 'info' : 'success',
      });
    });
    changeStatePrompt();
  }

  function getActualUser() {
    changeStatePrompt();
    addLine({
      type: 'info',
      text: user.value,
      color: 'success',
    });
    finalCommand();
  }

  function executeFile() {
    // TODO: make sh and bash
  }

  const executableFunctions = {
    clearTerminal,
    changePathByName,
    typeText,
    exit,
    changeUserName,
    showFilesAndFolders,
    getActualUser,
    executeFile,
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
    showPotentialFolders,
    potentialCommands,
    potentialFolders,
    lastCommands,
    actualIndex,
    temporalInputText,
    disconnected,
    executableFunctions,
    welcomeLines,
    setFocus,
    commandInput,
    connect,
    updateText,
    search,
    prevCommand,
    nextCommand,
  };
};
