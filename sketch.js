let tiles = [];

let grid = [];
let path = [];
let pathIndex = 0;

const DIM = 30;

function removeDuplicatedTiles(tempTiles) {
  for(let i = tempTiles.length - 1; i > 0; i--) {
    anySameEdges = false;
    for(let j = i-1; j >= 0; j--) {
      sameEdges = true;
      for(let k = 0; k < 4; k++) {
        if(tempTiles[i].edges[k] !== tempTiles[j].edges[k]) {
          sameEdges = false;
        }
      }
      anySameEdges = anySameEdges || sameEdges;
    }
    if(anySameEdges) {
      tempTiles.pop(i);
    }
  }
  return tempTiles;
}

function setup() {
  createCanvas(750, 750);
  
  const w = width / DIM;
  const h = height / DIM;

  let startTiles = Tile.getTiles();

  for (let i = 0; i < startTiles.length; i++) {
    let tempTiles = [];
    for (let j = 0; j < 4; j++) {
      tempTiles.push(startTiles[i].rotate(j, w, h));
    }
    if(i != 10) {
       tempTiles = removeDuplicatedTiles(tempTiles);
    }
    tiles = tiles.concat(tempTiles);
  }
  console.log("Num tiles: " + tiles.length);

  // Generate the adjacency rules based on edges
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    tile.analyze(tiles);
  }

  startOver();
}

function startCondition_Border() {
  // Making border
  // Top
  for(let i = 0; i < DIM; i++) {
    grid[i].collapsed = true;
    grid[i].options = [0];
  }
  // Right
  for(let i = 0; i < DIM; i++) {
    grid[DIM-1 + DIM*i].collapsed = true;
    grid[DIM-1 + DIM*i].options = [0];
  }
  // Bottom
  for(let i = 0; i < DIM; i++) {
    grid[DIM*(DIM-1) + i].collapsed = true;
    grid[DIM*(DIM-1) + i].options = [0];
  }
  // Left
  for(let i = 0; i < DIM; i++) {
    grid[DIM*i].collapsed = true;
    grid[DIM*i].options = [0];
  }
}

function startCondition_centerChip() {
  let size = 4;
  for(let i = int(DIM/2 - size/2); i < int(DIM/2 + (size+1)/2); i++) {
    for(let j = int(DIM/2 - size/2); j < int(DIM/2 + (size+1)/2); j++) {
      grid[DIM*i + j].collapsed = true;
      grid[DIM*i + j].options = [1];
    }
  }
}

function NextGrid(grid) {
  const nextGrid = [];
  
  for (let j = 0; j < DIM; j++) {
    for (let i = 0; i < DIM; i++) {
      let index = i + j * DIM;
      if (grid[index].collapsed) {
        nextGrid[index] = grid[index];
      } else {
        let options = new Array(tiles.length).fill(0).map((x, i) => i);
        // Look up
        if (j > 0) {
          let up = grid[i + (j - 1) * DIM];
          let validOptions = [];
          for (let option of up.options) {
            let valid = tiles[option].down;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions);
        }
        // Look right
        if (i < DIM - 1) {
          let right = grid[i + 1 + j * DIM];
          let validOptions = [];
          for (let option of right.options) {
            let valid = tiles[option].left;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions);
        }
        // Look down
        if (j < DIM - 1) {
          let down = grid[i + (j + 1) * DIM];
          let validOptions = [];
          for (let option of down.options) {
            let valid = tiles[option].up;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions);
        }
        // Look left
        if (i > 0) {
          let left = grid[i - 1 + j * DIM];
          let validOptions = [];
          for (let option of left.options) {
            let valid = tiles[option].right;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions);
        }
        
        for (let i = options.length - 1; i >= 0; i--) {
          let element = options[i];
          if (grid[index].restricted.includes(element)) {
            options.splice(i, 1);
          }
        }
        
        // I could immediately collapse if only one option left?
        nextGrid[index] = new Cell(options, index);
        // if(options.length == 1) {    // Sometimes puts two tiles together which don't share an edge (Skipping zero-option check)
        //   nextGrid[index].collapse();
        // }
      }
    }
  }
  return nextGrid;
}

function startOver() {
  // Create cell for each spot on the grid
  for (let i = 0; i < DIM * DIM; i++) {
    grid[i] = new Cell(tiles.length, i);
  }
  
  startCondition_Border();
  startCondition_centerChip();
  
  path = [[grid]];
}

function checkValid(arr, valid) {
  for (let i = arr.length - 1; i >= 0; i--) {
    let element = arr[i];
    if (!valid.includes(element)) {
      arr.splice(i, 1);
    }
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    if(pathIndex > 0) {
      pathIndex -= 1;
    }
    drawState(path[pathIndex][0]);
  } else if (keyCode === RIGHT_ARROW) {
    if(pathIndex < path.length - 1) {
      pathIndex += 1;
    }
    drawState(path[pathIndex][0]);
  } else if (keyCode == ESCAPE) {
    noLoop();
  } else if (keyCode == CONTROL) {
    pathIndex = path.length-1
    loop();
  }
}

function drawState(grid) {
  background(0);
  
  const w = width / DIM;
  const h = height / DIM;

  for (let j = 0; j < DIM; j++) {
    for (let i = 0; i < DIM; i++) {
      let cell = grid[i + j * DIM];
      if (cell.collapsed) {
        let index = cell.options[0];
        image(tiles[index].img, i * w, j * h, w, h);
      } else {
        stroke(51);
        let entropy = (cell.options.length/tiles.length)**2;
        fill(min(510*(entropy), 255), min(510*(1-entropy), 255), 0);
        if(cell.options.length == 1) {
          fill(0, 0, 255);
        }
        rect(i * w, j * h, w, h);
      }
    }
  }
}

function drawTiles() {
  const w = width / DIM;
  const h = height / DIM;
  
  for(let i = 0; i < tiles.length; i++) {
    image(tiles[i].img, i * w, int(i/DIM) * h, w, h);
  }
}

function draw() {
  drawState(grid);
  grid = NextGrid(grid);
  
  // Pick cell with least entropy
  let gridCopy = grid.slice();
  gridCopy = gridCopy.filter((a) => !a.collapsed);

  if (gridCopy.length == 0) {
    return;
  }
  gridCopy.sort((a, b) => {
    return a.options.length - b.options.length;
  });

  let len = gridCopy[0].options.length;
  let stopIndex = 0;
  for (let i = 1; i < gridCopy.length; i++) {
    if (gridCopy[i].options.length > len) {
      stopIndex = i;
      break;
    }
  }

  if (stopIndex > 0) gridCopy.splice(stopIndex);
  const cell = random(gridCopy);
  cell.collapse();
  const pick = random(cell.options);
  if (pick === undefined) {
    if(path.length > 2) {
      grid = path[path.length - 2][0];
      prevCell = path[path.length - 2][1];
      prevPick = path[path.length - 2][2];
      prevCell.restricted.push(prevPick);
      prevCell.collapsed = false;
      console.log(path.length);
      console.log(path[path.length - 2]);
      path.splice(path.length - 2);
    pathIndex = path.length - 1;
    }
    return;
  }
  path.push([grid, JSON.parse(JSON.stringify(cell)), pick]);
  pathIndex = path.length - 1;
  cell.options = [pick];

  
  // drawTiles();
  
  // console.log(grid);
  // noLoop();
}
