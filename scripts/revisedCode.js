// The Party class handles details related to a group of players, such as the number of players and their level.
class Party {
	constructor(size, level) {
	this.size = size; // Number of players in the party.
	this.level = level; // The players' level.
	}

	// Sets the size of the party, ensuring it's not negative.
	setSize(newSize) {
		this.size = Math.max(0, newSize);	
	}

	// Adds a player to the party, increasing its size.
	addPlayer() {
		this.setSize(this.size + 1);
	}

	// Removes a player from the party, decreasing its size.
	removePlayer() {
		this.setSize(this.size - 1);
	}

	// Sets the level of the party, ensuring it's not negative.
	setLevel(newLevel) {
		this.level = Math.max(0, newLevel);
	}

	// Increases the party's level by 1.
	addLevel() {
		this.setLevel(this.level + 1);
	}

	// Decreases the party's level by 1.
	removeLevel() {
		this.setLevel(this.level - 1);
	}
}

// The Encounter class handles details related to the NPCs in the battle, such as the number and Challenge Rating (CR) of any enemies and allies.
class Encounter {

	constructor(id) {
		this.id = id; // Unique identifier for the encounter.
		this.enemies = this.initializeCR(); // Enemies involved in the encounter.
		this.allies = this.initializeCR(); // Allies involved in the encounter.
		this.selectingAllies = false; // Whether the user is currently adding allies or enemies.
	}

	// Initializes the Challenge Ratings (CR) for enemies and allies.
	initializeCR() {
		const crList = {"0": 0, "1/8": 0, "1/4": 0, "1/2": 0};
		for (let i = 1; i <= 30; i++) {
			crList[i.toString()] = 0;
		}
		return crList;
	}

	// Checks if a particular CR is represented in the current selected group of allies or enemies (depending on which the user is currently adding).
	containsCR(CR) {
		return this.selectingAllies ? (this.allies[CR] >= 1) : (this.enemies[CR] >= 1);
	}

	// Sets the number of enemies or allies of a particular CR (depending on which the user is currently adding).
	setCR(CR, count) {
		if (this.selectingAllies) { this.allies[CR] = count; }
		else { this.enemies[CR] = count; }
	}

	// Increases or decreases the number of enemies or allies of a particular CR by a given amount (depending on which the user is currently adding).
	modifyCR(CR, change) {
		const target = this.selectingAllies ? this.allies : this.enemies;
		const count = (target[CR] || 0) + change;
		target[CR] = Math.max(0, count);
	}

	// Adds an additional enemy or ally of a particular CR (depending on which the user is currently adding).
	incrementCR(CR) {
		this.modifyCR(CR, 1);
	}

	// Removes a single enemy or ally of a particular CR (depending on which the user is currently adding).
	decrementCR(CR) {
		this.modifyCR(CR, -1);
	}

	// If a particular CR is already included in the encounter, removes it. Otherwise, sets the number of enemies or allies of that CR to 1 (depending on which the user is currently adding).
	toggleCR(CR) {
		if (this.containsCR(CR)) { this.setCR(CR, 0); }
		else { this.setCR(CR, 1); }
	}

	// Allows the user to toggle between whether they're currently adding enemies or allies.
	toggleSelector() {
		this.selectingAllies = !(this.selectingAllies);
	}
}

// The EncounterManager class manages multiple encounters and controls the active encounter.
class EncounterManager {
	constructor() {
		this.nextID = 0; // Counter for assigning unique encounter IDs
		this.party = new Party(5, 1); // Default party size and level
		this.encounters = {} // Collection of all encounters
		this.activeEncounter = this.newEncounter(); // The currently active encounter
		this.ui = new EncounterManagerUI(this); // The user interface for managing the encounters
	}

	// Creates a new encounter and adds it to the collection.
	newEncounter() {
		const id = this.nextID++;
		const encounter = new Encounter(id);
		this.encounters[id] = encounter;
		return encounter;
	}

}

// The EncounterManagerUI class handles the visual representation of the encounter manager.
class EncounterManagerUI {
	constructor(encounterManager) {
		this.encounterManager = encounterManager; // Reference to the encounter manager
		this.buttonContainer = document.getElementById('cr-buttons'); // Container for buttons
		this.buttons = this.initializeButtons(); // Initialize the buttons allowing the user to add or remove Challenge Ratings (CR) from the encounter.
	}

	// Creates a new row for button layout.
	createNewRow() {
		const row = document.createElement('div');
		row.className = 'row';
		return row;
	}

	// Initializes buttons for each Challenge Rating (CR) and arranges them in rows, five per row.
	initializeButtons() {
		const buttonContainer = document.getElementById('cr-buttons');
		const row = this.createNewRow();
		buttonContainer.appendChild(row);

		let buttonsPerLine = 0;
		let currentRow = row;

		// Iterates through each CR and creates a button for it.
		Object.keys(this.encounterManager.activeEncounter.enemies).forEach(CR => {
			if (buttonsPerLine === 5) {
				currentRow = this.createNewRow();
				buttonContainer.appendChild(currentRow);
				buttonsPerLine = 0;
			}

			const col = document.createElement('div');
			col.className = 'col-2';

			// Creates a CRButton and adds it to the layout.
			const crButton = new CRButton(CR, () => this.encounterManager.activeEncounter.toggleCR(CR));
			col.appendChild(crButton.getElement());
			currentRow.appendChild(col);

			buttonsPerLine++;
		});
	}

}

// The CRButton class represents a single Challenge Rating (CR) button.
class CRButton {
	constructor(CR, onSelect) {
		this.label = CR; // Label for the button (e.g., "1/4")
		this.selected = false; // Whether the button is currently selected
		this.CR = CR; // Challenge Rating represented by the button
		this.onSelect = onSelect; // Callback function for when the button is pressed
		this.ui = new CRButtonUI(CR, this.toggleSelected.bind(this)); // UI handling for the button
	}

	// Toggles whether the button is selected or not.
	toggleSelected() {
		this.selected = !this.selected;
		this.onSelect();
		this.ui.setSelected(this.selected);
	}

	// Retrieves the visual element for the button.
	getElement() {
		return this.ui.getElement();
	}
}

// The CRButtonUI class manages the visual appearance of a Challenge Rating (CR) button.
class CRButtonUI {
	constructor(CR, onClick) {
		this.buttonElement = document.createElement('button'); // HTML button element
		this.buttonElement.textContent = CR; // Text content of the button (e.g., "1/4")
		this.buttonElement.addEventListener('click', onClick); // Click event listener
	}

	// Sets whether the button is selected or not, changing its appearance.
	setSelected(selected) {
		this.buttonElement.classList.toggle('selected', selected);
	}

	// Retrieves the visual element for the button.
	getElement() {
		return this.buttonElement;
	}

}