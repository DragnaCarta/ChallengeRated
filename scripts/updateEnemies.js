// Function to add a Challenge Rating (CR)
function addCR(value) {
	activeCRs.push(value);
	enemyCounts[value] = 1; // Initialize the enemy count for this CR
	activeCRs.sort(function(a, b) {
		return parseCR(a) - parseCR(b);
	});
	renderCRList();
	updateEncounter();
}

// Function to remove a Challenge Rating (CR)
function removeCR(value) {
	let index = activeCRs.indexOf(value);
	if (index > -1) {
		activeCRs.splice(index, 1);
		delete enemyCounts[value]; // Remove the count for this CR
	}
	renderCRList();
	updateEncounter();
}

// Function to parse a CR value into a sortable number
function parseCR(value) {
	if (value.includes("-")) {
		let [numerator, denominator] = value.split("-");
		return parseFloat(numerator) / parseFloat(denominator);
	}
	return parseFloat(value);
}

// Function to create the CR list in sorted order
function renderCRList() {
	// Clear the current list
	crList.empty();

	// Iterate through the sorted CR array and create a div for each CR
	activeCRs.forEach(value => {
		let div = createCRDiv(value); // Assume createCRDiv is a function that creates the div for a single CR, you can put the creation logic here
		crList.append(div);
	})
}

// Function to create a single CR div
function createCRDiv(value) {
	// Create a new div with id 'cr' + value and class 'mb-3'
	let div = $('<div>').attr('id', 'cr' + value).addClass('mb-3');

	// Create a new label with text 'CR ' + value + ': '
	let label = $('<label class="mr-1">');
	label.append($('<strong>').text('CR ' + value.replace(/-/g, "/") + ': '));

	// Create an "enemy" text label
	let enemyLabel = $('<label class="ml-1 mr-1">').text('enemy');
	enemyLabel.attr({id: 'enemyLabel' + value})

	// Create a decrement button
	// When clicked, it decrements the value of the associated slider by 1, if the slider's value is greater than 1
	let decrementButton = $('<button>').addClass('btn btn-secondary mr-3').text('-').on('click', function() {
		let slider = $('#slider' + value);
		if(slider.val() > 1) slider.val(parseInt(slider.val()) - 1);
		$('#enemyLabel' + value).text(slider.val() > 1 ? "enemies" : "enemy");
		enemyCounts[value] = slider.val(); // Update the count
		$('#value' + value).text(slider.val());
		updateEncounter();
	});

	// Create a slider with range 1 to 10 and initial value 1
	// When the slider's input changes, the associated slider value text is updated
	let slider = $('<input>').attr({type: 'range', min: 1, max: 10, value: enemyCounts[value], id: 'slider' + value})
		.on('input', function() {
			enemyCounts[value] = $(this).val(); // Update the count
			$('#enemyLabel' + value).text(slider.val() > 1 ? "enemies" : "enemy");
			$('#value' + value).text($(this).val());
			updateEncounter();
		});

	// Create an increment button
	// When clicked, it increments the value of the associated slider by 1, if the slider's value is less than 10
	let incrementButton = $('<button>').addClass('btn btn-secondary ml-3').text('+').on('click', function() {
		let slider = $('#slider' + value);
		if(slider.val() < 10) slider.val(parseInt(slider.val()) + 1);
		$('#enemyLabel' + value).text(slider.val() > 1 ? "enemies" : "enemy");
		enemyCounts[value] = slider.val(); // Update the count
		$('#value' + value).text(slider.val());
		updateEncounter();
	});

	// Create a span to display the slider's value, initially set to '1'
	let sliderValue = $('<span>').attr('id', 'value' + value).text(enemyCounts[value]);


	// Create trash icon button
	let trashButton = $('<button>').addClass('btn')
		.html('<i class="fa fa-trash"></i>') // Add Font Awesome trash icon to button
		.on('click', function() {
			removeCR(value); // Call removeCR function on button click
			$('#cr' + value.replace("/", "-") + 'toggle').removeClass('btn-selected');
		});

	// Append the label, slider value text, 'enemies' text, and buttons to the div
	div.append(label, sliderValue, enemyLabel, decrementButton, slider, incrementButton, trashButton);

	return div;
}