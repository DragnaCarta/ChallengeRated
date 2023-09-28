/**
 * EncounterCalculator.js
 * 
 * This utility class calculates the difficulty of a Dungeons & Dragons encounter in real-time
 * by listening to events emitted from instances of the `Party` and `Encounter` classes. It uses
 * predetermined Power values associated with Challenge Ratings (CR) and player levels, as well as
 * scale multipliers, to generate a final difficulty percentage.
 * 
 * @author DragnaCarta
 */

/**
 * # EncounterCalculator Class Specification
 *
 * ## Overview
 * The `EncounterCalculator` class is responsible for determining the difficulty of an encounter,
 * taking into account the Powers of enemies, allies, and party members. The class subscribes to
 * events emitted by instances of `Party` and `Encounter` classes to update the difficulty in real-time.
 *
 * ## Properties
 * - **party**: A reference to the current Party object.
 * - **encounter**: A reference to the current Encounter object.
 * - **difficulty**: A read-only number representing the calculated encounter difficulty.
 *
 * ## Methods
 * ### constructor(party: Party, encounter: Encounter)
 * Initializes the EncounterCalculator with references to a Party and an Encounter object. Sets up event
 * listeners for both.
 * 
 * ### recalculateDifficulty(): void
 * Recalculates the encounter difficulty based on the most recent state of the Party and Encounter objects.
 * Updates the `difficulty` property.
 * 
 * ### getDifficulty(): number
 * Retrieves the current calculated difficulty.
 *
 * ## Events
 * ### onDifficultyChanged
 * Fired when the calculated difficulty changes. Listeners will receive the new difficulty.
 *
 * ## Usage Example
 * ```javascript
 * const party = new Party(4, 5);
 * const encounter = new Encounter();
 * const calculator = new EncounterCalculator(party, encounter);
 * 
 * encounter.addEnemy('1');
 * // calculator.recalculateDifficulty() is automatically called
 * // calculator.onDifficultyChanged is automatically fired
 * ```
 */

// Importing necessary modules for event handling.
const EventEmitter = require('events');

/**
 * EncounterCalculator
 * 
 * A utility class for calculating the difficulty of a Dungeons & Dragons encounter.
 * Listens to events emitted by Party and Encounter instances.
 * 
 * @author DragnaCarta
 * @extends EventEmitter
 */
class EncounterCalculator extends EventEmitter {

  /**
  * Lookup table of scaling factors used to adjust the Power values of enemies and allies.
  * Each object contains a 'ratio' representing the ratio of enemy/ally power to party power,
  * and a 'multiplier' used to scale the Power of the enemies and allies in the encounter.
  *
  * @type {Array.<Object>}
  */
  static RatioScaleLookup = [
    { ratio: 5, multiplier: 1.67 },
    { ratio: 2.5, multiplier: 1.33 },
    { ratio: 1.5, multiplier: 1.25 },
    { ratio: 1, multiplier: 1 },
    { ratio: 0.67, multiplier: 0.8 },
    { ratio: 0.4, multiplier: 0.67 },
    { ratio: 0.2, multiplier: 0.5 }
  ];
  
  /**
  * Lookup table mapping player levels to their corresponding Power values.
  * Power values are based on a pre-determined formula or dataset that evaluates 
  * the offensive and defensive capabilities of a player at a given level.
  *
  * @type {Object}
  */
  static LevelPowerLookup = {
    1: 11,
    2: 14,
    3: 18,
    4: 23,
    5: 32,
    6: 35,
    7: 41,
    8: 44,
    9: 49,
    10: 53,
    11: 62,
    12: 68,
    13: 71,
    14: 74,
    15: 82,
    16: 84,
    17: 103,
    18: 119,
    19: 131,
    20: 141
  };
  
  
  /**
  * Lookup table mapping Challenge Ratings (CR) to their corresponding Power values.
  * Power values are based on a pre-determined formula or dataset that evaluates 
  * the offensive and defensive capabilities of a creature with a given CR.
  * 
  * @type {Object}
  */
  static CRPowerLookup = {
    "0": 1,
    "1/8": 5,
    "1/4": 10,
    "1/2": 16,
    "1": 22,
    "2": 28,
    "3": 37,
    "4": 48,
    "5": 60,
    "6": 65,
    "7": 70,
    "8": 85,
    "9": 85,
    "10": 95,
    "11": 105,
    "12": 115,
    "13": 120,
    "14": 125,
    "15": 130,
    "16": 140,
    "17": 150,
    "18": 160,
    "19": 165,
    "20": 180,
    "21": 200,
    "22": 225,
    "23": 250,
    "24": 275,
    "25": 300,
    "26": 325,
    "27": 350,
    "28": 375,
    "29": 400,
    "30": 425
  };

