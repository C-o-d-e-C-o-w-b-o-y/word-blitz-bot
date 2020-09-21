import fs from 'fs';

class Dictionary {
  constructor() {
    this.trieRoot = new TrieNode(null, false);
    fs.readFileSync('words.txt', 'utf8')
      .split(/\s+/)
      .forEach((word) => this.insert(word));
  }

  insert(word) {
    // Do not insert word if it is too long or short
    if (word.length < 2 || word.length > 16) return;

    let curr = this.trieRoot;
    for (const char of word) {
      // Create node if it doesn't exist
      if (!curr.children[this._ord(char)])
        curr.children[this._ord(char)] = new TrieNode(char, false);

      curr = curr.children[this._ord(char)];
    }
    curr.valid = true;
  }

  contains(word) {
    let curr = this.trieRoot;
    for (const char of word) {
      if (!curr.children[this._ord(char)]) return false;
      curr = curr.children[this._ord(char)];
    }
    return curr.valid;
  }

  _ord(char) {
    return char.charCodeAt(0) - 97;
  }
}

class TrieNode {
  constructor(key, valid) {
    this.key = key;
    this.valid = valid;
    this.children = new Array(26);
  }
}

export default Dictionary;
