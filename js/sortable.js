var Selectable = {
	create: function() {
		var manager = {
			items: [],
			dragCallbacks: [],
			dragCompleteCallbacks: [],
			addItem: function(element) {
				var item = {
					element: element,
					select: function() {
						if (!this.selected) {
							this.selected = true;
							this.onUpdate && this.onUpdate();
						}
					},
					unselect: function() {
						if (this.selected) {
							this.selected = false;
							this.onUpdate && this.onUpdate();
						}
					},
					startDrag: function(event) {
						manager.init();
						var group = {
							selection: manager.getSelection(),
							top: item.box.top - item.selectionOffsetY,
							left: item.box.left,
							width: item.box.width,
							height: manager.selectionHeight
						};
						var offsetX = event.clientX - group.left;
						var offsetY = event.clientY - group.top;

						function dragMove(event) {
							group.top = event.clientY - offsetY;
							group.left = event.clientX - offsetX;
							manager.dragCallbacks.forEach(function(callback) {
								callback(group, item);
							});
							group.selection.forEach(function(item) {
								var tx = group.left - item.box.left;
								var ty = group.top + item.selectionOffsetY - item.box.top;
								item.element.style.transform = "translate("+tx+"px, "+ty+"px)";
							});
						}
						function dragComplete(event) {
							manager.dragCompleteCallbacks.forEach(function(callback) {
								callback(group, item);
							});
							manager.items.forEach(function(item, index) {
								item.element.style.transform = "translate(0px, 0px)";
							});
							window.removeEventListener("mousemove", dragMove);
							window.removeEventListener("mouseup", dragComplete);
						}
						window.addEventListener("mousemove", dragMove);
						window.addEventListener("mouseup", dragComplete);
					}
				};
				this.items.push(item);
				element.onmousedown = function(event) {
					event.preventDefault();
					event.stopPropagation();
					if (event.shiftKey) {
						//
					} else if (item.selected) {
						if (event.metaKey || event.controlKey) {
							item.unselect();
						} else { // if (manager.canDrag)
							item.startDrag(event);
						}
					} else {
						if (!event.metaKey && !event.controlKey) {
							manager.clearSelection();
						}
						item.select();
						manager.mouseDown = true;
						var onMouseUp = function(event) {
							manager.mouseDown = false;
							manager.clearSelection();
							window.removeEventListener("mouseup", onMouseUp);
						}
						window.addEventListener("mouseup", onMouseUp);
					}
				};
				element.onmousemove = function(event) {
					if (manager.mouseDown) {
						if ((event.metaKey || event.controlKey) && item.selected) {
							item.unselect();
						} else {
							item.select();
						}
					}
				};
				element.onmouseup = function(event) {
					if (manager.mouseDown) {
						manager.mouseDown = false;
						event.stopPropagation();
					}
				}
				return item;
			},
			init: function() {
				var y = 0;
				for (var i = 0; i < this.items.length; i++) {
					var item = this.items[i];
					item.element.style.transform = "none";
					item.box = item.element.getBoundingClientRect();
					if (item.selected) {
						item.selectionOffsetY = y;
						y += item.box.height;
					}
				}
				this.selectionHeight = y;
			},
			clearSelection: function() {
				this.items.forEach(function(item) {
					item.unselect();
				});
			},
			getSelection: function() {
				return this.items.filter(function(item) {
					return item.selected;
				});
			}
		};
		return manager;
	}
};



