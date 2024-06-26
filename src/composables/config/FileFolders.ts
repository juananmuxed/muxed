import { TerminalFile } from 'src/types/Files';

export const FILE_FOLDERS = [
  {
    id: 0,
    type: 'D',
    name: '~',
    permits: [
      'rwx',
      'r-x',
      'r--',
    ],
    size: 4096,
    owner: 'MuXeD',
    creationDate: new Date('1987-01-04'),
  },
  {
    id: 1,
    type: 'F',
    name: 'README',
    extension: 'md',
    parent: 0,
    permits: [
      'rw-',
      'r--',
      'r--',
    ],
    size: 62004,
    owner: 'MuXeD',
    creationDate: new Date('1987-01-04'),
  },
  {
    id: 2,
    type: 'D',
    name: 'images',
    parent: 0,
    permits: [
      'rwx',
      'r-x',
      'r--',
    ],
    size: 4096,
    owner: 'MuXeD',
    creationDate: new Date('1987-01-04'),
  },
  {
    id: 3,
    type: 'D',
    name: 'projects',
    parent: 0,
    permits: [
      'rwx',
      'r-x',
      'r--',
    ],
    size: 4096,
    owner: 'MuXeD',
    creationDate: new Date('1987-01-04'),
  },
  {
    id: 4,
    type: 'D',
    name: 'socialmedia',
    parent: 0,
    permits: [
      'rwx',
      'r-x',
      'r--',
    ],
    size: 4096,
    owner: 'MuXeD',
    creationDate: new Date('1987-01-04'),
  },
  {
    id: 5,
    type: 'D',
    name: 'skills',
    parent: 0,
    permits: [
      'rwx',
      'r-x',
      'r--',
    ],
    size: 4096,
    owner: 'MuXeD',
    creationDate: new Date('1987-01-04'),
  },
  {
    id: 6,
    type: 'D',
    name: 'pr0n',
    parent: 2,
    permits: [
      'rwx',
      'r-x',
      'r--',
    ],
    size: 4096,
    owner: 'MuXeD',
    creationDate: new Date('1987-01-04'),
  },
] as TerminalFile[];
