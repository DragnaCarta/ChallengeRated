var crGrid = $('#crGrid');
var crList = $("#crList");
var fractionCRs = ["0", "1/8", "1/4", "1/2"];

for (let i = 1; i <= 34; i++) {

	let label;
	if (i < 5) {
		label = fractionCRs[i-1];
	} else {
		label = i - 4; // To start numbering from 1 after the additional CRs
	}

	let col = $('<div>').addClass('col-3 mb-1 mr-0 ml-0 pr-0 pl-0');
	let button = $('<button>').addClass('btn btn-deselected btn-block')
		.text(label)
		.data('cr', String(label).replace("/", "-"))
		.attr('id', 'cr' + String(label).replace("/", "-") + 'toggle') // Use a hyphen instead of a slash in the ID
		.on('click', function() {
			$(this).toggleClass('btn-selected');
			if($(this).hasClass('btn-selected')) {
				addCR($(this).data('cr'));
			} else {
				removeCR($(this).data('cr'));
			}
		});
		
	col.append(button);
	crGrid.append(col);

	// Add a row after every 5 buttons
	if (i % 4 === 0) {
		crGrid.append('<div class="w-100"></div>') // Bootstrap class to force next row
	}
}

