function getActiveData() {

	console.log("Getting active data.");

	return selectingAllies
		? { activeCRs: activeAllyCRs, activeCounts: allyCounts }
		: { activeCRs: activeEnemyCRs, activeCounts: enemyCounts };
}

// Function to add a Challenge Rating (CR)
function addCR(value) {

	console.log("Adding a CR.");

	let {activeCRs, activeCounts} = getActiveData();

	activeCRs.push(value);
	activeCounts[value] = 1;
	activeCRs.sort(function(a, b) {
		return parseCR(a) - parseCR(b);
	});

	renderCRList();
	updateEncounter();

}

// Function to remove a Challenge Rating (CR)
function removeCR(value) {

	console.log("Removing a CR.");

	let {activeCRs, activeCounts} = getActiveData();
	let index = activeCRs.indexOf(value);

	if (index > -1) {
		activeCRs.splice(index, 1);
		delete activeCounts[value];
	};

	renderCRList();
	updateEncounter();

}

// Function to parse a CR value into a sortable number
function parseCR(value) {

	console.log("Parsing a CR.");

	if (value.includes("-")) {
		let [numerator, denominator] = value.split("-");
		return parseFloat(numerator) / parseFloat(denominator);
	}
	return parseFloat(value);
}


function updateQuantityLabel(quantityLabel, value) {

	console.log("Updating a quantity label.");

	if (selectingAllies) {
		quantityLabel.text(allyCounts[value] > 1 ? "allies" : "ally");
	} else {
		quantityLabel.text(enemyCounts[value] > 1 ? "enemies" : "enemy");
	};
};

// Function to create the CR list in sorted order
function renderCRList() {

	console.log("Rendering a CR list.");

	// Clear the current list
	crList.empty();

	let { activeCRs } = getActiveData();

	// Iterate through the sorted CR array and create a div for each CR
	activeCRs.forEach(value => {
		let div = createCRDiv(value); 
		crList.append(div);
	})
};

function createChallengeLabel(value) {
	let challengeLabel = $('<label class="mr-1">').css({'white-space': 'nowrap'});
	challengeLabel.append($('<strong>').text('CR ' + value.replace(/-/g, "/") + ': '));
	return challengeLabel;
}

function createQuantityLabel(value) {
	let quantityLabel = $('<label class="ml-1 mr-1">').attr({id: 'quantityLabel' + value});
	updateQuantityLabel(quantityLabel, value);
	return quantityLabel;
}

function createButton(className, text, clickFunction) {
	return $('<button>').addClass(className).text(text).on('click', clickFunction);
}

function createSlider(value, sliderChangeFunction) {

	let { activeCounts } = getActiveData(); 

	return $('<input>')
		.attr({
			type: 'range', 
			min: 1, 
			max: 10, 
			value: activeCounts[value], 
			id: 'slider' + value})
		.on('input', sliderChangeFunction);
}

function createSliderValue(value) {
	let { activeCounts } = getActiveData();

	return $('<span>').
		attr('id', 'value' + value)
		.text(activeCounts[value])
		.css({
    		'margin-top': 0,
    		'padding-top': 0});
}

function createTrashButton(value) {
	return $('<button>').addClass('btn')
		.html('<i class="fa fa-trash"></i>')
		.on('click', function() {
			removeCR(value);
			$('#cr' + value.replace("/", "-") + 'toggle').removeClass('btn-selected');
		});
}

function createCRDiv(value) {

	console.log("Creating a CR <div>.");
	
	let { activeCounts } = getActiveData(); 

	let decrementClickFunction = function() {
		let slider = $('#slider' + value);
		let quantityLabel = $('#quantityLabel' + value);

		if (slider.val() > 1) slider.val(parseInt(slider.val()) - 1);

		activeCounts[value] = slider.val(); // Update the count
		$('#value' + value).text(slider.val());

		updateQuantityLabel(quantityLabel, value);
		updateEncounter();
	};

	let incrementClickFunction = function() {
		let slider = $('#slider' + value);
		let quantityLabel = $('#quantityLabel' + value);

		if (slider.val() < 10) slider.val(parseInt(slider.val()) + 1);

		activeCounts[value] = slider.val(); // Update the count
		$('#value' + value).text(slider.val());

		updateQuantityLabel(quantityLabel, value);
		updateEncounter();
	};

	let sliderChangeFunction = function() {
		let quantityLabel = $('#quantityLabel' + value);
		
		activeCounts[value] = $(this).val(); // Update the count
		$('#value' + value).text($(this).val());

		updateQuantityLabel(quantityLabel, value);
		updateEncounter();
	};

	let div = $('<div>').attr('id', 'cr' + value).addClass('mb-3 d-flex flex-nowrap align-items-center');
	let challengeLabel = createChallengeLabel(value);
	let quantityLabel = createQuantityLabel(value);
	let decrementButton = createButton('btn btn-secondary mr-3', '-', decrementClickFunction);
	let slider = createSlider(value, sliderChangeFunction);
	let incrementButton = createButton('btn btn-secondary mr-3', '+', incrementClickFunction);
	let sliderValue = createSliderValue(value);
	let trashButton = createTrashButton(value);
	
	let textColumn = $('<div>').addClass('col-md-3 col-4 d-flex').append(challengeLabel, sliderValue, quantityLabel);
	let sliderColumn = $('<div>').addClass('col-md-9 col-8 d-flex').append(decrementButton, slider, incrementButton, trashButton);

	div.append(textColumn, sliderColumn);

	return div;

}