  /**
   * Constructs an EncounterCalculator instance.
   * 
   * @param {Party} party - The Party instance to listen to.
   * @param {Encounter} encounter - The Encounter instance to listen to.
   */
  constructor(party, encounter) {
    super();
    
    /** 
     * @property {Party} party - The current Party object.
     */
    this.party = party;

    /** 
     * @property {Encounter} encounter - The current Encounter object.
     */
    this.encounter = encounter;
    
    /** 
     * @property {number} difficulty - The calculated encounter difficulty. Read-only.
     */
    this.#difficulty = 0;

    // Attach event listeners
    this.party.on('onPartySizeChanged', () => this.recalculateDifficulty());
    this.party.on('onPartyLevelChanged', () => this.recalculateDifficulty());
    this.encounter.on('onEnemyAdded', () => this.recalculateDifficulty());
    this.encounter.on('onEnemyRemoved', () => this.recalculateDifficulty());
    this.encounter.on('onAllyAdded', () => this.recalculateDifficulty());
    this.encounter.on('onAllyRemoved', () => this.recalculateDifficulty());
  }

  /**
  * Recalculates the encounter difficulty based on current Party and Encounter states.
  * 
  * @returns {void}
  */
  recalculateDifficulty() {
    // Step 1: Scale the Power of each enemy and each ally.
    let totalEnemyPower = 0;
    let totalAllyPower = 0;
    
    // Assuming CRPowerLookup, LevelPowerLookup, and RatioScaleLookup are your lookup tables
    for (const [cr, count] of this.encounter.getEnemies()) {
      let enemyPower = EncounterCalculator.CRPowerLookup[cr];
      let ratio = enemyPower / EncounterCalculator.LevelPowerLookup[this.party.getLevel()];
      let closestRatio = this.findClosestRatio(ratio, EncounterCalculator.RatioScaleLookup);
      let scaleMultiplier = EncounterCalculator.RatioScaleLookup[closestRatio];
      totalEnemyPower += enemyPower * scaleMultiplier * count;
    }
    
    for (const [cr, count] of this.encounter.getAllies()) {
      let allyPower = EncounterCalculator.CRPowerLookup[cr];
      let ratio = allyPower / EncounterCalculator.LevelPowerLookup[this.party.getLevel()];
      let closestRatio = this.findClosestRatio(ratio, EncounterCalculator.RatioScaleLookup);
      let scaleMultiplier = EncounterCalculator.RatioScaleLookup[closestRatio];
      totalAllyPower += allyPower * scaleMultiplier * count;
    }
  
    // Step 2: Calculate total player + ally Power.
    let partyPower = EncounterCalculator.LevelPowerLookup[this.party.getLevel()] * this.party.getSize();
    let totalPartyAndAllyPower = partyPower + totalAllyPower;
  
    // Step 3: Calculate difficulty.
    let difficulty = (totalEnemyPower / totalPartyAndAllyPower) ** 2 * 100;
  
    // Update the _difficulty property and emit the event.
    this.#difficulty = difficulty;
    this.emit('onDifficultyChanged', difficulty);
  }
  
  /**
  * Finds the closest ratio in a given ratio table and returns the corresponding multiplier.
  *
  * @param {number} targetRatio - The ratio to find the closest match for.
  * @param {Array<{ratio: number, multiplier: number}>} ratioTable - The table of predefined ratios and their multipliers.
  * @returns {number} - The multiplier corresponding to the closest ratio found.
  */
  findClosestRatio(targetRatio, ratioTable) {
    // Validate that the ratioTable is not empty.
    if (ratioTable.length === 0) {
      throw new Error("The ratioTable must not be empty.");
    }
  
    // Initialize variables to track the closest ratio and its corresponding multiplier.
    let closestRatio = ratioTable[0].ratio;
    let closestMultiplier = ratioTable[0].multiplier;
    let smallestDifference = Math.abs(targetRatio - closestRatio);
  
    // Loop through each entry in the ratioTable to find the closest ratio.
    for (const { ratio, multiplier } of ratioTable) {
      const difference = Math.abs(targetRatio - ratio);
  
      // Update closest values if a closer ratio is found.
      if (difference < smallestDifference) {
        closestRatio = ratio;
        closestMultiplier = multiplier;
        smallestDifference = difference;
      }
    }
  
    return closestMultiplier;
  }


  /**
   * Retrieves the current calculated difficulty.
   * 
   * @returns {number} - The calculated encounter difficulty.
   */
  getDifficulty() {
    return this.#difficulty;
  }
}

/**
 * Event: onDifficultyChanged
 * 
 * Emitted whenever the calculated encounter difficulty changes.
 * 
 * @event EncounterCalculator#onDifficultyChanged
 * @type {number} - The new difficulty value.
 */