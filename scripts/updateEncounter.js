// <!-- Encounter Calculation Functionality -->

// Global array to hold active CRs
let activeCRs = [];

// Global object to store enemy counts
let enemyCounts = {};

let playerPower = {
	1: 11,
	2: 14,
	3: 18,
	4: 23,
	5: 32,
	6: 35,
	7: 41,
	8: 44,
	9: 49,
	10: 53,
	11: 62,
	12: 68,
	13: 71,
	14: 74,
	15: 82,
	16: 84,
	17: 103,
	18: 119,
	19: 131,
	20: 141
};

let powerByCR = {
	"0": 1,
	"1/8": 5,
	"1/4": 10,
	"1/2": 16,
	"1": 22,
	"2": 28,
	"3": 37,
	"4": 48,
	"5": 60,
	"6": 65,
	"7": 70,
	"8": 85,
	"9": 85,
	"10": 95,
	"11": 105,
	"12": 115,
	"13": 120,
	"14": 125,
	"15": 130,
	"16": 140,
	"17": 150,
	"18": 160,
	"19": 165,
	"20": 180,
	"21": 200,
	"22": 225,
	"23": 250,
	"24": 275,
	"25": 300,
	"26": 325,
	"27": 350,
	"28": 375,
	"29": 400,
	"30": 425
};

let partyPower = 0;
let encounterPower = 0;

function updateEncounter() {

	let warning = false;
	encounterPower = 0;
	partyPower = partySize * playerPower[partyLevel];

	$("#party-size-label").text(`There are ${partySize} players in the party.`);
	$("#party-level-label").text(`The party is level ${partyLevel}`);
	$("#party-power-label").text(`The party power is ${partyPower}`);

	let enemyCount = 0;

	activeCRs.forEach(function(value) {
		let enemies = enemyCounts[value]; // Retrieve the enemy count for this CR from the enemyCounts object
		enemyCount ++; // Keep track of the total number of enemies
		let cr = value; // CR value is taken directly from the activeCRs array
		cr = cr.replace(/-/g, "/");
		let enemyPower = powerByCR[cr];

		let powerDecayFactor = 1;
		let powerRatio = enemyPower / (playerPower[partyLevel]);

		if (powerRatio >= 2.5) { 
			warning = true;	
		};

		let ratioValues = [5, 2.5, 1.5, 1, 0.67, 0.4, 0.2];
		powerRatio = ratioValues.reduce(function(prev, curr) {
			return (Math.abs(curr - powerRatio) < Math.abs(prev - powerRatio) ? curr : prev);
		});

		if (powerRatio == 5) {
			powerDecayFactor = 1.67;
		} else if (powerRatio == 2.5) {
			powerDecayFactor = 1.33;
		} else if (powerRatio == 1.5) {
			powerDecayFactor = 1.25;
		} else if (powerRatio == 1) {
			powerDecayFactor = 1;
		} else if (powerRatio == 0.67) {
			powerDecayFactor = 0.8;
		} else if (powerRatio == 0.4) {
			powerDecayFactor = 0.67;
		} else if (powerRatio == 0.2) {
			powerDecayFactor = 0.5;
		} else {
			powerDecayFactor = 0
		};

		enemyPower = enemyPower * powerDecayFactor;

		encounterPower += enemies * Math.round(enemyPower);

	});

	if (warning == true) {
		$("#warning-label").text('WARNING: This encounter contains one or more enemies sufficiently powerful to KO one or more players on a single turn. (This power level is accounted for in the encounter math.)');
	} else {
		$("#warning-label").text('');
	};

	$("#encounter-size-label").text(`The encounter includes ${enemyCount} different types of enemies.`);
	$("#encounter-power-label").text(`The encounter power is ${encounterPower}`);

	hpLost = Math.round(100 * Math.pow(encounterPower/partyPower, 2));
	let resourcesSpent = Math.round(0.67 * hpLost);

	let encounterDifficulty = "";

	if (hpLost <= 20) {
		encounterDifficulty = "Mild";
	} else if (hpLost <= 40) {
		encounterDifficulty = "Bruising";
	} else if (hpLost <= 60) {
		encounterDifficulty = "Bloody";
	} else if (hpLost <= 80) {
		encounterDifficulty = "Brutal";
	} else if (hpLost <= 100) {
		encounterDifficulty = "Oppressive";
	} else if (hpLost <= 130) {
		encounterDifficulty = "Overwhelming";
	} else if (hpLost <= 170) {
		encounterDifficulty = "Crushing";
	} else if (hpLost <= 250) {
		encounterDifficulty = "Devastating";
	} else {
		encounterDifficulty = "Impossible";
	}

	let difficultyText = "";
	if (activeCRs.length) {
		difficultyText = 'This is a';
		if (/^[aeiou]/i.test(encounterDifficulty)) {
			difficultyText += "n";
		};
		difficultyText += (' ' + `${encounterDifficulty}`.bold() + ' encounter. ');
	};

	$("#hp-lost-label").html(`${difficultyText}The players will lose ${hpLost}% of their hit points and spend ${resourcesSpent}% of their daily resources.`);
};

					