// // Function to create a single CR div
// function createCRDiv(value) {

// 	let activeCounts = selectingAllies ? allyCounts : enemyCounts;

// 	// Create a new div with id 'cr' + value and class 'mb-3'
// 	let div = $('<div>').attr('id', 'cr' + value).addClass('mb-3 d-flex flex-nowrap align-items-center');

// 	// Create a new label with text 'CR ' + value + ': '
// 	let label = $('<label class="mr-1">').css({'white-space': 'nowrap'});
// 	label.append($('<strong>').text('CR ' + value.replace(/-/g, "/") + ': '));

// 	// Create an "enemy" or "ally" text label
// 	let creatureLabel = $('<label class="ml-1 mr-1">').attr({id: 'creatureLabel' + value});
// 	updateCreatureLabel(creatureLabel, value);

// 	// Create a decrement button
// 	// When clicked, it decrements the value of the associated slider by 1, if the slider's value is greater than 1
// 	let decrementButton = $('<button>').addClass('btn btn-secondary mr-3').text('-').on('click', function() {
// 		let slider = $('#slider' + value);
// 		let creatureLabel = $('#creatureLabel' + value);

// 		if (slider.val() > 1) slider.val(parseInt(slider.val()) - 1);

// 		activeCounts[value] = slider.val(); // Update the count
// 		$('#value' + value).text(slider.val());

// 		updateCreatureLabel(creatureLabel, value);
// 		updateEncounter();
// 	});

// 	// Create a slider with range 1 to 10 and initial value 1
// 	// When the slider's input changes, the associated slider value text is updated
// 	let slider = $('<input>').attr({type: 'range', min: 1, max: 10, value: enemyCounts[value], id: 'slider' + value})
// 		.on('input', function() {
// 			let creatureLabel = $('#creatureLabel' + value);
			
// 			activeCounts[value] = $(this).val(); // Update the count
// 			$('#value' + value).text($(this).val());

// 			updateCreatureLabel(creatureLabel, value);
// 			updateEncounter();
// 		});

// 	// Create an increment button
// 	// When clicked, it increments the value of the associated slider by 1, if the slider's value is less than 10
// 	let incrementButton = $('<button>').addClass('btn btn-secondary ml-3').text('+').on('click', function() {
// 		let slider = $('#slider' + value);
// 		let creatureLabel = $('#creatureLabel' + value);

// 		if (slider.val() < 10) slider.val(parseInt(slider.val()) + 1);

// 		activeCounts[value] = slider.val(); // Update the count
// 		$('#value' + value).text(slider.val());

// 		updateCreatureLabel(creatureLabel, value);
// 		updateEncounter();
// 	});

// 	// Create a span to display the slider's value, initially set to '1'
// 	let sliderValue = $('<span>').attr('id', 'value' + value).text(enemyCounts[value]).css({
//     	'margin-top': 0,
//     	'padding-top': 0
// 	});;


// 	// Create trash icon button
// 	let trashButton = $('<button>').addClass('btn')
// 		.html('<i class="fa fa-trash"></i>') // Add Font Awesome trash icon to button
// 		.on('click', function() {
// 			removeCR(value); // Call removeCR function on button click
// 			$('#cr' + value.replace("/", "-") + 'toggle').removeClass('btn-selected');
// 		});

// 	let textColumn = $('<div>').addClass('col-md-3 col-4 d-flex ').append(label, sliderValue, creatureLabel);
// 	let sliderColumn = $('<div>').addClass('col-md-9 col-8 d-flex').append(decrementButton, slider, incrementButton, trashButton);
// 	div.append(textColumn, sliderColumn);

// 	return div;
// }