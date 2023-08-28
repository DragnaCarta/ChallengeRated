/**
 * Creates a Bootstrap row with specified columns and widths.
 * @param {Object} columns - An object mapping HTML elements to column widths. Use null for empty columns.
 * @returns {HTMLElement} The created Bootstrap row.
 */
function createBootstrapRow(columns, centered=false) {
	// Create a row element with Bootstrap class
	let row = document.createElement('div');
	row.className = 'row align-items-center';
	row.style.width = '100%';

	// Iterate through the columns and create corresponding Bootstrap columns
	for (const [element, colWidth] of columns) {
		let col = document.createElement('div');
		col.className = centered ? `col col-${colWidth} d-flex justify-content-center` : `col col-${colWidth}`;

		// If the element is not null, append it; otherwise, it's a padding column
		if (element) {
			col.appendChild(element);
		}

		// Append the column to the row
		row.appendChild(col);
	}
	return row
}

// Creates a slider UI element with tickmarks, increment and decrement buttons, and a visual pointer to the current value
class SliderUI {
	constructor({
		containerId,
		minValue = 1,
		maxValue = 20,
		initialValue = 1,
		sliderColor = "#6c757d",
		pointerColor = "#28a745",
		onChange = () => {},
	}) {
		// Initialize properties
		this.containerId = containerId;
		this.minValue = minValue;
		this.maxValue = maxValue;
		this.initialValue = initialValue;
		this.sliderColor = sliderColor;
		this.pointerColor = pointerColor;
		this.onChange = onChange;

		// Get container and initialize slider
		this.sliderContainer = document.getElementById(this.containerId);
		this.sliderElement = this.initializeSlider();
	}

	// Creates a button element
	createButton(iconClass, onClick, isLeft=false) {
		const button = document.createElement('button');
		button.className = 'btn btn-outline-secondary';
		button.style.width = "100%";
		button.style.height = "50px";
		button.style.borderRadius = isLeft ? '50px 0 0 50px' : '0 50px 50px 0'; 
		button.style.backgroundColor = this.sliderColor;
		button.style.color = 'white';
		button.style.fontSize = '20px';
		button.style.fontWeight = 'bold';
		button.style.display = 'flex';
		button.style.alignItems = 'center';
		button.style.justifyContent = 'center';

		const icon = document.createElement('i');
		icon.className = iconClass;

		button.appendChild(icon);
		button.addEventListener('click', onClick);
		return button;
	}

	// Initializes the slider element
	initializeSlider() {
		// Create slider elements
		const label = this.createLabel();
		const slider = this.createSlider();
		const sliderWrapper = this.createSliderWrapper();
		const pointer = this.createPointer(slider);

		// Add slider and pointer to wrapper
		sliderWrapper.appendChild(slider);
		sliderWrapper.appendChild(pointer);

		// Add event listener for slider
		this.addSliderEventListener(slider, label, pointer);

		// Create tickmarks and other elements
		const tickmarks = this.createTickmarks();

		// Add everything to the main container
		this.sliderContainer.appendChild(sliderWrapper);
		this.sliderContainer.appendChild(tickmarks);
		this.sliderContainer.style.margin = 'auto';

		return slider;
	}

	createLabel() {
		const label = document.createElement('label');
		label.textContent = 'Level 1';
		label.classList.add('text-center');
		label.classList.add('my-auto');
		return label;
	}

	createSlider() {
		const slider = document.createElement('input');
		slider.style.width = "100%";
		slider.type = 'range';
		slider.min = this.minValue;
		slider.max = this.maxValue;
		slider.value = this.initialValue;
		slider.step = 1;
		slider.style.marginTop = '13px';
		slider.setAttribute('list', 'tickmarks');
		return slider;
	}

	createSliderWrapper() {
		const sliderWrapper = document.createElement('div');
		sliderWrapper.style.height = '50px';
		sliderWrapper.style.position = 'relative';
		sliderWrapper.style.alignItems = 'center';
		sliderWrapper.style.justifyContent = 'center';
		sliderWrapper.style.width = '100%';
		return sliderWrapper;
	}

	createPointer(slider) {
		const pointer = document.createElement('div');
		pointer.textContent = `Level ${slider.value}`;
		pointer.style.position = 'absolute';
		pointer.style.left = `calc(${(slider.value - 1) * 5}% + 2px)`;
		pointer.style.transform = 'translateX(-50%) translateY(-100%)';
		pointer.style.bottom = '32px';
		pointer.style.width = '80px';
		pointer.style.whiteSpace = 'nowrap';
		pointer.style.backgroundColor = this.pointerColor;
		pointer.style.color = 'white';
		pointer.style.padding = '3px';
		pointer.style.borderRadius = '5px';
		pointer.style.textAlign = 'center';

		pointer.style.position = 'relative';
		pointer.style.boxShadow = '0px 0px 4px rgba(0, 0, 0, 0.1)';
		pointer.classList.add('pointer-with-triangle');
		return pointer;
	}

	addSliderEventListener(slider, label, pointer) {
		slider.addEventListener('input', () => {
			label.textContent = `Level ${slider.value}`;
			pointer.textContent = `Level ${slider.value}`;
			pointer.style.left = `calc(${(slider.value - 1) * 5}% + 2px)`;
			const percentage = (slider.value - slider.min) / (slider.max - slider.min) * 100;
			slider.style.setProperty('--slider-percentage', `${percentage}%`);
			slider.style.background = `linear-gradient(to right, rgb(40, 167, 69) ${percentage}%, rgb(108, 117, 125) ${percentage}%)`;
			this.onChange(slider.value);
		});
	}

	createTickmarks() {
		const tickmarks = document.createElement('datalist');
		tickmarks.id = 'tickmarks';
		for (let i = 1; i <= this.maxValue; i++) {
			const option = document.createElement('option');
			option.value = i;
			tickmarks.appendChild(option);
		}
		return tickmarks
	}
}