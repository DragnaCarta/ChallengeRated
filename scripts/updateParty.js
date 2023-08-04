let partyLevel = 1;
let slider = document.getElementById("partyLevelRange");
let output = document.getElementById("value");
let incrementButton = document.getElementById("up");
let decrementButton = document.getElementById("down");

let partySize = 1;

// jQuery function to change button color on click
$(document).ready(function(){
	$(".party-size").click(function(){
					$(".party-size").removeClass("btn-secondary").addClass("btn-outline-secondary"); // De-highlight all buttons
					$(this).removeClass("btn-outline-secondary").addClass("btn-secondary"); // Highlight the clicked button
					partySize = parseInt($(this).text()); // Update party size variable
					updateEncounter();
				});
});

// Display the default slider value
output.innerHTML = slider.value;

// Update the current slider value each time you drag the slider handle
slider.oninput = function() {
	output.innerHTML = this.value;
}

// Function to increase the party level, with a max of 20
function up() {
	if(slider.value < 20) {
		slider.value++;
		partyLevel = slider.value;
		document.getElementById("party-level").value = partyLevel;
		output.innerHTML = slider.value;
		updateEncounter();
	}
}

// Function to decrease the party level, with a minimum of 1
function down() {
	if (partyLevel > 1) {
		slider.value++;
		partyLevel = slider.value;
		document.getElementById("party-level").value = partyLevel;
		updateEncounter();
	}
}
