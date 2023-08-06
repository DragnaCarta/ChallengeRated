let partyLevel = 1;
var slider = document.getElementById("partyLevelRange");
var output = document.getElementById("party-level");
let incrementButton = document.getElementById("up");
let decrementButton = document.getElementById("down");

let partySize = 5;

// jQuery function to change button color on click
$(document).ready(function(){
	$(".party-size").click(function(){
					$(".party-size").removeClass("btn-secondary").addClass("btn-outline-secondary"); // De-highlight all buttons
					$(this).removeClass("btn-outline-secondary").addClass("btn-secondary"); // Highlight the clicked button
					partySize = parseInt($(this).text()); // Update party size variable
					updateEncounter();
				});
});

updateEncounter();

// Display the default slider value
output.innerHTML = slider.value;

// Update the current slider value each time you drag the slider handle
slider.oninput = function() {
	output.innerHTML = this.value;
	partyLevel = slider.value;
	updateEncounter();
}

// Function to increase the party level, with a max of 20
function up() {
	var sliderValue = parseInt(slider.value, 10);
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
	var sliderValue = parseInt(slider.value, 10);
	if (partyLevel > 1) {
		slider.value--;
		partyLevel = slider.value;
		document.getElementById("party-level").value = partyLevel;
		output.innerHTML = slider.value;
		updateEncounter();
	}
}
