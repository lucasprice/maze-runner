const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    acrcade: {
      debug: false,
      gravity: {
        y: 300
      }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image("tiles", "assets/tiles.png");
  this.load.spritesheet("dude", "assets/dude.png",
                        { frameWidth: 32,
                          frameHeight: 32
                        });
  this.load.tilemapCSV("map", "assets/Maze Runner Levels - Level 1.csv");
};

function create() {
  this.map = this.make.tilemap({
    key: "map",
    tileWidth: 32,
    tileHeight: 32
  });

  /* addTilesetImage(tilesetName [, key] [, tileWidth] [, tileHeight] [, tileMargin] [, tileSpacing] [, gid])

     Adds an image to the map to be used as a tileset. A single map
     may use multiple tilesets. Note that the tileset name can be
     found in the JSON file exported from Tiled, or in the Tiled
     editor.

  */
  this.tiles = this.map.addTilesetImage("tiles");

  /* createStaticLayer(layerID, tileset, x, y)

     Creates a new StaticTilemapLayer that renders the LayerData
     associated with the given layerID. The currently selected layer
     in the map is set to this new layer.

     The layerID is important. If you've created your map in Tiled
     then you can get this by looking in Tiled and looking at the
     layer name. Or you can open the JSON file it exports and look at
     the layers[].name value. Either way it must match.

     It's important to remember that a static layer cannot be
     modified. See StaticTilemapLayer for more information.
  */
  this.layer = this.map.createStaticLayer(0, this.tiles, 0, 0);

  /* setCollisionBetween(start, stop [, collides] [, recalculateFaces] [, layer])

     Sets collision on a range of tiles in a layer whose index is
     between the specified start and stop (inclusive). Calling this
     with a start value of 10 and a stop value of 14 would set
     collision for tiles 10, 11, 12, 13 and 14. The collides parameter
     controls if collision will be enabled (true) or disabled (false).

     If no layer specified, the map's current layer is used.
  */
  this.map.setCollisionBetween(0, 22, this.layer);

  /* Resize world to fit the level. */
  this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

  /* sprite(x, y, key [, frame])

     Creates a new Arcade Sprite object with a Dynamic body.
  */
  this.dude = this.physics.add.sprite(10, 10, "dude");
  this.dude.setBounce(0.2);
  this.dude.setGravityY(300);
  this.dude.setCollideWorldBounds(true);

  this.anims.create({
    key: "stand",
    frames: [ { key: "dude", frame: 7 } ]
  });

  this.anims.create({
    key: "jump",
    frames: [ { key: "dude", frame: 4 } ]
  });

  this.anims.create({
    key: 'walk',
    frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 6 }),
    frameRate: 10,
    repeat: -1
  });

  /* This will watch the player and layer every frame to check for
     collisions. */
  this.physics.add.collider(this.dude, this.layer);

  this.cursors = this.input.keyboard.createCursorKeys();

  this.cameras.main.startFollow(this.dude);
  this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

  // const debugGraphics = this.add.graphics().setAlpha(0.75);
  // this.layer.renderDebug(debugGraphics, {
  //   tileColor: null, // Color of non-colliding tiles
  //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
  //   faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
  // });
};

function update(time, delta) {

  if (this.cursors.right.isDown) {
    this.dude.setFlipX(false);
    this.dude.setVelocityX(100);
    this.dude.anims.play("walk", true);
  } else if (this.cursors.left.isDown) {
    this.dude.setFlipX(true);
    this.dude.setVelocityX(-100);
    this.dude.anims.play("walk", true);
  } else {
    /* Stop any previous movement. */
    this.dude.setVelocityX(0);
    this.dude.anims.play("stand");
  }

  if (this.cursors.up.isDown) {
    if (this.dude.body.onFloor()) {
      this.dude.setVelocityY(-100);
    } else if (this.dude.body.onWall()) {
      this.dude.setVelocityY(-50);
    }
  }
};