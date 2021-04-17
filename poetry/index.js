const fs = require("fs").promises

let adjectives;
let verbs;
let nouns;
let prepositions;
let initialized;
let lineStructuresWeights;
let hardcodedStructures;

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

	lineStructureWeights = [
		[5, [nouns, verbs]],
		[10, [adjectives, nouns, verbs]],
		[15, [nouns, prepositions, nouns]],
		[5, [nouns, prepositions, adjectives, nouns]],
		[5, [adjectives, nouns, prepositions, nouns]],
		//[1, [adjectives, nouns, prepositions, adjectives, nouns]],
		[15, [nouns, verbs, nouns]],
		[10, [adjectives, nouns, verbs, nouns]],
		[10, [nouns, verbs, adjectives, nouns]],
		//[1, [adjectives, nouns, verbs, adjectives, nouns]],
		[5, [verbs, prepositions, nouns]],
	];

	hardcodedStructures = [
                [adjectives, nouns, verbs, nouns],
                [nouns, verbs, adjectives, nouns],
                [nouns, prepositions, nouns],
        ];

	initialized = true;
}

const lineCountWeights = [
	[1, 1],
	[10, 2],
	[30, 3],
	[5, 4],
	[1, 5],
];

const getWeightedChoicesArray = (weights) => {
	return weights
		.map(([weight, value]) => {
			return (new Array(weight))
				.fill(null)
				.map(() => value)
		})
		.flat(1);
};

const generateLine = (structure) => {
	return structure.map(randomChoice).join(" ") + ".";
};

const generateRandomPoem = () => {
	checkInitialized();
	const lineCount = randomChoice(getWeightedChoicesArray(lineCountWeights));
	return (new Array(lineCount))
		.fill(null)
		.map(() => randomChoice(getWeightedChoicesArray(lineStructureWeights)))
		.map(generateLine)
		.map(capitalize)
		.join("\n");
};

const generateHardcodedPoem = () => {
	checkInitialized();
	return hardcodedStructures
		.map(generateLine)
		.map(capitalize)
		.join("\n");
}

module.exports = {
	initialize,
	generate: generateHardcodedPoem,
};

