
var Selection = {
	intersect: function(box1, box2) {
		return box1.left < box2.left+box2.width && box1.left+box1.width > box2.left && box1.top < box2.top+box2.height && box1.top+box1.height > box2.top;
	},

	createSystem: function() {
		var system = {
			zones: [],
			findZoneUnder: function(rect) {
				return this.zones.find(function(item) {
					var box = item.element.getBoundingClientRect();
					var mX = rect.left+rect.width/2;
					var mY = rect.top+rect.height/2;
					return mX > box.left && mX < box.left+box.width && mY > box.top && mY < box.top+box.height;
				});
			},
			addZone: function() {
				var item = this.createItem();
				this.zones.push(item);
				return item;
			},
			selection: {
				selectedItems: [],
				// rect: {
				// 	top: 0,
				// 	left: 0,
				// 	width: 0,
				// 	height: 0
				// },
				top: 0,
				left: 0,
				getItems: function() {
					return this.selectedItems.map(function(selectedItem) {
						return selectedItem.item;
					});
				},
				getRect: function() {
					var width = this.selectedItems.length && this.selectedItems[0].box.width;
					var height = this.getItemY();
					return {
						top: this.top,
						left: this.left,
						width: width,
						height: height
					};
				},
				// move: function() {
				// 	for (var i = 0; i < this.selectedItems.length; i++) {
				// 		var tx = this.left - this.selectedItems[i].box.left;
				// 		var ty = this.top + this.getItemY(this.selectedItems[i].item) - this.selectedItems[i].box.top;
				// 		this.selectedItems[i].item.element.style.transform = "translate("+tx+"px, "+ty+"px)";
				// 	}
				// },
				// stop: function() {
				// 	for (var i = 0; i < this.selectedItems.length; i++) {
				// 		this.selectedItems[i].item.element.style.transform = "none";
				// 	}
				// },
				sort: function() {
					this.selectedItems.sort(function(a, b) {
						return a.item.isBefore(b.item) ? -1 : 1;
					});
				},
				add: function(item) {
					if (this.getIndex(item) === -1) {
						var selectedItem = {
							item: item,
							box: null,
							reset: function() {
								this.item.element.style.transform = "none";
								this.box = item.element.getBoundingClientRect();
							}
						}
						if (item.onSelect) {
							item.onSelect();
						}
						item.selected = selectedItem;
						item.selectionIndex = this.selectedItems.length;
						this.selectedItems.push(selectedItem);
						this.sort();
						selectedItem.reset();
					}
				},
				remove: function(item) {
					var index = this.getIndex(item);
					if (index > -1) {
						if (item.onUnselect) {
							 item.onUnselect();
						}
						item.selected = null;
						item.selectionIndex = -1;
						this.selectedItems.splice(index, 1);
						this.sort();
					}
				},
				// removeAt: function(index) {
				// 	var selectedItem = this.selectedItems[index];
				// 	if (selectedItem) {
				// 		if (selectedItem.item.onUnselect) {
				// 			 selectedItem.item.onUnselect();
				// 		}
				// 		this.selectedItems.splice(index, 1);
				// 	}
				// },
				getIndex: function(item) {
					for (var i = 0; i < this.selectedItems.length; i++) {
						if (this.selectedItems[i].item === item) {
							return i;
						}
					}
					return -1;
				},
				// find: function(item) {
				// 	return this.selectedItems.find(function(selectedItem) {
				// 		return selectedItem.item === item;
				// 	});
				// },
				getFirst: function() {
					return this.selectedItems[0];
				},
				getLast: function() {
					return this.selectedItems[this.selectedItems.length-1];
				},
				isConsecutive: function() {
					var last = this.selectedItems.length && this.selectedItems[0].item;
					var lastIndex = last && last.getIndex();
					for (var i = 1; i < this.selectedItems.length; i++) {
						if (this.selectedItems[i].item.parent !== last.parent || this.selectedItems[i].item.getIndex() !== lastIndex+1) {
							return false;
						}
						last = this.selectedItems[i].item;
						lastIndex++;
					}
					return true;
				},
				getItemY: function(item) {
					var y = 0;
					for (var i = 0; i < this.selectedItems.length; i++) {
						if (item === this.selectedItems[i].item) {
							return y;
						}
						y += this.selectedItems[i].box.height;
					}
					return y;
				},
				// getSelectionHeightBefore: function(item) {
				// 	var y = 0;
				// 	var items = item.getRoot().getDescendants();
				// 	for (var i = 0; i < items.length; i++) {
				// 		if (item === items[i]) {
				// 			break;
				// 		}
				// 		if (items[i].selected) {
				// 			y += items[i].getBox().height;
				// 		}
				// 	}
				// 	return y;
				// },
				reset: function() {
					this.selectedItems.forEach(function(selectedItem) {
						selectedItem.reset();
					});
				},
				update: function() {
					this.sort();
					this.insertBefore(this.getFirst().item);
					this.reset();
					this.left = this.getFirst().box.left;
					this.top = this.getFirst().box.top;
					this.width = this.getFirst().box.width;
					this.height = this.getItemY();
				},
				clear: function() {
					this.selectedItems.forEach(function(selectedItem) {
						if (selectedItem.item.onUnselect) {
							 selectedItem.item.onUnselect();
						}
						selectedItem.item.selected = null;
						selectedItem.item.selectionIndex = -1;
					});
					this.selectedItems = [];
				},
				prependTo: function(item) {
					if (item.children.length > 0) {
						this.insertBefore(item.children[0]);
					} else {
						this.appendTo(item);
					}
				},
				appendTo: function(item) {
					for (var i = 0; i < this.selectedItems.length; i++) {
						var selectedItem = this.selectedItems[i];
						item.append(selectedItem.item);
						// selectedItem.reset();
					}
					this.reset();
				},
				insertBefore: function(item) {
					for (var i = 0; i < this.selectedItems.length; i++) {
						var selectedItem = this.selectedItems[this.selectedItems.length-1-i];
						selectedItem.item.insertBefore(item);
						// selectedItem.reset();
						item = selectedItem.item;
					}
					this.reset();
				},
				insertAfter: function(item) {
					var next = item.getNextSibling();
					if (next) {
						this.insertBefore(next);
					} else {
						this.appendTo(item.parent);
					}
				},
				moveTop: function() {
					var selectionRect = this.getRect();
					var first = this.getFirst().item;
					var prev = first.getPrevSibling();

					if (prev) {
						var box = prev.element.getBoundingClientRect();
						if (selectionRect.top < box.top+box.height/2) {
							// prev.insertBefore(this.getItems());
							this.insertBefore(prev);
						}
					} else if (first.parent && first.parent.parent && first.parent.handle) {
						var box = first.parent.handle.getBoundingClientRect();
						if (selectionRect.top < box.top+box.height/2) {
							// first.parent.insertBefore(this.getItems());
							this.insertBefore(first.parent);
						}
					}
				},
				moveBottom: function() {
					var selectionRect = this.getRect();
					var last = this.getLast().item;
					var next = last.getNext();

					if (next) {
						var box = next.element.getBoundingClientRect();
						var handle = next.handle.getBoundingClientRect();
						var zone = next.zone.getBoundingClientRect();
						if (selectionRect.top+selectionRect.height > box.top+box.height/2) {
							// next.insertAfter(this.getItems());
							this.insertAfter(next);
						} else if (selectionRect.top+selectionRect.height > handle.top+handle.height/2 && selectionRect.left >= zone.left) {
							// next.prepend(this.getItems());
							this.prependTo(next);
						}
					}
				},
				moveLeft: function() {
					var selectionRect = this.getRect();
					var first = this.getFirst().item;
					var next = this.getLast().item.getNextSibling();

					if (!next && first.parent && first.parent.parent) {
						var zone = first.parent.zone.getBoundingClientRect();
						if (selectionRect.left < zone.left) {
							// first.parent.insertAfter(this.getItems());
							this.insertAfter(first.parent);
						}
					}
				},
				moveRight: function() {
					var selectionRect = this.getRect();
					var prev = this.getFirst().item.getPrevSibling();

					if (prev) {
						var box = prev.zone.getBoundingClientRect();
						if (selectionRect.left >= box.left) {
							// prev.prepend(this.getItems());
							this.prependTo(prev);
						}
					}
				},
				updateShadow: function() {
					var activeItem = this.getFirst().item.parent;
					if (this.shadowItem !== activeItem) {
						if (this.shadowItem && this.shadowItem.onDeactivate) {
							this.shadowItem.onDeactivate();
						}
						if (activeItem.onActivate) {
							activeItem.onActivate();
							this.shadowItem = activeItem;
						}
					}
				},
				move: function(root, currentItem) {
					if (root && root !== currentItem.getRoot()) {
						var rect = this.getRect();
						var box = root.element.getboundingClientRect();
						if (rect.top+rect.height/2 < box.top+box.height/2) {
							// root.prepend(this.getItems());
							this.prependTo(root);
						} else {
							this.appendTo(root);
						}
					} else {
						// if (!this.isConsecutive()) {
						// 	currentItem.insertBefore(this.getItems());
						// 	this.reset();
						// }
						// this.updateShadow(this.getFirst().item);
						this.moveTop();
						this.moveBottom();
						this.moveLeft();
						this.moveRight();
					}
					this.updateShadow();

					for (var i = 0; i < this.selectedItems.length; i++) {
						var tx = this.left - this.selectedItems[i].box.left;
						var ty = this.top + this.getItemY(this.selectedItems[i].item) - this.selectedItems[i].box.top;
						this.selectedItems[i].item.element.style.transform = "translate("+tx+"px, "+ty+"px)";
					}
				},
				stop: function() {
					if (this.shadowItem && this.shadowItem.onDeactivate) {
						this.shadowItem.onDeactivate();
					}
					this.shadowItem = null;
					for (var i = 0; i < this.selectedItems.length; i++) {
						this.selectedItems[i].item.element.style.transform = "none";
					}
				},
				mouseDown: function(event, item) {
					this.update();

					var offsetX = event.clientX - this.left;
					var offsetY = event.clientY + this.getItemY(item) - item.element.getBoundingClientRect().top;

					function dragMove(event) {
						system.selection.left = event.clientX - offsetX;
						system.selection.top = event.clientY - offsetY;
						var zone = system.findZoneUnder(this);
						system.selection.move(zone, item);
					}
					function dragComplete(event) {
						system.selection.stop();
						window.removeEventListener("mousemove", dragMove);
						window.removeEventListener("mouseup", dragComplete);
					}
					window.addEventListener("mousemove", dragMove);
					window.addEventListener("mouseup", dragComplete);
				}

				// findItemUnder: function(deltaX, deltaY) {
				//
				// 	var items = item.getRoot().findDescendants(function(item) {
				// 		return !item.selected;
				// 	});
				//
				// 	var choice = items.shift();
				//
				//
				// 	var selectionX = selection.rect.left;
				// 	var selectionY = selection.rect.top ; //deltaY < 0 ? selection.rect.top : selection.rect.top + selection.rect.height;
				//
				//
				// 	// if (deltaY < 0) {
				// 	// 	selectionY = selection.rect.top;
				// 	// } else if (deltaY > 0) {
				// 	// 	selectionY = selection.rect.top + selection.rect.height;
				// 	// } else {
				// 	// 	selectionY = selection.rect.top + selection.rect.height/2;
				// 	// }
				//
				//
				// 	for (var i = 0; i < items.length; i++) {
				// 		var zoneBox = items[i].zone.element.getBoundingClientRect();
				//
				// 		// var zoneBox = items[i].getBox() || items[i].zone.element.getBoundingClientRect();
				//
				// 		// var offset = this.getSelectionHeightBefore(items[i]);
				//
				// 		var handleBox = items[i].getHandleBox();
				// 		var handleHeight = handleBox && handleBox.height || 9;
				//
				// 		if (zoneBox && selectionY > zoneBox.top - handleHeight && selectionX > zoneBox.left) {
				// 			choice = items[i];
				// 		}
				// 	}
				//
				// 	return choice;
				//
				// 	// if (this.items.length) {
				// 	//
				// 	//
				// 	// 	var items = this.items[0].getRoot().getDescendants().filter(function(item) {
				// 	//
				// 	// 		return item.zone.element && !selection.items.some(function(selectedItem) {
				// 	// 			return selectedItem.contains(item);
				// 	// 		}) && Selection.intersect(item.zone.element.getBoundingClientRect(), selection.rect);
				// 	// 	});
				// 	//
				// 	// 	console.log(items);
				// 	//
				// 	// 	items.sort(function(a, b) {
				// 	// 		// var diffA = Math.abs(selection.left - a.element.getBoundingClientRect().left);
				// 	// 		// var diffB = Math.abs(selection.left - b.element.getBoundingClientRect().left);
				// 	// 		var diffA = selection.rect.left - a.zone.element.getBoundingClientRect().left;
				// 	// 		var diffB = selection.rect.left - b.zone.element.getBoundingClientRect().left;
				// 	// 		if (diffA < 0) diffA = 100 - diffA;
				// 	// 		if (diffB < 0) diffB = 100 - diffB;
				// 	// 		if (diffA < diffB) return -1;
				// 	// 		else if (diffA > diffB) return 1;
				// 	// 		else return 0;
				// 	// 	});
				// 	// 	return items[0];
				// 	// }
				// },
				// // move: function(left, top, deltaX, deltaY) {
				// // 	this.rect.top = top;
				// // 	this.rect.left = left;
				// // 	var itemUnder = this.findItemUnder(deltaX, deltaY);
				// move: function(itemUnder) {
				//
				// 	var prev = this.getPrev();
				// 	var next = this.getNext();
				//
				// 	// check top
				// 	if (prev && ) {
				//
				// 	}
				//
				//
				//
				// 	// if (itemUnder) {
				// 	// 	if (Selection.currentItem && Selection.currentItem !== itemUnder && Selection.currentItem.onDeactivate) {
				// 	// 		Selection.currentItem.onDeactivate();
				// 	// 	}
				// 	// 	if (Selection.currentItem !== itemUnder) {
				// 	// 		Selection.currentItem = itemUnder;
				// 	// 		if (itemUnder.onActivate) {
				// 	// 			itemUnder.onActivate();
				// 	// 		}
				// 	// 	}
				// 	// 	this.items.forEach(function(selectedItem) {
				// 	// 		if (selectedItem.parent !== itemUnder) {
				// 	// 			selectedItem.parent.remove(selectedItem);
				// 	// 			selectedItem.parent = itemUnder;
				// 	// 			itemUnder.zone.items.push(selectedItem);
				// 	// 			itemUnder.zone.element.appendChild(selectedItem.element);
				// 	// 			selectedItem.resetBox();
				// 	// 		}
				// 	// 	});
				// 	//
				// 	// 	var inbetween = selection.getInbetween();
				// 	//
				// 	// 	while (inbetween) {
				// 	// 		itemUnder.zone.insertBefore(inbetween, selection.getFirst());
				// 	// 		selection.reset();
				// 	// 		inbetween.resetBox();
				// 	// 		inbetween = selection.getInbetween();
				// 	// 	}
				// 	//
				// 	// 	var prev = selection.getFirst().getPrevSibling();
				// 	//
				// 	// 	while (prev && selection.rect.top < prev.getBox().top + prev.getBox().height/2) {
				// 	// 		itemUnder.zone.insertAfter(prev, selection.getLast());
				// 	// 		selection.reset();
				// 	// 		prev.resetBox();
				// 	// 		prev = selection.getFirst().getPrevSibling();
				// 	// 	}
				// 	//
				// 	// 	var next = selection.getLast().getNextSibling();
				// 	//
				// 	// 	while (next && selection.rect.top + selection.rect.height > next.getBox().top + next.getBox().height/2) {
				// 	// 		itemUnder.zone.insertBefore(next, selection.getFirst());
				// 	// 		selection.reset();
				// 	// 		next.resetBox();
				// 	// 		next = selection.getLast().getNextSibling();
				// 	// 	}
				// 	//
				// 	//
				// 	// }
				// 	this.items.forEach(function(item) {
				// 		var tx = selection.rect.left - item.getBox().left;
				// 		var ty = selection.rect.top + selection.getItemY(item) - item.getBox().top;
				// 		item.element.style.transform = "translate("+tx+"px, "+ty+"px)";
				// 	});
				// },
				// stop: function() {
				// 	var item = this.findItemUnder();
				// 	if (item) {
				// 		item.zone.items.forEach(function(childItem, index) {
				// 			if (childItem.index !== index || childItem.parentId !== item.id) {
				// 				childItem.index = index;
				// 				childItem.parentId = item.id;
				// 				if (childItem.onChange) {
				// 					childItem.onChange();
				// 				}
				// 			}
				// 		});
				// 	}
				// 	this.items.forEach(function(item) {
				// 		item.element.style.transform = "none";
				// 	});
				// 	if (Selection.currentItem && Selection.currentItem.onDeactivate) {
				// 		Selection.currentItem.onDeactivate();
				// 		Selection.currentItem = null;
				// 	}
				// }

			},
			createItem: function() {
				var box;
				var item = {
					element: null,
					zone: null,
					handle: null,
					children: [],
					parent: null,
					prepend: function(item) {
						if (this.children.length > 0) {
							this.children[0].insertBefore(item);
						} else {
							this.append(item);
						}
					},
					append: function(item) {
						if (this.isAncestor(item)) {
							console.error("cannot append ancestor of item to itself");
						} else if (item === this) {
							console.error("cannot append item to itself");
						} else {
							item.parent.remove(item);
							this.add(item);
							this.zone.appendChild(item.element);
						}
					},
					insertBefore: function(item) {
						if (item.isAncestor(this)) {
							console.error("cannot insert ancestor of item before itself");
						} else if (item !== this) {
							this.parent.remove(this);
							item.parent.addAt(this, item.getIndex());
							item.parent.zone.insertBefore(this.element, item.element);
						}
					},
					insertAfter: function(item) {
						var next = item.getNextSibling();
						if (next) {
							this.insertBefore(next);
						} else {
							item.parent.append(this);
						}
					},


					// prepend: function(items) {
					// 	if (this.children.length > 0) {
					// 		this.children[0].insertBefore(items);
					// 	} else {
					// 		this.append(items);
					// 	}
					// },
					// append: function(items) {
					// 	for (var i = 0; i < items.length; i++) {
					// 		items[i].parent.remove(items[i]);
					// 		this.add(items[i]);
					// 		this.zone.appendChild(items[i].element);
					// 	}
					// },
					// insertBefore: function(items) {
					// 	var index = this.getIndex();
					// 	var parent = this.parent;
					// 	for (var i = 0; i < items.length; i++) {
					// 		var item = items[items.length-1-i];
					// 		item.parent.remove(item);
					// 		parent.addAt(item, index);
					// 		parent.zone.insertBefore(item.element, this.element);
					// 	}
					// },
					// insertAfter: function(items) {
					// 	var next = this.getNextSibling();
					// 	if (next) {
					// 		next.insertBefore(items);
					// 	} else {
					// 		this.parent.append(items);
					// 	}
					// },


					// getBox: function() {
					// 	return this.selected && this.selected.box || this.element && this.element.getBoundingClientRect();
					// },
					getRoot: function() {
						if (this.parent) {
							return this.parent.getRoot();
						}
						return this;
					},
					contains: function(child) {
						return this.children.some(function(item) {
							return item === child || item.contains(child);
						});
					},
					getIndex: function() {
						return this.parent.children.indexOf(this);
					},
					getPrev: function() {
						var prev = this.getPrevSibling();
						if (prev) {
							return prev;
						} else {
							return this.parent;
						}
					},
					getNext: function() {
						var next = this.getNextSibling();
						if (next) {
							return next;
						} else if (this.parent) {
							return this.parent.getNext();
						}
					},
					getPrevSibling: function() {
						return this.parent && this.parent.children[this.getIndex()-1];
					},
					getNextSibling: function() {
						return this.parent && this.parent.children[this.getIndex()+1];
					},
					getDepth: function() {
						if (this.parent) {
							this.parent.getDepth() + 1;
						} else {
							return 0;
						}
					},
					isBefore: function(item) {
						if (this.parent && item.parent && item.parent === this.parent) {
							return this.getIndex() < item.getIndex();
						} else if (item.parent && item.getDepth() > this.getDepth()) {
							return this.isBefore(item.parent);
						} else if (this.parent && this.getDepth() > item.getDepth()) {
							return this.parent.isBefore(item);
						} else if (this.parent && item.parent) {
							return this.parent.isBefore(item.parent);
						} else {
							return system.zones.indexOf(this) < system.zones.indexOf(item);
						}
					},
					createChild: function() {
						var child = system.createItem();
						this.add(child);
						return child;
					},
					add: function(item) {
						// item.index = this.children.length;
						this.children.push(item);
						item.parent = this;

					},
					addAt: function(item, index) {
						// item.index = index;
						// for (var i = index; i < this.children.length; i++) {
						// 	this.children[i].index++;
						// }
						this.children.splice(index, 0, item);
						item.parent = this;
					},
					remove: function(item) {
						var index = this.children.indexOf(item);
						if (index > -1) {
							this.children.splice(index, 1);
							item.parent = null;
						}
					},
					select: function() {
						system.selection.add(this);
						// if (!this.selected) {
						// 	this.selected = true;
						// 	this.resetBox();
						// 	if (this.onSelect) {
						// 		 this.onSelect();
						// 	}
						// }
					},
					unselect: function() {
						system.selection.remove(this);
						// if (this.selected) {
						// 	this.selected = false;
						// 	this.resetBox();
						// 	if (this.onUnselect) {
						// 		 this.onUnselect();
						// 	}
						// }
					},
					isSelected: function() {
						return system.selection.getIndex(this) > -1;
					},
					isAncestor: function(item) {
						return item === this.parent || this.parent && this.parent.isAncestor(item);
					},
					getSelectedAncestor: function() {
						if (this.isSelected()) {
							return this;
						} else if (this.parent) {
							return this.parent.getSelectedAncestor();
						}
					},
					// moveTop: function() {
					// 	var selectionRect = system.selection.getRect();
					// 	var prev = system.selection.getFirst().item.getPrevSibling();
					// 	var next = system.selection.getLast().item.getNextSibling();
					//
					// 	// top
					// 	if (prev) {
					// 		var box = prev.element.getBoundingClientRect();
					// 		if (selectionRect.top < box.top+box.height/2) {
					// 			prev.insertBefore(system.selection.getItems());
					// 		}
					// 	} else if (this.parent && this.parent !== root && this.parent.handle) {
					// 		var box = this.parent.handle.getBoundingClientRect();
					// 		if (selectionRect.top < box.top+box.height/2) {
					// 			this.parent.parent.insertBefore(system.selection.getItems(), this.parent);
					// 		}
					// 	}
					// },
					// moveBottom: function() {
					// 	var selectionRect = system.selection.getRect();
					// 	var next = system.selection.getLast().item.getNext();
					//
					// 	if (next) {
					// 		var box = next.element.getBoundingClientRect();
					// 		var handle = next.handle.getBoundingClientRect();
					// 		var zone = next.zone.getBoundingClientRect();
					// 		if (selectionRect.top+selectionRect.height > box.top+box.height/2) {
					// 			next.insertAfter(system.selection.getItems());
					// 		} else if (selectionRect.top+selectionRect.height > handle.top+handle.height/2 && selectionRect.left >= zone.left) {
					// 			next.prepend(system.selection.getItems());
					// 		}
					// 	}
					// },
					// moveLeft: function() {
					// 	var selectionRect = system.selection.getRect();
					// 	var next = system.selection.getLast().item.getNextSibling();
					//
					// 	if (!next && this.parent && this.parent.parent) {
					// 		var zone = this.parent.zone.getBoundingClientRect();
					// 		if (selectionRect.left < zone.left) {
					// 			this.parent.parent.append(system.selection.getItems());
					// 		}
					// 	}
					// },
					// moveRight: function() {
					// 	var selectionRect = system.selection.getRect();
					// 	var prev = system.selection.getFirst().item.getPrevSibling();
					// 	var next = system.selection.getLast().item.getNextSibling();
					//
					// 	if (prev) {
					// 		var box = prev.zone.getBoundingClientRect();
					// 		if (selectionRect.left >= box.left) {
					// 			prev.prepend(system.selection.getItems());
					// 		}
					// 	}
					// },
					// move: function(root, currentItem) {
					//
					// 	if (root && root !== this.getRoot()) {
					// 		var rect = system.selection.getRect();
					// 		var box = root.element.getboundingClientRect();
					// 		if (rect.top+rect.height/2 < box.top+box.height/2) {
					// 			root.prepend(system.selection.getItems());
					// 		} else {
					// 			root.append(system.selection.getItems());
					// 		}
					// 	} else {
					//
					//
					// 		// var selectionRect = system.selection.getRect();
					// 		// var first = system.selection.getFirst().item;
					// 		// var last = system.selection.getLast().item;
					//
					// 		// unconsecutive
					// 		if (!system.selection.isConsecutive()) {
					// 			currentItem.insertBefore(system.selection.getItems());
					// 			system.selection.reset();
					// 		}
					// 		// var prev = system.selection.getFirst().item.getPrevSibling();
					// 		// var next = system.selection.getLast().item.getNextSibling();
					//
					// 		// top
					// 		system.selection.moveTop();
					// 		// if (prev) {
					// 		// 	var box = prev.element.getBoundingClientRect();
					// 		// 	if (selectionRect.top < box.top+box.height/2) {
					// 		// 		prev.insertBefore(system.selection.getItems());
					// 		// 		prev = this.getPrevSibling();
					// 		// 		next = this.getNextSibling();
					// 		// 	}
					// 		// } else if (this.parent && this.parent !== root && this.parent.handle) {
					// 		// 	var box = this.parent.handle.getBoundingClientRect();
					// 		// 	if (selectionRect.top < box.top+box.height/2) {
					// 		// 		this.parent.parent.insertBefore(system.selection.getItems(), this.parent);
					// 		// 		prev = this.getPrevSibling();
					// 		// 		next = this.getNextSibling();
					// 		// 	}
					// 		// }
					//
					// 		// bottom
					// 		system.selection.moveBottom();
					// 		// if (last.getNext()) {
					// 		// 	var box = last.getNext().element.getBoundingClientRect();
					// 		// 	var handle = last.getNext().handle.getBoundingClientRect();
					// 		// 	var zone = last.getNext().zone.getBoundingClientRect();
					// 		// 	if (selectionRect.top+selectionRect.height > box.top+box.height/2) {
					// 		// 		last.getNext().parent.insertAfter(last.getNext());
					// 		// 	} else if (selectionRect.top+selectionRect.height > handle.top+handle.height/2 && selectionRect.left >= zone.left) {
					// 		// 		last.getNext().prepend(system.selection.getItems());
					// 		// 	}
					// 		// }
					//
					//
					// 		// left
					// 		system.selection.moveLeft();
					// 		// if (!last.getNextSibling() && this.parent && this.parent.parent) {
					// 		// 	var zone = this.parent.zone.getBoundingClientRect();
					// 		// 	if (selectionRect.left < zone.left) {
					// 		// 		this.parent.parent.append(system.selection.getItems());
					// 		// 	}
					// 		// }
					//
					// 		// right
					// 		system.selection.moveRight();
					// 		// if (first.getPrevSibling()) {
					// 		// 	var box = first.getPrevSibling().zone.getBoundingClientRect();
					// 		// 	if (selectionRect.left >= box.left) {
					// 		// 		first.getPrevSibling().prepend(system.selection.getItems());
					// 		// 	}
					// 		// }
					//
					//
					//
					// 	}
					//
					// },

					// resolve: function(item, box) {
					// 	return item.parent === this.parent && (this.parent.zone.items.indexOf(item) < this.parent.zone.items.indexOf(this) ? box.top+box.height > this.getBox().top+this.getBox().height/2 : box.top < this.getBox().top+this.getBox().height/2);
					//
					// 	// if (item.parent === this.parent) {
					// 	// 	var index = this.parent.zone.items.indexOf(this);
					// 	// 	var itemIndex = this.parent.zone.items.indexOf(item);
					// 	// 	if (itemIndex < index) {
					// 	// 		return box.top+box.height > this.getBox().top+this.getBox().height/2;
					// 	// 	} else {
					// 	// 		return box.top < this.getBox().top+this.getBox().height/2;
					// 	// 	}
					// 	// }
					// 	// if (item.parent === this.parent) {
					// 	// 	var index = ;
					// 	//
					// 	//
					// 	//
					// 	// 	if (this.parent.zone.items.indexOf(item) < this.parent.zone.items.indexOf(this)) {
					// 	// 		return box.top+box.height > this.getBox().top+this.getBox().height/2;
					// 	// 	} else {
					// 	// 		return box.top < this.getBox().top+this.getBox().height/2;
					// 	// 	}
					// 	// }
					// },
					// findSelected: function() {
					// 	return this.getRoot().getDescendants().find(function(item) {
					// 		return item.selected;
					// 	});
					// },
					// getSelection: function() {
					// 	var selection = {
					//
					// 	};
					// 	// selection.items = this.getRoot().getDescendants().filter(function(item) {
					// 	// 	return item.selected;
					// 	// });
					// 	// if (selection.items.length) {
					// 	// 	selection.rect = {
					// 	// 		top: selection.items[0].getBox().top,
					// 	// 		left: selection.items[0].getBox().left,
					// 	// 		width: selection.items[0].getBox().width,
					// 	// 		height: selection.getItemY()
					// 	// 	};
					// 	// }
					// 	return selection;
					// },
					mousedown: function(event) {

						if (item.isSelected()) {
							if (event.metaKey || event.controlKey) {
								system.mouseAction = "select";
								item.unselect();
							} else {
								system.mouseAction = "drag";
								system.selection.mouseDown(event, item);
								// var selection = system.selection;
								// // var clientX = event.clientX;
								// // var clientY = event.clientY;
								// var offsetX = event.clientX - item.element.getBoundingClientRect().left;
								// var offsetY = event.clientY + selection.getItemY(item) - item.element.getBoundingClientRect().top;
								//
								// // selection.left = event.clientX - offsetX;
								// // selection.top = event.clientY - offsetY;
								//
								//
								// //
								// //
								// // var dirX = 0;
								// // var dirY = 0;
								//
								// function dragMove(event) {
								// 	var zone = system.findZoneUnder(selection.getRect());
								//
								// 	selection.left = event.clientX - offsetX;
								// 	selection.top = event.clientY - offsetY;
								//
								// 	// selection.move(event.clientX - offsetX, event.clientY - offsetY, event.clientX - clientX, event.clientY - clientY);
								// 	// var deltaX = event.clientX - clientX;
								// 	// var deltaY = event.clientY - clientY;
								// 	//
								// 	// if (deltaX !== 0) {
								// 	// 	dirX = deltaX > 0 ? 1 : -1;
								// 	// }
								// 	// if (deltaY !== 0) {
								// 	// 	dirY = deltaY > 0 ? 1 : -1;
								// 	// }
								// 	// itemUnder = selection.findItemUnder(deltaX, deltaY);
								// 	// itemUnder = selection.findItemUnder(dirX, dirY);
								//
								// 	// item.move(zone);
								// 	selection.move(zone, item);
								//
								// 	// clientX = event.clientX;
								// 	// clientY = event.clientY;
								//
								// }
								// function dragComplete(event) {
								// 	selection.stop();
								// 	window.removeEventListener("mousemove", dragMove);
								// 	window.removeEventListener("mouseup", dragComplete);
								// }
								// window.addEventListener("mousemove", dragMove);
								// window.addEventListener("mouseup", dragComplete);
							}
						} else { // not selected
							system.mouseAction = "select";
							if (!event.metaKey && !event.controlKey) {
								system.selection.clear();
							}
							item.select();
						}
						var onMouseUp = function(event) {
							system.mouseAction = null;
							var onMouseDown = function() {
								if (!system.mouseAction) {
									system.selection.clear();
								}
								window.removeEventListener("mousedown", onMouseDown);
							};
							window.addEventListener("mousedown", onMouseDown);
							window.removeEventListener("mouseup", onMouseUp);
						}
						window.addEventListener("mouseup", onMouseUp);
					},
					mousemove: function() {
						if (system.mouseAction === "select") {
							if (item.isSelected()) {
								//item.unselect();
							} else {
								if (!item.getSelectedAncestor()) {
									item.select();
								}
							}
						}
					}
				};
				return item;
			}
		}
		return system;
	}


};