var Sortable = {
	create: function(selectionManager, element) {
		// var selectionManager = Selectable.create();
		var active = false;
		var manager = {
			element: element,
			insertBefore: function(item1, item2) {
				manager.element.insertBefore(item1.element, item2.element);
				selectionManager.items.splice(selectionManager.items.indexOf(item2), 0, selectionManager.items.splice(selectionManager.items.indexOf(item1), 1)[0]);
			},
			insertAfter: function(item1, item2) {
				if (item2.element.nextSibling) {
					manager.element.insertBefore(item1.element, item2.element.nextSibling);
				} else {
					manager.element.appendChild(item1.element);
				}
				selectionManager.items.splice(selectionManager.items.indexOf(item2), 0, selectionManager.items.splice(selectionManager.items.indexOf(item1), 1)[0]);
			}
		};
		selectionManager.dragCallbacks.push(function(group, item) {
			// if (group inside element)
			var box = manager.element.getBoundingClientRect();
			var groupX = group.left+group.width/2;
			var groupY = group.top+group.height/2;
			var isInside = manager.element.contains(item.element) || groupX >= box.left && groupY < box.right && groupY >= box.top && groupY < box.bottom;

			if (isInside && !active) {
				active = true;
				manager.onActivate && manager.onActivate();
				// element.classList.add("active");
			} else if (!isInside && active) {
				active = false;
				manager.onDeactivate && manager.onDeactivate();
			}

			var prev = selectionManager.items.find(function(item, index, items) {
				return !item.selected && index < items.length-1 && items[index+1].selected && group.top < item.box.top + item.box.height/2;
			});
			var next = selectionManager.items.find(function(item, index, items) {
				return !item.selected && index > 0 && items[index-1].selected && group.top+group.height > item.box.top + item.box.height/2;
			});

			if (prev) {
				manager.insertAfter(prev, group.selection[group.selection.length-1]);
				selectionManager.init();
			} else if (next) {
				manager.insertBefore(next, group.selection[0]);
				selectionManager.init();
			}
		});
		selectionManager.dragCompleteCallbacks.push(function(group, item) {
			selectionManager.items.forEach(function(item, index) {
				if (item.index !== index && item.onReorder) {
					item.onReorder(index);
				}
				item.index = index;
			});

			if (active) {
				active = false;
				manager.onDeactivate && manager.onDeactivate();
			}
			// group.selection.forEach(function(item) {
			// 	item.select();
			// });
		});
		return manager;
	}
};


