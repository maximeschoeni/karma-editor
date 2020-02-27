
var Selection = {
	intersect: function(box1, box2) {
		return box1.left < box2.left+box2.width && box1.left+box1.width > box2.left && box1.top < box2.top+box2.height && box1.top+box1.height > box2.top;
	},
	createItem: function() {
		var box;
		var item = {
			element: null,
			zone: {
				element: null,
				items: [],
				insertBefore: function(item1, item2) {
					this.element.insertBefore(item1.element, item2.element);
					this.items.splice(this.items.indexOf(item2), 0, this.items.splice(this.items.indexOf(item1), 1)[0]);
				},
				insertAfter: function(item1, item2) {
					if (item2.element.nextSibling) {
						this.element.insertBefore(item1.element, item2.element.nextSibling);
					} else {
						this.element.appendChild(item1.element);
					}
					this.items.splice(this.items.indexOf(item2), 0, this.items.splice(this.items.indexOf(item1), 1)[0]);
				}
			},
			getBox: function() {
				if (!box) {
					this.element.style.transform = "none";
					box = this.element.getBoundingClientRect();
				}
				return box;
			},
			resetBox: function() {
				box = null;
			},
			getDescendants: function() {
				var descendants = [this];
				this.zone.items.forEach(function(subItem) {
					descendants = descendants.concat(subItem.getDescendants());
				});
				return descendants;
			},
			findDescendants: function(filter) {
				// if (!filter || filter(this)) {
				// 	var descendants = [this];
				// 	this.zone.items.forEach(function(subItem) {
				// 		descendants = descendants.concat(subItem.getDescendants());
				// 	});
				// 	return descendants;
				// }
				// return [];
				var descendants = [this];
				this.zone.items.filter(filter).forEach(function(subItem) {
					descendants = descendants.concat(subItem.getDescendants());
				});
				return descendants;
			},
			getRoot: function() {
				if (this.parent) {
					return this.parent.getRoot();
				}
				return this;
			},
			contains: function(child) {
				return this.zone.items.some(function(item) {
					return item === child || item.contains(child);
				});
			},
			addChild: function() {
				var child = Selection.createItem();
				child.parent = this;
				this.zone.items.push(child);
				return child;
			},
			remove: function(item) {
				this.zone.items.splice(this.zone.items.indexOf(item), 1);
			},
			select: function() {
				if (!this.selected) {
					this.selected = true;
					this.resetBox();
					if (this.onSelect) {
						 this.onSelect();
					}
				}
			},
			unselect: function(item) {
				if (this.selected) {
					this.selected = false;
					this.resetBox();
					if (this.onUnselect) {
						 this.onUnselect();
					}
				}
			},
			findSelected: function() {
				return this.getRoot().getDescendants().find(function(item) {
					return item.selected;
				});
			},
			getSelection: function() {
				var selection = {
					items: [],
					rect: {
						top: 0,
						left: 0,
						width: 0,
						height: 0
					},
					getItemY: function(item) {
						var y = 0;
						for (var i = 0; i < this.items.length; i++) {
							if (item === this.items[i]) {
								return y;
							}
							y += this.items[i].getBox().height;
						}
						return y;
					},
					reset: function() {
						this.items.forEach(function(item) {
							item.resetBox();
						});
					},
					clear: function() {
						this.items.forEach(function(item) {
							item.unselect();
						});
					},
					findItemUnder: function() {


						var items = item.getRoot().findDescendants(function(item) {
							return !item.selected;
						});

						var choosen = items.shift();

						for (var i = 0; i < items.length; i++) {
							var zoneBox = items[i].zone.element.getBoundingClientRect();
							// var zoneBox = items[i].element && items[i].getBox() && items[i].zone.element.getBoundingClientRect();
							if (zoneBox && selection.rect.top+selection.rect.height > zoneBox.top && selection.rect.left > zoneBox.left) {
								choosen = items[i];
							}
						}
						// console.log(choosen);
						return choosen;

						// if (this.items.length) {
						//
						//
						// 	var items = this.items[0].getRoot().getDescendants().filter(function(item) {
						//
						// 		return item.zone.element && !selection.items.some(function(selectedItem) {
						// 			return selectedItem.contains(item);
						// 		}) && Selection.intersect(item.zone.element.getBoundingClientRect(), selection.rect);
						// 	});
						//
						// 	console.log(items);
						//
						// 	items.sort(function(a, b) {
						// 		// var diffA = Math.abs(selection.left - a.element.getBoundingClientRect().left);
						// 		// var diffB = Math.abs(selection.left - b.element.getBoundingClientRect().left);
						// 		var diffA = selection.rect.left - a.zone.element.getBoundingClientRect().left;
						// 		var diffB = selection.rect.left - b.zone.element.getBoundingClientRect().left;
						// 		if (diffA < 0) diffA = 100 - diffA;
						// 		if (diffB < 0) diffB = 100 - diffB;
						// 		if (diffA < diffB) return -1;
						// 		else if (diffA > diffB) return 1;
						// 		else return 0;
						// 	});
						// 	return items[0];
						// }
					},
					move: function(left, top) {
						this.rect.top = top;
						this.rect.left = left;
						var itemUnder = this.findItemUnder();
						if (itemUnder) {
							if (Selection.currentItem && Selection.currentItem !== itemUnder && Selection.currentItem.onDeactivate) {
								Selection.currentItem.onDeactivate();
							}
							if (Selection.currentItem !== itemUnder) {
								Selection.currentItem = itemUnder;
								if (itemUnder.onActivate) {
									itemUnder.onActivate();
								}
							}
							this.items.forEach(function(selectedItem) {
								if (selectedItem.parent !== itemUnder) {
									selectedItem.parent.remove(selectedItem);
									selectedItem.parent = itemUnder;
									itemUnder.zone.items.push(selectedItem);
									itemUnder.zone.element.appendChild(selectedItem.element);
									selectedItem.resetBox();
								}
							});
							var prev = itemUnder.zone.items.find(function(item, index, items) {
								return !item.selected && selection.items.some(function(selectedItem) {
									return item.getBox().top < selectedItem.getBox().top && selection.rect.top < item.getBox().top + item.getBox().height/2;
								});
							});
							var next = !prev && itemUnder.zone.items.find(function(item, index, items) {
								return !item.selected && selection.items.some(function(selectedItem) {
									return item.getBox().top+item.getBox().height > selectedItem.getBox().top+selectedItem.getBox().height && selection.rect.top + selection.rect.height > item.getBox().top + item.getBox().height/2;
								});
							});
							if (prev) {
								itemUnder.zone.insertAfter(prev, selection.items[selection.items.length-1]);
								selection.reset();
								prev.resetBox();
							} else if (next) {
								itemUnder.zone.insertBefore(next, selection.items[0]);
								selection.reset();
								next.resetBox();
							}
						}
						this.items.forEach(function(item) {
							var tx = selection.rect.left - item.getBox().left;
							var ty = selection.rect.top + selection.getItemY(item) - item.getBox().top;
							item.element.style.transform = "translate("+tx+"px, "+ty+"px)";
						});
					},
					stop: function() {
						var item = this.findItemUnder();
						if (item) {
							item.zone.items.forEach(function(childItem, index) {
								if (childItem.index !== index || childItem.parentId !== item.id) {
									childItem.index = index;
									childItem.parentId = item.id;
									if (childItem.onChange) {
										childItem.onChange();
									}
								}
							});
						}
						this.items.forEach(function(item) {
							item.element.style.transform = "none";
						});
						if (Selection.currentItem && Selection.currentItem.onDeactivate) {
							Selection.currentItem.onDeactivate();
							Selection.currentItem = null;
						}
					}
				};
				selection.items = this.getRoot().getDescendants().filter(function(item) {
					return item.selected;
				});
				if (selection.items.length) {
					selection.rect = {
						top: selection.items[0].getBox().top,
						left: selection.items[0].getBox().left,
						width: selection.items[0].getBox().width,
						height: selection.getItemY()
					};
				}
				return selection;
			},
			mousedown: function(event) {
				if (item.selected) {
					if (event.metaKey || event.controlKey) {
						Selection.mouseAction = "select";
						item.unselect();
					} else {
						Selection.mouseAction = "drag";
						var selection = item.getSelection();
						var offsetX = event.clientX - selection.rect.left;
						var offsetY = event.clientY + selection.getItemY(item) - item.getBox().top;
						function dragMove(event) {
							selection.move(event.clientX - offsetX, event.clientY - offsetY);
						}
						function dragComplete(event) {
							selection.stop();
							window.removeEventListener("mousemove", dragMove);
							window.removeEventListener("mouseup", dragComplete);
						}
						window.addEventListener("mousemove", dragMove);
						window.addEventListener("mouseup", dragComplete);
					}
				} else {
					Selection.mouseAction = "select";
					if (!event.metaKey && !event.controlKey) {
						item.getSelection().clear();
					}
					item.select();
				}
				var onMouseUp = function(event) {
					Selection.mouseAction = null;
					var onMouseDown = function() {
						if (!Selection.mouseAction) {
							item.getSelection().clear();
						}
						window.removeEventListener("mousedown", onMouseDown);
					};
					window.addEventListener("mousedown", onMouseDown);
					window.removeEventListener("mouseup", onMouseUp);
				}
				window.addEventListener("mouseup", onMouseUp);
			},
			mousemove: function() {
				if (Selection.mouseAction === "select") {
					if ((event.metaKey || event.controlKey) && item.selected) {
						item.unselect();
					} else {
						var selectedItem = item.findSelected();
						if (!selectedItem || selectedItem.parent === item.parent) {
							item.select();
						}
					}
				}
			}
		};
		return item;
	}
};
