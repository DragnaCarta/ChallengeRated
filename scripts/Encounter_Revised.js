/**
 * Encounter.js
 * 
 * This class models a Dungeons & Dragons encounter, tracking both enemies and allies
 * based on their Challenge Ratings (CR). The Encounter class is event-driven, emitting
 * events when entities are added or removed. This enables real-time interaction and
 * makes it easier to integrate the class into larger systems or UI components.
 * 
 * @author DragnaCarta
 */

/**
 * # Encounter Class Specification
 *
 * ## Overview
 * The `Encounter` class models a Dungeons & Dragons encounter, tracking both enemies and allies 
 * based on their Challenge Ratings (CR). This class is event-driven, emitting events when entities 
 * are added or removed. You can use this class to manage encounters in a D&D setting.
 *
 * ## Properties
 * - **enemies**: A read-only Map where the key is the Challenge Rating (CR) and the value is the number of enemies with that CR.
 * - **allies**: A read-only Map where the key is the Challenge Rating (CR) and the value is the number of allies with that CR.
 *
 * ## Methods
 * ### constructor()
 * Initializes an empty encounter. Sets up optional event listeners for entity addition and removal.
 * 
 * ### validateCR(cr: string): boolean | Error
 * Validates a given CR string. Returns `true` if valid, otherwise throws an `Error`.
 * 
 * ### addEnemy(cr: string): void
 * Adds an enemy with the given CR to the encounter. Emission of `onEnemyAdded` event is expected.
 * 
 * ### addAlly(cr: string): void
 * Adds an ally with the given CR to the encounter. Emission of `onAllyAdded` event is expected.
 *
 * ### removeEnemy(cr: string): void
 * Removes an enemy with the given CR from the encounter. Emission of `onEnemyRemoved` event is expected.
 *
 * ### removeAlly(cr: string): void
 * Removes an ally with the given CR from the encounter. Emission of `onAllyRemoved` event is expected.
 *
 * ### getEnemies(): Map<string, number>
 * Retrieves a copy of the current list of enemies along with their CRs.
 *
 * ### getAllies(): Map<string, number>
 * Retrieves a copy of the current list of allies along with their CRs.
 *
 * ## Events
 * ### onEnemyAdded
 * Fired when an enemy is added to the encounter. Listeners will receive the CR of the added enemy.
 *
 * ### onAllyAdded
 * Fired when an ally is added to the encounter. Listeners will receive the CR of the added ally.
 *
 * ### onEnemyRemoved
 * Fired when an enemy is removed from the encounter. Listeners will receive the CR of the removed enemy.
 *
 * ### onAllyRemoved
 * Fired when an ally is removed from the encounter. Listeners will receive the CR of the removed ally.
 *
 * ## Usage Example
 * ```javascript
 * const encounter = new Encounter();
 * encounter.addEnemy('1');
 * encounter.addAlly('2');
 * ```
 */


const EventEmitter = require('events');

class Encounter extends EventEmitter {

	/**
	 * @property {Map<string, number>} enemies
	 * Key: Challenge Rating (CR) of enemy
	 * Value: Number of enemies with that CR
	 */

	/**
	 * @property {Map<string, number>} allies
	 * Key: Challenge Rating (CR) of ally
	 * Value: Number of allies with that CR
	 */

	/**
 	* constructor()
 	* Initializes an empty encounter by setting up empty maps for enemies and allies.
 	* Sets up event listeners for entity addition and removal.
 	*/
	constructor() {
  	super(); // Initialize EventEmitter functionality
  	this.enemies = new Map(); // Initialize an empty Map for enemies
  	this.allies = new Map(); // Initialize an empty Map for allies
	
  	// Optional: set up event listeners if needed. For example:
  	// this.on('onEnemyAdded', (cr) => { /* custom logic here */ });
  	// this.on('onAllyAdded', (cr) => { /* custom logic here */ });
	}

	/**
 	* validateCR(cr: string): boolean | Error
 	*
 	* Validates the given Challenge Rating (CR) value for both format and acceptability within the game's rule system.
 	*
 	* Contract:
 	* - Accepts a string representing the Challenge Rating (CR) of an entity.
 	* - Checks if the CR is in the acceptable format (e.g., a number or fraction).
 	* - Checks if the CR falls within the acceptable range or list of values defined by the game system.
 	* - If the CR is valid, returns `true`.
 	* - If the CR is invalid, returns an `Error` object with a descriptive message.
 	*
 	* Examples:
 	* validateCR("1")     => true
 	* validateCR("1/4")   => true
 	* validateCR("abc")   => Error("Invalid Challenge Rating: abc")
 	* validateCR("-1")    => Error("Invalid Challenge Rating: -1")
 	*
 	* @param {string} cr - The Challenge Rating to be validated.
 	* @returns {boolean | Error} - `true` if the CR is valid, otherwise returns an `Error` object.
 	*/
	validateCR(cr) {
  	const wholeNumberPattern = /^(?:0|[1-9][0-9]*)$/;
  	const fractionPattern = /^(?:1\/8|1\/4|1\/2)$/;
	  
  	if (wholeNumberPattern.test(cr)) {
    	const crNumber = parseInt(cr, 10);
    	if (crNumber >= 0 && crNumber <= 30) {
      	return true;
    	}
    	throw new Error(`Invalid Challenge Rating: ${cr}. CR must be a whole number between 0 and 30.`);
  	}
	  
  	if (fractionPattern.test(cr)) {
    	return true;
  	}
	  
  	throw new Error(`Invalid Challenge Rating: ${cr}. Acceptable CRs are whole numbers between 0 and 30, or fractions 1/8, 1/4, 1/2.`);
	}

