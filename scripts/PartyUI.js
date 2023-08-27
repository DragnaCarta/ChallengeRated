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

		for (let i = 1; i <= 10; i++) {
			const button = document.createElement('button');
			button.className = 'btn btn-secondary';
			button.style.margin = '1px';
			button.textContent = i;
			if (i === 5) { button.classList.add('btn-success'); }
			button.addEventListener('click', () => {
				this.deselectAllButtons();
				button.classList.add('btn-success');
				this.encounterManager.setPartySize(i);
			});
			this.buttons.push(button);
			fragment.appendChild(button);
		}

		this.buttonContainer.appendChild(fragment);
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