// <!-- Encounter Calculation Functionality -->

// Global array to hold active enemy CRs
let activeEnemyCRs = [];

// Global array to hold active ally CRs
let activeAllyCRs = [];

// Global object to store enemy counts
let enemyCounts = {};

// Global object to store ally counts
let allyCounts = {};

// Boolean toggle to determine storage of enemies or NPCs
let selectingAllies = false;

// Warning for powerful enemies
let warning = false;

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
let allyPower = 0;

function toggleSelection(isAllies) {

	console.log("Toggling ally selection.");

	let activeCRs = isAllies ? activeAllyCRs : activeEnemyCRs;

	var label = document.getElementById('crSelectorLabel');
	var enemiesTab = document.getElementById('enemies-tab');
	var alliesTab = document.getElementById('allies-tab');

	var crGrid = document.getElementById('crGrid');
	var crButtons = crGrid.querySelectorAll('.cr-button');

	const BUTTON_ID_PATTERN = /cr(.+?)toggle/;

	const CLASSES = {
		selectedAlly: 'cr-button-ally-selected',
		selectedEnemy: 'cr-button-enemy-selected',
		deselectedAlly: 'cr-button-ally-deselected',
		deselectedEnemy: 'cr-button-enemy-deselected',
	};

	const DESELECTED_CLASSES = [CLASSES.deselectedAlly, CLASSES.deselectedEnemy];

	const getToggleClasses = () => isAllies ?
		[CLASSES.selectedAlly, CLASSES.deselectedAlly] :
		[CLASSES.selectedEnemy, CLASSES.deselectedEnemy];

	const toggleButtonState = (button, value) => {
		button.classList.remove(...DESELECTED_CLASSES);
		const [selectedClass, deselectedClass] = getToggleClasses();
		button.classList.add(activeCRs.includes(value) ? selectedClass : deselectedClass);
	};

	crButtons.forEach(button => {
		let match = button.id.match(BUTTON_ID_PATTERN);
		if (match == null) return;
		let value = match[1].replace("-", "/");
		toggleButtonState(button, value);
	});

	if (selectingAllies) {
		enemiesTab.classList.remove('btn-danger');
		enemiesTab.classList.add('btn-light-red');
		alliesTab.classList.remove('btn-light-blue');
		alliesTab.classList.add('btn-primary');
		label.textContent = "Select the Challenge Ratings of all allies that will appear in this encounter.";
	} else {
		enemiesTab.classList.remove('btn-light-red');
		enemiesTab.classList.add('btn-danger');
		alliesTab.classList.remove('btn-primary');
		alliesTab.classList.add('btn-light-blue');
		label.textContent = "Select the Challenge Ratings of all enemies that will appear in this encounter.";
	};

	updateEncounter()
};

function updateEncounter() {

	console.log("Updating the encounter.");

	const powerDecayFactors = {
		5: 1.67, 2.5: 1.33, 1.5: 1.25, 1: 1, 0.67: 0.8, 0.4: 0.67, 0.2: 0.5
	};

	const difficultyLevels = [
		{ max: 20, label: "Mild" },
		{ max: 40, label: "Bruising" },
		{ max: 60, label: "Bloody" },
		{ max: 80, label: "Brutal" },
		{ max: 100, label: "Oppressive" },
		{ max: 130, label: "Overwhelming" },
		{ max: 170, label: "Crushing" },
		{ max: 250, label: "Devastating" },
		{ max: Infinity, label: "Impossible" },
	];

	warning = false;
	encounterPower = 0;
	allyPower = 0;
	partyPower = partySize * playerPower[partyLevel];

	let activeCRs = selectingAllies ? activeAllyCRs : activeEnemyCRs;
	let activeCounts = selectingAllies ? allyCounts : enemyCounts;

	activeCRs.forEach(value => processCreature(value, activeCounts, powerDecayFactors));

	updateWarningAndLabels(warning, encounterPower, difficultyLevels);

};

function processCreature(value, activeCounts, powerDecayFactors) {
	let creatures = activeCounts[value];
	let cr = value.replace(/-/g, "/");
	let creaturePower = powerByCR[cr];

	let powerRatio = creaturePower / playerPower[partyLevel];
	if (powerRatio >= 2.5) warning = true;

	// Find closest ratio
	powerRatio = [5, 2.5, 1.5, 1, 0.67, 0.4, 0.2]
		.reduce((prev, curr) => Math.abs(curr - powerRatio) < Math.abs(prev - powerRatio) ? curr : prev);

	// Get decay factor from map
	let powerDecayFactor = powerDecayFactors[powerRatio] || 0;
	creaturePower *= powerDecayFactor;

	if (selectingAllies) {
		allyPower += creatures * Math.round(creaturePower);
	} else {
		encounterPower += creatures * Math.round(creaturePower);
	}
};

