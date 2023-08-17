// The EncounterManagerUI class handles the visual representation of the encounter manager.
class EncounterManagerUI {

	constructor(encounterManager) {
		this.encounterManager = encounterManager; // Reference to the encounter manager
		this.encounterUI = new EncounterUI(encounterManager);
		this.partyUI = new PartyUI(encounterManager);	
	}
	
}