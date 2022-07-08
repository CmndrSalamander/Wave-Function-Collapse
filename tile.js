function reverseString(s) {
  let arr = s.split('');
  arr = arr.reverse();
  return arr.join('');
}

function compareEdge(a, b) {
  return a === b;
}

class Tile {
  constructor(img, edges, i) {
    this.img = img;
    this.edges = edges;
    this.up = [];
    this.right = [];
    this.down = [];
    this.left = [];

    if (i !== undefined) {
      this.index = i;
    }
  }

  analyze(tiles) {
    for (let i = 0; i < tiles.length; i++) {
      let tile = tiles[i];
      
      if (tile.index == 2 && this.index == 2) continue;
      if (tile.index == 2 && this.index == 8) continue;
      if (tile.index == 2 && this.index == 12) continue;
      
      // if (tile.index == 4 && this.index == 4) continue;

      if (tile.index == 5 && this.index == 5) continue;
      
      if (tile.index == 8 && this.index == 2) continue;
      if (tile.index == 8 && this.index == 8) continue;
      if (tile.index == 8 && this.index == 12) continue;
      
      if (tile.index == 9 && this.index == 9) continue;
      
      if (tile.index == 11 && this.index == 11) continue;
      
      if (tile.index == 12 && this.index == 2) continue;
      if (tile.index == 12 && this.index == 8) continue;
      if (tile.index == 12 && this.index == 12) continue;
      

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

  rotate(num) {
    const w = this.img.width;
    const h = this.img.height;
    const newImg = createGraphics(w, h);
    newImg.imageMode(CENTER);
    newImg.translate(w / 2, h / 2);
    newImg.rotate(HALF_PI * num);
    newImg.image(this.img, 0, 0);

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
    
    return new Tile(newImg, newEdges, this.index);
  }
}
