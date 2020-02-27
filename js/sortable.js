var Selectable = {
	intersect: function(box1, box2) {
		return box1.left < box2.left+box2.width && box1.left+box1.width > box2.left && box1.top < box2.top+box2.height && box1.top+box1.height > box2.top;
	},
	create: function() {
		var selection = {
			items: [],
			update: function() {
				this.width = 0;
				this.height = 0;
				this.items = manager.items.filter(function(item) {
					return item.selected;
				});
				if (this.items.length) {
					this.top = this.items[0].getBox().top;
					this.left = this.items[0].getBox().left;
				}

				this.items.forEach(function(item) {
					item.selectionOffsetY = selection.height;
					selection.height += item.getBox().height;
					selection.width = Math.max(selection.width, item.getBox().width);
				});
			},
			getZone: function() {
				return this.items.length && this.items[this.items.length-1].zone;
			},
			add: function(item) {
				if (!item.selected && item.element) {
					item.selected = true;
					// item.selection = this;
					item.resetBox();
					if (item.onSelect) {
						 item.onSelect();
					}
					// this.zone = item.zone;
					this.update();
				}
			},
			remove: function(item) {
				if (item.selected) {
					item.selected = false;
					// item.selection = null;
					item.resetBox();
					if (item.onUnselect) {
						 item.onUnselect();
					}
					// this.zone = this.items.length && this.items[this.items.length-1].zone;
					this.update();
				}
			},
			reset: function() {
				this.items.forEach(function(item) {
					item.resetBox();
				});
			},
			// getItems: function() {
			// 	return manager.items.filter(function(item) {
			// 		return item.selected;
			// 	});
			// },
			clear: function() {
				this.items.forEach(function(item) {
					selection.remove(item);
				});
			}
		};
		var currentZone;
		var mouseDown;
		var dragging;
		var mouseOk;
		var mouseAction;

		var manager = {
			items: [],
			dragCallbacks: [],
			dragCompleteCallbacks: [],
			zones: [],
			getZone: function() {
				var zones = this.zones.filter(function(zone) {
					return selection.items.length && !selection.items.some(function(item) {
						return item.element.contains(zone.element);
					}) && Selectable.intersect(zone.element.getBoundingClientRect(), selection);
				});
				zones.sort(function(a, b) {
					// var diffA = Math.abs(selection.left - a.element.getBoundingClientRect().left);
					// var diffB = Math.abs(selection.left - b.element.getBoundingClientRect().left);
					var diffA = selection.left - a.element.getBoundingClientRect().left;
					var diffB = selection.left - b.element.getBoundingClientRect().left;
					while (diffA < 0) diffA += 100;
					while (diffB < 0) diffB += 100;
					if (diffA < diffB) return -1;
					else if (diffA > diffB) return 1;
					else return 0;
				});
				return zones[0];
			},
			addZone: function(sortable, expendable) {
				var zone = {
					element: null,
					children: [],
					items: [],
					addZone: function() {
						var subZone = manager.addZone();
						this.children.push(subZone);
						return subZone;
					},
					contains: function(subZone) {
						return children.some(function(zone) {
							return zone === subZone || zone.contains(subZone);
						});
					},
					getDescendants: function() {
						var descendants = this.items.slice();
						this.children.forEach(function(subZone) {
							descendants.concat(subZone.getDescendants());
						});
						return descendants;
					},
					addItem: function() {
						var item = manager.addItem();
						this.items.push(item);
						item.zone = this;
						return item;
					},
					removeItem: function(item) {
						this.items.splice(this.items.indexOf(item), 1);
					},
					getItems: function() {
						return manager.items.filter(function(item) {
							return item.zone === zone;
						});
					},
					insertBefore: function(item1, item2) {
						this.element.insertBefore(item1.element, item2.element);
						manager.items.splice(manager.items.indexOf(item2), 0, manager.items.splice(manager.items.indexOf(item1), 1)[0]);

						// this.items.splice(this.items.indexOf(item2), 0, this.items.splice(this.items.indexOf(item1), 1)[0]);
					},
					insertAfter: function(item1, item2) {
						if (item2.element.nextSibling) {
							this.element.insertBefore(item1.element, item2.element.nextSibling);
						} else {
							this.element.appendChild(item1.element);
						}
						manager.items.splice(manager.items.indexOf(item2), 0, manager.items.splice(manager.items.indexOf(item1), 1)[0]);

						// this.items.splice(this.items.indexOf(item2), 0, this.items.splice(this.items.indexOf(item1), 1)[0]);
					},
					drag: function() {


						if (currentZone && currentZone !== zone && currentZone.onDeactivate) {
							currentZone.onDeactivate();
						}
						if (currentZone !== zone) {
							currentZone = zone;
							if (zone.onActivate) {
								zone.onActivate();
							}
						}

						selection.items.forEach(function(item) {
							if (item.zone !== zone) {
								item.zone = zone;
								zone.element.appendChild(item.element);
								item.resetBox();
							}

							// if (item.zone !== zone) {
							// 	item.zone.removeItem(item);
							// 	zone.addItem(item);
							// 	zone.element.appendChild(item.element);
							// 	item.resetBox();
							// }
						});



						var prev = this.getItems().find(function(item, index, items) {
							return !item.selected && selection.items.some(function(selectedItem) {
								return item.getBox().top < selectedItem.getBox().top && selection.top < item.getBox().top + item.getBox().height/2;
							});
							//return !item.selected && index < items.length-1 && items[index+1].selected && selection.top < item.getBox().top + item.getBox().height/2;
						});
						var next = this.getItems().find(function(item, index, items) {
							return !item.selected && selection.items.some(function(selectedItem) {
								return item.getBox().top > selectedItem.getBox().top && selection.top+selection.height > item.getBox().top + item.getBox().height/2;
							});
							// return !item.selected && index > 0 && items[index-1].selected && selection.top+selection.height > item.getBox().top + item.getBox().height/2;
						});


						if (prev) {
							this.insertAfter(prev, selection.items[selection.items.length-1]);
							selection.reset();
							prev.resetBox();
						} else if (next) {
							this.insertBefore(next, selection.items[0]);
							selection.reset();
							next.resetBox();
						}
					},
					dragComplete: function() {
						this.getItems().forEach(function(item, index) {
							if (item.index !== index || item.parentId !== zone.id) {
								item.index = index;
								item.parentId = zone.id;
								if (item.onChange) {
									item.onChange();
								}
							}
							// if (item.index !== index) {
							// 	item.index = index;
							// 	if (item.onReorder) {
							// 		item.onReorder();
							// 	}
							// }
							// if (item.parentId !== zone.id) {
							// 	item.parentId = zone.id;
							// 	if (item.onParent) {
							// 		item.onParent();
							// 	}
							// }
						});
						if (currentZone && currentZone.onDeactivate) {
							currentZone.onDeactivate();
							currentZone = null;
						}
					}
				};
				this.zones.push(zone);
				return zone;
			},


			addItem: function() {
				var box;
				var item = {
					zone: null,
					element: null,
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
					// select: function() {
					// 	if (!this.selected) {
					// 		this.selected = true;
					// 		this.onUpdate && this.onUpdate();
					// 	}
					// },
					// unselect: function() {
					// 	if (this.selected) {
					// 		this.selected = false;
					// 		this.selection = null;
					// 		this.onUpdate && this.onUpdate();
					// 	}
					// },
					startDrag: function(event) {
						mouseAction = "drag";
						// item.selection.top = ;

						// manager.init();
						// var group = {
						// 	selection: manager.getSelection(),
						// 	top: item.box.top - item.selectionOffsetY,
						// 	left: item.box.left,
						// 	width: item.box.width,
						// 	height: manager.selectionHeight
						// };
						var offsetX = event.clientX - selection.left;
						var offsetY = event.clientY + item.selectionOffsetY - item.getBox().top;

						function dragMove(event) {
							selection.top = event.clientY - offsetY;
							selection.left = event.clientX - offsetX;
							var zone = manager.getZone();


							if (zone) {
								zone.drag();
							}
							// manager.dragCallbacks.forEach(function(callback) {
							// 	callback(selection, item, zone);
							// });
							selection.items.forEach(function(item) {
								var tx = selection.left - item.getBox().left;
								var ty = selection.top + item.selectionOffsetY - item.getBox().top;
								item.element.style.transform = "translate("+tx+"px, "+ty+"px)";
							});
						}
						function dragComplete(event) {
							var zone = manager.getZone();
							if (zone) {
								zone.dragComplete();
							}
							manager.items.forEach(function(item, index) {
								item.element.style.transform = "none";
							});
							mouseAction = null;
							window.removeEventListener("mousemove", dragMove);
							window.removeEventListener("mouseup", dragComplete);
						}
						window.addEventListener("mousemove", dragMove, {passive: true});
						window.addEventListener("mouseup", dragComplete, {passive: true});
					},
					mousedown: function(event) {
						if (item.selected) {
							if (event.metaKey || event.controlKey) {
								selection.remove(item);
								mouseAction = "select";
							} else {
								item.startDrag(event);
							}
						} else {
							if (!event.metaKey && !event.controlKey) {
								selection.clear();
							}
							selection.add(item);

							mouseAction = "select";
						}

						var onMouseUp = function(event) {
							mouseAction = null;
							var onMouseDown = function() {
								if (!mouseAction) {
									selection.clear();
								}
								window.removeEventListener("mousedown", onMouseDown);
							};
							window.addEventListener("mousedown", onMouseDown, {passive: true});
							window.removeEventListener("mouseup", onMouseUp);
						}
						window.addEventListener("mouseup", onMouseUp, {passive: true});
					},
					mousemove: function() {
						if (mouseAction === "select") {
							if ((event.metaKey || event.controlKey) && item.selected) {
								selection.remove(item);
							} else if (selection.items.length === 0 || selection.getZone() === item.zone) {
								selection.add(item);
							}
						}
					}
				};
				this.items.push(item);
				// this.element.addEventListener("mousedown", function(event) {
				// 	// event.stopPropagation();
				//
				// });
				// element.addEventListener("mousemove", function(event) {
				//
				// });
				// element.addEventListener("mouseup", function(event) {
				// 	// if (zone.mouseDown) {
				// 	// 	zone.mouseDown = false;
				// 	// 	// event.stopPropagation();
				// 	// }
				// })
				return item;
			}
		};

		return manager;
	}
};
