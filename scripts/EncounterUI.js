class EncounterUI {

	constructor(encounterManager) {
		this.encounterManager = encounterManager;
		this.partyLabel = this.createLabel('party-label');
		this.enemyLabel = this.createLabel('enemy-label');
		this.difficultyLabel = this.createLabel('difficulty-label');

		this.labelContainer = document.getElementById('encounter-labels');
		this.labelContainer.append(this.partyLabel, this.enemyLabel, this.difficultyLabel);
		
		this.crSelectionUI = new CRSelectionUI(encounterManager, this);
		this.encounterToggleUI = new EncounterToggleUI(encounterManager, this);
	}

	toggleGroupVisibility(isAlliesSelected) {
		this.crSelectionUI.toggleGroupVisibility(isAlliesSelected);
	}

	createLabel(id) {
		const label = document.createElement('div');
		label.id = id;
		label.className = 'label';
		return label;
	}

	groupToDescription(group, name) {
		// Convert the group map into an array and filter out entries with zero count.
		const descriptions = Array.from(group)
			.filter(([CR, count]) => count > 0)
			.map(([CR, count]) => `${count} CR ${CR} ${name}`);

		// If there are no descriptions, return "no [name]".
		if (descriptions.length === 0) { return `no ${name}`; }

		// Pop the last description to handle separately.
		const lastDescription = descriptions.pop();

		// If there are more descriptions, join them with commas, and append "and" with the last description.
		// Otherwise, simply return the last description.
		return descriptions.length > 0
			? descriptions.join(', ') + ", and " + lastDescription
			: lastDescription
	}

	updateDifficultyLabels() {
		// Get the party, enemies, and allies from the encounter manager.
		let party = this.encounterManager.party;
		let enemies = this.encounterManager.activeEncounter.enemies;
		let allies = this.encounterManager.activeEncounter.allies;

		// Construct the party description using the party size, level, and allies.
		let partyDescription = `There are ${party.size} Level ${party.level} players in the party, and ${this.groupToDescription(allies, "allies")}.`;

		// Construct the encounter description using the enemies.
		let enemyDescription = `There are ${this.groupToDescription(enemies, "enemies")}.`;

		// Calculate the HP cost and difficulty using the active encounter.
		let hpCost = this.encounterManager.activeEncounter.getHPCost(party);

		// Construct the difficulty description using the HP cost.
		let difficultyDescription = this.encounterManager.activeEncounter.getDifficultyDescription(hpCost);

		// Update the text content of the party, encounter, and difficulty labels.
		this.partyLabel.textContent = partyDescription;
		this.enemyLabel.textContent = enemyDescription;
		this.difficultyLabel.textContent = difficultyDescription;
	}
	
}

