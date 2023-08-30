// The Encounter class handles details related to the NPCs in the battle, such as the number and Challenge Rating (CR) of any enemies and allies.
class Encounter {

	constructor(id, onEncounterChange) {
		this.id = id; // Unique identifier for the encounter.
		this.onEncounterChange = onEncounterChange;
		this.enemies = this.initializeCR(); // Enemies involved in the encounter.
		this.allies = this.initializeCR(); // Allies involved in the encounter.
		this.activeGroup = this.enemies;
	}

	getActiveGroup() {
		return this.activeGroup;
	}

	// Initializes the Challenge Ratings (CR) for enemies and allies.
	initializeCR() {
		const crList = new Map([
			["0", 0],
			["1/8", 0],
			["1/4", 0],
			["1/2", 0]
		]);

		for (let i = 1; i <= 30; i++) {
			crList.set(i.toString(), 0);
		}
		return crList;
	}

	// Checks if a particular CR is represented in the current selected group of allies or enemies (depending on which the user is currently adding).
	containsCR(CR) {
		return this.activeGroup.get(CR) > 0;
	}

	// Sets the number of enemies or allies of a particular CR (depending on which the user is currently adding).
	setCR(CR, count) {
		this.activeGroup.set(CR, count);
		this.onEncounterChange();
	}

	// Increases or decreases the number of enemies or allies of a particular CR by a given amount (depending on which the user is currently adding).
	modifyCR(CR, change) {
		const count = (this.activeGroup.get(CR) || 0) + change;
		this.activeGroup.set(CR, Math.max(0, count));
		this.onEncounterChange();
	}

	// Adds an additional enemy or ally of a particular CR (depending on which the user is currently adding).
	incrementCR(CR) {
		this.modifyCR(CR, 1);
		this.onEncounterChange();
	}

	// Removes a single enemy or ally of a particular CR (depending on which the user is currently adding).
	decrementCR(CR) {
		this.modifyCR(CR, -1);
		this.onEncounterChange();
	}

	// If a particular CR is already included in the encounter, removes it. Otherwise, sets the number of enemies or allies of that CR to 1 (depending on which the user is currently adding).
	toggleCR(CR) {
		if (this.containsCR(CR)) { 
			this.setCR(CR, 0); 
		}
		else { 
			this.setCR(CR, 1); 
		}
		this.onEncounterChange();
	}

	// Allows the user to toggle between whether they're currently adding enemies or allies.
	toggleActiveGroup() {
		if (this.activeGroup === this.enemies) { this.activeGroup = this.allies; }
		else { this.activeGroup = this.enemies; }
	}

	// Scales the power of a creature by a multiplier, given the power of the players.
	scalePower(creaturePower, playerPower) {
		let powerRatio = creaturePower / playerPower;

		let closestRatio = Object.keys(scaleFactors)
			.reduce((prev, curr) => Math.abs(curr - powerRatio) < Math.abs(prev - powerRatio) ? curr : prev);

		let scaleFactor = scaleFactors[closestRatio] || 1;
		return creaturePower * scaleFactor;
	}

	// Calculates the HP cost of the encounter based on the party's current size and level, as well as the number and CRs of all selected enemies and allies.
	getHPCost(party) {
		const playerPower = powerByLevel[party.level]; 
		let partyPower = party.size * playerPower; 
		let enemyPower = 0;

		this.enemies.forEach((count, CR) => {
			enemyPower += count * this.scalePower(powerByCR[CR], playerPower); 			
		});

		this.allies.forEach((count, CR) => {
			partyPower += count * this.scalePower(powerByCR[CR], playerPower);
		});

		return Math.round(100 * Math.pow((enemyPower / partyPower), 2));
	}

	getDifficultyDescription(hpCost) {
		let difficultyDescription = "This is "

		if (hpCost === 0) { return "The players will lose no hit points."; }
		if (hpCost < 20) { difficultyDescription += `a Mild encounter. The players will lose approximately ${hpCost}% of their hit points.`; }
		else if (hpCost < 40) { difficultyDescription += `a Bruising encounter. The players will lose approximately ${hpCost}% of their hit points.`; }
		else if (hpCost < 60) { difficultyDescription += `a Bloody encounter. The players will lose approximately ${hpCost}% of their hit points.`; }
		else if (hpCost < 80) { difficultyDescription += `a Brutal encounter. The players will lose approximately ${hpCost}% of their hit points.`; }
		else if (hpCost < 100) { difficultyDescription += `an Oppressive encounter. The players will lose approximately ${hpCost}% of their hit points, and might need a little luck or skill to win.`; }
		else if (hpCost < 130) { difficultyDescription += "an Overwhelming encounter. The players can win only with a lot of luck or skill."; }
		else if (hpCost < 170) { difficultyDescription += "a Crushing encounter. The players can win only with an exceptional amount of luck or skill."; }
		else if (hpCost < 250) { difficultyDescription += "a Devastating encounter. The players can only win under perfect conditions."; }
		else { difficultyDescription += "an Impossible encounter. The players cannot win."; }

		return difficultyDescription;
	}

	isSelectingAllies() {
		return (this.activeGroup === this.allies);
	}

}