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
  Color,
} from "gdxts";

export const init = async () => {
  const stage = createStage();
  const canvas = stage.getCanvas();
  const viewport = createViewport(canvas, 1500, 2000);
  const gl = viewport.getContext();
  const shapeRenderer = new ShapeRenderer(gl);
  const batch = new PolygonBatch(gl);
  const camera = viewport.getCamera();
  const inputHandler = new ViewportInputHandler(viewport);

  const background = await Texture.load(gl, "./TetrisBg.png");
  const bgRight = await Texture.load(gl, "./bg1.png");
  const block = await Texture.load(gl, "./7251.png");
  const redBlock = await Texture.load(gl, "./RedBlock.png");
  const purpleBlock = await Texture.load(gl, "./PurpleBlock.png");
  const orangeBlock = await Texture.load(gl, "./OrangeBlock.png");
  const yellowBlock = await Texture.load(gl, "./YellowBlock.png");
  const blueBlock = await Texture.load(gl, "./BlueBlock.png");
  const blueSkyBlock = await Texture.load(gl, "./BlueSkyBlock.png");
  const greenBlock = await Texture.load(gl, "./GreenBlock.png");

  //config game
  let blockPosition = new Vector2(415, 1830);

  //tetromino
  const squareBlock = [
    [1, 1],
    [1, 1],
  ];
  //I
  const iBlock1 = [1, 1, 1, 1];
  const iBlock2 = [[1], [1], [1], [1]];

  //J
  const jBlock1 = [
    [1, 0, 0],
    [1, 1, 1],
  ];
  const jBlock2 = [
    [1, 1],
    [1, 0],
    [1, 0],
  ];
  const jBlock3 = [
    [1, 1, 1],
    [0, 0, 1],
  ];
  //L
  const LBlock1 = [
    [0, 0, 1],
    [1, 1, 1],
  ];
  const LBlock2 = [
    [1, 1],
    [0, 1],
    [0, 1],
  ];
  //s
  const sBlock1 = [
    [0, 1, 1],
    [1, 1, 0],
  ];
  const sBlock2 = [
    [1, 0],
    [1, 1],
    [0, 1],
  ];
  //t
  const tBlock1 = [
    [0, 1, 0],
    [1, 1, 1],
  ];
  const tBlock2 = [
    [1, 0],
    [1, 1],
    [1, 0],
  ];
  const tBlock3 = [
    [1, 1, 1],
    [0, 1, 0],
  ];
  const tBlock4 = [
    [0, 1],
    [1, 1],
    [0, 1],
  ];
  //z
  const zBlock1 = [
    [1, 1, 0],
    [0, 1, 1],
  ];
  const zBlock2 = [
    [1, 0],
    [1, 1],
    [0, 1],
  ];

  function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  createGameLoop((delta: number) => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    shapeRenderer.setProjection(camera.projectionView.values);
    shapeRenderer.begin();
    shapeRenderer.rect(true, 0, 0, 1000, 2000);
    shapeRenderer.end();

    window.addEventListener("keydown", function (e) {
      console.log(e.key);
    });

    //draw background
    batch.setProjection(camera.projectionView.values);
    batch.begin();
    batch.draw(background, 0, 0, 1000, 2000);
    batch.draw(block, blockPosition.x, blockPosition.y, 84, 84);
    batch.draw(bgRight, 1000, 0, 500, 2000);
    batch.end();
  });
};

init();
