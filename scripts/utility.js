/**
 * Creates a Bootstrap row with specified columns and widths.
 * @param {Object} columns - An object mapping HTML elements to column widths. Use null for empty columns.
 * @returns {HTMLElement} The created Bootstrap row.
 */
function createBootstrapRow(columns, centered=false) {
	// Create a row element with Bootstrap class
	let row = document.createElement('div');
	row.className = 'row align-items-center';
	row.style.width = '100%';

	// Iterate through the columns and create corresponding Bootstrap columns
	for (const [element, colWidth] of columns) {
		let col = document.createElement('div');
		col.className = centered ? `col col-${colWidth} d-flex justify-content-center` : `col col-${colWidth}`;

		// If the element is not null, append it; otherwise, it's a padding column
		if (element) {
			col.appendChild(element);
		}

		// Append the column to the row
		row.appendChild(col);
	}
	return row
}