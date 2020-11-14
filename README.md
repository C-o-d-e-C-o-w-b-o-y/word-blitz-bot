# Word-Blitz-Bot

## How To Install

* Clone repo
* `npm install`
* You might get issues with `robot.js`, google to debug

## How To Use

* Make sure you are in the main directory `cd Word-Blitz-Bot`
* Run `node getMousePos.js`, this program will print your mouse coordinates repeatedly, so open Word Blitz and hover over the top left and bottom right tiles to get their pixel locations, then enter these locations into the constants at the top of `index.js`
* Start a game of Word Blitz, then run `node index.js`
* Quickly change back to your browser if you don't have both open at once
* Make sure bot is dragging correct tiles, adjust top left and bottom right corner pixel constants if neccessary 


## Notes

If you intend to repeat this project for yourself I highly reccomend not using JavaScript like I did, use a language like Python which has better libraries for OS mouse interaction as installing `robot.js` was a big pain for me, at least on windows. 




