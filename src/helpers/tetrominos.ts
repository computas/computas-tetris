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

export const randomTetromino = (simple: boolean) => {
  const tetrominos = 'IJLOSTZ';
  const scope = simple ? 4 : tetrominos.length;
  const index = Math.floor(Math.random() * scope);
  return Tetrominos[index];
};