	/**
 	* addEnemy(cr: string)
 	* Adds an enemy with a given Challenge Rating to the encounter.
 	* Triggers the onEnemyAdded event.
 	* 
 	* @param {string} cr - The Challenge Rating of the enemy to be added.
 	* @returns {void}
 	*/
	addEnemy(cr) {
  	// Validate the CR before proceeding
  	this.validateCR(cr);

  	// Check if the given CR already exists in the enemies map
  	if (this.enemies.has(cr)) {
    	// If it does, increment the count for that CR
    	const existingCount = this.enemies.get(cr);
    	this.enemies.set(cr, existingCount + 1);
  	} else {
    	// If it doesn't, add a new entry for that CR with a count of 1
    	this.enemies.set(cr, 1);
  	}
	
  	// Emit an event to notify that an enemy has been added
  	this.emit('onEnemyAdded', cr);
	}

	/**
 	* addAlly(cr: string)
 	* Adds an ally with a given Challenge Rating to the encounter.
 	* Triggers the onAllyAdded event.
 	* 
 	* @param {string} cr - The Challenge Rating of the ally to be added.
 	* @returns {void}
 	*/
	addAlly(cr) {
  	// Validate the CR before proceeding
  	this.validateCR(cr);

  	// Check if the ally with the given CR already exists in the Map.
  	// If it does, increment the count; otherwise, add a new entry with count 1.
  	if (this.allies.has(cr)) {
    	const currentCount = this.allies.get(cr);
    	this.allies.set(cr, currentCount + 1);
  	} else {
    	this.allies.set(cr, 1);
  	}
	
  	// Trigger the onAllyAdded event and pass along the CR of the added ally.
  	this.emit('onAllyAdded', cr);
	}

	/**
 	* removeEnemy(cr: string)
 	* Removes an enemy with a given Challenge Rating from the encounter.
 	* Triggers the onEnemyRemoved event.
 	* 
 	* @param {string} cr - The Challenge Rating of the enemy to be removed.
 	* @returns {void}
 	*/
	removeEnemy(cr) {
  	// Validate the CR before proceeding
  	this.validateCR(cr);

  	// Check if an enemy with the given CR exists in the Map
  	if (this.enemies.has(cr)) {
    	// Fetch the current quantity of enemies with the given CR
    	let currentCount = this.enemies.get(cr);
	    
    	// If more than one enemy with this CR exists, decrement the count
    	if (currentCount > 1) {
      	this.enemies.set(cr, currentCount - 1);
    	} else {
      	// Otherwise, remove the CR entry entirely from the Map
      	this.enemies.delete(cr);
    	}
	
    	// Emit the onEnemyRemoved event, signaling an enemy has been removed
    	this.emit('onEnemyRemoved', cr);
  	} else {
    	// Optionally, handle the case where an enemy with the given CR doesn't exist
    	console.log(`No enemies with CR ${cr} found.`);
  	}
	}

	/**
 	* removeAlly(cr: string)
 	* Removes an ally with a given Challenge Rating from the encounter.
 	* Triggers the onAllyRemoved event.
 	* 
 	* Contract:
 	* - If there are no allies with the given CR, the function will exit without making changes.
 	* - If the number of allies with the given CR becomes zero, the CR is removed from the `allies` Map.
 	* - An `onAllyRemoved` event is fired, signaling the CR of the ally removed.
 	* 
 	* @param {string} cr - The Challenge Rating of the ally to be removed.
 	* @returns {void}
 	*/
	removeAlly(cr) {
  	// Validate the CR before proceeding
  	this.validateCR(cr);

  	if (this.allies.has(cr)) {
    	let count = this.allies.get(cr);
    	if (count > 1) {
      	// Decrement the count of allies with this CR
      	this.allies.set(cr, count - 1);
    	} else {
      	// Remove the CR entry altogether
      	this.allies.delete(cr);
    	}
    	// Emit the onAllyRemoved event
    	this.emit('onAllyRemoved', cr);
  	}
  	// If the CR is not in the map, the function will simply exit without doing anything.
	}


	/**
 	* getEnemies()
 	* Retrieves the current state of enemies in the encounter.
 	* 
 	* @returns {Map<string, number>} - The current list of enemies with their respective CRs.
 	*/
	getEnemies() {
  	// Create a new Map to store a copy of the enemies data
  	const enemiesCopy = new Map();
	
  	// Populate the new Map with the data from the original enemies Map
  	for (const [cr, count] of this.enemies) {
    	enemiesCopy.set(cr, count);
  	}
	
  	// Return the copy
  	return enemiesCopy;
	}

	/**
 	* getAllies()
 	* Retrieves the current state of allies in the encounter.
 	* 
 	* @returns {Map<string, number>} - The current list of allies with their respective CRs.
 	*/
	getAllies() {
  	// Create a new Map to store a copy of the allies data
  	const alliesCopy = new Map();
	
  	// Populate the new Map with the data from the original allies Map
  	for (const [cr, count] of this.allies) {
    	alliesCopy.set(cr, count);
  	}
	
  	// Return the copy
  	return alliesCopy;
	}


	/**
	 * @event onEnemyAdded
	 * Fired when an enemy is added to the encounter.
	 * Listeners will receive the Challenge Rating of the added enemy.
	 */

	/**
	 * @event onAllyAdded
	 * Fired when an ally is added to the encounter.
	 * Listeners will receive the Challenge Rating of the added ally.
	 */

	/**
	 * @event onEnemyRemoved
	 * Fired when an enemy is removed from the encounter.
	 * Listeners will receive the Challenge Rating of the removed enemy.
	 */

	/**
	 * @event onAllyRemoved
	 * Fired when an ally is removed from the encounter.
	 * Listeners will receive the Challenge Rating of the removed ally.
	 */
}

module.exports = Encounter;
