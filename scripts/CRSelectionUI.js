class CRSelectionUI {
	
	static BUTTONS_PER_LINE = 5;

	constructor(encounterManager, encounterUI) {
		this.encounterManager = encounterManager;
		this.encounterUI = encounterUI;
		this.enemyButtonContainer = document.getElementById('enemy-buttons');
		this.enemySliderContainer = document.getElementById('enemy-sliders');
		this.allyButtonContainer = document.getElementById('ally-buttons');
		this.allySliderContainer = document.getElementById('ally-sliders');
		this.enemyButtons = [];
		this.allyButtons = [];
		this.initializeCRButtons(); // Initialize the buttons allowing the user to add or remove Challenge Ratings (CR) from the encounter.
	}

	// Creates a new row for button layout.
	createNewRow() {
		const row = document.createElement('div');
		row.className = 'row';
		return row;
	}

	initializeCRButtons() {
		this.initializeCRButtonGroup(
			this.encounterManager.activeEncounter.enemies,
			this.enemyButtonContainer,
			this.enemySliderContainer,
			this.enemyButtons, false);
		this.initializeCRButtonGroup(
			this.encounterManager.activeEncounter.allies,
			this.allyButtonContainer,
			this.allySliderContainer,
			this.allyButtons, true);
		this.setInitialGroupVisibility();
	}

	setInitialGroupVisibility() {
		this.enemyButtonContainer.style.display = 'block';
		this.enemySliderContainer.style.display = 'block';
		this.allyButtonContainer.style.display = 'none';
		this.allySliderContainer.style.display = 'none';
	}

	toggleGroupVisibility(isAlliesSelected) {
		this.enemyButtonContainer.style.display = isAlliesSelected ? 'none' : 'block';
		this.enemySliderContainer.style.display = isAlliesSelected ? 'none' : 'block';
		this.allyButtonContainer.style.display = isAlliesSelected ? 'block' : 'none';
		this.allySliderContainer.style.display = isAlliesSelected ? 'block' : 'none';
	}

	// Initializes buttons for each Challenge Rating (CR) and arranges them in rows, five per row.
	initializeCRButtonGroup(group, buttonContainer, sliderContainer, buttons, isAllyButton) {
		const fragment = document.createDocumentFragment();

		let paddingLeft = document.createElement('div');
		paddingLeft.className = 'col-1';
		let paddingRight = document.createElement('div');

		let currentRow = this.createNewRow();
		currentRow.appendChild(paddingLeft);
		fragment.appendChild(currentRow);
		let buttonsPerLine = 0;

		// Iterates through each CR and creates a button and corresponding slider for it.
		group.forEach((count, CR) => {
			if (buttonsPerLine === CRSelectionUI.BUTTONS_PER_LINE) {
				paddingLeft = document.createElement('div');
				paddingRight = document.createElement('div');
				paddingLeft.className = 'col-1';
				paddingRight.className = 'col-1';
				
				currentRow.append(paddingRight);

				currentRow = this.createNewRow();
				currentRow.append(paddingLeft);

				fragment.appendChild(currentRow);
				buttonsPerLine = 0;
			}

			const col = this.createCRButtonColumn(CR, sliderContainer, buttons, isAllyButton);
			currentRow.appendChild(col);
			buttonsPerLine++;
		});

		buttonContainer.append(fragment);
	}

	createCRButtonColumn(CR, sliderContainer, buttons, isAllyButton) {
		const col = document.createElement('div');
		col.className = 'col-2';
		col.style.padding = '1px';

		// Creates a CRButton and adds it to the layout.
		const crButton = new CRButton(CR, isAllyButton,
			() => this.encounterManager.activeEncounter.toggleCR(CR),
			(value) => this.encounterManager.activeEncounter.setCR(CR, value),
			this.encounterManager.activeEncounter.isSelectingAllies.bind(this.encounterManager.activeEncounter));
		col.appendChild(crButton.getElement());
		buttons.push(crButton);

		// Appends a corresponding slider to the slider container.
		sliderContainer.appendChild(crButton.slider.getElement());

		return col;
	}
}

