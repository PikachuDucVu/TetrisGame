import {
  createGameLoop,
  createStage,
  createViewport,
  PolygonBatch,
  ShapeRenderer,
  Texture,
  Vector2,
  BitmapFont,
  TextureRegion,
  Color,
} from "gdxts";

const ROWS = 24;
const COLS = 12;
const GAME_WIDTH = 1500;
const GAME_HEIGHT = 2000;

export const init3 = async () => {
  const stage = createStage();
  const canvas = stage.getCanvas();
  const viewport = createViewport(canvas, GAME_WIDTH, GAME_HEIGHT);
  const gl = viewport.getContext();

  const batch = new PolygonBatch(gl);
  const camera = viewport.getCamera();
  batch.setYDown(true);
  camera.setYDown(true);

  const bgRight = await Texture.load(gl, "./bg1.png");
  const block = await Texture.load(gl, "./borderBlock.png");
  const mainBlock = await Texture.load(gl, "./GreenBlock.png");
  // const black = await Texture.load(gl, "./download.jpg");
  const SQUARE_SIZE = 83;

  let delayTime = 0;
  let gameOver = false;

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
    [1, 1],
    [1, 1],
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
  // console.log(iBlock[0]);

  class Piece {
    tetromino: any;
    color: any;
    tetrominoN: any;
    activeTetromino: any;
    x: number;
    y: number;

    constructor(tetromino: any) {
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
            // if (color === 1) {
            //   map[row + this.y][col + this.x] = 1;
            //   console.log(map);
            // } else {
            //   map[row + this.y][col + this.x] = 0;
            // }
            // console.log(row + this.y);
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
        }
        console.warn(map);
      }
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
        this.tetromino[this.tetrominoN + 1] % this.tetromino.length;
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
      if (this.y >= 22) {
        piece = new Piece(blocks[getRandomInt(0, 6)]);
        this.lock();
      }
      if (!this.collision(0, 1, this.activeTetromino)) {
        this.undraw();
        this.y++;
        this.draw();
      } else {
        piece = new Piece(blocks[getRandomInt(0, 6)]);
        this.lock();
      }

      console.log(this.x, this.y);
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
  }

  let blocks = [
    iBlock,
    lBlock,
    lReverseBlock,
    sBlock,
    zBlock,
    zReverseBlock,
    tBlock,
  ];

  let piece = new Piece(blocks[1]);

  window.addEventListener("keydown", function (e) {
    control(e);
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
  console.log(map);
  function drawSquare(x: number, y: number, color?: any) {
    batch.begin();
    batch.draw(
      color ? mainBlock : block, // 0 = grayBlock // 1 = greenBlock
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
    drawMapGame();
    piece.fill(1);

    //draw border
    batch.setProjection(camera.projectionView.values);
    batch.begin();
    // batch.draw(black, 0, 0, GAME_WIDTH, GAME_HEIGHT);
    batch.draw(bgRight, 1000, 0, 500, 2000);
    batch.end();
    delayTime += delta;
    if (delayTime >= 0.5) {
      delayTime = 0;
      piece.moveDown();
    }
  });
};
