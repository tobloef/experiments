const fs = require("fs").promises


let adjectives;
let verbs;
let nouns;
let prepositions;
let initialized;

const readFileLinesAsync = async (path) => (await fs.readFile(path))
  .toString()
  .split(/\r?\n/);

const toLower = (word) => word.toLowerCase();
const isNotCapitalized = (word) => word.charAt(0) === toLower(word.charAt(0));
const randomChoice = (list) => list[Math.floor(Math.random() * list.length)];
const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);
const isNotIn = (...lists) => (word) => lists.every((list) => !list.includes(word));
const isIn = (...lists) => (word) => lists.every((list) => list.includes(word));

const checkInitialized = () => {
  if (!initialized) {
    throw new Error("Poetry dictionary not initialized.");
  }
};

const initialize = async () => { 
  const topWords = (await readFileLinesAsync(__dirname + "/top-10000-words.txt"))
    .map(toLower);
  const allAdjectives = await readFileLinesAsync(__dirname + "/adjectives.txt");
  const allVerbs = await readFileLinesAsync(__dirname + "/verbs.txt");
  const allNouns = await readFileLinesAsync(__dirname + "/nouns.txt");
  const allPrepositions = await readFileLinesAsync(__dirname + "/prepositions.txt");

  adjectives = allAdjectives
    .filter(isNotCapitalized)
    .map(toLower)
    .filter(isIn(topWords))
    .filter(isNotIn(allVerbs, allNouns, allPrepositions));
  verbs = allVerbs
    .filter(isNotCapitalized)
    .map(toLower)
    .filter(isIn(topWords))
    .filter(isNotIn(allAdjectives, allNouns, allPrepositions));
  nouns = allNouns
    .filter(isNotCapitalized)
    .map(toLower)
    .filter(isIn(topWords))
    .filter(isNotIn(allAdjectives, allVerbs, allPrepositions));
  prepositions = allPrepositions
    .filter(isIn(topWords));

  initialized = true;
}

const generateANVN = () => {
  let poetry = "";
  poetry += randomChoice(adjectives);
  poetry += " ";
  poetry += randomChoice(nouns);
  poetry += " ";
  poetry += randomChoice(verbs);
  poetry += " ";
  poetry += randomChoice(nouns);
  poetry += ".";

  poetry = capitalize(poetry);

  return poetry;
};

const generateNofN = () => {
  let poetry = "";
  poetry += randomChoice(nouns);
  poetry += " ";
  poetry += randomChoice(prepositions);
  poetry += " ";
  poetry += randomChoice(nouns);
  poetry += ".";
  
  poetry = capitalize(poetry);

  return poetry;
};

const generate = () => {
  checkInitialized();

  let poetry = "";
  poetry += generateANVN();
  poetry += "\n";
  poetry += generateANVN();
  poetry += "\n";
  poetry += generateNofN();

  return poetry;
};

module.exports = {
  initialize,
  generate,
};
