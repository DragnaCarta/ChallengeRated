class EncounterToggleUI {
	
	static TOGGLE_LABEL_MARGIN = '10px';

	constructor(encounterManager, encounterUI) {
		// Initialize properties
		this.encounterManager = encounterManager;
		this.encounterUI = encounterUI;
		this.toggleContainer = document.getElementById('selecting-allies-toggle'); // Container for toggle

		// Add responsive styles and initialize the toggle switch between adding enemies and adding allies.
		this.updateResponsiveStyles();
		window.addEventListener('resize', this.updateResponsiveStyles);
		this.initializeToggleSwitch();
	}

	updateResponsiveStyles() {
		const windowWidth = window.innerWidth;

		// Define your min and max window widths and corresponding style values
		const minWidth = 500, maxWidth = 1200;
		const minFontSize = 12, maxFontSize = 18;
		const minScale = 1.5, maxScale = 2;

		// Calculate interpolated values
		const lerp = (min, max, t) => min * (1 - t) + max * t;
		const t = Math.min(1, Math.max(0, (windowWidth - minWidth) / (maxWidth - minWidth)));
		const fontSize = lerp(minFontSize, maxFontSize, t);
		const scale = lerp(minScale, maxScale, t);

		// Update CSS variables
		document.documentElement.style.setProperty('--responsive-badge-font-size', `${fontSize}px`);
		document.documentElement.style.setProperty('--responsive-switch-scale', scale);
	}

	// Create a label with specific text and initial class
	createLabel(text, initialClass) {
		const label = document.createElement('span');
		label.textContent = text;
		label.className = `badge badge-pill ${initialClass} text-white responsive-badge unselectable cursor-pointer`;
		return label;
	}

	// Create the toggle switch and its wrapper.
	createSwitch() {
		const input = document.createElement('input');
		input.type = 'checkbox';
		input.className = 'custom-control-input';
		input.id = 'toggleSwitch';

		const label = document.createElement('label');
		label.className = 'custom-control-label my-auto';
		label.setAttribute('for', 'toggleSwitch');

		const switchWrapper = document.createElement('div');
		switchWrapper.className = 'custom-control custom-switch mx-2 responsive-switch';
		switchWrapper.appendChild(input);
		switchWrapper.appendChild(label);

		return { input, switchWrapper };
	}

	// Initialize the toggle switch and its behavior
	initializeToggleSwitch() {
		// Create main toggle container
		const toggleContainer = this.createToggleContainer();

		// Create labels for enemies and allies
		const enemiesLabel = this.createLabel('Selecting Enemies', 'badge-danger');
		const alliesLabel = this.createLabel('Selecting Allies', 'badge-secondary');

		// Create the toggle switch
		const { input, switchWrapper } = this.createSwitch();

		// Add click event listeners to labels
		this.addLabelEventListeners(input, enemiesLabel, alliesLabel);

		// Update and set toggle switch classes
		this.updateToggleSwitchClass(input);

		const row = createBootstrapRow([
			[null, 1],
			[enemiesLabel, 4],
			[switchWrapper, 2],
			[alliesLabel, 4],
			[null, 1]
		], true);

		toggleContainer.appendChild(row);
		this.toggleContainer.appendChild(toggleContainer);

		input.addEventListener('change', () => {
			const enemyClass = input.checked ? 'badge-secondary' : 'badge-danger';
			const allyClass = input.checked ? 'badge-primary' : 'badge-secondary';
			enemiesLabel.className = `badge badge-pill ${enemyClass} text-white responsive-badge unselectable cursor-pointer`;
			alliesLabel.className = `badge badge-pill ${allyClass} text-white responsive-badge unselectable cursor-pointer`;
			this.encounterManager.activeEncounter.toggleActiveGroup();
			this.encounterUI.toggleGroupVisibility(input.checked);
			this.updateToggleSwitchClass(input);
		});
	}

	createToggleContainer() {
		const toggleContainer = document.createElement('div');
		toggleContainer.className = 'd-flex justify-content-center';
		return toggleContainer;
	}

	updateToggleSwitchClass(input) {
			if (input.checked) { input.classList.remove('enemy'); }
			else { input.classList.add('enemy'); }
	}

	addLabelEventListeners(input, enemiesLabel, alliesLabel) {
		enemiesLabel.addEventListener('click', () => {
			input.checked = false;
			input.dispatchEvent(new Event('change'));
		});

		alliesLabel.addEventListener('click', () => {
			input.checked = true;
			input.dispatchEvent(new Event('change'));
		});
	}

}