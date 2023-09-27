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

// Creates a slider UI element with a visual pointer to the current value
class SliderUI {
	constructor({
		minValue = 1,
		maxValue = 20,
		initialValue = 1,
		sliderColor = "#6c757d",
		pointerColor = "#28a745",
		onChange = () => {},
	}) {
		// Initialize properties
		this.minValue = minValue;
		this.maxValue = maxValue;
		this.initialValue = initialValue;
		this.sliderColor = sliderColor;
		this.pointerColor = pointerColor;
		this.onChange = onChange;

		// Create container and initialize slider
		this.ui = createElement('div', {
			className: 'd-flex align-items-center',
			style: {
				width: '100%'
			}
		});
		this.sliderElement = this.initializeSlider();
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
		this.ui.appendChild(sliderWrapper);
		this.ui.appendChild(tickmarks);
		this.ui.style.margin = 'auto';

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
		const slider = createElement('input', {
			className: 'form-range',
			type: 'range',
			min: this.minValue,
			max: this.maxValue,
			value: this.initialValue,
			step: 1,
			style: {
				width: '100%',
				marginTop: '13px'
			}
		});

		slider.setAttribute('list', 'tickmarks');
		return slider;
	}

	createSliderWrapper() {
		const sliderWrapper = createElement('div', {
			style: {
				height: '50px',
				position: 'relative',
				alignItems: 'center',
				justifyContent: 'center',
				width: '100%'
			}
		});

		return sliderWrapper;
	}

	createPointer(slider) {
		const pointer = createElement('div', {
			textContent: `Level ${slider.value}`,
			className: 'pointer-with-triangle',
			style: {
				position: 'absolute',
				left: `calc(${(slider.value - 1) * 5}% + 2px)`,
				transform: 'translateX(-50%) translateY(-100%)',
				bottom: '32px',
				width: '80px',
				whiteSpace: 'nowrap',
				backgroundColor: this.pointerColor,
				color: 'white',
				padding: '3px',
				borderRadius: '5px',
				textAlign: 'center',
				position: 'relative',
				boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.1)'
			}
		});

		return pointer;
	}

	addSliderEventListener(slider, label, pointer) {
		slider.addEventListener('input', () => {
			label.textContent = `Level ${slider.value}`;
			pointer.textContent = `Level ${slider.value}`;
			pointer.style.left = `calc(${(slider.value - 1) * 5}% + 2px)`;
			this.onChange(slider.value);
		});
	}

	createTickmarks() {
		const tickmarks = createElement('datalist', {});

		for (let i = 1; i <= this.maxValue; i++) {
			const option = createElement('option', {
				value: i
			});

			tickmarks.appendChild(option);
		}
		return tickmarks
	}
}

function createElement(tag, attributes) {
	const element = document.createElement(tag);
	for (const [key, value] of Object.entries(attributes)) {
		if (typeof value === 'object' && key === 'style') {
			Object.assign(element.style, value);
		} else {
			element[key] = value;
		}
	}
	return element;
}