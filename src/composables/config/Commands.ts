import { Command } from 'src/types/Commands';

export const COMMANDS = [
  {
    name: '',
    executionsLines: [],
  },
  {
    name: 'clear',
    executionsLines: [
      {
        function: 'clearTerminal',
        async: false,
      },
    ],
  },
  {
    name: 'cd',
    searchFiles: true,
    executionsLines: [
      {
        function: 'changePathByName',
        async: false,
      },
    ],
  },
  {
    name: 'echo',
    executionsLines: [
      {
        function: 'typeText',
        async: true,
        speed: 30,
        color: 'info',
      },
    ],
  },
  {
    name: 'ls',
    searchFiles: true,
    executionsLines: [
      {
        function: 'showFilesAndFolders',
        async: false,
      },
    ],
  },
  {
    name: 'su',
    executionsLines: [
      {
        function: 'changeUserName',
        async: false,
      },
    ],
  },
  {
    name: 'whoami',
    executionsLines: [
      {
        function: 'getActualUser',
        async: false,
      },
    ],
  },
  {
    name: 'sh',
    executionsLines: [
      {
        function: 'executeFile',
        async: false,
      },
    ],
  },
  {
    name: 'bash',
    executionsLines: [
      {
        function: 'executeFile',
        async: false,
      },
    ],
  },
  {
    name: 'exit',
    executionsLines: [{ function: 'exit', async: true }],
  },
] as Command[];
