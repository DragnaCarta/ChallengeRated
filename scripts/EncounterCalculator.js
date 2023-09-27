/**
 * EncounterCalculator.js
 * 
 * This class calculates and updates the difficulty of a Dungeons & Dragons encounter based on
 * the Party and Encounter objects it listens to. The EncounterCalculator class is event-driven, 
 * emitting events when the calculated difficulty changes. This enables real-time interaction and 
 * makes it easier to integrate the class into larger systems or UI components.
 * 
 * @author DragnaCarta
 */

/**
 * # EncounterCalculator Class Specification
 *
 * ## Overview
 * The `EncounterCalculator` class calculates the difficulty of a Dungeons & Dragons encounter.
 * It listens to changes in `Party` and `Encounter` objects and recalculates the encounter 
 * difficulty in real-time. This class is event-driven and emits events when the difficulty 
 * changes.
 *
 * ## Properties
 * - **difficulty**: A read-only string representing the current difficulty of the encounter ("Easy", "Medium", "Hard", "Deadly").
 *
 * ## Methods
 * ### constructor(party: Party, encounter: Encounter)
 * Initializes the EncounterCalculator and sets it to listen to the provided `Party` and `Encounter` objects.
 * 
 * ### calculateDifficulty(): void
 * Recalculates the encounter difficulty based on the current state of the `Party` and `Encounter` objects.
 * Emission of `onDifficultyChanged` event is expected.
 *
 * ### getDifficulty(): string
 * Retrieves the current calculated difficulty of the encounter.
 * 
 * ## Events
 * ### onDifficultyChanged
 * Fired when the calculated difficulty of the encounter changes. Listeners will receive the new difficulty string.
 *
 * ## Usage Example
 * ```javascript
 * const party = new Party(4, 5);
 * const encounter = new Encounter();
 * const calculator = new EncounterCalculator(party, encounter);
 * 
 * // Suppose a party size changes
 * party.setSize(5);  // calculator's onDifficultyChanged event should fire
 * 
 * // Suppose an enemy is added in the encounter
 * encounter.addEnemy('1');  // calculator's onDifficultyChanged event should fire
 * ```
 */
