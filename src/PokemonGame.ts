import {
  createStage,
  createViewport,
  createGameLoop,
  ShapeRenderer,
  Texture,
  TextureRegion,
  PolygonBatch,
  Animation,
  PlayMode,
  ViewportInputHandler,
  InputEvent,
  Vector2,
} from "gdxts";
import Walkable from "walkable";

export const init2 = async () => {
  let walkable = new Walkable(500, 1000);

  const stage = createStage();
  const canvas = stage.getCanvas();
  const viewport = createViewport(canvas, 500, 1000);
  const gl = viewport.getContext();
  const background = await Texture.load(gl, "./pokemon-bg.jpg");

  const mapData = await fetch("./test.tmj").then((res) => res.json());
  const obstacles = mapData.layers
    .find((l: any) => l.name === "obstacles")
    .objects.map((rect: any) => ({
      ...rect,
      y: 1000 - rect.y - rect.height,
    }));

  for (let rect of obstacles) {
    walkable.addRect(rect.width, rect.height, rect.x, rect.y);
  }

  // eslint-disable-next-line
  // const texture = await Texture.load(gl, "./charizard.png");
  const characterTexture = await Texture.load(gl, "./spritesheet.png");
  // const apple = await Texture.load(gl, "./apple.png");
  const regions = TextureRegion.splitTexture(characterTexture, 4, 4);

  const walkDownAnimation = new Animation(regions.slice(0, 4), 0.2);
  const walkLeftAnimation = new Animation(regions.slice(4, 8), 0.2);
  const walkRightAnimation = new Animation(regions.slice(8, 12), 0.2);
  const walkUpAnimation = new Animation(regions.slice(12, 16), 0.2);

  const shapeRenderer = new ShapeRenderer(gl);
  const batch = new PolygonBatch(gl);
  const camera = viewport.getCamera();
  const inputHandler = new ViewportInputHandler(viewport);
  let characterPosition = new Vector2(250, 500);

  let frame = 0;
  let rotation = 0;
  let vectorResult = new Vector2();
  let d = new Vector2();

  let count = 0;

  gl.clearColor(0, 0, 0, 1);
  let nextPosition = new Vector2(250, 500);
  const path: number[] = [];
  inputHandler.addEventListener(InputEvent.TouchStart, (x, y) => {
    path.length = 0;
    count = 0;
    nextPosition = inputHandler.getTouchedWorldCoord();
    walkable.findPath(
      characterPosition.x,
      characterPosition.y,
      nextPosition.x,
      nextPosition.y,
      10,
      path
    );
    console.log(path);

    nextPosition.x = path[0];
    nextPosition.y = path[1];
    rotation =
      (Math.atan2(
        nextPosition.y - characterPosition.y,
        nextPosition.x - characterPosition.x
      ) *
        180) /
      Math.PI;
  });
  var region = walkDownAnimation.getKeyFrame(frame, PlayMode.NORMAL);
  const moveSpeed = 150;

  createGameLoop((delta: number) => {
    vectorResult.x = nextPosition.x - characterPosition.x;
    vectorResult.y = nextPosition.y - characterPosition.y;
    d = vectorResult.nor();
    gl.clear(gl.COLOR_BUFFER_BIT);
    shapeRenderer.setProjection(camera.projectionView.values);
    shapeRenderer.begin();
    shapeRenderer.rect(true, 0, 0, 500, 1000);
    shapeRenderer.end();

    if (
      characterPosition.x !== nextPosition.x ||
      characterPosition.y !== nextPosition.y
    ) {
      frame += delta;
      if (rotation >= -45 && rotation < 45) {
        region = walkRightAnimation.getKeyFrame(frame, PlayMode.LOOP);
      }
      if (rotation >= -135 && rotation < -45) {
        region = walkDownAnimation.getKeyFrame(frame, PlayMode.LOOP);
      }
      if (rotation >= 45 && rotation < 135) {
        region = walkUpAnimation.getKeyFrame(frame, PlayMode.LOOP);
      }
      if (
        (rotation >= 135 && rotation < 180) ||
        (rotation <= -135 && rotation >= -180)
      ) {
        region = walkLeftAnimation.getKeyFrame(frame, PlayMode.LOOP);
      }

      if (characterPosition.x < nextPosition.x) {
        characterPosition.x = Math.min(
          characterPosition.x + d.x * moveSpeed * delta,
          nextPosition.x
        );
      }
      if (characterPosition.y < nextPosition.y) {
        characterPosition.y = Math.min(
          characterPosition.y + d.y * moveSpeed * delta,
          nextPosition.y
        );
      }
      if (characterPosition.x > nextPosition.x) {
        characterPosition.x = Math.max(
          characterPosition.x + d.x * moveSpeed * delta,
          nextPosition.x
        );
      }
      if (characterPosition.y > nextPosition.y) {
        characterPosition.y = Math.max(
          characterPosition.y + d.y * moveSpeed * delta,
          nextPosition.y
        );
      }
    } else {
      frame = 0;
      setTimeout(() => {
        region = walkDownAnimation.getKeyFrame(frame, PlayMode.NORMAL);
      }, 0.2);
      if (count <= path.length) {
        count += 2;
      } else {
        count = 0;
      }
      nextPosition.x = path[count];
      nextPosition.y = path[count + 1];
      // console.log(rotation);
      rotation =
        (Math.atan2(
          nextPosition.y - characterPosition.y,
          nextPosition.x - characterPosition.x
        ) *
          180) /
        Math.PI;
    }

    batch.setProjection(camera.projectionView.values);
    batch.begin();
    batch.draw(background, 0, 0, 500, 1000);
    region.draw(
      batch,
      characterPosition.x - 50,
      characterPosition.y - 20,
      50,
      50
    );
    batch.end();

    // shapeRenderer.begin();
    // for (let rect of obstacles) {
    //   shapeRenderer.rect(
    //     false,
    //     rect.x,
    //     rect.y,
    //     rect.width,
    //     rect.height,
    //     Color.WHITE
    //   );
    // }

    // if (path.length >= 4) {
    //   for (let i = 2; i <= path.length; i += 2) {
    //     shapeRenderer.line(
    //       path[i - 2],
    //       path[i - 1],
    //       path[i],
    //       path[i + 1],
    //       Color.WHITE
    //     );
    //   }
    // }

    // shapeRenderer.end();
  });
};
