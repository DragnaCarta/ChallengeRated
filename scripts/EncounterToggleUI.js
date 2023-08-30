class EncounterToggleUI {
	
	constructor(encounterManager, encounterUI) {
		// Initialize properties
		this.encounterManager = encounterManager;
		this.encounterUI = encounterUI;
		this.toggleContainer = document.getElementById('selecting-allies-toggle'); // Container for toggle

		// Initialize the button group
		this.initializeBtnGroup();
	}

	createButton(text, initialClass) {
		const button = document.createElement('button');
		button.textContent = text;
		button.className = `btn ${initialClass}`;
		button.style.outline = 'none';
		button.style.boxShadow = 'none';
		return button;
	}

	initializeBtnGroup() {
		// Create main toggle container
		const toggleContainer = this.createToggleContainer();

		// Create buttons for enemies and allies
		const enemiesButton = this.createButton('Enemies', 'btn-danger');
		const alliesButton = this.createButton('Allies', 'btn-secondary');

		// Create the btn-group container
		const btnGroup = document.createElement('div');
		btnGroup.className = 'btn-group w-75';
		btnGroup.appendChild(enemiesButton);
		btnGroup.appendChild(alliesButton);

		toggleContainer.appendChild(btnGroup);
		this.toggleContainer.appendChild(toggleContainer);

		// Initialize as enemies
		this.updateButtonGroup(false, enemiesButton, alliesButton);

		// Add click event listeners as buttons
		enemiesButton.addEventListener('click', () => {
			this.updateButtonGroup(false, enemiesButton, alliesButton);
			this.encounterManager.activeEncounter.toggleActiveGroup();
			this.encounterUI.toggleGroupVisibility(false);
		});

		alliesButton.addEventListener('click', () => {
			this.updateButtonGroup(true, enemiesButton, alliesButton);
			this.encounterManager.activeEncounter.toggleActiveGroup();
			this.encounterUI.toggleGroupVisibility(true);
		});
	}

	createToggleContainer() {
		const toggleContainer = document.createElement('div');
		toggleContainer.className = 'd-flex justify-content-center';
		return toggleContainer;
	}

	// Update the classes and state when a button is clicked
	updateButtonGroup(selectingAllies, enemiesButton, alliesButton) {
		if (selectingAllies) {
			enemiesButton.className = 'btn btn-secondary';
			alliesButton.className = 'btn btn-primary';
		} else {
			enemiesButton.className = 'btn btn-danger';
			alliesButton.className = 'btn btn-secondary';
		}
	}

}