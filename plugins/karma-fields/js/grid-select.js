KarmaFieldMedia.selectors.grid = function(tableManager) {
	var manager = {
		// cells: [],
		rows: {},
		grid: {},
		// numCol: 0,
		// numRow: 0,
		width: 0,
		height: 0,
		rect: {
			x: 0,
			y: 0,
			width: 0,
			height: 0
		},
		init: function() {
			this.rows = {};
			this.grid = {};
			this.width = 0;
			this.height = 0;
			this.rect = {
				x: 0,
				y: 0,
				width: 0,
				height: 0
			};
		},
		// initRect: function() {
		// 	this.rect = {
		// 		x: 0,
		// 		y: 0,
		// 		width: 0,
		// 		height: 0
		// 	}
		// },

		addCol: function(cell, col) {
			// this.numCol = Math.max(col, this.numCol);
			this.grid[col] = {};
			this.width = Math.max(col+1, this.width);

			cell.addEventListener("click", function(event) {
				// var cells = manager.getCells(0, col, manager.numRow, col);

				// if (manager.areSelected(col, 0, col, manager.height-1)) {
				if (manager.rect.x === col && manager.rect.y === 0 && manager.rect.width === 1 && manager.rect.height === manager.height) {
					// manager.current = null;
					// manager.unselectCells();
					// manager.initRect();
					manager.select();
					// manager.updateCells();
				} else {
					// if (manager.current) {
					// 	manager.unselectCells(manager.current.cells);
					// }

					// manager.unselectCells();
					//
					// manager.rect.x = col;
					// manager.rect.y = 0;
					// manager.rect.width = 1;
					// manager.rect.height = manager.height;
					//
					// manager.selectCells();

					manager.select(col, 0, 1, manager.height);

					// manager.current = {
					// 	col: col,
					// 	row: 0,
					// 	colEnd: col,
					// 	rowEnd: manager.height - 1,
					// 	selecting: false
					// };
					// manager.updateCells();

				}

				if (manager.onSelect) {
					manager.onSelect();
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
			this.rows[row] = item;
			// this.rows.push({
			// 	item: item,
			// 	row: row
			// });

			this.height = Math.max(row+1, this.height);
		},
		// getRow: function(y) {
		// 	return this.rows.find(function(row) {
		// 		return row.row === y;
		// 	});
		// },
		getSelectedItems: function() {
			var items = [];
			for (var i = 0; i < this.rect.height; i++) {
				if (this.rows[this.rect.y+i] && this.rect.x === 0 && this.rect.width === this.width) {
					items.push(this.rows[this.rect.y+i]);
				}
			}
			return items;
		},
		getSelectedFields: function() {
			var fields = [];
			for (var i = 0; i < this.rect.width; i++) {
				for (var j = 0; j < this.rect.height; j++) {
					fields.push(this.grid[this.rect.x+i][this.rect.y+j].field);
				}
			}
			return fields;
		},
		// getCell: function(col, row) {
		// 	return this.cells.find(function(cell) {
		// 		return cell.col === col && cell.row === row;
		// 	});
		// },
		// getField: function(col, row) {
		// 	return this.grid[col][row].field;
		// },
		// getCells: function(col1, row1, col2, row2) {
		// 	var col = Math.min(col1, col2);
		// 	var lastCol = Math.max(col1, col2);
		// 	var row = Math.min(row1, row2);
		// 	var lastRow = Math.max(row1, row2);
		// 	return this.cells.filter(function(cell) {
		// 		return cell.col >= col && cell.col <= lastCol && cell.row >= row && cell.row <= lastRow;
		// 	});
		// },
		// areSelected: function(col, row, colEnd, rowEnd) {
		// 	for (var i = col; i <= colEnd; i++) {
		// 		for (var j = row; j <= rowEnd; j++) {
		// 			if (!this.isSelected(i, j)) {
		// 				return false;
		// 			}
		// 		}
		// 	}
		// 	return true;
		// },
		// isSelected: function(cell) {
		// 	return manager.current && manager.current.cells.some(function(selectedCell) {
		// 		return selectedCell === cell;
		// 	});
		// },
		isSelected: function(col, row) {
			// if (this.current) {
			// 	var left = Math.min(this.current.col, this.current.colEnd);
			// 	var right = Math.max(this.current.col, this.current.colEnd);
			// 	var top = Math.min(this.current.row, this.current.rowEnd);
			// 	var bottom = Math.max(this.current.row, this.current.rowEnd);
			//
			// 	return col >= left && col <= right && row >= top && row <= bottom;
			// }
			// return false;

			// var rect = this.getRect();
			return col >= this.rect.x && col < this.rect.x+this.rect.width && row >= this.rect.y && row < this.rect.y+this.rect.height;
			//
			// return this.cells.filter(function(cell) {
			// 	return cell.col >= col && cell.col <= lastCol && cell.row >= row && cell.row <= lastRow;
			// });
			//
			//
			// return manager.current && manager.current.cells.some(function(selectedCell) {
			// 	return selectedCell === cell;
			// });
		},
		// getRect: function() {
		// 	if (this.current) {
		// 		var left = Math.min(this.current.col, this.current.colEnd);
		// 		var right = Math.max(this.current.col, this.current.colEnd);
		// 		var top = Math.min(this.current.row, this.current.rowEnd);
		// 		var bottom = Math.max(this.current.row, this.current.rowEnd);
		// 		return {
		// 			x: left,
		// 			y: top,
		// 			width: right - left,
		// 			height: bottom - top
		// 		};
		// 	}
		// 	return {
		// 		x: 0,
		// 		y: 0,
		// 		width: 0,
		// 		height: 0
		// 	}
		// },
		// countSelected: function() {
		// 	var rect = this.getRect();
		// 	return this.rect.width*rect.height;
		// },
		// getSelectedCells: function() {
		// 	return this.cells.filter(function(cell) {
		// 		return manager.isSelected(cell.col, cell.row);
		// 	});
		// },
		// getSelectedArray: function() {
		// 	var array = {};
		// 	if (this.current) {
		// 		for (var i = this.current.col; i <= this.current.colEnd; i++) {
		// 			for (var j = this.current.row; j <= this.current.rowEnd; j++) {
		//
		// 			}
		// 		}
		// 	}
		// 	this.cells.filter(function(cell) {
		// 		return manager.isSelected(cell.col, cell.row);
		// 	});
		// },
		selectCells: function() {
			for (var i = 0; i < this.rect.width; i++) {
				for (var j = 0; j < this.rect.height; j++) {
					this.grid[this.rect.x+i][this.rect.y+j].cell.classList.add("selected");
					if (i === 0) {
						this.grid[this.rect.x+i][this.rect.y+j].cell.classList.add("selected-left");
					}
					if (i === this.rect.width-1) {
						this.grid[this.rect.x+i][this.rect.y+j].cell.classList.add("selected-right");
					}
					if (j === 0) {
						this.grid[this.rect.x+i][this.rect.y+j].cell.classList.add("selected-top");
					}
					if (j === this.rect.height-1) {
						this.grid[this.rect.x+i][this.rect.y+j].cell.classList.add("selected-bottom");
					}
				}
			}
		},
		unselectCells: function() {
			for (var i = 0; i < this.rect.width; i++) {
				for (var j = 0; j < this.rect.height; j++) {
					this.grid[this.rect.x+i][this.rect.y+j].cell.classList.remove("selected");
					this.grid[this.rect.x+i][this.rect.y+j].cell.classList.remove("selected-left");
					this.grid[this.rect.x+i][this.rect.y+j].cell.classList.remove("selected-right");
					this.grid[this.rect.x+i][this.rect.y+j].cell.classList.remove("selected-top");
					this.grid[this.rect.x+i][this.rect.y+j].cell.classList.remove("selected-bottom");
				}
			}
			// for (var col in this.rect) {
			// 	for (var row in this.grid[col]) {
			// 		this.grid[col][row].cell.classList.remove("selected");
			// 	}
			// }
		},
		select: function(x, y, width, height) {
			this.unselectCells();
			// this.rect = {
			// 	x: x || 0,
			// 	y: y || 0,
			// 	width: width || 0,
			// 	height: height || 0
			// };
			this.rect.x = x || 0;
			this.rect.y = y || 0;
			this.rect.width = width || 0;
			this.rect.height = height || 0;
			this.selectCells();
		},
		// unselectCells: function(cells) {
		// 	cells.forEach(function(cell) {
		// 		cell.field.element.classList.remove("selected");
		// 	});
		// },
		// updateCells: function() {
		// 	this.cells.forEach(function(cell) {
		// 		if (manager.isSelected(cell.col, cell.row)) {
		// 			cell.field.element.classList.add("selected");
		// 		} else {
		// 			cell.field.element.classList.remove("selected");
		// 		}
		// 	});
		// },
		// emptySelection: function() {
		// 	this.getSelectedCells().forEach(function(cell) {
		// 		cell.field.element.classList.remove("selected");
		// 	});
		// 	this.current = null;
		// },
		// setSelection: function(col, row, colEnd, rowEnd, selecting) {
		// 	manager.current = {
		// 		col: col,
		// 		row:row,
		// 		colEnd: colEnd,
		// 		rowEnd: rowEnd,
		// 		selecting: selecting
		// 	};
		// },
		onClick: function() {
			if (this.selection) {
				this.selection = null;
				if (manager.onSelect) {
					manager.onSelect();
				}
			} else if (this.rect.width && this.rect.height) {
				this.select();
				if (manager.onSelect) {
					manager.onSelect();
				}
			}


		},
		onCopy: function() {
			if (navigator.clipboard && navigator.clipboard.writeText) {
				var rows = [];
				for (var j = 0; j < this.rect.height; j++) {
					var cols = [];
					for (var i = 0; i <= this.rect.width; i++) {
						cols.push(this.grid[this.rect.x+i][this.rect.y+j].field.value); // should use getValue() promise!!
					}
					rows.push(cols.join("\t"));
				}
				if (rows.length) {
					navigator.clipboard.writeText(rows.join("\n"));
				}
			}
		},
		onSelectAll: function() {
			// var cells = this.getCells(0, 0, this.numRow, this.numCol);

			// this.rect.x = 0;
			// this.rect.y = 0;
			// this.rect.width = this.width;
			// this.rect.height = this.height;
			// manager.current = {
			// 	col: 0,
			// 	row:0,
			// 	colEnd: this.width - 1,
			// 	rowEnd: this.height - 1,
			// 	// cells: cells,
			// 	selecting: false
			// };
			// this.updateCells();
			// this.selectCells();
			this.select(0, 0, this.width, this.height);

			if (manager.onSelect) {
				manager.onSelect();
			}
		},
		addField: function(cell, field, col, row) {
			// this.cells.push({
			// 	field: field,
			// 	col: col,
			// 	row: row
			// });

			// if (!this.fields[col]) {
			// 	this.fields[col] = {};
			// }

			this.grid[col][row] = {
				cell: cell,
				field: field
			};

			// this.width = Math.max(col+1, this.width);
			// this.height = Math.max(row+1, this.height);

			cell.addEventListener("mousedown", function(event) {
				// var cell = manager.getCell(col, row)


				if (manager.isSelected(col, row)) {


						// console.log(manager.getCell(col, row));

						// manager.current = null;
				} else {
					// if (manager.current) {
					// 	// manager.unselectCells(manager.current.cells);
					// 	manager.current = null;
					//
					// 	manager.updateCells();
					//
					// 	// manager.emptySelection();
					//
					// }

					// manager.unselectCells();

					manager.selection = {
						col: col,
						row: row
					};

					manager.select(col, row, 1, 1);

					// this.rect.x = col;
					// this.rect.y = row;
					// this.rect.width = 1;
					// this.rect.height = 1;

					// manager.current = {
					// 	col: col,
					// 	row:row,
					// 	colEnd: col,
					// 	rowEnd: row,
					// 	// cells: [cell],
					// 	selecting: true
					// };

					// manager.updateCells();
					// manager.selectCells();

					// manager.selectCells([cell]);
				}
				// event.stopPropagation();
			});
			cell.addEventListener("mousemove", function() {
				// if (manager.current && manager.current.selecting) {
				if (manager.selection) {

					var x = Math.min(manager.selection.col, col);
					var y = Math.min(manager.selection.row, row);
					var width = Math.abs(col - manager.selection.col) + 1;
					var height = Math.abs(row - manager.selection.row) + 1;

					manager.select(x, y, width, height);



					// manager.unselectCells();
					//
					// rect.x = Math.min(rect.x, col);
					// rect.y = Math.min(rect.y, row);
					// rect.width = Math.abs(col - rect.x) + 1;
					// rect.height = Math.abs(row - rect.y) + 1;
					//
					// manager.selectCells();

					// var col = Math.min(col1, col2);
					// var lastCol = Math.max(col1, col2);
					// var row = Math.min(row1, row2);
					// var lastRow = Math.max(row1, row2);
					//
					// manager.current.colEnd = col;
					// manager.current.rowEnd = row;
					// manager.updateCells();

					// manager.current.lastCol = col;
					// manager.current.lastRow = row;
					// manager.unselectCells(manager.current.cells);
					//
					// manager.current.cells = manager.getCells(manager.current.col, manager.current.row, col, row);
					// manager.selectCells(manager.current.cells);
				}
			});
			cell.addEventListener("mouseup", function(event) {
				if (manager.selection) {
					// manager.current.selecting = false;
					manager.selection = null;


					if (manager.onSelect) {
						manager.onSelect();
					}
				}
				event.stopPropagation();
				// if (manager.isSelected(col, row)) {
				//
				// }
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
	if (event.metaKey && event.key === "s" && KarmaFieldMedia.currentSelector && KarmaFieldMedia.currentSelector.onSave) {
		KarmaFieldMedia.currentSelector.onSave(event);
	}
});
