/**
 * Party.js
 * 
 * This class models a Dungeons & Dragons adventuring party, tracking the number of members
 * and their level. The Party class is event-driven, emitting events when the party size or 
 * level changes. This enables real-time interaction and makes it easier to integrate the 
 * class into larger systems or UI components.
 * 
 * @author DragnaCarta
 */

/**
 * # Party Class Specification
 *
 * ## Overview
 * The `Party` class models a Dungeons & Dragons adventuring party, tracking the number of members
 * and their level. This class is event-driven, emitting events when the party size or level changes.
 *
 * ## Properties
 * - **size**: A read-only integer representing the number of party members.
 * - **level**: A read-only integer representing the level of all party members.
 *
 * ## Methods
 * ### constructor(initialSize: number, initialLevel: number)
 * Initializes a party with a given initial size and level. Sets up optional event listeners for size and level changes.
 * 
 * ### setSize(newSize: number): void
 * Sets the size of the party to the given number. Emission of `onPartySizeChanged` event is expected.
 *
 * ### setLevel(newLevel: number): void
 * Sets the level of the party to the given number. Emission of `onPartyLevelChanged` event is expected.
 *
 * ### getSize(): number
 * Retrieves the current size of the party.
 * 
 * ### getLevel(): number
 * Retrieves the current level of all party members.
 *
 * ## Events
 * ### onPartySizeChanged
 * Fired when the party size changes. Listeners will receive the new size.
 *
 * ### onPartyLevelChanged
 * Fired when the party level changes. Listeners will receive the new level.
 *
 * ## Usage Example
 * ```javascript
 * const party = new Party(4, 5);
 * party.setSize(5);
 * party.setLevel(6);
 * ```
 */

// Required for event-emitter functionality
const EventEmitter = require('events');

class Party extends EventEmitter {
  /**
   * @private
   * Internal representation of party size.
   */
  #size;

  /**
   * @private
   * Internal representation of party level.
   */
  #level;

  /**
   * Initialize a Party instance with a given size and level.
   *
   * @param {number} initialSize - The initial size of the party.
   * @param {number} initialLevel - The initial level of the party members.
   * @fires Party#onPartySizeChanged
   * @fires Party#onPartyLevelChanged
   */
  constructor(initialSize, initialLevel) {
    // Call the EventEmitter constructor
    super();

    // Initialize the size and level with the given parameters
    this.#size = initialSize;
    this.#level = initialLevel;

    // Emit events for initial setup; this is optional and can be removed if you prefer
    this.emit('onPartySizeChanged', { newSize: this.#size });
    this.emit('onPartyLevelChanged', { newLevel: this.#level });
  }

  /**
   * Set the size of the party.
   * 
   * @param {number} newSize - The new size of the party.
   * @throws {Error} If the new size is not a valid number.
   * @fires Party#onPartySizeChanged
   */
	setSize(newSize) {
    	// Validate the newSize to ensure it's a non-negative integer
    	if (typeof newSize !== 'number' || newSize < 0 || !Number.isInteger(newSize)) {
      	throw new Error('Invalid party size: Size must be a non-negative integer.');
    	}
	
    	// Update the internal representation of the party size
    	this.#size = newSize;
	
    	// Emit an event to inform any listeners that the party size has changed
    	this.emit('onPartySizeChanged', { newSize: this.#size });
  	}

  /**
   * Set the level of the party.
   * 
   * @param {number} newLevel - The new level of the party members.
   * @throws {Error} If the new level is not a valid number.
   * @fires Party#onPartyLevelChanged
   */
  setLevel(newLevel) {
  	// Step 1: Validate the newLevel
  	if (typeof newLevel !== 'number' || newLevel <= 0) {
    	throw new Error("Invalid level: Level must be a positive number.");
  	}

  	// Step 2: Update the private #level field
  	this.#level = newLevel;

  	// Step 3: Emit the onPartyLevelChanged event
  	this.emit('onPartyLevelChanged', { newLevel: this.#level });
  }

  /**
   * Retrieve the current size of the party.
   *
   * @returns {number} The current size of the party.
   */
  getSize() {
    return this.#size;
  }

  /**
   * Retrieve the current level of all party members.
   *
   * @returns {number} The current level of all party members.
   */
  getLevel() {
    return this.#level;
  }

  /**
   * Event fired when the party size changes.
   * 
   * @event Party#onPartySizeChanged
   * @type {object}
   * @property {number} newSize - The new size of the party.
   */

  /**
   * Event fired when the party level changes.
   * 
   * @event Party#onPartyLevelChanged
   * @type {object}
   * @property {number} newLevel - The new level of the party members.
   */
}