// The CRButton class represents a single Challenge Rating (CR) button.
class CRButton {
	constructor(CR, isAllyButton, onSelect, onSliderChange, isSelectingAllies) {
		this.label = CR; // Label for the button (e.g., "1/4")
		this.selected = false; // Whether the button is currently selected
		this.CR = CR; // Challenge Rating represented by the button
		this.onSelect = onSelect; // Callback function for when the button is pressed
		this.isSelectingAllies = isSelectingAllies;
		this.slider = new CRSlider(CR, onSliderChange, isSelectingAllies, this.onSliderDeleted.bind(this)); // A new corresponding slider.
		this.ui = new CRButtonUI(CR, isAllyButton, this.toggleSelected.bind(this), this.slider, this.isSelectingAllies.bind(this)); // UI handling for the button
	}

	// Toggling whether the button is selected when its slider is deleted.
	onSliderDeleted() {
		this.toggleSelected(); // Toggle the selected state.
	}

	// Toggles whether the button is selected or not.
	toggleSelected() {
		this.selected = !this.selected;
		if (this.selected) { 
			this.slider.ui.setSliderValue(1); 
		}
		else { 
			this.onSelect(); 
		}
		this.ui.setSelected(this.selected);
		this.slider.toggleVisibility();
	}

	updateColor(isSelectingAllies) {
		this.ui.updateButtonColor(this.selected, isSelectingAllies);
	}

	// Retrieves the visual element for the button.
	getElement() {
		return this.ui.getElement();
	}
}

// The CRSlider class allows the user to adjust the number of enemies or allies of a particular CR (depending on which the user is adding).
class CRSlider {

	constructor(CR, onSliderChange, isSelectingAllies, onSliderDeleted) {
		this.CR = CR;
		this.onSliderChange = onSliderChange;
		this.isSelectingAllies = isSelectingAllies;
		this.onSliderDeleted = onSliderDeleted;
		this.visible = false;
		this.ui = new CRSliderUI(CR, this.onSliderChange.bind(this), this.isSelectingAllies.bind(this), this.onSliderDeleted.bind(this));
	}

	handleSliderChange(value) {
		this.onSliderChange(this.CR, value); // Pass value to callback
	}

	toggleVisibility() {
		this.visible = !this.visible;
		if (this.visible) { this.ui.showSlider(); }
		else { this.ui.hideSlider(); }
	}

	getElement() {
		return this.ui.getElement();
	}
}

class CRSliderUI {

	static MAX_SLIDER_VALUE = 10;
	static MIN_SLIDER_VALUE = 1;

	constructor(CR, onSliderChange, isSelectingAllies, onSliderDeleted) {
		this.CR = CR;
		this.onSliderChange = onSliderChange;
		this.isSelectingAllies = isSelectingAllies;
		this.onSliderDeleted = onSliderDeleted;
		this.sliderElement = this.createSlider(CR, onSliderChange); // HTML slider element
		this.container = this.createContainer(CR, isSelectingAllies);
	}

	createSlider(CR, onSliderChange) {
		const slider = document.createElement('input');
		slider.style.width = '100%';
		slider.type = 'range';
		slider.min = CRSliderUI.MIN_SLIDER_VALUE;
		slider.max = CRSliderUI.MAX_SLIDER_VALUE;
		slider.step = 1;
		slider.value = 1;
		slider.className = 'cr-slider';
		slider.addEventListener('input', () => {
			onSliderChange(slider.value); // Listen for changes
			this.updateLabel();
		});
		return slider;
	}

	createButton(textContent, onClick) {
		const button = document.createElement('button');
		button.className = 'btn btn-secondary';
		button.style.width = '100%';
		button.textContent = textContent;
		button.addEventListener('click', onClick);
		return button;
	}