function updateWarningAndLabels(warning, encounterPower, difficultyLevels) {
	const warningLabel = warning
		? 'WARNING: This encounter contains one or more enemies sufficiently powerful to KO one or more players on a single turn. (This power level is accounted for in the encounter math.)'
		: '';

	$("#warning-label").text(warningLabel);
	$("#encounter-power-label").text(`The encounter power is ${encounterPower}`);

	const hpLost = Math.round(100 * Math. pow(encounterPower / (partyPower + allyPower), 2));
	const resourcesSpent = Math.round(0.67 * hpLost);

	let encounterDifficulty = difficultyLevels.find(level => hpLost <= level.max).label;

	let difficultyText = "";
	if (activeEnemyCRs.length) {
		difficultyText = 'This is a';
		if (/^[aeiou]/i.test(encounterDifficulty)) {
			difficultyText += "n";
		};
		difficultyText += ' ' + `${encounterDifficulty.bold()} encounter. `;
	};

	$("#hp-lost-label").html(`${difficultyText}The players will lose ${hpLost}% of their hit points and spend ${resourcesSpent}% of their daily resources.`);

};

// function updateEncounter() {

// 	let warning = false;
// 	encounterPower = 0;
// 	allyPower = 0;
// 	partyPower = partySize * playerPower[partyLevel];

// 	$("#party-size-label").text(`There are ${partySize} players in the party.`);
// 	$("#party-level-label").text(`The party is level ${partyLevel}`);
// 	$("#party-power-label").text(`The party power is ${partyPower}`);

// 	let activeCRs = selectingAllies ? activeAllyCRs : activeEnemyCRs;
// 	let activeCounts = selectingAllies ? allyCounts : enemyCounts;

// 	activeCRs.forEach(function(value) {
// 		let creatures = activeCounts[value]; // Retrieve the creature count for this CR from the enemyCounts or allyCounts object
// 		let cr = value; // CR value is taken directly from the activeEnemyCRs array
// 		cr = cr.replace(/-/g, "/");
// 		let creaturePower = powerByCR[cr];

// 		let powerDecayFactor = 1;
// 		let powerRatio = creaturePower / (playerPower[partyLevel]);

// 		if (powerRatio >= 2.5) { 
// 			warning = true;	
// 		};

// 		let ratioValues = [5, 2.5, 1.5, 1, 0.67, 0.4, 0.2];
// 		powerRatio = ratioValues.reduce(function(prev, curr) {
// 			return (Math.abs(curr - powerRatio) < Math.abs(prev - powerRatio) ? curr : prev);
// 		});

// 		if (powerRatio == 5) {
// 			powerDecayFactor = 1.67;
// 		} else if (powerRatio == 2.5) {
// 			powerDecayFactor = 1.33;
// 		} else if (powerRatio == 1.5) {
// 			powerDecayFactor = 1.25;
// 		} else if (powerRatio == 1) {
// 			powerDecayFactor = 1;
// 		} else if (powerRatio == 0.67) {
// 			powerDecayFactor = 0.8;
// 		} else if (powerRatio == 0.4) {
// 			powerDecayFactor = 0.67;
// 		} else if (powerRatio == 0.2) {
// 			powerDecayFactor = 0.5;
// 		} else {
// 			powerDecayFactor = 0
// 		};

// 		creaturePower = creaturePower * powerDecayFactor;

// 		if (selectingAllies) {
// 			allyPower += creatures * Math.round(creaturePower);
// 		} else {
// 			encounterPower += creatures * Math.round(creaturePower);
// 		};
// 	});

// 	if (warning == true) {
// 		$("#warning-label").text('WARNING: This encounter contains one or more enemies sufficiently powerful to KO one or more players on a single turn. (This power level is accounted for in the encounter math.)');
// 	} else {
// 		$("#warning-label").text('');
// 	};

// 	$("#encounter-power-label").text(`The encounter power is ${encounterPower}`);

// 	hpLost = Math.round(100 * Math.pow(encounterPower/(partyPower+allyPower), 2));
// 	let resourcesSpent = Math.round(0.67 * hpLost);

// 	let encounterDifficulty = "";

// 	if (hpLost <= 20) {
// 		encounterDifficulty = "Mild";
// 	} else if (hpLost <= 40) {
// 		encounterDifficulty = "Bruising";
// 	} else if (hpLost <= 60) {
// 		encounterDifficulty = "Bloody";
// 	} else if (hpLost <= 80) {
// 		encounterDifficulty = "Brutal";
// 	} else if (hpLost <= 100) {
// 		encounterDifficulty = "Oppressive";
// 	} else if (hpLost <= 130) {
// 		encounterDifficulty = "Overwhelming";
// 	} else if (hpLost <= 170) {
// 		encounterDifficulty = "Crushing";
// 	} else if (hpLost <= 250) {
// 		encounterDifficulty = "Devastating";
// 	} else {
// 		encounterDifficulty = "Impossible";
// 	}

// 	let difficultyText = "";
// 	if (activeEnemyCRs.length) {
// 		difficultyText = 'This is a';
// 		if (/^[aeiou]/i.test(encounterDifficulty)) {
// 			difficultyText += "n";
// 		};
// 		difficultyText += (' ' + `${encounterDifficulty}`.bold() + ' encounter. ');
// 	};

// 	$("#hp-lost-label").html(`${difficultyText}The players will lose ${hpLost}% of their hit points and spend ${resourcesSpent}% of their daily resources.`);
// };

					

