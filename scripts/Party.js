// The Party class handles details related to a group of players, such as the number of players and their level.
class Party {
	constructor(size, level, onPartyChange) {
	this.onPartyChange = onPartyChange;
	this.size = size; // Number of players in the party.
	this.level = level; // The players' level.
	}

	// Sets the size of the party, ensuring it's not negative.
	setSize(newSize) {
		this.size = Math.max(0, newSize);	
		this.onPartyChange();
	}

	// Adds a player to the party, increasing its size.
	addPlayer() {
		this.setSize(this.size + 1);
		this.onPartyChange();
	}

	// Removes a player from the party, decreasing its size.
	removePlayer() {
		this.setSize(this.size - 1);
		this.onPartyChange();
	}

	// Sets the level of the party, ensuring it's not negative.
	setLevel(newLevel) {
		this.level = Math.max(0, newLevel);
		this.onPartyChange();
	}

	// Increases the party's level by 1.
	addLevel() {
		this.setLevel(this.level + 1);
		this.onPartyChange();
	}

	// Decreases the party's level by 1.
	removeLevel() {
		this.setLevel(this.level - 1);
		this.onPartyChange();
	}

}