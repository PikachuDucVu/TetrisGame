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

import { init3 } from "./index3";

export const init = async () => {
  const stage = createStage();
  const canvas = stage.getCanvas();
  const viewport = createViewport(canvas, 1500, 2000);
  const gl = viewport.getContext();
  const shapeRenderer = new ShapeRenderer(gl);
  const batch = new PolygonBatch(gl);
  const camera = viewport.getCamera();

  // const background = await Texture.load(gl, "./TetrisBg.png");
  // const border = await Texture.load(gl, "./border.png");
  const bgRight = await Texture.load(gl, "./bg1.png");
  const block = await Texture.load(gl, "./borderBlock.png");
  const mainBlock = await Texture.load(gl, "./GreenBlock.png");
  const black = new Color(0, 0, 0, 1);

  //config game
  const ROWGAME = 24;
  const COLGAME = 12;
  let map: any[] = [];
  let blockSize = new Vector2(83, 83);
  let delayTime = 0;
  let moveLeft = false;
  let moveRight = false;
  let moveDown = false;

  //I
  const iBlock = [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  //L
  const lBlock = [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ];

  //L-reverse
  const lReverseBlock = [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ];

  // Square
  const sBlock = [
    [1, 1],
    [1, 1],
  ];

  // Z
  const zBlock = [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ];

  // Z-reverse
  const zReverseBlock = [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ];

  // T
  const tBlock = [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ];

  const blocks = [
    iBlock,
    lReverseBlock,
    lBlock,
    sBlock,
    zBlock,
    zReverseBlock,
    tBlock,
  ];
  console.log(map);
  let currentBlock = blocks[0]; //
  let nextBlock = blocks[getRandomInt(0, 6)];
  let positionBlock: number[] = [];
  let currentPosition = new Vector2(23, 11);

  function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // draw the map
  function mapGame() {
    for (let row = 0; row < ROWGAME; row++) {
      map[row] = [];
      for (let col = 0; col < COLGAME; col++) {
        if (row >= 1) {
          map[row].push(0);
        } else {
          map[row].push(1);
        }
      }
      for (let col = 0; col < map[row].length; col++) {
        map[row][0] = 1;
        map[row][11] = 1;
      }
    }
  }

  function keyMove() {
    if (moveLeft) {
      for (let i = 1; i < positionBlock.length; i += 2) {
        positionBlock[i] -= 1;
        if (i + 2 >= positionBlock.length) {
          map[positionBlock[i - 1]][positionBlock[i]] = 0;
          console.warn("dcm");
        }
      }
      console.log(positionBlock);
      moveLeft = false;
    }
    if (moveRight) {
      if (moveRight) {
        for (let i = 1; i < positionBlock.length; i += 2) {
          positionBlock[i] += 1;
        }
        console.log(positionBlock);
        moveRight = false;
      }
    }
    if (moveDown) {
      for (let i = 0; i < positionBlock.length; i += 2) {
        positionBlock[i] -= 1;
      }
      console.log(positionBlock);
      moveDown = false;
    }
  }

  function blockOnMap() {
    positionBlock = [];
    for (let row = 0; row < currentBlock.length; row++) {
      for (let col = 0; col < currentBlock[row].length; col++) {
        map[ROWGAME - 1 - row][COLGAME / 2 - 1 + col] = currentBlock[row][col];
        if (map[ROWGAME - 1 - row][COLGAME / 2 - 1 + col]) {
          positionBlock.push(ROWGAME - 1 - row, COLGAME / 2 - 1 + col);
        }
        console.warn(positionBlock);
      }
      console.log(map);
    }
  }

  function drawTetromino() {
    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[row].length; col++) {
        if (map[row][col] !== 0) {
          batch.draw(
            map[row][col] === 1 ? block : mainBlock,
            col * blockSize.x,
            row * blockSize.y,
            83,
            83
          );
        } // scan to draw
      }
    } //
  }

  function collisionHandmade() {
    switch (currentBlock) {
      case blocks[0]:
        if (
          map[positionBlock[0] - 1][positionBlock[1]] === 0 &&
          map[positionBlock[2] - 1][positionBlock[3]] === 0 &&
          map[positionBlock[4] - 1][positionBlock[5]] === 0 &&
          map[positionBlock[6] - 1][positionBlock[7]] === 0
        ) {
          keyMove();
          map[positionBlock[0] - 1][positionBlock[1]] = 1;
          map[positionBlock[2] - 1][positionBlock[3]] = 1;
          map[positionBlock[4] - 1][positionBlock[5]] = 1;
          map[positionBlock[6] - 1][positionBlock[7]] = 1;
          //undraw
          map[positionBlock[0]][positionBlock[1]] = 0;
          map[positionBlock[2]][positionBlock[3]] = 0;
          map[positionBlock[4]][positionBlock[5]] = 0;
          map[positionBlock[6]][positionBlock[7]] = 0;
          for (let i = 0; i < positionBlock.length; i += 2) {
            positionBlock[i] -= 1;
          }
        } else {
          currentBlock = nextBlock;
          nextBlock = blocks[getRandomInt(0, 6)];
          blockOnMap();
        }

        break;
      case blocks[1]:
        if (
          map[positionBlock[2] - 1][positionBlock[3]] === 0 &&
          map[positionBlock[4] - 1][positionBlock[5]] === 0 &&
          map[positionBlock[6] - 1][positionBlock[7]] === 0
        ) {
          // keyMove();
          // map[positionBlock[0] - 1][positionBlock[1]] =
          //   map[positionBlock[0]][positionBlock[1]];
          // map[positionBlock[2] - 1][positionBlock[3]] = 1;
          // map[positionBlock[4] - 1][positionBlock[5]] =
          //   map[positionBlock[4]][positionBlock[5]];
          // map[positionBlock[6] - 1][positionBlock[7]] =
          //   map[positionBlock[6]][positionBlock[7]];
          // //undraw
          // map[positionBlock[0]][positionBlock[1]] = 0;
          // map[positionBlock[4]][positionBlock[5]] = 0;
          // map[positionBlock[6]][positionBlock[7]] = 0;
          // for (let i = 0; i < positionBlock.length; i += 2) {
          //   positionBlock[i] -= 1;
          // }
        } else {
          currentBlock = nextBlock;
          nextBlock = blocks[getRandomInt(0, 6)];
          blockOnMap();
        }
        break;
      case blocks[2]:
        if (
          map[positionBlock[2] - 1][positionBlock[3]] === 0 &&
          map[positionBlock[4] - 1][positionBlock[5]] === 0 &&
          map[positionBlock[6] - 1][positionBlock[7]] === 0
        ) {
          // keyMove();
          // map[positionBlock[2] - 1][positionBlock[3]] =
          //   map[positionBlock[2]][positionBlock[3]];
          // map[positionBlock[4] - 1][positionBlock[5]] =
          //   map[positionBlock[4]][positionBlock[5]];
          // map[positionBlock[6] - 1][positionBlock[7]] = 1;
          // map[positionBlock[0] - 1][positionBlock[1]] =
          //   map[positionBlock[0]][positionBlock[1]];
          // //undraw
          // map[positionBlock[0]][positionBlock[1]] = 0;
          // map[positionBlock[2]][positionBlock[3]] = 0;
          // map[positionBlock[4]][positionBlock[5]] = 0;
          // for (let i = 0; i < positionBlock.length; i += 2) {
          //   positionBlock[i] -= 1;
          // }
        } else {
          currentBlock = nextBlock;
          nextBlock = blocks[getRandomInt(0, 6)];
          blockOnMap();
        }
        break;
      case blocks[3]:
        if (
          map[positionBlock[4] - 1][positionBlock[5]] === 0 &&
          map[positionBlock[6] - 1][positionBlock[7]] === 0
        ) {
          // keyMove();
          // map[positionBlock[4] - 1][positionBlock[5]] =
          //   map[positionBlock[4]][positionBlock[5]];
          // map[positionBlock[6] - 1][positionBlock[7]] =
          //   map[positionBlock[6]][positionBlock[7]];
          // //undraw
          // map[positionBlock[0]][positionBlock[1]] = 0;
          // map[positionBlock[2]][positionBlock[3]] = 0;
          // for (let i = 0; i < positionBlock.length; i += 2) {
          //   positionBlock[i] -= 1;
          // }
        } else {
          currentBlock = nextBlock;
          nextBlock = blocks[getRandomInt(0, 6)];
          blockOnMap();
        }
        break;
      case blocks[4]:
        if (
          map[positionBlock[4] - 1][positionBlock[5]] === 0 &&
          map[positionBlock[6] - 1][positionBlock[7]] === 0
        ) {
          // keyMove();
          // map[positionBlock[4] - 1][positionBlock[5]] =
          //   map[positionBlock[4]][positionBlock[5]];
          // map[positionBlock[6] - 1][positionBlock[7]] =
          //   map[positionBlock[6]][positionBlock[7]];
          // map[positionBlock[2] - 1][positionBlock[3]] =
          //   map[positionBlock[2]][positionBlock[3]];
          // // undraw
          // map[positionBlock[0]][positionBlock[1]] = 0;
          // map[positionBlock[2]][positionBlock[3]] = 0;
          // map[positionBlock[4]][positionBlock[5]] = 0;
          // for (let i = 0; i < positionBlock.length; i += 2) {
          //   positionBlock[i] -= 1;
          // }
        } else {
          currentBlock = nextBlock;
          nextBlock = blocks[getRandomInt(0, 6)];
          blockOnMap();
        }
        break;
      case blocks[5]:
        if (
          map[positionBlock[0] - 1][positionBlock[1]] === 0 &&
          map[positionBlock[4] - 1][positionBlock[5]] === 0 &&
          map[positionBlock[6] - 1][positionBlock[7]] === 0
        ) {
          // keyMove();
          // map[positionBlock[0] - 1][positionBlock[1]] =
          //   map[positionBlock[0]][positionBlock[1]];
          // map[positionBlock[4] - 1][positionBlock[5]] =
          //   map[positionBlock[4]][positionBlock[5]];
          // map[positionBlock[6] - 1][positionBlock[7]] =
          //   map[positionBlock[6]][positionBlock[7]];
          // // undraw
          // map[positionBlock[0]][positionBlock[1]] = 0;
          // map[positionBlock[2]][positionBlock[3]] = 0;
          // map[positionBlock[6]][positionBlock[7]] = 0;
          // for (let i = 0; i < positionBlock.length; i += 2) {
          //   positionBlock[i] -= 1;
          // }
        } else {
          currentBlock = nextBlock;
          nextBlock = blocks[getRandomInt(0, 6)];
          blockOnMap();
        }
        break;
      case blocks[6]:
        if (
          map[positionBlock[2] - 1][positionBlock[3]] === 0 &&
          map[positionBlock[4] - 1][positionBlock[5]] === 0 &&
          map[positionBlock[6] - 1][positionBlock[7]] === 0
        ) {
          // keyMove();
          // map[positionBlock[2] - 1][positionBlock[3]] =
          //   map[positionBlock[0]][positionBlock[1]];
          // map[positionBlock[4] - 1][positionBlock[5]] =
          //   map[positionBlock[4]][positionBlock[5]];
          // map[positionBlock[6] - 1][positionBlock[7]] =
          //   map[positionBlock[6]][positionBlock[7]];
          // //undraw
          // map[positionBlock[0]][positionBlock[1]] = 0;
          // map[positionBlock[2]][positionBlock[3]] = 0;
          // map[positionBlock[6]][positionBlock[7]] = 0;
          // for (let i = 0; i < positionBlock.length; i += 2) {
          //   positionBlock[i] -= 1;
          // }
        } else {
          currentBlock = nextBlock;
          nextBlock = blocks[getRandomInt(0, 6)];
          blockOnMap();
        }

        break;
      default:
        break;
    }
  }
  function control(e: any) {
    switch (e.keyCode) {
      case 37:
        moveLeft = true;
        break;
      case 39:
        moveRight = true;
        break;
      case 40:
        moveDown = true;
        break;
      default:
        break;
    }
  }

  window.addEventListener("keydown", function (e) {
    control(e);
  });

  mapGame();
  blockOnMap();

  createGameLoop((delta: number) => {
    delayTime += delta;
    if (delayTime >= 0.5) {
      delayTime = 0;
      collisionHandmade();
    }
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clearColor(0, 0, 0, 1);
    shapeRenderer.setProjection(camera.projectionView.values);
    shapeRenderer.begin();
    shapeRenderer.rect(true, 0, 0, 1000, 2000, black);
    shapeRenderer.end();
    // console.log(currentBlock);

    //draw border
    batch.setProjection(camera.projectionView.values);
    batch.begin();
    drawTetromino();
    batch.draw(bgRight, 1000, 0, 500, 2000);
    batch.end();
  });
};

// init();
// init2();
init3();
