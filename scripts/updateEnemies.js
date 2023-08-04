let encounterSize = 1;
let crValues = [ '0', '1/8', '1/4', '1/2', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30' ];

// jQuery function to change button color on click
$(document).ready(function(){
	$(".encounter-size").click(function(){
					$(".encounter-size").removeClass("btn-secondary").addClass("btn-outline-secondary"); // De-highlight all buttons
					$(this).removeClass("btn-outline-secondary").addClass("btn-secondary"); // Highlight the clicked button
					encounterSize = parseInt($(this).text()); // Update encounter size variable

					// Clear existing sub-rows
					$("#encounter-details").empty();

					for (let i = 0; i < encounterSize; i++) {
						let newRow = $(`
							<div class="d-flex align-items-center justify-content-center mt-2">
							<div class="stepperEnemy d-flex align-items-center">
							<button class="down btn btn-outline-secondary btn-sm" onclick="updateEnemies(this, -1)">-</button>
							<input type="text" class="enemy-value mx-2" value="1" readonly>
							<button class="up btn btn-outline-secondary btn-sm" onclick="updateEnemies(this, 1)">+</button>
							</div>
							<span class="mx-2">enemies of CR</span>
							<div class="stepperCR d-flex align-items-center">
							<button class="down btn btn-outline-secondary btn-sm" onclick="updateCR(this, -1)">-</button>
							<input type="text" class="cr-value mx-2" value="0" readonly>
							<button class="up btn btn-outline-secondary btn-sm" onclick="updateCR(this, 1)">+</button>
							</div>
							</div>
							`);
						$("#encounter-details").append(newRow);
					}

					// Add event listeners for all number inputs and cr-value inputs
					$("#encounter-details input[type=number], .cr-value").change(updateEncounter);

					updateEncounter();
				});
});

// Update the input width whenever its value changes
$("#encounter-details").on('input', 'input.enemy-value, input.cr-value', function() {
		let newWidth = ((this.value.length + 1) * 8);
		this.style.width = newWidth + 'px';
});

function updateEnemies(button, direction) {
	let input = $(button).siblings('.enemy-value');
	let value = parseInt(input.val());
	value += direction;
	if (value >= 1 && value <= 10) {
		input.val(value);
		input[0].dispatchEvent(new Event('input', { bubbles: true }));
	}
	updateEncounter();
}

function updateCR(button, direction) {
	let input = $(button).siblings('.cr-value');
	let index = crValues.indexOf(input.val());
	index += direction;
	if (index >= 0 && index < crValues.length) {
		input.val(crValues[index]);
		input[0].dispatchEvent(new Event('input', { bubbles: true }));
	}
	updateEncounter();
}