import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';

// Interfaces
import Line from '../interfaces/line';
import Command from '../interfaces/command';
import FileFolder from '../interfaces/FileFolder';

// Data
import commands from '@/store/config/commands.json';
import fileFolders from '@/store/config/fileFolders.json'

@Module({
    namespaced: true, 
    name: 'terminal'
})
class TerminalModule extends VuexModule {
    public disabedInput: Boolean = false;
    public actualPath: Number = 0;
    public inputText: String = '';
    public user: String = 'guest';
    public lines: Array<Line> = []
    public commands: Array<Command> = commands;
    public folders: Array<FileFolder> = fileFolders.filter(v => v.type == "D");
    public files: Array<FileFolder> = fileFolders.filter(v => v.type == "F");

    public sleep = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
    public randomSpeed = (minspeed: number, maxspeed: number) => {
        return Math.floor(Math.random() * (maxspeed - minspeed + 1)) + minspeed;
    }
    
    get getActualPathNameById(): String {
        return this.folders.filter(v => v.id == this.actualPath)[0]?.name;
    }

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
    public changePath(newPath: Number): void {
        this.actualPath = newPath;
    }

    @Mutation
    public updateText(event: {target: HTMLInputElement, data: String | null}): void {
        if(event.data == null) {
            this.inputText = this.inputText.slice(0, -1);
        } else {
            this.inputText += event.target.value[event.target.value.length - 1];
        }
    }
}

export default TerminalModule;