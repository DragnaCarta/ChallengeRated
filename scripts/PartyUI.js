class PartyUI {
	constructor(encounterManager) {
		this.encounterManager = encounterManager;
		this.partySizeUI = new PartySizeUI(encounterManager);
		this.partyLevelUI = new PartyLevelUI(encounterManager);
	}
}

class PartySizeUI {
	constructor(encounterManager) {
		this.encounterManager = encounterManager;
		this.buttonContainer = document.getElementById('party-size-buttons');
		this.buttons = [];
		this.initializePartySizeButtons();
	}

	initializePartySizeButtons() {
		const fragment = document.createDocumentFragment();

		// Create two rows
		let buttonRowOne = document.createElement('div');
		let buttonRowTwo = document.createElement('div');
		buttonRowOne.className = 'row d-flex align-items-center justify-content-center';
		buttonRowTwo.className = 'row d-flex align-items-center justify-content-center';

		for (let i = 1; i <= 10; i++) {
			
			const button = this.createButton(i);
			const col = this.createColumn(button, 2);

			if (i === 1) {
				const padding = this.createColumn(document.createElement('div'), 1);
				buttonRowOne.appendChild(padding);
				buttonRowOne.appendChild(col);
			} else if (i > 1 && i < 5) {
				buttonRowOne.appendChild(col);
			} else if (i === 5) {
				const padding = this.createColumn(document.createElement('div'), 1);
				buttonRowOne.appendChild(col);
				buttonRowOne.appendChild(padding);
			} else if (i === 6) {
				const padding = this.createColumn(document.createElement('div'), 1);
				buttonRowTwo.appendChild(padding);
				buttonRowTwo.appendChild(col);
			} else if (i > 6 && i < 10) {
				buttonRowTwo.appendChild(col);
			} else if (i === 10) {
				const padding = this.createColumn(document.createElement('div'), 1);
				buttonRowTwo.appendChild(col);
				buttonRowTwo.appendChild(padding);
			}
		}

		// Append the two buttons rows to the fragment
		fragment.appendChild(buttonRowOne);
		fragment.appendChild(buttonRowTwo);

		this.buttonContainer.className = 'mb-3';
		this.buttonContainer.appendChild(fragment);
	}

	createButton(i) {
		const button = document.createElement('button');
		button.className = 'btn btn-secondary m-1';
		button.style.width = '100%';
		button.textContent = i;

		if (i === 5) { button.classList.add('btn-success'); }

		button.addEventListener('click', () => {
			this.deselectAllButtons();
			button.classList.add('btn-success');
			this.encounterManager.setPartySize(i);
		});

		this.buttons.push(button);

		return button;
	}

	createColumn(button, width) {
		const col = document.createElement('div');
		col.className = `col-${width} px-1`;
		col.appendChild(button);
		return col
	}

	deselectAllButtons() {
		this.buttons.forEach(button => button.classList.remove('btn-success'));
		this.buttons.forEach(button => button.classList.add('btn-secondary'));
	}

}

class PartyLevelUI {
	constructor(encounterManager) {
		this.encounterManager = encounterManager;
		this.sliderElement = new SliderUI({
			containerId: 'party-level-slider',
			minValue: 1,
			maxValue: 20,
			initialValue: 1,
			sliderColor: "#6c757d",
			pointerColor: "#28a745",
			onChange: (value) => {
				this.encounterManager.setPartyLevel(value);
			}
		});
	}
	
}