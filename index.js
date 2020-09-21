import robot from 'robotjs';
import readlineSync from 'readline-sync';
import Dictionary from './dictionary-trie.js';

// SET TOP LEFT TILE COORD HERE
const TOP_LEFT_TILE = [800, 540];

// SET BOTTOM RIGHT TILE COORD HERE
const BOTTOM_RIGHT_TILE = [1100, 850];

// CONFIGURE MOUSE DELAY HERE
const MOVE_DELAY = 50;
robot.setMouseDelay(MOVE_DELAY);

// Import dictionary
const dict = new Dictionary();

// Record start time so we know when to stop mouse
const startTime = new Date();

function msleep(n) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}
function sleep(ms) {
  msleep(ms);
}

// Populate tileCoords map:
const tileCoords = new Map();
const tilePxDiff = ((BOTTOM_RIGHT_TILE[0] - TOP_LEFT_TILE[0]) / 2) * (2 / 3);
new Array(16)
  .fill()
  .forEach((_, i) =>
    tileCoords.set(`${Math.floor(i / 4)},${i % 4}`, [
      TOP_LEFT_TILE[0] + (i % 4) * tilePxDiff,
      TOP_LEFT_TILE[1] + Math.floor(i / 4) * tilePxDiff,
    ]),
  );

// Get grid input from stdin
const grid = new Map(
  readlineSync
    .question('Enter grid characters: ')
    // 'LHNIMADDCIISTEST'
    .toLowerCase()
    .split('')
    .map((char, i) => [`${Math.floor(i / 4)},${i % 4}`, char]),
);

// Keep map of paths for each word
const directions = new Map();

let callCount = 0;

const DFS = (currWord, visitedTileMap, tile, foundWords) => {
  const [x, y] = tile.split(',').map((char) => Number(char));
  if (
    x < 0 ||
    y < 0 ||
    x > 3 ||
    y > 3 ||
    visitedTileMap.has(tile) ||
    currWord.length > 8
  )
    return;

  callCount++;

  visitedTileMap.set(tile, visitedTileMap.size);
  currWord += grid.get(tile);
  if (currWord.length > 2 && dict.contains(currWord)) {
    foundWords.add(currWord);
    directions.set(currWord, [...visitedTileMap.keys()]);
  }
  [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
    [1, 1],
    [-1, -1],
    [1, -1],
    [-1, 1],
  ].forEach((adj) =>
    DFS(
      currWord,
      new Map(visitedTileMap),
      `${x + adj[0]},${y + adj[1]}`,
      foundWords,
    ),
  );
};

// Find words
const foundWords = new Set();
for (const tile of grid.keys()) {
  DFS('', new Map(), tile, foundWords);
}

// Sort words by length
const sortedWords = [...foundWords];
sortedWords.sort((a, b) => b.length - a.length);

// Draw the words
for (const word of sortedWords) {
  const path = directions.get(word);
  robot.moveMouse(...tileCoords.get(path[0]));
  robot.mouseToggle('down');
  sleep(50);
  for (const tile of path) {
    robot.dragMouse(...tileCoords.get(tile));
    sleep(10);
  }
  robot.mouseToggle('up');
  if (new Date() - startTime > 80000) break;
}

console.log(callCount);
