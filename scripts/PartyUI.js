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
		this.sliderContainer = document.getElementById('party-level-slider');
		this.sliderElement = this.initializePartyLevelSlider();
	}

	createButton(iconClass, onClick, isLeft=false) {
		const button = document.createElement('button');
		button.className = 'btn btn-outline-secondary';
		button.style.width = "100%";
		button.style.height = "50px";
		button.style.borderRadius = isLeft ? '50px 0 0 50px' : '0 50px 50px 0'; 
		button.style.backgroundColor = '#6c757d';
		button.style.color = 'white';
		button.style.fontSize = '20px';
		button.fontWeight = 'bold';
		button.style.display = 'flex';
		button.style.alignItems = 'center';
		button.style.justifyContent = 'center';

		const icon = document.createElement('i');
		icon.className = iconClass;

		button.appendChild(icon);
		button.addEventListener('click', onClick);
		return button;
	}

	initializePartyLevelSlider() {
		const label = document.createElement('label');
		label.textContent = 'Level 1';
		label.classList.add('text-center');
		label.classList.add('my-auto');

		const slider = document.createElement('input');
		slider.style.width = "100%";
		slider.type = 'range';
		slider.min = 1;
		slider.max = 20;
		slider.step = 1;
		slider.value = 1;
		slider.style.marginTop = '13px';
		slider.setAttribute('list', 'tickmarks');

		const sliderWrapper = document.createElement('div');
		sliderWrapper.style.height = '50px';

		sliderWrapper.style.position = 'relative';
		sliderWrapper.style.alignItems = 'center';
		sliderWrapper.style.justifyContent = 'center';
		sliderWrapper.style.width = '100%';

		const pointer = document.createElement('div');
		pointer.textContent = `Level ${slider.value}`;
		pointer.style.position = 'absolute';
		pointer.style.left = `calc(${(slider.value - 1) * 5}% + 2px)`;
		pointer.style.transform = 'translateX(-50%) translateY(-100%)';
		pointer.style.bottom = '32px';
		pointer.style.width = '80px';
		pointer.style.whiteSpace = 'nowrap';
		pointer.style.backgroundColor = '#28a745';
		pointer.style.color = 'white';
		pointer.style.padding = '3px';
		pointer.style.borderRadius = '5px';
		pointer.style.textAlign = 'center';

		pointer.style.position = 'relative';
		pointer.style.boxShadow = '0px 0px 4px rgba(0, 0, 0, 0.1)';
		pointer.classList.add('pointer-with-triangle');

		sliderWrapper.appendChild(slider);
		sliderWrapper.appendChild(pointer);

		slider.addEventListener('input', () => {
			label.textContent = `Level ${slider.value}`;
			pointer.textContent = `Level ${slider.value}`;
			pointer.style.left = `calc(${(slider.value - 1) * 5}% + 2px)`;
			this.encounterManager.setPartyLevel(slider.value);
			const percentage = (slider.value - slider.min) / (slider.max - slider.min) * 100;
			slider.style.setProperty('--slider-percentage', `${percentage}%`);
			slider.style.background = `linear-gradient(to right, rgb(40, 167, 69) ${percentage}%, rgb(108, 117, 125) ${percentage}%)`;
		});

		const tickmarks = document.createElement('datalist');
		tickmarks.id = 'tickmarks';
		for (let i = 1; i <= 20; i++) {
			const option = document.createElement('option');
			option.value = i;
			tickmarks.appendChild(option);
		}

		const decrementButton = this.createButton('fas fa-minus', this.decrementSlider.bind(this), true);
		const incrementButton = this.createButton('fas fa-plus', this.incrementSlider.bind(this), false);

		const row = createBootstrapRow([
			[decrementButton, 2],
			[sliderWrapper, 8],
			[incrementButton, 2],
		], true);

		row.classList.add('align-items-center')

		const columns = row.querySelectorAll('.col');
		columns.forEach(col => {
			col.style.padding = '5px';
		});

		this.sliderContainer.appendChild(row);
		this.sliderContainer.appendChild(tickmarks);
		this.sliderContainer.style.margin = 'auto';

		return slider;
	}

	decrementSlider() {
		this.sliderElement.value = Math.max(1, Number(this.sliderElement.value) - 1);
		this.sliderElement.dispatchEvent(new Event('input')); // Trigger a change event
	}

	incrementSlider() {
		this.sliderElement.value = Math.min(20, Number(this.sliderElement.value) + 1);
		this.sliderElement.dispatchEvent(new Event('input')); // Trigger a change event
	}
}