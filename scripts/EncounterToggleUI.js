class EncounterToggleUI {
	
	static TOGGLE_LABEL_MARGIN = '10px';

	constructor(encounterManager, encounterUI) {
		this.encounterManager = encounterManager;
		this.encounterUI = encounterUI;
		this.toggleContainer = document.getElementById('selecting-allies-toggle'); // Container for toggle
		this.initializeToggleSwitch(); // Initialize the toggle switch between adding enemies and adding allies.
	}

	createLabel(text, initialClass) {
		const label = document.createElement('span');
		label.textContent = text;
		label.className = `badge badge-pill ${initialClass} text-white`;
		label.style.padding = '8px 15px';
		return label;
	}

	createSwitch() {
		const input = document.createElement('input');
		input.type = 'checkbox';
		input.className = 'custom-control-input';
		input.id = 'toggleSwitch';

		const label = document.createElement('label');
		label.className = 'custom-control-label my-auto';
		label.setAttribute('for', 'toggleSwitch');
		label.style.height = '24px';

		const switchWrapper = document.createElement('div');
		switchWrapper.className = 'custom-control custom-switch mx-2';
		switchWrapper.style.transform = 'scale(2)';
		switchWrapper.style.display = 'flex';
		switchWrapper.style.alignItems = 'center';
		switchWrapper.appendChild(input);
		switchWrapper.appendChild(label);

		return { input, switchWrapper };
	}

	initializeToggleSwitch() {
		const toggleContainer = document.createElement('div');
		toggleContainer.className = 'd-flex justify-content-center';
		toggleContainer.style.fontSize = '18px';

		const enemiesLabel = this.createLabel('Selecting Enemies', 'badge-danger');
		enemiesLabel.style.marginRight = EncounterToggleUI.TOGGLE_LABEL_MARGIN;
		enemiesLabel.style.width = "100%";

		const alliesLabel = this.createLabel('Selecting Allies', 'badge-secondary');
		alliesLabel.style.marginLeft = EncounterToggleUI.TOGGLE_LABEL_MARGIN;
		alliesLabel.style.width = "100%";

		const { input, switchWrapper } = this.createSwitch();

		const updateToggleSwitchClass = () => {
			if (input.checked) { input.classList.remove('enemy'); }
			else { input.classList.add('enemy'); }
		}

		updateToggleSwitchClass();

		const row = createBootstrapRow([
			[null, 1],
			[enemiesLabel, 4],
			[switchWrapper, 2],
			[alliesLabel, 4],
			[null, 1]
		], true);

		// toggleContainer.append(enemiesLabel, switchWrapper, alliesLabel);
		toggleContainer.appendChild(row);
		this.toggleContainer.appendChild(toggleContainer);

		input.addEventListener('change', () => {
			const enemyClass = input.checked ? 'badge-secondary' : 'badge-danger';
			const allyClass = input.checked ? 'badge-primary' : 'badge-secondary';
			enemiesLabel.className = `badge badge-pill ${enemyClass} text-white`;
			alliesLabel.className = `badge badge-pill ${allyClass} text-white`;
			this.encounterManager.activeEncounter.toggleActiveGroup();
			this.encounterUI.toggleGroupVisibility(input.checked);
			updateToggleSwitchClass();
		});
	}

}