	createIconButton(iconClass, onClick) {
		const button = document.createElement('button');
		button.className = 'btn';
		button.style.width = "100%";
		button.style.borderRadius = '70px';
		button.style.backgroundColor = 'transparent';
		button.style.color = 'black';
		button.style.outline = 'none';
		button.style.boxShadow = 'none';
		button.style.padding = '0';
		button.style.border = '0px';
		button.style.fontSize = '30px';
		button.style.fontWeight = 'bold';

		const icon = document.createElement('i');
		icon.className = iconClass;

		button.appendChild(icon);
		button.addEventListener('click', onClick);
		return button;
	}

	createContainer(CR, isSelectingAllies) {
		const container = document.createElement('div');
		container.className = 'slider-container justify-content-center';
		container.style.display = 'none'; // Initially hidden;

		this.label = document.createElement('span'); // Assign the new label to this.label
		this.updateLabel(); // Set initial text content

		const decrementButton = this.createIconButton('fas fa-minus', this.decrementSlider.bind(this))
		const incrementButton = this.createIconButton('fas fa-plus', this.incrementSlider.bind(this))
		const deleteButton = this.createButton('🗑️', () => {
			this.sliderElement.value = 1;
			this.onSliderDeleted();
			this.updateLabel();
		});

		let row = createBootstrapRow([
			[this.label, 4],
			[decrementButton, 1],
			[this.sliderElement, 4],
			[incrementButton, 1],
			[deleteButton, 2]
		]);
		const columns = row.querySelectorAll('.col');
		columns.forEach(col => {
			col.style.padding = '5px';
		});

		container.appendChild(row);

		return container;
	}

	initializeSliderValue(value) {
		this.sliderElement.value = value;
		this.updateLabel();
	}

	setSliderValue(value) {
		this.initializeSliderValue(1);
		this.onSliderChange(this.sliderElement.value);
	}

	decrementSlider() {
		this.sliderElement.value = Math.max(CRSliderUI.MIN_SLIDER_VALUE, Number(this.sliderElement.value) - 1);
		this.sliderElement.dispatchEvent(new Event('input')); // Trigger a change event
	}

	incrementSlider() {
		this.sliderElement.value = Math.min(CRSliderUI.MAX_SLIDER_VALUE, Number(this.sliderElement.value) + 1);
		this.sliderElement.dispatchEvent(new Event('input')); // Trigger a change event
	}

	updateLabel() {
		this.label.textContent = `CR ${this.CR}: ${this.sliderElement.value} ${this.isSelectingAllies() ? 'allies' : 'enemies'}`;
	}

	showSlider() {
		this.container.style.display = 'block';
	}

	hideSlider() {
		this.container.style.display = 'none';
	}

	// Retrieves the visual element for the slider.
	getElement() {
		return this.container;
	}
}

// The CRButtonUI class manages the visual appearance of a Challenge Rating (CR) button.
class CRButtonUI {
	constructor(CR, isAllyButton, onClick, slider, isSelectingAllies) {
		this.buttonElement = document.createElement('button'); // HTML button element
		this.buttonElement.className = 'btn';
		this.buttonElement.style.display = 'block';
		this.buttonElement.style.width = '100%';
		this.buttonElement.style.color = 'white';
		this.buttonElement.textContent = CR; // Text content of the button (e.g., "1/4")
		this.buttonElement.addEventListener('click', onClick); // Click event listener
		this.slider = slider;
		this.isAllyButton = isAllyButton;
		this.isSelectingAllies = isSelectingAllies;
		this.updateButtonColor(false); 
	}

	// Sets whether the button is selected or not, changing its appearance.
	setSelected(selected) {
		this.buttonElement.classList.toggle('selected', selected);
		this.updateButtonColor(selected);
	}

	updateButtonColor(selected) {
		this.buttonElement.classList.remove('btn-primary', 'btn-danger', 'btn-light-red', 'btn-light-blue');
		if (selected) { this.buttonElement.classList.add(this.isAllyButton ? 'btn-primary' : 'btn-danger'); }
		else { this.buttonElement.classList.add(this.isAllyButton ? 'btn-light-blue' : 'btn-light-red'); }
	}

	// Retrieves the visual element for the button.
	getElement() {
		return this.buttonElement;
	}

}