var crGrid = document.getElementById('crGrid');
var crList = $("#crList");

for (let i = 1; i <= 20; i++) {

	let col = $('<div>').addClass('col-2 mb-3');
	let button = $('<button>').addClass('btn btn-primary btn-block')
		.text(i)
		.val(i)
		.on('click', function() {
			$(this).toggleClass('selected');
			if($(this).hasClass('selected')) {
				addCR($(this).val());
			} else {
				removeCR($(this).val());
			}
		});
		
	col.append(button);
	crGrid.append(col);

	// Add a row after every 5 buttons
	if (i % 5 === 0) {
		crGrid.append('<div class="w-100"></div>') // Bootstrap class to force next row
	}
}

