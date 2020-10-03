KarmaFields.selectors.grid = function(tableManager) {
	var manager = {
		rows: {}, // deprecated
		grid: {},

		rect: KarmaFields.utils.rect(),
		selectionRect: KarmaFields.utils.rect(),

		init: function() {
			this.rows = {}; // deprecated
			this.grid = {};
			this.rect.set();
		},
		createRect: function(x, y, width, height) {
			return KarmaFields.utils.rect(x, y, width, height).intersect(this.rect);
		},
		getSelectionRect: function() {
			return this.selectionRect.intersect(this.rect);
		},
		setSelectionRect: function(rect) {
			this.selectionRect = this.selectionRect.intersect(this.rect);
		},
		// deprecated
		addCol: function(cell, col) { // = addHeaderCell
			// this.numCol = Math.max(col, this.numCol);
			this.grid[col] = {};
			this.rect.width = Math.max(col+1, this.rect.width);

			// cell.addEventListener("mousedown", function(event) {
			// 	var rect = manager.createRect(col, 0, 1, manager.rect.height);
			// 	if (manager.selectionRect && manager.selectionRect.equals(rect)) {
			// 		manager.select();
			// 	} else {
			// 		manager.selection = rect;
			// 		manager.select(manager.selection);
			// 	}
			// });
			// cell.addEventListener("mousemove", function() {
			// 	if (manager.selection) {
			// 		var rect = manager.createRect(col, 0, 1, manager.rect.height).union(manager.selection);
			// 		manager.select(rect);
			// 	}
			// });
			// cell.addEventListener("mouseup", function(event) {
			// 	if (manager.selection) {
			// 		manager.selection = null;
			// 		if (manager.onSelect) {
			// 			manager.onSelect();
			// 		}
			// 	}
			// 	event.stopPropagation();
			// });
			//
			// this.element.addEventListener("mousedown", function(event) {
			// 	manager.select.onHeaderMouseDown(colIndex);
			// });
			// this.element.addEventListener("mousemove", function(event) {
			// 	manager.select.onHeaderMouseMove(colIndex);
			// });
			// this.element.addEventListener("mouseup", function(event) {
			// 	manager.select.onHeaderMouseUp(colIndex);
			// 	event.stopPropagation();
			// });
		},
		// deprecated
		addIndexHeader: function(cell) { // = addHeaderCell
			this.grid[1] = {};
			this.rect.width = Math.max(1, this.rect.width);
			// cell.addEventListener("mousedown", function(event) {
			// 	var rect = manager.createRect(0, 0, manager.rect.width, manager.rect.height);
			// 	if (manager.selectionRect && manager.selectionRect.equals(rect)) {
			// 		manager.select();
			// 	} else {
			// 		manager.selection = rect;
			// 		manager.select(manager.selection);
			// 	}
			// 	event.stopPropagation();
			// });
			// cell.addEventListener("mousemove", function() {
			// 	if (manager.selection) {
			// 		var rect = manager.createRect(0, 0, manager.rect.width, manager.rect.height);
			// 		manager.select(rect);
			// 		if (manager.onSelect) {
			// 			manager.onSelect();
			// 		}
			// 		event.stopPropagation();
			// 	}
			// });
			// cell.addEventListener("mouseup", function(event) {
			// 	if (manager.selection) {
			// 		manager.selection = null;
			// 		if (manager.onSelect) {
			// 			manager.onSelect();
			// 		}
			// 	}
			// 	event.stopPropagation();
			// });
		},

		// deprecated
		addRowIndex: function(cell, y) {

			// if (!this.grid[0]) {
			// 	this.grid[0] = {};
			// }
			// this.grid[0][y] = {
			// 	cell: cell
			// };
			//
			// this.rect.width = Math.max(1, this.rect.width);
			// this.rect.height = Math.max(y+1, this.rect.height);

			// cell.addEventListener("mousedown", function(event) {
			// 	var rect = manager.createRect(0, y, manager.rect.width, 1);
			// 	if (manager.selectionRect && manager.selectionRect.equals(rect)) {
			// 		manager.select();
			// 	} else {
			// 		manager.selection = rect;
			// 		manager.select(manager.selection);
			// 	}
			// });
			// cell.addEventListener("mousemove", function() {
			// 	if (manager.selection) {
			// 		var rect = manager.createRect(0, y, manager.rect.width, 1).union(manager.selection);
			// 		manager.select(rect);
			// 	}
			// });
			// cell.addEventListener("mouseup", function(event) {
			// 	if (manager.selection) {
			// 		manager.selection = null;
			// 		if (manager.onSelect) {
			// 			manager.onSelect();
			// 		}
			// 	}
			// 	event.stopPropagation();
			// });

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
					var cell = this.getCell(0, y);
					if (cell) {
						items.push(cell);
					}
				}
			}
			return items;
			// var items = [];
			// var rect = this.getSelectionRect();
			// for (var y = rect.top; y < rect.top+rect.height; y++) {
			// 	if (rect.left === 0 && rect.width === this.rect.width) {
			// 		items.push(y);
			// 	}
			// }
			// return items;
		},
		getSelectedCols: function() {
			var items = [];
			var rect = this.getSelectionRect();
			for (var x = rect.left; x < rect.left+rect.width; x++) {
				if (rect.top === 0 && rect.height === this.rect.height) {
					items.push(x);
				}
			}
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
		isSelected: function(x, y) {
			return this.getSelectionRect().contains(x, y);
		},
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
						this.grid[x][y].element.classList.remove("selected");
						this.grid[x][y].element.classList.remove("selected-left");
						this.grid[x][y].element.classList.remove("selected-right");
						this.grid[x][y].element.classList.remove("selected-top");
						this.grid[x][y].element.classList.remove("selected-bottom");
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
						this.grid[x][y].element.classList.add("selected");
						if (i === 0) {
							this.grid[x][y].element.classList.add("selected-left");
						}
						if (i === rect.width-1) {
							this.grid[x][y].element.classList.add("selected-right");
						}
						if (j === 0) {
							this.grid[x][y].element.classList.add("selected-top");
						}
						if (j === rect.height-1) {
							this.grid[x][y].element.classList.add("selected-bottom");
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

				var input = cell.element && cell.element.querySelector("input, textarea");
				if (input) {
					input.focus();
				}
			}

			this.selectionRect = rect;
		},
		// updateCell: function(x, y, value, buffer) {
		// 	var cell = manager.getCell(x, y);
		// 	if (cell && cell.path && cell.render) {
		// 		tableManager.history.write(cell.path, value, buffer);
		// 		cell.render();
		// 	}
		// },
		// changeOthers: function(x, y, value, buffer) {
		// 	var rect = this.getSelectionRect();
		// 	for (var i = 0; i < rect.height; i++) {
		// 		var row = i + rect.top;
		// 		if (row !== y) {
		// 			this.updateCell(x, row, value, buffer);
		// 		}
		// 	}
		// },
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
						var cell = this.grid[rect.left+i][rect.top+j];
						var value = cell && cell.field.getValue();
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
							var data = {};
							for (var j = 0; j < rect.height; j++) {
								var line = j%rows.length;
								for (var i = 0; i < rect.width; i++) {

									var cell = manager.grid[rect.left+i][rect.top+j];
									var value = rows[line][i%rows[line].length];
									if (value !== undefined) {
										// tableManager.history.write(cell.field.getOutput(), value, true);
										// cell.field.setValue(value, true, true);
										// cell.render();
										if (cell.field && cell.field.path && cell.field.resource && cell.field.resource.key) {
											data[cell.field.path] = {};
											data[cell.field.path][cell.field.resource.key] = value;
										}
									}
								}
							}
							var cell = manager.getCell(rect.left, rect.top);
							if (cell && cell.field && cell.field.buffer) {
								cell.field.history.write(cell.field.buffer, [cell.field.resource.driver], data, cell.field.getPath().join("/")+"/"+rows[0][0]);
							}

							tableManager.render();

							// if (manager.onSelect) {
							// 	manager.onSelect(); // -> update table footer
							// }
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
		// onEditCell: function(field, value) {
		// 	var rect = this.getSelectionRect();
		// 	var key = field.keys.toString();
		//
		// 	for (var i = 0; i < rect.height; i++) {
		// 		for (var j = 0; i < rect.width; i++) {
		// 			var cell = this.grid[rect.left+i][rect.top+j];
		// 			if (cell.field !== field && cell.field.keys.toString() === key) {
		// 				// tableManager.history.write(cell.field.getOutput(), value, true);
		// 				cell.field.setValue(value, true, true);
		// 				cell.render();
		// 			}
		// 		}
		// 	}
		// },
		onMultiEdit: function(field, value, flux) {
			var rect = this.getSelectionRect();
			if (field.history && field.path && field.resource && field.resource.key) {
				var data = {};
				for (var j = 0; j < rect.height; j++) {
					var cell = this.grid[field.colIndex][rect.top+j];
					if (cell.field && cell.field.path && cell.field.path !== field.path) {
						field.history.write(field.buffer, [field.resource.driver, cell.field.path, field.resource.key], value, flux);
						if (cell.field.render) {
							cell.field.render();
						}
						if (cell.element) {
							cell.element.classList.toggle("modified", cell.field.isModified());
						}
					}
				}
			}
		},
		onHeaderMouseDown: function(x) {
			var rect = manager.createRect(x, 0, 1, manager.rect.height);
			if (manager.selectionRect && manager.selectionRect.equals(rect)) {
				manager.select();
			} else {
				manager.selection = rect;
				manager.select(manager.selection);
			}
		},
		onHeaderMouseMove: function(x) {
			if (manager.selection) {
				var rect = manager.createRect(x, 0, 1, manager.rect.height).union(manager.selection);
				manager.select(rect);
			}
		},
		onHeaderMouseUp: function(x) {
			if (manager.selection) {
				manager.selection = null;
				if (manager.onSelect) {
					manager.onSelect();
				}
			}
		},
		onIndexHeaderMouseDown: function() {
			var rect = manager.createRect(0, 0, manager.rect.width, manager.rect.height);
			if (manager.selectionRect && manager.selectionRect.equals(rect)) {
				manager.select();
			} else {
				manager.selection = rect;
				manager.select(manager.selection);
			}
		},
		onIndexHeaderMouseMove: function() {
			if (manager.selection) {
				var rect = manager.createRect(0, 0, manager.rect.width, manager.rect.height);
				manager.select(rect);
			}
		},
		onIndexHeaderMouseUp: function() {
			if (manager.selection) {
				manager.selection = null;
				if (manager.onSelect) {
					manager.onSelect();
				}
			}
		},
		onIndexCellMouseDown: function(y) {
			var rect = manager.createRect(0, y, manager.rect.width, 1);
			if (manager.selectionRect && manager.selectionRect.equals(rect)) {
				manager.select();
			} else {
				manager.selection = rect;
				manager.select(manager.selection);
			}
		},
		onIndexCellMouseMove: function(y) {
			if (manager.selection) {
				var rect = manager.createRect(0, y, manager.rect.width, 1).union(manager.selection);
				manager.select(rect);
			}
		},
		onIndexCellMouseUp: function(y) {
			if (manager.selection) {
				manager.selection = null;
				if (manager.onSelect) {
					manager.onSelect();
				}
			}
		},
		onCellMouseDown: function(x, y) {
			if (manager.isSelected(x, y)) {
				manager.selection = manager.selectionRect.clone();
			} else {
				manager.selection = manager.createRect(x, y, 1, 1);
				manager.select(manager.selection);
			}
		},
		onCellMouseMove: function(x, y) {
			if (manager.selection) {
				var rect = manager.createRect(x, y, 1, 1).union(manager.selection);
				manager.select(rect);
			}
		},
		onCellMouseUp: function(x, y) {
			if (manager.selection) {
				manager.selection = null;
				if (manager.onSelect) {
					manager.onSelect();
				}
			}
		},


		// manager.select.addHiddenField(trashFieldManager, rowIndex, "trash");

		// updateCell: function(x, y, element, field) {
		// 	if (!this.grid[x]) {
		// 		this.grid[x] = {};
		// 	}
		// 	if (!this.grid[x][y]) {
		// 		this.grid[x][y] = {};
		// 	}
		// 	this.grid[x][y].element = element;
		// 	this.grid[x][y].field = field;
		// },


		// addHiddenField: function(x, y, field) {
		// 	// if (!this.grid[x]) {
		// 	// 	this.grid[x] = {};
		// 	// }
		//
		// 	this.updateCell(x, y, field);
		//
		// },
		// updateCell: function(x, y, element, field) {
		//
		// 	// if (!this.grid[x]) {
		// 	// 	this.grid[x] = {};
		// 	// }
		// 	// this.grid[x][y] = {
		// 	// 	element: element,
		// 	// 	uri: uri,
		// 	// 	key: key,
		// 	// 	field: field,
		// 	// 	render: render,
		// 	// };
		//
		// 	if (!this.grid[x]) {
		// 		this.grid[x] = {};
		// 	}
		// 	if (!this.grid[x][y]) {
		// 		this.grid[x][y] = {};
		// 	}
		// 	this.grid[x][y].element = element;
		// 	this.grid[x][y].field = field;
		// addField: function(element, uri, key, field, render, x, y, field) {
		addField: function(x, y, element, field) {

			// if (!this.grid[x]) {
			// 	this.grid[x] = {};
			// }
			// this.grid[x][y] = {
			// 	element: element,
			// 	uri: uri,
			// 	key: key,
			// 	field: field,
			// 	render: render,
			// };

			if (!this.grid[x]) {
				this.grid[x] = {};
			}
			if (!this.grid[x][y]) {
				this.grid[x][y] = {};
			}
			this.grid[x][y].element = element;
			this.grid[x][y].field = field;

			if (!isNaN(x)) {
				this.rect.width = Math.max(x+1, this.rect.width);
			}
			if (!isNaN(y)) {
				this.rect.height = Math.max(y+1, this.rect.height);
			}




			var rect = this.getSelectionRect();
			this.updateSelection(rect);
			// element.addEventListener("mousedown", function(event) {
			// 	if (manager.isSelected(x, y)) {
			// 		manager.selection = manager.selectionRect.clone();
			// 	} else {
			// 		manager.selection = manager.createRect(x, y, 1, 1);
			// 		manager.select(manager.selection);
			// 	}
			// 	// event.stopPropagation();
			// });
			// element.addEventListener("mousemove", function() {
			// 	if (manager.selection) {
			// 		var rect = manager.createRect(x, y, 1, 1).union(manager.selection);
			// 		manager.select(rect);
			// 	}
			// });
			// element.addEventListener("mouseup", function(event) {
			// 	if (manager.selection) {
			// 		manager.selection = null;
			// 		if (manager.onSelect) {
			// 			manager.onSelect();
			// 		}
			// 	}
			// 	event.stopPropagation();
			// });
		}
	};
	KarmaFields.currentSelector = manager; // ??
	return manager;
};
