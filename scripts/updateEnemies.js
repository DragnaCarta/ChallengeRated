function addCR(value) {
	let div = $('<div>').attr('id', 'cr' + value).addClass('mb-3');

	let label = $('<label>').text('CR ' + value + ': ');

	let decrementButton = $('<button>').addClass('btn btn-secondary mr-3').text('-').on('click', function() {
		let slider = $('#slider' + value);
		if(slider.val() > 1) slider.val(parseInt(slider.val()) - 1);
		$('#value' + value).text(slider.val());
	});

	let slider = $('<input>').attr({type: 'range', min: 1, max: 10, value: 1, id: 'slider' + value})
		.on('input', function() {
			$('#value' + value).text($(this).val());
		});

	let incrementButton = $('<button>').addClass('btn btn-secondary ml-3').text('+').on('click', function() {
		let slider = $('#slider' + value);
		if(slider.val() < 10) slider.val(parseInt(slider.val()) + 1);
		$('#value' + value.text(slider.val()));
	});

	let sliderValue = $('<span>').attr('id', 'value' + value).text('1');

	div.append(label, sliderValue, 'enemies', decrementButton, slider, incrementButton);
	crList.append(div);
}

function removeCR(value) {
	$('#cr' + value).remove();
}