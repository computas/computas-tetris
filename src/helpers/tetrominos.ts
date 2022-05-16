import { TetrominoSetting } from '../pages/settings/Settings';

export interface Tetromino {
  shape: any;
  color: number;
}

export const Tetrominos: Tetromino[] = [
  {
    shape: [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0]
    ],
    color: 1
  },

  {
    shape: [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0]
    ],
    color: 2
  },

  {
    shape: [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1]
    ],
    color: 3
  },

  {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: 4
  },

  {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    color: 5
  },

  {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: 6
  },

  {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    color: 7
  }
];

export const getTetrominoNamed = (name: string): Tetromino => {
  const index = 'IJLOSTZ'.indexOf(name);
  if (index === -1) {
    return Tetrominos[0];
  }
  return Tetrominos[index];
};

export const randomTetromino = (
  availability: TetrominoSetting[],
  count: number,
  lines: number
) => {
  const available: Tetromino[] = [];
  availability.forEach((tetromino, index) => {
    if (lines >= tetromino.lines || count >= tetromino.count) {
      available.push(Tetrominos[index]);
    }
  });

  if (!available.length) {
    available.push(Tetrominos[3]);
  }

  const index = Math.floor(Math.random() * available.length);
  return available[index];
};