// var Sortable = {
// 	register: function(element) {
// 		var manager = {
// 			element: element,
// 			items: [],
// 			reIndex: function() {
// 				this.items.forEach(function(item, index) {
// 					item.index = index;
// 				});
// 			},
// 			resetBox: function() {
// 				this.items.forEach(function(item, index) {
// 					item.element.style.transform = "none";
// 					item.box = item.element.getBoundingClientRect();
// 				});
// 			},
// 			getSelectionHeight: function(item) {
// 				var y = 0;
// 				for (var i = 0; i < manager.items.length; i++) {
// 					if (manager.items[i] === item) {
// 						break;
// 					} else if (manager.items[i].selected) {
// 						y += manager.items[i].box.height;
// 					}
// 				}
// 				return y;
// 			},
// 	    clearSelection: function() {
// 	      this.items.forEach(function(item) {
// 					item.unselect();
// 				});
// 	    },
// 	    getSelection: function() {
// 	      return this.items.filter(function(item) {
// 	        return item.selected;
// 	      });
// 	    },
// 			register: function(element) {
// 				var item = {
// 					index: this.items.length,
// 					element: element,
// 					select: function() {
// 			      if (!this.selected) {
// 							this.selected = true;
// 			        this.onUpdate && this.onUpdate();
// 			      }
// 			    },
// 					unselect: function() {
// 						if (this.selected) {
// 							this.selected = false;
// 			        this.onUpdate && this.onUpdate();
// 			      }
// 			    },
// 					insertBefore: function(item) {
// 						manager.element.insertBefore(this.element, item.element);
// 						manager.items.splice(manager.items.indexOf(item), 0, manager.items.splice(manager.items.indexOf(this), 1)[0]);
// 					},
// 					insertAfter: function(item) {
// 						if (item.element.nextSibling) {
// 							manager.element.insertBefore(this.element, item.element.nextSibling);
// 						} else {
// 							manager.element.appendChild(this.element);
// 						}
// 						manager.items.splice(manager.items.indexOf(item), 0, manager.items.splice(manager.items.indexOf(this), 1)[0]);
// 					},
// 					startDrag: function(event) {
// 						manager.reIndex();
// 						manager.resetBox();
// 						var selection = manager.getSelection();
// 						var group = {};
// 						// var groupOffsetX = event.clientX - selection[0].box.left;
// 						// var groupOffsetY = event.clientY - item.box.top + manager.getSelectionHeight(item);
// 						//var groupHeight = manager.getSelectionHeight();
//
// 						group.top = item.box.top - manager.getSelectionHeight(item);
// 						group.left = item.box.left;
// 						group.width = item.box.width;
// 						group.height = manager.getSelectionHeight();
//
// 						var offsetX = event.clientX - group.left;
// 						var offsetY = event.clientY - group.top;
//
// 						function dragMove(event) {
// 							// var groupX = event.clientX - offsetX;
// 							// var groupY = event.clientY - offsetY;
// 							group.top = event.clientY - offsetY;
// 							group.left = event.clientX - offsetX;
//
// 							var prev = manager.items.find(function(item, index, items) {
// 								return !item.selected && index < items.length-1 && items[index+1].selected && group.top < item.box.top + item.box.height/2;
// 							});
// 							var next = manager.items.find(function(item, index, items) {
// 								return !item.selected && index > 0 && items[index-1].selected && group.top+group.height > item.box.top + item.box.height/2;
// 							});
// 							if (prev) {
// 								prev.insertAfter(selection[selection.length-1]);
// 								manager.resetBox();
// 							} else if (next) {
// 								next.insertBefore(selection[0]);
// 								manager.resetBox();
// 							}
// 							selection.forEach(function(item) {
// 								var tx = group.left - item.box.left;
// 								var ty = group.top + manager.getSelectionHeight(item) - item.box.top;
// 								item.element.style.transform = "translate("+tx+"px, "+ty+"px)";
// 							});
// 							manager.onMove && manager.onMove(selection, group);
// 						}
// 						function dragComplete(event) {
// 							manager.items.forEach(function(item, index) {
// 								// console.log("dragComplete", item.post.post_name, item.index, index);
// 								if (item.index !== index && item.onReorder) {
// 									item.onReorder(index);
// 								}
// 								item.index = index;
// 								item.element.style.transform = "none";
// 							});
// 							manager.dragging = false;
// 							window.removeEventListener("mousemove", dragMove);
// 							window.removeEventListener("mouseup", dragComplete);
// 						}
// 						window.addEventListener("mousemove", dragMove);
// 						window.addEventListener("mouseup", dragComplete);
// 					}
// 				};
// 				this.items.push(item);
//
// 				element.onmousedown = function(event) {
// 					if (event.shiftKey) {
// 						item.select();
// 						manager.mouseDown = true;
// 					} else if (event.metaKey) {
// 						item.selected ? item.unselect() : item.select();
// 						manager.mouseDown = true;
// 					} else if (item.selected) {
// 						item.startDrag(event);
// 						manager.dragging = true;
// 					} else {
//
// 						manager.clearSelection();
// 						item.select();
// 						manager.mouseDown = true;
// 						var onMouseUp = function() {
// 							if (!manager.dragging) {
// 								manager.clearSelection();
// 								window.removeEventListener("mouseup", onMouseUp);
// 							}
// 						}
// 						window.addEventListener("mouseup", onMouseUp);
// 					}
// 				};
// 				element.onmousemove = function(event) {
// 					if (manager.mouseDown) {
// 						item.select();
// 					}
// 				};
// 				element.onmouseup = function(event) {
// 					if (manager.mouseDown) {
// 						event.stopPropagation();
// 						manager.mouseDown = false;
// 						item.select();
// 					}
// 				};
// 				return item;
// 			}
// 		};
// 		return manager;
// 	}
// };
