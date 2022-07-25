import {
  createGameLoop,
  createStage,
  createViewport,
  InputEvent,
  PolygonBatch,
  ShapeRenderer,
  Texture,
  Vector2,
  ViewportInputHandler,
  BitmapFont,
  TextureRegion,
  Animation,
  PlayMode,
} from "gdxts";
// import { init2 } from "./PokemonGame";
export const init = async () => {
  const stage = createStage();
  const canvas = stage.getCanvas();
  const viewport = createViewport(canvas, 600, 1000);
  const gl = viewport.getContext();
  const background1 = await Texture.load(gl, "./flappy-bird.gif");
  let layer1 = 0;
  const background2 = await Texture.load(gl, "./flappy-bird2.gif");
  let layer2 = 595;

  const obstacles = await Texture.load(gl, "./obstacle.webp");
  const gameovericon = await Texture.load(gl, "./gameover.png");
  const tapToPlay = await Texture.load(gl, "./taptoplay.png");
  const font = await BitmapFont.load(gl, "./font.fnt");

  const shapeRenderer = new ShapeRenderer(gl);
  const batch = new PolygonBatch(gl);
  const camera = viewport.getCamera();
  const inputHandler = new ViewportInputHandler(viewport);

  const newBird = await Texture.load(gl, "./newbird.png");
  const regions = TextureRegion.splitTexture(newBird, 3, 1);
  const birdAnimation = new Animation(regions.slice(0, 3), 0.25);

  let characterPosition = new Vector2(250, 500);
  let rotationOfBird = 0;
  let obstaclePosition1 = new Vector2(595, 195);
  let obstaclePosition2 = new Vector2(995, 195);

  gl.clearColor(0, 0, 0, 1);
  let lastClick = false;
  let speedGame = 185;
  let obstacleSpeed = speedGame;
  let count = 0;
  let heightObstacleUp1 = 300;
  let heightObstacleDown1 = 270;
  let heightObstacleUp2 = 350;
  let heightObstacleDown2 = 220;
  let firstClick = false;
  let runningGame = true;
  let frame = 0;
  let i = 0;

  inputHandler.addEventListener(InputEvent.TouchStart, (x, y) => {
    firstClick = true;

    if (firstClick === true && runningGame === true) {
      speedGame = 185;
      count = 0;
      rotationOfBird = -0.1;
    }

    lastClick = true;
  });

  function moveOfBird(delta: number) {
    if (lastClick) {
      lastClick = true;
      characterPosition.y = characterPosition.y + (speedGame *= 1.02) * delta;
      count += speedGame * delta;
      if (rotationOfBird <= 0.25) {
        setTimeout(() => {
          rotationOfBird += 0.05;
          // console.log(rotationOfBird);
        }, 50);
      }

      if (count >= 80) {
        lastClick = false;
        count--;
      }
    }

    if (lastClick === false) {
      characterPosition.y -= speedGame * delta;
      if (count >= -30 && count < 80) {
        count -= (speedGame *= 1.025) * delta;
      }
      if (rotationOfBird >= -1) {
        rotationOfBird -= 0.07;
      }
    }
  }

  function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function obstacleMove(delta: number) {
    obstaclePosition1.x -= obstacleSpeed * delta;
    obstaclePosition2.x -= obstacleSpeed * delta;
    layer1 -= delta * obstacleSpeed;
    layer2 -= delta * obstacleSpeed;

    if (obstaclePosition1.x < -200) {
      obstaclePosition1.set(695, 195);
      randomHeightOfObstacle();
      // heightObstacleUp1 = getRandomInt(200, 800);
      // heightObstacleDown1 = getRandomInt(200, 800);

      if (obstacleSpeed <= 500) {
        obstacleSpeed *= 1.02;
      }
    }
    if (obstaclePosition2.x < -200) {
      obstaclePosition2.set(695, 195);
      randomHeightOfObstacle();
      if (obstacleSpeed <= 500) {
        obstacleSpeed *= 1.02;
      }
    }
  }

  function randomHeightOfObstacle() {
    if (obstaclePosition1.x >= 600) {
      let optionOfObstacle1 = getRandomInt(1, 5);
      switch (optionOfObstacle1) {
        case 1:
          heightObstacleDown1 = 150;
          heightObstacleUp1 = 500; //
          break;

        case 2:
          heightObstacleDown1 = 250;
          heightObstacleUp1 = 400;
          break;
        case 3:
          heightObstacleDown1 = 350;
          heightObstacleUp1 = 300;
          break;
        case 4:
          heightObstacleDown1 = 450;
          heightObstacleUp1 = 200;
          break;
        case 5:
          heightObstacleDown1 = 550;
          heightObstacleUp1 = 125;
          break;
        default:
          break;
      }
    }

    if (obstaclePosition2.x >= 600) {
      let optionOfObstacle2 = getRandomInt(1, 5);
      switch (optionOfObstacle2) {
        case 1:
          heightObstacleDown2 = 150;
          heightObstacleUp2 = 500;
          break;

        case 2:
          heightObstacleDown2 = 250;
          heightObstacleUp2 = 400;
          break;
        case 3:
          heightObstacleDown2 = 350;
          heightObstacleUp2 = 300;
          break;
        case 4:
          heightObstacleDown2 = 450;
          heightObstacleUp2 = 200;
          break;
        case 5:
          heightObstacleDown2 = 550;
          heightObstacleUp2 = 125;
          break;
        default:
          break;
      }
    }
  }

  createGameLoop((delta: number) => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    shapeRenderer.setProjection(camera.projectionView.values);
    shapeRenderer.begin();
    shapeRenderer.rect(true, 0, 0, 600, 1000);
    shapeRenderer.end();
    frame += delta;
    let region = birdAnimation.getKeyFrame(frame, PlayMode.LOOP);
    if (i > 0.2) {
      i = 0;
      frame %= 3;
    }

    // console.log(characterPosition.y, speedGame);
    if (firstClick === true && runningGame === true) {
      moveOfBird(delta);
      obstacleMove(delta);
    }
    // console.log(layer1);

    batch.setProjection(camera.projectionView.values);
    batch.begin();
    batch.draw(background2, layer2, 0, 600, 1000);
    batch.draw(background1, layer1, 0, 600, 1000);

    region.draw(
      batch,
      characterPosition.x,
      characterPosition.y, // height of chim
      60,
      60,
      30,
      30,
      rotationOfBird
    );

    // obstacle 1
    batch.draw(
      obstacles,
      obstaclePosition1.x - 50,
      obstaclePosition1.y,
      150,
      heightObstacleDown1 // heightDown // default = 270 // max 500 min 150
    );
    batch.draw(
      obstacles,
      obstaclePosition1.x - 50,
      obstaclePosition1.y + 610,
      150,
      heightObstacleUp1, // heightUp // default = 300 // max 500 min 150
      75,
      100,
      47.13
    );

    // obstacles 2
    batch.draw(
      obstacles,
      obstaclePosition2.x - 50,
      obstaclePosition2.y,
      150,
      heightObstacleDown2 // height ben duoi default = 270 // max 500 min 150
    );
    batch.draw(
      obstacles,
      obstaclePosition2.x - 50,
      obstaclePosition2.y + 610,
      150,
      heightObstacleUp2, // height ben tren // default = 300 // max 500 min 150
      75,
      100,
      47.13
    );

    if (firstClick === false && runningGame === true) {
      batch.draw(tapToPlay, 180, 330, 200, 200);
    }

    if (characterPosition.y <= 190) {
      runningGame = false;
      firstClick = false;
      lastClick = false;
      speedGame = 0;
      batch.draw(gameovericon, 50, 500, 500, 250);
    }

    if (Math.abs(characterPosition.x - obstaclePosition1.x) <= 90) {
      // crash with obstacleDown
      if (characterPosition.y - 90 - heightObstacleDown1 <= 90) {
        batch.draw(gameovericon, 50, 500, 500, 250);
        runningGame = false;
        firstClick = false;
        lastClick = false;
        speedGame = 0;
      }

      // crash with obstacleUp

      if (heightObstacleUp1 === 500 && characterPosition.y >= 460) {
        batch.draw(gameovericon, 50, 500, 500, 250);
        runningGame = false;
        firstClick = false;
        lastClick = false;
        speedGame = 0;
      }
      if (heightObstacleUp1 === 400 && characterPosition.y >= 560) {
        batch.draw(gameovericon, 50, 500, 500, 250);
        runningGame = false;
        firstClick = false;
        lastClick = false;
        speedGame = 0;
      }
      if (heightObstacleUp1 === 300 && characterPosition.y >= 660) {
        batch.draw(gameovericon, 50, 500, 500, 250);
        runningGame = false;
        firstClick = false;
        lastClick = false;
        speedGame = 0;
      }
      if (heightObstacleUp1 === 200 && characterPosition.y >= 760) {
        batch.draw(gameovericon, 50, 500, 500, 250);
        runningGame = false;
        firstClick = false;
        lastClick = false;
        speedGame = 0;
      }
      if (heightObstacleUp1 === 125 && characterPosition.y >= 830) {
        batch.draw(gameovericon, 50, 500, 500, 250);
        runningGame = false;
        firstClick = false;
        lastClick = false;
        speedGame = 0;
      }
    }

    if (Math.abs(characterPosition.x - obstaclePosition2.x) <= 90) {
      if (characterPosition.y - 90 - heightObstacleDown2 <= 90) {
        batch.draw(gameovericon, 50, 500, 500, 250);
        runningGame = false;
        firstClick = false;
        lastClick = false;
        speedGame = 0;
      }

      if (heightObstacleUp2 === 350 && characterPosition.y >= 610) {
        batch.draw(gameovericon, 50, 500, 500, 250);
        runningGame = false;
        firstClick = false;
        lastClick = false;
        speedGame = 0;
      }

      if (heightObstacleUp2 === 500 && characterPosition.y >= 460) {
        batch.draw(gameovericon, 50, 500, 500, 250);
        runningGame = false;
        firstClick = false;
        lastClick = false;
        speedGame = 0;
      }
      if (heightObstacleUp2 === 400 && characterPosition.y >= 560) {
        batch.draw(gameovericon, 50, 500, 500, 250);
        runningGame = false;
        firstClick = false;
        lastClick = false;
        speedGame = 0;
      }
      if (heightObstacleUp2 === 300 && characterPosition.y >= 660) {
        batch.draw(gameovericon, 50, 500, 500, 250);
        runningGame = false;
        firstClick = false;
        lastClick = false;
        speedGame = 0; // correct
      }
      if (heightObstacleUp2 === 200 && characterPosition.y >= 760) {
        batch.draw(gameovericon, 50, 500, 500, 250);
        runningGame = false;
        firstClick = false;
        lastClick = false;
        speedGame = 0;
      }
      if (heightObstacleUp2 === 125 && characterPosition.y >= 830) {
        batch.draw(gameovericon, 50, 500, 500, 250);
        runningGame = false;
        firstClick = false;
        lastClick = false;
        speedGame = 0;
      }
    }
    if (runningGame === false) {
      font.draw(batch, "NON", 260, 450, 250);
    }

    //bg
    if (layer1 <= -595) {
      layer1 = 594;
    }
    if (layer2 <= -595) {
      layer2 = 594;
    }

    batch.end();
  });
};

init();
