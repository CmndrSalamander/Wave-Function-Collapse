const tileImages = [];
const numTiles = 5;

function preload() {
  for (let i = 0; i < numTiles; i++) {
    tileImages[i] = loadImage(`tiles/demo/${i}.png`);
  }
}

edges = [['AAA', 'AAA', 'AAA', 'AAA'], 
         ['AAA', 'ABA', 'ABA', 'ABA'], 
         ['ABA', 'AAA', 'ABA', 'ABA'], 
         ['ABA', 'ABA', 'ABA', 'AAA'], 
         ['ABA', 'ABA', 'AAA', 'ABA']];

restrictions = [[0,  [-1]], 
                [1,  [-1]], 
                [2,  [-1]], 
                [3,  [-1]], 
                [4,  [-1]]];

function reverseString(s) {
  let arr = s.split('');
  arr = arr.reverse();
  return arr.join('');
}

function compareEdge(a, b) {
  return a === b;
}

class Tile {
  constructor() {
    this.up = [];
    this.right = [];
    this.down = [];
    this.left = [];
  }
  static indexCon(i) {
    var newTile = new Tile();
    newTile.index = i;
    newTile.img = tileImages[i];
    newTile.edges = edges[i];
    newTile.restrictions = restrictions[i][1];
    return newTile;
  }
  static allCon(img, edges, i) {
    var newTile = new Tile();
    newTile.index = i;
    newTile.img = img;
    newTile.edges = edges;
    newTile.restrictions = restrictions[i][1];
    return newTile;
  }

  analyze(tiles) {
    for (let i = 0; i < tiles.length; i++) {
      let tile = tiles[i];
      
      if(this.restrictions.includes(tile.index)) continue;

      // UP
      if (compareEdge(tile.edges[2], this.edges[0])) {
        this.up.push(i);
      }
      // RIGHT
      if (compareEdge(tile.edges[3], this.edges[1])) {
        this.right.push(i);
      }
      // DOWN
      if (compareEdge(tile.edges[0], this.edges[2])) {
        this.down.push(i);
      }
      // LEFT
      if (compareEdge(tile.edges[1], this.edges[3])) {
        this.left.push(i);
      }
    }
  }

  rotate(num, w, h) {
    const newImg = createGraphics(w, h);
    newImg.imageMode(CENTER);
    newImg.translate(w / 2, h / 2);
    newImg.rotate(HALF_PI * num);
    newImg.image(this.img, 0, 0, w, h);

    const newEdges = [];
    const len = this.edges.length;
    for(let i = 0; i < len; i++) {
      newEdges[i] = this.edges[(i - num + len) % len];
    }
    for(let i = 0; i < num; i++) {
      newEdges[i] = reverseString(newEdges[i]);
    }
    for(let i = 0; i < num; i++) {
      newEdges[(i+2)%len] = reverseString(newEdges[(i+2)%len]);
    }
    
    return Tile.allCon(newImg, newEdges, this.index);
  }
  
  static getTiles() {
    let tiles = [];
    for (let i = 0; i < numTiles; i++) {
      tiles[i] = Tile.indexCon(i);
    }
    return tiles;
  }
}