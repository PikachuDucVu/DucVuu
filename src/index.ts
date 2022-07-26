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

export const FlappyBird = async () => {
  const stage = createStage();
  const canvas = stage.getCanvas();
  const viewport = createViewport(canvas, 600, 1000);
  const gl = viewport.getContext();

  const background1 = await Texture.load(gl, "./flappy-bird.gif");
  const background2 = await Texture.load(gl, "./flappy-bird2.gif");
  const obstacles = await Texture.load(gl, "./obstacle.webp");
  const gameovericon = await Texture.load(gl, "./gameover.png");
  const tapToPlay = await Texture.load(gl, "./taptoplay.png");
  const font = await BitmapFont.load(gl, "./font.fnt");
  const newBird = await Texture.load(gl, "./newbird.png");
  const regions = TextureRegion.splitTexture(newBird, 3, 1);
  const birdAnimation = new Animation(regions.slice(0, 3), 0.25);

  const shapeRenderer = new ShapeRenderer(gl);
  const batch = new PolygonBatch(gl);
  const camera = viewport.getCamera();
  const inputHandler = new ViewportInputHandler(viewport);

  //config of bỉd
  let characterPosition = new Vector2(250, 500);
  let rotationOfBird = 0;
  let i = 0;
  let frame = 0; // animation

  let firstClick = false;
  let falling = true;
  let runningGame = true;

  //config obstacle
  let obstaclePosition = [495, 195, 995, 195];
  let obstacleSpeed = 350;
  let heightObstacleUp1 = 300;
  let heightObstacleDown1 = 270;
  let heightObstacleUp2 = 200;
  let heightObstacleDown2 = 420;

  //config game
  let speedY = 0;
  let gravityOfBird = 0;
  let fallSpeed = 0;
  let tryagainmode = false;
  let score = 0;

  gl.clearColor(0, 0, 0, 1);
  let layerbg2 = 595;
  let layerbg1 = 0;

  inputHandler.addEventListener(InputEvent.TouchStart, (x, y) => {
    firstClick = true;
    if (firstClick === true && runningGame === true) {
      speedY = 525;
      rotationOfBird = 0;
      gravityOfBird = 0;
      fallSpeed = 200;
    }
    falling = false;

    //try again
    if (tryagainmode === true && runningGame === false) {
      characterPosition = new Vector2(250, 500);

      // redeclare

      rotationOfBird = 0;
      i = 0;
      frame = 0;

      layerbg2 = 595;
      layerbg1 = 0;

      speedY = 0;
      gravityOfBird = 0;
      fallSpeed = 0;
      score = 0;

      obstaclePosition = [495, 195, 995, 195];
      obstacleSpeed = 350;
      heightObstacleUp1 = 300;
      heightObstacleDown1 = 270;
      heightObstacleUp2 = 200;
      heightObstacleDown2 = 420;

      runningGame = true;
      firstClick = false;
      falling = true;
    }
    tryagainmode = false;
  });

  function moveOfBird(delta: number) {
    if (falling === false) {
      characterPosition.y = characterPosition.y + speedY * delta;
      if (rotationOfBird <= 0.3) {
        setTimeout(() => {
          rotationOfBird += 0.04;
        }, 50);
      }

      if (speedY <= 20) {
        falling = true;
      }
    }

    if (falling === true) {
      characterPosition.y -= fallSpeed * delta;
      if (rotationOfBird >= -1.05) {
        setTimeout(() => {
          rotationOfBird -= 0.07 - delta;
        }, 50);
      }
    }
  }

  function spawnAndMovePipe(delta: number) {
    obstaclePosition[0] -= obstacleSpeed * delta;
    obstaclePosition[2] -= obstacleSpeed * delta;

    //bg move
    layerbg1 -= delta * obstacleSpeed;
    layerbg2 -= delta * obstacleSpeed;

    // respawn pipe
    if (obstaclePosition[0] < -200) {
      obstaclePosition[0] = 695;
      randomHeightOfObstacle();

      if (obstacleSpeed <= 520) {
        obstacleSpeed *= 1.02;
      }
    }
    if (obstaclePosition[2] < -200) {
      obstaclePosition[2] = 695;
      randomHeightOfObstacle();

      if (obstacleSpeed <= 500) {
        obstacleSpeed *= 1.02;
      }
    }
  }

  //random height of obstacle
  function randomHeightOfObstacle() {
    if (obstaclePosition[0] >= 600) {
      let optionOfObstacle1 = getRandomInt(1, 5);
      score += 1;
      switch (optionOfObstacle1) {
        case 1:
          heightObstacleDown1 = 150;
          heightObstacleUp1 = 400; //
          break;

        case 2:
          heightObstacleDown1 = 250;
          heightObstacleUp1 = 300;
          break;
        case 3:
          heightObstacleDown1 = 350;
          heightObstacleUp1 = 200;
          break;
        case 4:
          heightObstacleDown1 = 450;
          heightObstacleUp1 = 150;
          break;
        case 5:
          heightObstacleDown1 = 550;
          heightObstacleUp1 = 125;
          break;
        default:
          break;
      }
    }

    if (obstaclePosition[2] >= 600) {
      let optionOfObstacle2 = getRandomInt(1, 5);
      score += 1;
      switch (optionOfObstacle2) {
        case 1:
          heightObstacleDown2 = 150;
          heightObstacleUp2 = 400;
          break;

        case 2:
          heightObstacleDown2 = 250;
          heightObstacleUp2 = 300;
          break;
        case 3:
          heightObstacleDown2 = 350;
          heightObstacleUp2 = 200;
          break;
        case 4:
          heightObstacleDown2 = 450;
          heightObstacleUp2 = 150;
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
  function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // try again

  createGameLoop((delta: number) => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    shapeRenderer.setProjection(camera.projectionView.values);
    shapeRenderer.begin();
    shapeRenderer.rect(true, 0, 0, 600, 1000);
    shapeRenderer.end();

    frame += delta * 2;
    gravityOfBird += delta;
    speedY = speedY - 20 - gravityOfBird;
    fallSpeed += 250 * delta * 1.75;

    if (firstClick === true && runningGame === true) {
      spawnAndMovePipe(delta);
      moveOfBird(delta);
    }

    // draw background
    batch.setProjection(camera.projectionView.values);
    batch.begin();
    batch.draw(background1, 0, 0, 600, 1000);
    batch.draw(background2, layerbg2, 0, 600, 1000);
    batch.draw(background1, layerbg1, 0, 600, 1000);
    if (layerbg1 <= -595) {
      layerbg1 = 590;
    }
    if (layerbg2 <= -595) {
      layerbg2 = 590;
    }

    //draw obstacle
    batch.draw(
      obstacles,
      obstaclePosition[0] - 50,
      obstaclePosition[1],
      150,
      heightObstacleDown1 // heightDown // default = 270 // max 500 min 150
    );
    batch.draw(
      obstacles,
      obstaclePosition[0] - 50,
      obstaclePosition[1] + 610,
      150,
      heightObstacleUp1, // heightUp // default = 300 // max 500 min 150
      75,
      100,
      47.13
    );
    batch.draw(
      obstacles,
      obstaclePosition[2] - 50,
      obstaclePosition[3],
      150,
      heightObstacleDown2 // heightDown // default = 270 // max 500 min 150
    );
    batch.draw(
      obstacles,
      obstaclePosition[2] - 50,
      obstaclePosition[3] + 610,
      150,
      heightObstacleUp2, // heightUp // default = 300 // max 500 min 150
      75,
      100,
      47.13
    );

    //draw chim
    let region = birdAnimation.getKeyFrame(frame, PlayMode.LOOP);
    if (i > 0.2) {
      i = 0;
      frame %= 3;
    }
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

    //gameover condition
    if (firstClick === false && runningGame === true) {
      batch.draw(tapToPlay, 180, 330, 200, 200);
    }

    if (characterPosition.y <= 190) {
      runningGame = false;
      firstClick = false;
      falling = false;
      speedY = 0;
    }

    if (Math.abs(characterPosition.x - obstaclePosition[0]) <= 90) {
      // crash with obstacleDown
      if (characterPosition.y - 100 - heightObstacleDown1 <= 90) {
        runningGame = false;
        firstClick = false;
        speedY = 0;
      }
      // crash with obstacleUp
      if (heightObstacleUp1 === 300 && characterPosition.y >= 660) {
        runningGame = false;
        firstClick = false;
        speedY = 0;
      }
      if (heightObstacleUp1 === 400 && characterPosition.y >= 560) {
        runningGame = false;
        firstClick = false;
        speedY = 0;
      } //
      if (heightObstacleUp1 === 200 && characterPosition.y >= 760) {
        runningGame = false;
        firstClick = false;
        speedY = 0;
      } //
      if (heightObstacleUp1 === 150 && characterPosition.y >= 810) {
        runningGame = false;
        firstClick = false;
        speedY = 0;
      }
      if (heightObstacleUp1 === 125 && characterPosition.y >= 835) {
        runningGame = false;
        firstClick = false;
        speedY = 0;
      }
    }

    if (Math.abs(characterPosition.x - obstaclePosition[2]) <= 95) {
      if (characterPosition.y - 90 - heightObstacleDown2 <= 90) {
        runningGame = false;
        firstClick = false;
        speedY = 0;
      }
      if (heightObstacleUp2 === 300 && characterPosition.y >= 660) {
        runningGame = false;
        firstClick = false;
        speedY = 0;
      }
      if (heightObstacleUp2 === 400 && characterPosition.y >= 560) {
        runningGame = false;
        firstClick = false;
        speedY = 0;
      }
      if (heightObstacleUp2 === 200 && characterPosition.y >= 760) {
        runningGame = false;
        firstClick = false;
        speedY = 0;
      }
      if (heightObstacleUp2 === 150 && characterPosition.y >= 810) {
        runningGame = false;
        firstClick = false;
        speedY = 0;
      }
      if (heightObstacleUp2 === 125 && characterPosition.y >= 830) {
        runningGame = false;
        firstClick = false;
        speedY = 0;
      }
      // crash with obstacleUp
    }
    if (runningGame === false) {
      batch.draw(gameovericon, 50, 500, 500, 250);
      if (characterPosition.y >= 190) {
        characterPosition.y -= fallSpeed * delta;
      }
      font.draw(batch, "TAP TO TRY AGAIN", 150, 500, 400);
      font.draw(batch, "Your Score is: " + score, 170, 760, 400);
      if (rotationOfBird >= -1.2) {
        rotationOfBird -= 0.1 - delta;
      }
      setTimeout(() => {
        tryagainmode = true;
      }, 800);
    }

    batch.end();
  });
};

FlappyBird();
