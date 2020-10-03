KarmaFields.selectors.grid = function(tableManager) {
	var manager = {
		// cells: [],
		rows: {}, // deprecated
		grid: {},
		// numCol: 0,
		// numRow: 0,
		rect: KarmaFields.utils.rect(),
		selectionRect: KarmaFields.utils.rect(),
		// width: 0,
		// height: 0,
		// rect: {
		// 	x: 0,
		// 	y: 0,
		// 	width: 0,
		// 	height: 0
		// },
		init: function() {
			this.rows = {}; // deprecated
			this.grid = {};
			this.rect.set();
			// this.width = 0;
			// this.height = 0;
			// this.rect = {
			// 	x: 0,
			// 	y: 0,
			// 	width: 0,
			// 	height: 0
			// };

		},
		createRect: function(x, y, width, height) {
			return KarmaFields.utils.rect(x, y, width, height).intersect(this.rect);
		},
		// getRect: function() {
		// 	return {
		// 		left: 0,
		// 		top: 0,
		// 		width: this.width,
		// 		height: this.height
		// 	};
		// },
		getSelectionRect: function() {
			return this.selectionRect.intersect(this.rect);
			// var rect = {};
			// rect.left = Math.min((this.rect.left || 0), this.width);
			// rect.top = Math.min((this.rect.top || 0), this.height);
			// rect.width = Math.min((this.rect.width || 0), this.width - rect.left);
			// rect.height = Math.min((this.rect.height || 0), this.height - rect.top);
			// return rect;
		},
		setSelectionRect: function(rect) {
			this.selectionRect = this.selectionRect.intersect(this.rect);
			// rect = rect || {};
			// this.rect.left = Math.min((rect.left || 0), this.width);
			// this.rect.top = Math.min((rect.top || 0), this.height);
			// this.rect.width = Math.min((rect.width || 0), this.width - rect.left);
			// this.rect.height = Math.min((rect.height || 0), this.height - rect.top);
		},
		// initRect: function() {
		// 	this.rect = {
		// 		x: 0,
		// 		y: 0,
		// 		width: 0,
		// 		height: 0
		// 	}
		// },

		addCol: function(cell, col) { // = addHeaderCell
			// this.numCol = Math.max(col, this.numCol);
			this.grid[col] = {};
			this.rect.width = Math.max(col+1, this.rect.width);

			// cell.addEventListener("click", function(event) {
			// 	var rect = manager.getSelectionRect();
			// 	if (rect.left === col && rect.top === 0 && rect.width === 1 && rect.height === manager.rect.height) {
			// 		manager.select();
			// 	} else {
			// 		rect = manager.createRect(col, 0, 1, manager.rect.height);
			// 		manager.select(rect);
			// 	}
			// 	if (manager.onSelect) {
			// 		manager.onSelect();
			// 	}
			// });
			// cell.addEventListener("mouseup", function(event) {
			// 	event.stopPropagation();
			// });

			cell.addEventListener("mousedown", function(event) {
				var rect = manager.createRect(col, 0, 1, manager.rect.height);
				if (manager.selectionRect && manager.selectionRect.equals(rect)) {
					manager.select();
				} else {
					manager.selection = rect;
					manager.select(manager.selection);
				}
			});
			cell.addEventListener("mousemove", function() {
				if (manager.selection) {
					var rect = manager.createRect(col, 0, 1, manager.rect.height).union(manager.selection);
					manager.select(rect);
				}
			});
			cell.addEventListener("mouseup", function(event) {
				if (manager.selection) {
					manager.selection = null;
					if (manager.onSelect) {
						manager.onSelect();
					}
				}
				event.stopPropagation();
			});


		},

		addIndexHeader: function(cell) { // = addHeaderCell
			this.grid[1] = {};
			this.rect.width = Math.max(1, this.rect.width);

			// cell.addEventListener("click", function(event) {
			// 	var rect = manager.createRect(0, 0, manager.rect.width, manager.rect.height);
			// 	manager.select(rect);
			// 	if (manager.onSelect) {
			// 		manager.onSelect();
			// 	}
			// 	event.stopPropagation();
			// });
			cell.addEventListener("mousedown", function(event) {
				var rect = manager.createRect(0, 0, manager.rect.width, manager.rect.height);
				if (manager.selectionRect && manager.selectionRect.equals(rect)) {
					manager.select();
				} else {
					manager.selection = rect;
					manager.select(manager.selection);
				}
				event.stopPropagation();
			});
			cell.addEventListener("mousemove", function() {
				if (manager.selection) {
					var rect = manager.createRect(0, 0, manager.rect.width, manager.rect.height);
					manager.select(rect);
					if (manager.onSelect) {
						manager.onSelect();
					}
					event.stopPropagation();
				}
			});
			cell.addEventListener("mouseup", function(event) {
				if (manager.selection) {
					manager.selection = null;
					if (manager.onSelect) {
						manager.onSelect();
					}
				}
				event.stopPropagation();
			});
		},

		addRowIndex: function(cell, y) {

			if (!this.grid[0]) {
				this.grid[0] = {};
			}
			this.grid[0][y] = {
				cell: cell
			};

			this.rect.width = Math.max(1, this.rect.width);
			this.rect.height = Math.max(y+1, this.rect.height);

			cell.addEventListener("mousedown", function(event) {
				var rect = manager.createRect(0, y, manager.rect.width, 1);
				if (manager.selectionRect && manager.selectionRect.equals(rect)) {
					manager.select();
				} else {
					manager.selection = rect;
					manager.select(manager.selection);
				}
			});
			cell.addEventListener("mousemove", function() {
				if (manager.selection) {
					var rect = manager.createRect(0, y, manager.rect.width, 1).union(manager.selection);
					manager.select(rect);
				}
			});
			cell.addEventListener("mouseup", function(event) {
				if (manager.selection) {
					manager.selection = null;
					if (manager.onSelect) {
						manager.onSelect();
					}
				}
				event.stopPropagation();
			});

		},

		// deprecated: only for getSelectedItems()
		addRow: function(item, row) {
			this.rows[row] = item;
			this.rect.height = Math.max(row+1, this.rect.height);
		},
		getCell: function(x, y) {
			if (manager.grid[x] && manager.grid[x][y]) {
				return manager.grid[x][y];
			}
		},
		comparePaths: function(path1, path2) {
			for (var i = 0; i < path1.length; i++) {
				if (path1[i] !== path2[i]) return false;
			}
			return true;
		},
		getCoordByPath: function(path, rect) {
			rect = rect || this.rect;
			for (var i = 0; i < rect.width; i++) {
				for (var j = 0; j < rect.height; j++) {
					if (this.comparePaths(path, this.grid[rect.left+i][rect.top+j].path)) {
						return {
							x: rect.left+i,
							y: rect.top+j
						};
					}
				}
			}
		},

		// deprecated
		getField: function(x, y) {
			if (manager.grid[x] && manager.grid[x][y] && manager.grid[x][y].field) {
				return manager.grid[x][y].field;
			}
		},

		// deprecated: use getSelectedRows
		getSelectedItems: function() {
			var items = [];
			var rect = this.getSelectionRect();
			for (var i = 0; i < rect.height; i++) {
				if (rect.left === 0 && rect.width === this.rect.width) {
					items.push(this.rows[rect.top+i]);
				}
			}
			return items;
		},
		getSelectedRows: function() {
			var items = [];
			var rect = this.getSelectionRect();
			for (var y = rect.top; y < rect.top+rect.height; y++) {
				if (rect.left === 0 && rect.width === this.rect.width) {
					items.push(y);
				}
			}

			// for (var i = 0; i < this.rect.height; i++) {
			// 	if (i >= rect.y && i < rect.y + rect.height && rect.x === 0 && rect.width === this.rect.width) {
			// 		items.push(i);
			// 	}
			// }
			return items;
		},
		getSelectedCols: function() {
			var items = [];
			var rect = this.getSelectionRect();
			for (var x = rect.left; x < rect.left+rect.width; x++) {
				if (rect.top === 0 && rect.height === this.rect.height) {
					items.push(x);
				}
			}
			// for (var i = 0; i < this.rect.width; i++) {
			// 	if (i >= rect.x && i < rect.x + rect.width && rect.y === 0 && rect.height === this.rect.height) {
			// 		items.push(i);
			// 	}
			// }
			return items;
		},
		getSelectedCells: function() {
			var cells = [];
			var rect = this.getSelectionRect();
			for (var i = 0; i < rect.width; i++) {
				for (var j = 0; j < rect.height; j++) {
					var x = rect.left+i;
					var y = rect.top+j;
					if (this.grid[x][y]) {
						cells.push(this.grid[x][y]);
					}
				}
			}
			return cells;
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
		// contains: function(rect, x, y) {
		// 	return x >= rect.x && x < rect.x+rect.width && y >= rect.y && y < rect.y+rect.height;
		// },
		// intersect: function(rect1, rect2) {
		// 	var left = Math.min(rect1.width, rect2.width, Math.max(0, rect1.left, rect2.left));
		// 	var top = Math.min(rect1.height, rect2.height, Math.max(0, rect1.top, rect2.top));
		// 	var right = Math.max(left, Math.min(left, rect1.left + rect1.width, rect2.left + rect2.width));
		// 	var bottom = Math.max(top, Math.min(top, rect1.top + rect1.height, rect2.top + rect2.height));
		// 	return {
		// 		left: left,
		// 		top: top,
		// 		width: right - left,
		// 		height: bottom - top
		// 	};
		// },
		isSelected: function(x, y) {
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
			return this.getSelectionRect().contains(x, y);
			// return col >= rect.x && col < rect.x+rect.width && row >= rect.y && row < rect.y+rect.height;
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
		// selectCells: function() {
		// 	var rect = this.getSelectionRect();
		// 	for (var i = 0; i < rect.width; i++) {
		// 		for (var j = 0; j < rect.height; j++) {
		// 			var obj = this.grid[rect.x+i][rect.y+j];
		// 			if (obj) {
		// 				obj.cell.classList.add("selected");
		// 				if (i === 0) {
		// 					obj.cell.classList.add("selected-left");
		// 				}
		// 				if (i === this.rect.width-1) {
		// 					obj.cell.classList.add("selected-right");
		// 				}
		// 				if (j === 0) {
		// 					obj.cell.classList.add("selected-top");
		// 				}
		// 				if (j === this.rect.height-1) {
		// 					obj.cell.classList.add("selected-bottom");
		// 				}
		// 				// var field = this.getField(this.rect.x+i, this.rect.y+j);
		// 				if (obj.field && obj.field.onSelect) {
		// 					obj.field.onSelect();
		// 				}
		// 			}
		// 		}
		// 	}
		// },
		// unselectCells: function() {
		// 	var rect = this.getSelectionRect();
		// 	for (var i = 0; i < rect.width; i++) {
		// 		for (var j = 0; j < rect.height; j++) {
		// 			var obj = this.grid[rect.x+i][rect.y+j];
		// 			if (obj) {
		// 				obj.cell.classList.remove("selected");
		// 				obj.cell.classList.remove("selected-left");
		// 				obj.cell.classList.remove("selected-right");
		// 				obj.cell.classList.remove("selected-top");
		// 				obj.cell.classList.remove("selected-bottom");
		// 				// var field = this.getField(this.rect.x+i, this.rect.y+j);
		// 				if (obj.field && obj.field.onUnselect) {
		// 					obj.field.onUnselect();
		// 				}
		// 			}
		// 		}
		// 	}
		// 	// for (var col in this.rect) {
		// 	// 	for (var row in this.grid[col]) {
		// 	// 		this.grid[col][row].cell.classList.remove("selected");
		// 	// 	}
		// 	// }
		// },
		// selectCells: function(rect) {
		// 	var oldRect = this.getSelectionRect();
		// 	for (var i = 0; i < rect.width; i++) {
		// 		for (var j = 0; j < rect.height; j++) {
		// 			var x = rect.x+i;
		// 			var y = rect.y+j;
		// 			if (!this.contains(oldRect, x, y)) {
		// 				if (this.grid[x][y].field.onSelect) {
		// 					this.grid[x][y].field.onSelect();
		// 				}
		// 			}
		// 			this.grid[x][y].cell.classList.add("selected");
		// 			if (i === 0) {
		// 				this.grid[x][y].cell.classList.add("selected-left");
		// 			}
		// 			if (i === this.rect.width-1) {
		// 				this.grid[x][y].cell.classList.add("selected-right");
		// 			}
		// 			if (j === 0) {
		// 				this.grid[x][y].cell.classList.add("selected-top");
		// 			}
		// 			if (j === this.rect.height-1) {
		// 				this.grid[x][y].cell.classList.add("selected-bottom");
		// 			}
		// 		}
		// 	}
		// },
		// unselectCells: function(rect) {
		// 	var oldRect = this.getSelectionRect();
		// 	for (var i = 0; i < oldRect.width; i++) {
		// 		for (var j = 0; j < oldRect.height; j++) {
		// 			var x = oldRect.x+i;
		// 			var y = oldRect.y+j;
		// 			if (!this.contains(rect, x, y)) {
		// 				if (this.grid[x][y].field.onUnselect) {
		// 					this.grid[x][y].field.onUnselect();
		// 				}
		// 			}
		// 			this.grid[x][y].cell.classList.remove("selected");
		// 			this.grid[x][y].cell.classList.remove("selected-left");
		// 			this.grid[x][y].cell.classList.remove("selected-right");
		// 			this.grid[x][y].cell.classList.remove("selected-top");
		// 			this.grid[x][y].cell.classList.remove("selected-bottom");
		// 		}
		// 	}
		// },
		updateSelection: function(rect) {

			var oldRect = this.getSelectionRect();
			for (var i = 0; i < oldRect.width; i++) {
				for (var j = 0; j < oldRect.height; j++) {
					var x = oldRect.left+i;
					var y = oldRect.top+j;
					if (this.grid[x][y]) {
						if (!rect.contains(x, y) && this.grid[x][y].field && this.grid[x][y].field.onUnselect) {
							this.grid[x][y].field.onUnselect();
						}
						this.grid[x][y].cell.classList.remove("selected");
						this.grid[x][y].cell.classList.remove("selected-left");
						this.grid[x][y].cell.classList.remove("selected-right");
						this.grid[x][y].cell.classList.remove("selected-top");
						this.grid[x][y].cell.classList.remove("selected-bottom");

						// if (this.grid[x][y].field.onBlur) {
						// 	this.grid[x][y].field.onBlur();
						// }

						// this.grid[x][y].field.onChangeOthers = null;

					}
				}
			}
			for (var i = 0; i < rect.width; i++) {
				for (var j = 0; j < rect.height; j++) {
					var x = rect.left+i;
					var y = rect.top+j;
					if (this.grid[x][y]) {
						if (!oldRect.contains(x, y) && this.grid[x][y].field && this.grid[x][y].field.onSelect) {
							this.grid[x][y].field.onSelect();
						}
						this.grid[x][y].cell.classList.add("selected");
						if (i === 0) {
							this.grid[x][y].cell.classList.add("selected-left");
						}
						if (i === rect.width-1) {
							this.grid[x][y].cell.classList.add("selected-right");
						}
						if (j === 0) {
							this.grid[x][y].cell.classList.add("selected-top");
						}
						if (j === rect.height-1) {
							this.grid[x][y].cell.classList.add("selected-bottom");
						}

						// this.grid[x][y].field.onChangeOthers = function(value) {
						// 	manager.changeOthers(value);
						// };
					}
				}
			}


		},
		select: function(rect) {

			rect = this.rect.intersect(rect || this.createRect());

			this.updateSelection(rect);

			if (rect.width === 1 && rect.height === 1) {
				var cell = this.grid[rect.left][rect.top];
				var input = cell.cell && cell.cell.querySelector("input, textarea");
				if (input) {
					input.focus();
				}
				// if (cell.field && cell.field.onFocus) {
				// 	cell.field.onFocus();
				// }
			}


			// var oldRect = this.getSelectionRect();
			// for (var i = 0; i < oldRect.width; i++) {
			// 	for (var j = 0; j < oldRect.height; j++) {
			// 		var x = oldRect.x+i;
			// 		var y = oldRect.y+j;
			// 		if (!this.contains(rect, x, y)) {
			// 			if (this.grid[x][y].field.onUnselect) {
			// 				this.grid[x][y].field.onUnselect();
			// 			}
			// 		}
			// 		this.grid[x][y].cell.classList.remove("selected");
			// 		this.grid[x][y].cell.classList.remove("selected-left");
			// 		this.grid[x][y].cell.classList.remove("selected-right");
			// 		this.grid[x][y].cell.classList.remove("selected-top");
			// 		this.grid[x][y].cell.classList.remove("selected-bottom");
			// 	}
			// }
			// for (var i = 0; i < rect.width; i++) {
			// 	for (var j = 0; j < rect.height; j++) {
			// 		var x = rect.x+i;
			// 		var y = rect.y+j;
			// 		if (!this.contains(oldRect, x, y)) {
			// 			if (this.grid[x][y].field.onSelect) {
			// 				this.grid[x][y].field.onSelect();
			// 			}
			// 		}
			// 		this.grid[x][y].cell.classList.add("selected");
			// 		if (i === 0) {
			// 			this.grid[x][y].cell.classList.add("selected-left");
			// 		}
			// 		if (i === this.rect.width-1) {
			// 			this.grid[x][y].cell.classList.add("selected-right");
			// 		}
			// 		if (j === 0) {
			// 			this.grid[x][y].cell.classList.add("selected-top");
			// 		}
			// 		if (j === this.rect.height-1) {
			// 			this.grid[x][y].cell.classList.add("selected-bottom");
			// 		}
			// 	}
			// }
			this.selectionRect = rect;
		},

		// select: function(x, y, width, height) {
		//
		// 	this.unselectCells();
		// 	// this.rect = {
		// 	// 	x: x || 0,
		// 	// 	y: y || 0,
		// 	// 	width: width || 0,
		// 	// 	height: height || 0
		// 	// };
		// 	// this.rect.x = x || 0;
		// 	// this.rect.y = y || 0;
		// 	// this.rect.width = width || 0;
		// 	// this.rect.height = height || 0;
		//
		// 	this.setSelectionRect({
		// 		x: x,
		// 		y: y,
		// 		width: width,
		// 		height: height
		// 	});
		//
		// 	this.selectCells();
		//
		// },
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

		updateCell: function(x, y, value, buffer) {
			var cell = manager.getCell(x, y);
			if (cell && cell.path && cell.render) {
				tableManager.history.write(cell.path, value, buffer);
				cell.render();
				// cell.field.set(value);
				// if (cell.field.onUpdate) {
				// 	cell.field.onUpdate(value);
				// }
			}
		},
		changeOthers: function(x, y, value, buffer) {
			var rect = this.getSelectionRect();
			for (var i = 0; i < rect.height; i++) {
				var row = i + rect.top;
				if (row !== y) {
					this.updateCell(x, row, value, buffer);
				}
			}
		},
		onClick: function() {
			if (this.selection) {
				this.selection = null;
				if (manager.onSelect) {
					manager.onSelect();
				}
			} else if (!this.getSelectionRect().isEmpty()) {
				this.select();
				if (manager.onSelect) {
					manager.onSelect();
				}
			}
		},
		onCopy: function(event) {
			event.preventDefault();
			if (navigator.clipboard && navigator.clipboard.writeText) {
				var rows = [];
				var rect = this.getSelectionRect();
				for (var j = 0; j < rect.height; j++) {
					var cols = [];
					for (var i = 0; i < rect.width; i++) {
						var value = tableManager.history.read(this.grid[rect.left+i][rect.top+j].path);
						// cols.push(this.grid[rect.left+i][rect.top+j].field.get());
						cols.push(value);
					}
					rows.push(cols.join("\t"));
				}
				if (rows.length) {
					var text = rows.join("\n");
					navigator.clipboard.writeText(text);
				}
			}
		},
		onPast: function(event) {
			var rect = manager.getSelectionRect();
			if (!rect.isEmpty()) {
				event.preventDefault();
				navigator.clipboard.readText().then(function(text) {
					if (text) {
						var rows = text.split("\n").map(function(row) {
							return row.split("\t");
						});
						if (manager.onCustomPast) {
							manager.onCustomPast(rows);
						} else if (!rect.isEmpty()) {
							var cell = manager.getCell(rect.left, rect.top);
							// if (cell.field) {
							// 	cell.field.history.save();
							// }
							// tableManager.history.startEdit(cell.path, );
							for (var j = 0; j < rect.height; j++) {
								var line = j%rows.length;
								for (var i = 0; i < rect.width; i++) {
									var value = rows[line][i%rows[line].length];
									if (value !== undefined) {
										manager.updateCell(rect.left+i, rect.top+j, value);
									}
								}
							}
							if (manager.onSelect) {
								manager.onSelect(); // -> update table footer
							}
						}
					}
				});
			}
		},

		onSelectAll: function(event) {
			if (document.activeElement === document.body) {
				var rect = manager.createRect(0, 0, this.rect.width, this.rect.height);

				this.select(rect);
				if (manager.onSelect) {
					manager.onSelect();
				}
				event.preventDefault();
			}
		},
		onEditCell: function(path, value, buffer) {
			var rect = this.getSelectionRect();
			var coord = this.getCoordByPath(path, rect);
			if (coord) {
				this.changeOthers(coord.x, coord.y, value, buffer);
			}
		},
		addField: function(element, buffer, path, keys, render, x, y) {

			if (!this.grid[x]) {
				this.grid[x] = {};
			}
			this.grid[x][y] = {
				element: element,
				buffer: buffer,
				path: path,
				keys: keys,
				render: render,
				path: path
			};

			this.rect.width = Math.max(x+1, this.rect.width);
			this.rect.height = Math.max(y+1, this.rect.height);

			var rect = this.getSelectionRect();
			this.updateSelection(rect);

			// field.onChangeOthers = function(value) {
			// manager.changeOthers(x, y, value);
			// };

			cell.addEventListener("mousedown", function(event) {
				if (manager.isSelected(x, y)) {
					manager.selection = manager.selectionRect.clone();
				} else {
					manager.selection = manager.createRect(x, y, 1, 1);
					manager.select(manager.selection);
				}
				// event.stopPropagation();
			});
			cell.addEventListener("mousemove", function() {
				if (manager.selection) {
					var rect = manager.createRect(x, y, 1, 1).union(manager.selection);
					manager.select(rect);
				}
			});
			cell.addEventListener("mouseup", function(event) {
				if (manager.selection) {
					manager.selection = null;
					if (manager.onSelect) {
						manager.onSelect();
					}
				}
				event.stopPropagation();
			});
		}
	};
	KarmaFields.currentSelector = manager; // ??
	return manager;
};

// window.addEventListener("keydown", function(event) {
// 	if (event.metaKey && event.key === "c" && KarmaFields.currentSelector && KarmaFields.currentSelector.onCopy) {
// 		KarmaFields.currentSelector.onCopy(event);
// 	}
// 	if (event.metaKey && event.key === "v" && KarmaFields.currentSelector && KarmaFields.currentSelector.onPast) {
// 		KarmaFields.currentSelector.onPast(event);
// 	}
// 	if (event.metaKey && event.key === "a" && document.activeElement === document.body && KarmaFields.currentSelector && KarmaFields.currentSelector.onSelectAll) {
// 		KarmaFields.currentSelector.onSelectAll();
// 		event.preventDefault();
// 	}
// 	if (event.metaKey && event.key === "s" && KarmaFields.currentSelector && KarmaFields.currentSelector.onSave) {
// 		KarmaFields.currentSelector.onSave(event);
// 	}
// 	if (event.metaKey && !event.shiftKey && event.key === "z" && KarmaFields.currentSelector && KarmaFields.currentSelector.onUndo) {
// 		KarmaFields.currentSelector.onUndo(event);
// 	}
// 	if (event.metaKey && event.shiftKey && event.key === "z" && KarmaFields.currentSelector && KarmaFields.currentSelector.onRedo) {
// 		KarmaFields.currentSelector.onRedo(event);
// 	}
// });
