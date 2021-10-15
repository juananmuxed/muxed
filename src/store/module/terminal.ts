import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';

// Interfaces
import Line from '../interfaces/line';
import Command from '../interfaces/command';
import FileFolder from '../interfaces/FileFolder';

// Data
import commands from '@/store/config/commands.json';
import files from '@/store/config/fileFolders.json'

// Utils
import * as Utils from '@/utils/utils'

@Module({
    namespaced: true, 
    name: 'terminal'
})
class TerminalModule extends VuexModule {
    public disabledInput: Boolean = false;
    public actualFolder: FileFolder = files.filter(v => v.id == 0)[0];
    public actualUrl: String = files.filter(v => v.id == 0)[0]?.name;
    public tempFolder: FileFolder = files.filter(v => v.id == 0)[0];
    public inputText: String = '';
    public user: String = 'guest';
    public lines: Array<Line> = []
    public commands: Array<Command> = commands;
    public folders: Array<FileFolder> = files.filter(v => v.type == "D");
    public files: Array<FileFolder> = files.filter(v => v.type == "F");
    public showPotential: Boolean = false;
    public potentialCommands: Array<Command> = [];
    public lastCommands: Array<String> = [];

    @Mutation
    public addLine(line: Line): void {
        this.lines.push(line);
    }

    @Mutation
    public endCommand(): void {
        this.inputText = '';
    }

    @Mutation
    public clearTerminal(): void {
        this.lines = [];
    }

    @Mutation
    public changeStatePrompt(): void {
        this.disabledInput = !this.disabledInput;
    }

    @Mutation
    public setFolder(folder: FileFolder): void {
        this.actualFolder = folder;
    }

    @Mutation
    public setActualUrl(url: String): void {
        this.actualUrl = url;
    }

    @Mutation
    public getTempFolderById(id: Number | null): void {
        this.tempFolder = this.folders.filter(folder => folder.id == id)[0];
    }

    @Mutation
    public setInputText(value: String): void {
        this.inputText = value;
    }

    @Mutation
    private changePotentialState(value: Boolean = true) {
        this.showPotential = value;
    }

    @Mutation
    private clearPotentialCommands() {
        this.potentialCommands = [];
    }

    @Action
    public updateText(event: {target: HTMLInputElement, data: String | null}): void {
        if(event.data == null) {
            this.setInputText(this.inputText.slice(0, -1));
        } else {
            this.setInputText(this.inputText + event.target.value[event.target.value.length - 1]);
        }
    }

    @Action
    private setFolderById(id:Number = 0): void {
        this.setFolder(this.folders.filter(v => v.id == id)[0]);
    }

    @Action
    public setActualPathUrl(): void {
        let url = this.actualFolder.name;
        let parent = this.actualFolder.parent
        while (parent || parent === 0) {
            let parentFolder = this.folders.filter(v => v.id == parent)[0]
            parent = parentFolder.parent;
            url = parentFolder.name + "/" + url;
        }
        this.setActualUrl(url);
    }

    @Action
    public async commandInput(): Promise<void> {
        this.changeStatePrompt();
        this.changePotentialState(false);

        const command: String = this.inputText.split(' ')[0]
        const params: Array<String> = this.inputText.substring(command.length + 1).split(' ')

        this.freezeLine();

        let existCommand: Command | undefined = this.commands.filter(comm => comm.name == command)[0];
        
        if(!existCommand) {
            this.createErrorLine('MuXbash: ' + command + ' command not found');
            return this.finalCommand();
        }

        for (let x = 0; x < existCommand.executionsLines.length; x++) {
            const line = existCommand.executionsLines[x];
            if(line.type == 'commit') {
                this.context.commit(line.function, params);
            }
            if(line.type == 'dispatch') {
                if(line.async) {
                    await this.context.dispatch(line.function, params);
                } else {
                    this.context.dispatch(line.function, params);
                }
            }
        }

        return this.finalCommand();
    }

    @Action
    private changePathByName(params: Array<String>): void {
        if(params[0]) {
            if(params[0] == '.') {
                return;
            }
            let folderName: String = params[0];
            if(params[0] == '..') {
                if(this.actualFolder.parent == null) {
                    return this.createErrorLine('You have no permision to this folder');
                }
                this.getTempFolderById(this.actualFolder.parent);
                folderName = this.tempFolder.name;
            }
            const folderValid: FileFolder = this.folders.filter(folder => folder.name == folderName)[0];
            if(folderValid) {
                this.setFolder(folderValid);
                this.setActualPathUrl();
            } else {
                this.createErrorLine('This folder not contain ' + params[0] + ' folder');
            }
        } else {
            const folderValid: FileFolder = this.folders.filter(folder => folder.name == '~')[0];
            this.setFolder(folderValid);
            this.setActualPathUrl();
        }
    }

    @Action
    public search(event: {target: HTMLInputElement, preventDefault:Function}): void {
        event.preventDefault();
        this.checkPotentialCommands(event.target.value);
    }

    @Action
    private checkPotentialCommands(value: string): void {
        this.clearPotentialCommands();
        this.commands.forEach(com => {
            if(com.name.toLowerCase().startsWith(value.toLowerCase()) && com.name != ''){
                this.potentialCommands.push(com);
            }
        });
        if(this.potentialCommands.length > 1) {
            this.changePotentialState();
        } else {
            if(this.potentialCommands.length == 1) {
                this.changePotentialState(false);
                this.setInputText(this.potentialCommands[0].name + ' ')
            } else {
                this.changePotentialState();
            }
        }
    }

    //TODO: Arroy Key Up Function (last commands)

    @Action
    private createErrorLine(text: String): void {
        let errorLine = { type: 'echo', text: text, path: this.actualUrl , color:'error-light' }
        this.addLine(errorLine);
    }

    @Action
    private freezeLine(): void {
        const line: Line = { type: 'prompt', text: this.inputText + '<br>', path: this.actualUrl }
        this.addLine(line);
        this.endCommand();
    }

    @Action
    public finalCommand(): void {
        setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
            this.changeStatePrompt();
            setTimeout(() => {
                document.getElementById("inputPrompt")?.focus();
            }, 10);
        }, 10);
    }
}

export default TerminalModule;