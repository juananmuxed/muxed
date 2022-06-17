import { randomSpeed } from "./../utils/random";
import { controllerLog } from "./../utils/logs";
import { sleep } from "./../utils/asyncFunctions";
import { clearOption } from "./../utils/options";
import { getLS, setLS } from "@/utils/localStorage";
import { Constants } from "./../config/constants";
import type { ILine } from "./../types/ILine";
import { ref, type Ref } from "vue";
import { defineStore } from "pinia";
import allFiles from "@/stores/config/fileFolders.json";
import allCommands from "@/stores/config/commands.json";

export type JSONFile = typeof allFiles[number];
export type JSONCommand = typeof allCommands[number];

export const useTerminalStore = defineStore("terminal", () => {
  const homeFolder: JSONFile | undefined = (
    allFiles as JSONFile[]
  ).find((v) => v.id == 0);

  const commandsStored = getLS(
    `${Constants.COOKIE_NAME}_${Constants.COOKIE_NAME_COMMANDS}`
  );

  const disabledInput = ref(false);
  const actualUrl = ref(homeFolder?.name);
  const inputText = ref("");
  const user = ref("guest");
  const showPotential = ref(false);
  const actualIndex = ref(-1);
  const temporalInputText = ref("");
  const disconnected = ref(false);

  const actualFolder: Ref<JSONFile> = ref(
    homeFolder || ({} as JSONFile)
  );

  const tempFolder: Ref<JSONFile> = ref(
    homeFolder || ({} as JSONFile)
  );

  const lines: Ref<ILine[]> = ref([]);

  const commands: Ref<JSONCommand[]> = ref(allCommands);

  const folders: Ref<JSONFile[]> = ref(getFolderByType("D"));

  const files: Ref<JSONFile[]> = ref(getFolderByType("F"));
  const potentialCommands: Ref<JSONCommand[]> = ref([]);

  const lastCommands: Ref<string[]> = ref(
    JSON.parse(commandsStored || "[]")
  );

  function getFolderByType(type: string): JSONFile[] {
    return allFiles.filter((v) => v.type === type) as JSONFile[];
  }

  function addLine(line: ILine): void {
    lines.value.push(line);
  }

  function endCommand(): void {
    inputText.value = "";
  }

  function clearTerminal(): void {
    lines.value = [];
  }

  function setLastCommands(commands: string[]): void {
    lastCommands.value = commands;
  }

  function addTextLastLine(string: string): void {
    lines.value[lines.value.length - 1].text += string;
  }

  function changeLastLineColor(color: String): void {
    lines.value[lines.value.length - 1].color = color;
  }

  function deleteLastLine(): void {
    lines.value.pop();
  }

  function changeStatePrompt(): void {
    disabledInput.value = !disabledInput;
  }

  function setFolder(folder: JSONFile): void {
    actualFolder.value = folder;
  }

  function setActualUrl(url: string): void {
    actualUrl.value = url;
  }

  function getTempFolderById(id: Number | null): void {
    tempFolder.value = folders.value.filter(
      (folder) => folder.id == id
    )[0];
  }

  function setInputText(value: string): void {
    inputText.value = value;
  }

  function setTemporalInputText(value: string): void {
    temporalInputText.value = value;
  }

  function initialActualIndex(): void {
    actualIndex.value = -1;
  }

  function setActualIndex(value: number): void {
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
  }

  function connectPrompt() {
    disconnected.value = false;
  }

  function updateText(inputEvent: Event): void {
    const event = inputEvent as InputEvent;
    if (event.data == null) {
      setInputText(inputText.value.slice(0, -1));
    } else {
      setInputText(
        inputText.value +
          (event.target as HTMLInputElement).value[
            (event.target as HTMLInputElement).value.length - 1
          ]
      );
    }
  }

  function setFolderById(id: Number = 0): void {
    setFolder(folders.value.filter((v) => v.id == id)[0]);
  }

  function setActualPathUrl(): void {
    let url = actualFolder.value.name;
    let parent = actualFolder.value.parent;
    while (parent || parent === 0) {
      let parentFolder = folders.value.filter(
        (v) => v.id == parent
      )[0];
      parent = parentFolder.parent;
      url = parentFolder.name + "/" + url;
    }
    setActualUrl(url);
    setActualPathTitle(url);
  }

  function setActualPathTitle(url: String): void {
    document.title = `${user.value}@MuXeD:${url}`;
  }

  async function commandInput(): Promise<void> {
    try {
      changeStatePrompt();
      changePotentialState(false);

      const command: String = inputText.value.split(" ")[0];
      const params: Array<String> = inputText.value
        .substring(command.length + 1)
        .split(" ")
        .filter((s) => s != "");

      if (command !== "") saveCommand();
      initialActualIndex();

      freezeLine();

      const existCommand: JSONCommand | undefined =
        commands.value.find((comm) => comm.name == command);

      if (!existCommand) {
        controllerLog("The resistance is futile", "warning");
        createErrorLine("MuXbash: " + command + " command not found");
        return finalCommand();
      }

      for (let x = 0; x < existCommand.executionsLines.length; x++) {
        const line = existCommand.executionsLines[x];
        if (!executableFunctions[line.function]) {
          controllerLog(
            "Command not added to executableFunctions Object.",
            "error"
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
      controllerLog("Error: " + error, "error");
    }
  }

  function saveCommand(): void {
    const storageName = `${Constants.COOKIE_NAME}_${Constants.COOKIE_NAME_COMMANDS}`;
    const savedCommands = getLS(storageName);

    const commands: Array<String> =
      savedCommands != null && typeof savedCommands == "string"
        ? JSON.parse(savedCommands)
        : [];

    commands.push(inputText.value);
    lastCommands.value.push(inputText.value);

    if (commands.length > Constants.COMMANDS_LIMIT + 1) {
      commands.shift();
      lastCommands.value.shift();
    }

    setLS(
      `${Constants.COOKIE_NAME}_${Constants.COOKIE_NAME_COMMANDS}`,
      JSON.stringify(commands)
    );
  }

  function prevCommand(event: { preventDefault: Function }): void {
    if (
      actualIndex.value < 0 ||
      actualIndex.value === lastCommands.value.length
    ) {
      setTemporalInputText(inputText.value);
      setActualIndex(lastCommands.value.length);
    }
    setActualIndex(actualIndex.value - 1);
    if (actualIndex.value < 0) setActualIndex(0);
    setInputText(lastCommands.value[actualIndex.value]);
    event.preventDefault();
  }

  function nextCommand(event: { preventDefault: Function }): void {
    setActualIndex(actualIndex.value + 1);
    if (actualIndex.value >= lastCommands.value.length) {
      if (actualIndex.value == lastCommands.value.length)
        setInputText(temporalInputText.value);
      setActualIndex(lastCommands.value.length);
    } else {
      setInputText(lastCommands.value[actualIndex.value]);
    }
    event.preventDefault();
  }

  function changePathByName(params: Array<String>): void {
    if (params[0]) {
      if (params[0] == ".") {
        return;
      }
      let folderName: String = params[0];
      if (params[0] == ".." || params[0] == "/") {
        if (actualFolder.value.parent == null) {
          return createErrorLine(
            "You have no permission to this folder"
          );
        }
        getTempFolderById(actualFolder.value.parent);
        folderName = tempFolder.value.name;
      }
      const folderValid: JSONFile | undefined = folders.value.find(
        (folder) => folder.name == folderName
      );
      if (!!folderValid) {
        setFolder(folderValid);
        setActualPathUrl();
      } else {
        createErrorLine(
          "This folder not contain " + params[0] + " folder"
        );
      }
    } else {
      const folderValid: JSONFile | undefined = folders.value.filter(
        (folder) => folder.name == "~"
      )[0];
      setFolder(folderValid);
      setActualPathUrl();
    }
  }

  function search(inputEvent: Event): void {
    const event = inputEvent as InputEvent;
    event.preventDefault();
    checkPotentialCommands((event.target as HTMLInputElement).value);
    // TODO: check if commands is a special commands like "cd"
    // if (event.target.value.toLowerCase().startsWith("cd") && potentialCommands.length == 1)
  }

  function checkPotentialCommands(value: string): void {
    clearPotentialCommands();
    commands.value.forEach((com) => {
      if (
        com.name.toLowerCase().startsWith(value.toLowerCase()) &&
        com.name != ""
      ) {
        potentialCommands.value.push(com);
      }
    });
    if (potentialCommands.value.length > 1) {
      changePotentialState();
    } else {
      if (potentialCommands.value.length == 1) {
        changePotentialState(false);
        setInputText(potentialCommands.value[0].name + " ");
      } else {
        changePotentialState();
      }
    }
  }

  async function typeText(params: Array<String>): Promise<void> {
    try {
      const colorOption = clearOption(params, "c");
      const color =
        colorOption.value !== "" ? colorOption.value : "info";
      params = colorOption.params;
      const speedOption = clearOption(params, "s");
      const speed = speedOption.value !== "" ? speedOption.value : 0;
      params = speedOption.params;
      if (params.length > 0) {
        createEmptyLine();
        changeLastLineColor(color);
        const stringType = params.join(" ");
        for (let i = 0; i < stringType.length; i++) {
          addTextLastLine(stringType[i]);
          await sleep(randomSpeed(Number(speed), Number(speed) + 60));
        }
      } else {
        createErrorLine("Add a text to type");
      }
    } catch (error) {
      controllerLog("Error: " + error, "error");
    }
  }

  function createErrorLine(text: String): void {
    let errorLine: ILine = {
      type: "echo",
      text: text,
      path: actualUrl.value as String,
      color: "error-light",
    };
    addLine(errorLine);
  }

  function createEmptyLine(): void {
    let emptyLine: ILine = {
      type: "echo",
      text: "",
      path: actualUrl.value as String,
    };
    addLine(emptyLine);
  }

  function freezeLine(): void {
    const line: ILine = {
      type: "prompt",
      text: inputText.value + "<br>",
      path: actualUrl.value as String,
    };
    addLine(line);
    endCommand();
  }

  function finalCommand(): void {
    setTimeout(() => {
      window.scrollTo(
        0,
        document.body.scrollHeight ||
          document.documentElement.scrollHeight
      );
      changeStatePrompt();
      setTimeout(() => {
        setFocus();
      }, 10);
    }, 10);
  }

  function setFocus(): void {
    document.getElementById("inputPrompt")?.focus();
  }

  async function exit(): Promise<void> {
    const line: ILine = {
      type: "info",
      text: "Connection to muxed.dev closed.",
      path: actualUrl.value as String,
      color: "info",
    };
    const lineLogout: ILine = {
      type: "info",
      text: "logout",
      path: actualUrl.value as String,
      color: "info",
    };
    try {
      disconnectPrompt();
      addLine(lineLogout);
      await sleep(800);
      addLine(line);
    } catch (error) {
      controllerLog("Error: " + error, "error");
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

  const executableFunctions: { [key: string]: Function } = {
    clearTerminal: clearTerminal,
    changePathByName: changePathByName,
    typeText: typeText,
    exit: exit,
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
});
