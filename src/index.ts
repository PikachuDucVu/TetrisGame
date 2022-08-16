import {
  createGameLoop,
  createStage,
  createViewport,
  PolygonBatch,
  Texture,
  BitmapFont,
  BitmapFontData,
  Color,
} from "gdxts";

const ROWS = 24;
const COLS = 12;
const GAME_WIDTH = 1500;
const GAME_HEIGHT = 2000;

export const init = async () => {
  const stage = createStage();
  const canvas = stage.getCanvas();
  const viewport = createViewport(canvas, GAME_WIDTH, GAME_HEIGHT);
  const gl = viewport.getContext();

  const data = new BitmapFontData("./1231231.fnt", true);
  await data.loadFont(gl);
  data.setScale(3, 3);
  const font = new BitmapFont(data, data.regions, true);

  const batch = new PolygonBatch(gl);
  const camera = viewport.getCamera();
  batch.setYDown(true);
  camera.setYDown(true);

  const bgRight = await Texture.load(gl, "./bg1.png");
  const block = await Texture.load(gl, "./borderBlock.png");
  const mainBlock = await Texture.load(gl, "./GreenBlock.png");
  const gameOverIcon = await Texture.load(gl, "./gameover.png");
  const temp = await Texture.load(gl, "./temp.png");
  const SQUARE_SIZE = 83;

  let dropTime = 0;
  let score = 0;
  let gameover = false;

  //tetrominoes
  //I
  const iBlock = [
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
  ];

  //L
  const lBlock = [
    [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [1, 0, 0],
    ],
    [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ],
  ];

  //L-reverse
  const lReverseBlock = [
    [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 1],
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
  ];

  // Square
  const sBlock = [
    [
      [1, 1],
      [1, 1],
    ],
  ];

  // Z
  const zBlock = [
    [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 0, 1],
    ],
  ];

  // Z-reverse
  const zReverseBlock = [
    [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 0, 1],
      [0, 1, 1],
      [0, 1, 0],
    ],
  ];

  // T
  const tBlock = [
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  ];
  let speedGame = 0.5;
  class Piece {
    tetromino: any;
    color: any;
    tetrominoN: any;
    activeTetromino: any;
    temp: any;
    x: number;
    y: number;

    constructor(tetromino: any, nextTetro?: any) {
      this.tetromino = tetromino;
      this.tetrominoN = 0;
      this.activeTetromino = this.tetromino[this.tetrominoN];

      this.x = 4;
      this.y = 0;
    }

    fill(color?: any) {
      for (let row = 0; row < this.activeTetromino.length; row++) {
        for (let col = 0; col < this.activeTetromino.length; col++) {
          if (this.activeTetromino[row][col]) {
            drawSquare(this.x + col, this.y + row, color);
          }
        }
      }
    }

    draw() {
      this.fill(1);
    }
    undraw() {
      this.fill(0);
    }

    lock() {
      for (let row = 0; row < this.activeTetromino.length; row++) {
        for (let col = 0; col < this.activeTetromino.length; col++) {
          if (!this.activeTetromino[row][col]) {
            continue;
          }
          map[this.y + row][this.x + col] = 1;
          //checkGameOver
          if (this.y + row < 1) {
            gameover = true;
          }
        }
        // console.warn(map);
      }

      //checkpoint
      setTimeout(() => {
        for (let row = 0; row < ROWS; row++) {
          let fullRow: boolean = true;
          for (let col = 0; col < COLS; col++) {
            fullRow = fullRow && map[row][col] !== 0;
          }
          if (fullRow) {
            for (let y = row; y > 1; y--) {
              for (let col = 0; col < COLS; col++) {
                map[y][col] = map[y - 1][col];
              }
            }
            for (let col = 0; col < COLS; col++) {
              map[0][col] = 0;
            }
            if (speedGame > 0.15) {
              speedGame -= 0.05;
              score += 10;
            }
          }
        }
      }, 200);
    }

    collision(x: any, y: any, piece: any) {
      for (let row = 0; row < piece.length; row++) {
        for (let col = 0; col < piece.length; col++) {
          if (!piece[row][col]) {
            continue;
          }
          let newX = this.x + col + x;
          let newY = this.y + row + y;

          if (newX < 0 || newX >= COLS || newY >= ROWS) {
            return true;
          }

          if (newY < 0) {
            continue;
          }
          if (map[newY][newX] !== 0) {
            return true;
          }
        }
      }
      return false;
    }

    rotate() {
      let nextRotateOfBlock =
        this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
      let kick = 0;
      if (this.collision(0, 0, nextRotateOfBlock)) {
        if (this.x > COLS / 2) {
          kick = -1;
        } else {
          kick = 1;
        }
      }
      if (!this.collision(kick, 0, nextRotateOfBlock)) {
        this.undraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
      }
    }

    moveDown() {
      if (this.y > ROWS - 1) {
        this.lock();
        piece = new Piece(nextPiece);
        nextPiece = blocks[getRandomInt(0, 6)];
      }
      if (!this.collision(0, 1, this.activeTetromino)) {
        this.undraw();
        this.y++;
        this.draw();
      } else {
        this.lock();
        piece = new Piece(nextPiece);
        nextPiece = blocks[getRandomInt(0, 6)];
      }
    }
    moveLeft() {
      if (!this.collision(-1, 0, this.activeTetromino)) {
        this.undraw();
        this.x--;
        this.draw();
      }
    }
    moveRight() {
      if (!this.collision(1, 0, this.activeTetromino)) {
        this.undraw();
        this.x++;
        this.draw();
      }
    }
    showNextTetromino(nextTetro: any) {
      for (let row = 0; row < nextTetro.length; row++) {
        for (let col = 0; col < nextTetro[row].length; col++) {
          if (nextTetro[row][col]) {
            drawSquare(13.4 + col, 3.2 + row, 1);
          }
        }
      }
    }
  }

  let blocks = [
    iBlock,
    lBlock,
    lReverseBlock,
    tBlock,
    sBlock,
    zBlock,
    zReverseBlock,
  ];

  let piece = new Piece(blocks[4]);
  let nextPiece = blocks[getRandomInt(0, 6)];

  window.addEventListener("keydown", function (e) {
    control(e);
    console.log(e.code);
  });
  function control(e: any) {
    if (e.keyCode === 37) {
      piece.moveLeft();
    } else if (e.keyCode === 38) {
      piece.rotate();
    } else if (e.keyCode === 39) {
      piece.moveRight();
    } else if (e.keyCode === 40) {
      piece.moveDown();
      piece.moveDown();
    }
  }

  function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  let map: any[] = [];
  for (let row = 0; row < ROWS; row++) {
    map[row] = [];
    for (let col = 0; col < COLS; col++) {
      drawSquare(col, row, 0);
      map[row][col] = 0;
    }
  }
  function drawMapGame() {
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        drawSquare(col, row, map[row][col] === 1 ? 1 : 0);
      }
    }
  }
  function drawSquare(x: number, y: number, color?: any) {
    batch.begin();
    batch.draw(
      color ? mainBlock : block, // 0 = gray // 1 = green
      SQUARE_SIZE * x,
      SQUARE_SIZE * y,
      SQUARE_SIZE,
      SQUARE_SIZE
    );
    batch.end();
  }

  createGameLoop((delta: number) => {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    batch.setProjection(camera.projectionView.values);
    drawMapGame();
    batch.begin();
    batch.draw(bgRight, 1000, 0, 500, 2000);

    batch.setColor(Color.WHITE);
    font.draw(
      batch,
      "Score: " + score,
      GAME_WIDTH / 2 + 320,
      GAME_HEIGHT / 2 - 200,
      GAME_WIDTH
    );
    batch.draw(temp, GAME_WIDTH / 2 + 200, GAME_HEIGHT / 2 - 500, 500, 250);
    batch.end();
    piece.fill(1);
    piece.showNextTetromino(nextPiece[0]);
    if (!gameover) {
      dropTime += delta;
      if (dropTime >= speedGame) {
        dropTime = 0;
        piece.moveDown();
      }
    } else {
      batch.begin();

      batch.draw(
        gameOverIcon,
        GAME_WIDTH / 2 - 760,
        GAME_HEIGHT / 2 - 500,
        1000,
        1000
      );

      batch.end();
    }
  });
};
init();
