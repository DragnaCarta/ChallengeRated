// The EncounterManager class manages multiple encounters and controls the active encounter.
class EncounterManager {
	constructor() {
		this.nextID = 0; // Counter for assigning unique encounter IDs
		this.party = new Party(5, 1, this.onEncounterChange.bind(this)); // Default party size and level
		this.encounters = {} // Collection of all encounters
		this.activeEncounter = this.newEncounter(); // The currently active encounter
		this.ui = new EncounterManagerUI(this); // The user interface for managing the encounters
		this.hpCost = 0; // The percentage of hit points (HP) that the party is currently expected to lose in the active encounter.
		this.difficulty = ''; // The current difficulty of the encounter.
	}

	onEncounterChange() {
		this.ui.encounterUI.updateDifficultyLabels();
	}

	// Creates a new encounter and adds it to the collection.
	newEncounter() {
		const id = this.nextID++;
		const encounter = new Encounter(id, this.onEncounterChange.bind(this));
		this.encounters[id] = encounter;
		return encounter;
	}

	setPartyLevel(level) {
		this.party.setLevel(level);
	}

	setPartySize(size) {
		this.party.setSize(size);
	}

}