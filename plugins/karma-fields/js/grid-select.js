KarmaFieldMedia.selectors.grid = function(tableManager) {
	var manager = {
		cells: [],
		numCol: 0,
		numRow: 0,
		addCol: function(cell, col) {
			this.numCol = Math.max(col, this.numCol);
			cell.addEventListener("click", function(event) {
				var cells = manager.getCells(0, col, manager.numRow, col);
				if (manager.areSelected(cells)) {
					manager.unselectCells(cells);
					manager.current = null;
				} else {
					if (manager.current) {
						manager.unselectCells(manager.current.cells);
					}
					manager.current = {
						col: 0,
						row: 0,
						cells: cells,
						selecting: false
					};
					manager.selectCells(cells);
				}


				// if (manager.areSelected(cells)) {
				// 	manager.unselectCells(cells);
				// 	manager.current = null;
				// } else {
				// 	manager.current = {
				// 		col: 0,
				// 		row: 0,
				// 		cells: cells,
				// 		selecting: false
				// 	};
				// 	manager.selectCells(cells);
				// }

			});
			cell.addEventListener("mouseup", function(event) {
				event.stopPropagation();
			});
		},
		addRow: function(item, row) {
			this.numRow = Math.max(row, this.numRow);
		},
		getCell: function(col, row) {
			return this.cells.find(function(cell) {
				return cell.col === col && cell.row === row;
			});
		},
		getCells: function(col1, row1, col2, row2) {
			var col = Math.min(col1, col2);
			var lastCol = Math.max(col1, col2);
			var row = Math.min(row1, row2);
			var lastRow = Math.max(row1, row2);
			return this.cells.filter(function(cell) {
				return cell.col >= col && cell.col <= lastCol && cell.row >= row && cell.row <= lastRow;
			});
		},
		areSelected: function(cells) {
			return cells.every(function(selectedCell) {
				return manager.isSelected(selectedCell);
			});
		},
		isSelected: function(cell) {
			return manager.current && manager.current.cells.some(function(selectedCell) {
				return selectedCell === cell;
			});
		},
		selectCells: function(cells) {
			cells.forEach(function(cell) {
				if (cells.length > 1 && cell.field.input) {
					cell.field.input.blur();
				}
				cell.field.element.classList.add("selected");
			});
		},
		unselectCells: function(cells) {
			cells.forEach(function(cell) {
				cell.field.element.classList.remove("selected");
			});
		},
		onClick: function() {
			console.log("onClick");
			if (manager.current) {
				manager.unselectCells(manager.current.cells);
				manager.current = null;
			}
		},
		onCopy: function() {
			if (this.current && this.current.cells.length && navigator.clipboard && navigator.clipboard.writeText) {
				var values = this.current.cells.map(function(cell) {
					return cell.field.value;
				});
				var text = values.join("\t");
				navigator.clipboard.writeText(text);
			}
		},
		onSelectAll: function() {
			var cells = this.getCells(0, 0, this.numRow, this.numCol);
			manager.current = {
				col: 0,
				row:0,
				cells: cells,
				selecting: false
			};
			this.selectCells(cells);
		},
		addField: function(field, col, row) {
			this.cells.push({
				field: field,
				col: col,
				row: row
			});

			field.element.addEventListener("mousedown", function(event) {
				var cell = manager.getCell(col, row)
				if (manager.isSelected(cell)) {
					console.log("isSelected");

						// console.log(manager.getCell(col, row));

						// manager.current = null;
				} else if (cell) {
					if (manager.current) {
						manager.unselectCells(manager.current.cells);
						manager.current = null;
					}
					manager.current = {
						col: col,
						row:row,
						cells: [cell],
						selecting: true
					};
					manager.selectCells([cell]);
				}

			});
			field.element.addEventListener("mousemove", function() {
				if (manager.current && manager.current.selecting) {

					// manager.current.lastCol = col;
					// manager.current.lastRow = row;
					manager.unselectCells(manager.current.cells);

					manager.current.cells = manager.getCells(manager.current.col, manager.current.row, col, row);
					manager.selectCells(manager.current.cells);
				}
			});
			field.element.addEventListener("mouseup", function(event) {
				if (manager.current) {
					manager.current.selecting = false;
					event.stopPropagation();
				}
			});
		}
	};
	KarmaFieldMedia.currentSelector = manager;
	return manager;
};

window.addEventListener("keydown", function(event) {
	if (event.metaKey && event.key === "c" && KarmaFieldMedia.currentSelector && KarmaFieldMedia.currentSelector.onCopy) {
		KarmaFieldMedia.currentSelector.onCopy();
	}
	if (event.metaKey && event.key === "a" && document.activeElement === document.body && KarmaFieldMedia.currentSelector && KarmaFieldMedia.currentSelector.onSelectAll) {
		KarmaFieldMedia.currentSelector.onSelectAll();
		event.preventDefault();
	}
});
