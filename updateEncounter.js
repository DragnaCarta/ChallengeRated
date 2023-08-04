// <!-- Encounter Calculation Functionality -->

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
	encounterPower = 0;

	partyPower = partySize * playerPower[partyLevel];
	$("#party-size-label").text(`There are ${partySize} players in the party.`);
	$("#party-level-label").text(`The party is level ${partyLevel}`);
	$("#party-power-label").text(`The party power is ${partyPower}`);

	let enemyCount = 0;

	$("#encounter-details > div").each(function() {
		let enemies = $(this).find('.enemy-value').val();
						enemyCount += 1 // parseInt(enemies); // Keep track of the total number of enemies
						let cr = $(this).find('.cr-value').val();
						enemyPower = powerByCR[cr];

						let powerDecayFactor = 1;
						let powerRatio = enemyPower / (playerPower[partyLevel]);

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
						} else if (powerRatio == 0.2 {
							powerDecayFactor = 0.5;
						} else {
							powerDecayFactor = 0
						};

						enemyPower = enemyPower * powerDecayFactor;

						encounterPower += enemies * Math.round(enemyPower);
					});

						$("#encounter-size-label").text(`The encounter includes ${enemyCount} different types of enemies.`);
						$("#encounter-power-label").text(`The encounter power is ${encounterPower}`);

						hpLost = Math.round(100 * Math.pow(encounterPower/partyPower, 2));
						let resourcesSpent = Math.round(0.67 * hpLost);
						$("#hp-lost-label").text(`The players will lose ${hpLost}% of their hit points and spend ${resourcesSpent}% of their daily resources.`);
					};

					</script>

					<!-- Bootstrap and jQuery CDN links -->
					<script src="https://code.jquery.com/jquery-3.4.1.slim.min.js"></script>
					<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>

