var Sortable = {
	register: function(element) {
		var manager = {
			element: element,
			items: [],
			reIndex: function() {
				this.items.forEach(function(item, index) {
					item.index = index;
				});
			},
			resetBox: function() {
				this.items.forEach(function(item, index) {
					item.element.style.transform = "none";
					item.box = item.element.getBoundingClientRect();
				});
			},
			getSelectionHeight: function(item) {
				var y = 0;
				for (var i = 0; i < manager.items.length; i++) {
					if (manager.items[i] === item) {
						break;
					} else if (manager.items[i].selected) {
						y += manager.items[i].box.height;
					}
				}
				return y;
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
	    },
			register: function(element) {
				var item = {
					index: this.items.length,
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
					insertBefore: function(item) {
						manager.element.insertBefore(this.element, item.element);
						manager.items.splice(manager.items.indexOf(item), 0, manager.items.splice(manager.items.indexOf(this), 1)[0]);
					},
					insertAfter: function(item) {
						if (item.element.nextSibling) {
							manager.element.insertBefore(this.element, item.element.nextSibling);
						} else {
							manager.element.appendChild(this.element);
						}
						manager.items.splice(manager.items.indexOf(item), 0, manager.items.splice(manager.items.indexOf(this), 1)[0]);
					},
					startDrag: function(event) {
						manager.reIndex();
						manager.resetBox();
						var selection = manager.getSelection();
						var group = {};
						// var groupOffsetX = event.clientX - selection[0].box.left;
						// var groupOffsetY = event.clientY - item.box.top + manager.getSelectionHeight(item);
						//var groupHeight = manager.getSelectionHeight();

						group.top = item.box.top - manager.getSelectionHeight(item);
						group.left = item.box.left;
						group.width = item.box.width;
						group.height = manager.getSelectionHeight();

						var offsetX = event.clientX - group.left;
						var offsetY = event.clientY - group.top;

						function dragMove(event) {
							// var groupX = event.clientX - offsetX;
							// var groupY = event.clientY - offsetY;
							group.top = event.clientY - offsetY;
							group.left = event.clientX - offsetX;

							var prev = manager.items.find(function(item, index, items) {
								return !item.selected && index < items.length-1 && items[index+1].selected && group.top < item.box.top + item.box.height/2;
							});
							var next = manager.items.find(function(item, index, items) {
								return !item.selected && index > 0 && items[index-1].selected && group.top+group.height > item.box.top + item.box.height/2;
							});
							if (prev) {
								prev.insertAfter(selection[selection.length-1]);
								manager.resetBox();
							} else if (next) {
								next.insertBefore(selection[0]);
								manager.resetBox();
							}
							selection.forEach(function(item) {
								var tx = group.left - item.box.left;
								var ty = group.top + manager.getSelectionHeight(item) - item.box.top;
								item.element.style.transform = "translate("+tx+"px, "+ty+"px)";
							});
							manager.onMove && manager.onMove(selection, group);
						}
						function dragComplete(event) {
							manager.items.forEach(function(item, index) {
								// console.log("dragComplete", item.post.post_name, item.index, index);
								if (item.index !== index && item.onReorder) {
									item.onReorder(index);
								}
								item.index = index;
								item.element.style.transform = "none";
							});
							manager.dragging = false;
							window.removeEventListener("mousemove", dragMove);
							window.removeEventListener("mouseup", dragComplete);
						}
						window.addEventListener("mousemove", dragMove);
						window.addEventListener("mouseup", dragComplete);
					}
				};
				this.items.push(item);

				element.onmousedown = function(event) {
					if (event.shiftKey) {
						item.select();
						manager.mouseDown = true;
					} else if (event.metaKey) {
						item.selected ? item.unselect() : item.select();
						manager.mouseDown = true;
					} else if (item.selected) {
						item.startDrag(event);
						manager.dragging = true;
					} else {
						
						manager.clearSelection();
						item.select();
						manager.mouseDown = true;
						var onMouseUp = function() {
							if (!manager.dragging) {
								manager.clearSelection();
								window.removeEventListener("mouseup", onMouseUp);
							}
						}
						window.addEventListener("mouseup", onMouseUp);
					}
				};
				element.onmousemove = function(event) {
					if (manager.mouseDown) {
						item.select();
					}
				};
				element.onmouseup = function(event) {
					if (manager.mouseDown) {
						event.stopPropagation();
						manager.mouseDown = false;
						item.select();
					}
				};
				return item;
			}
		};
		return manager;
	}
};



// var Sortable = {
// 	register: function(element) {
// 		var manager = {
// 			element: element,
// 			items: [],
// 			selection: {
// 				getFirst: function() {
// 					for (var i = 0; i < manager.items.length; i++) {
// 						if (manager.items[i].selected) {
// 							return manager.items[i];
// 						}
// 					}
// 				},
// 				getLast: function() {
// 					for (var i = 0; i < manager.items.length; i++) {
// 						if (manager.items[manager.items.length-i-1].selected) {
// 							return manager.items[manager.items.length-i-1];
// 						}
// 					}
// 				},
// 				getOffsetY: function(item) {
// 					var y = 0;
// 					for (var i = 0; i < manager.items.length; i++) {
// 						if (manager.items[i] === item) {
// 							break;
// 						} else if (manager.items[i].selected && manager.items[i].box) {
// 							y += manager.items[i].box.height;
// 						}
// 					}
// 					return y;
// 				},
// 				getAll: function() {
// 		      return manager.items.filter(function(item) {
// 		        return item.selected;
// 		      });
// 		    }
//
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
// 							this.resetBox();
//
//
//
// 			        this.onUpdate && this.onUpdate();
// 			      }
// 			    },
// 					unselect: function() {
// 						if (this.selected) {
// 							this.selected = false;
// 			        this.onUpdate && this.onUpdate();
// 			      }
// 			    },
// 					resetBox: function() {
// 						this.element.style.transform = "none";
// 						this.box = this.element.getBoundingClientRect();
// 					},
// 					// getGroupOffsetY: function(selection) {
// 					// 	var y = 0;
// 					// 	for (var i = 0; i < selection.length; i++) {
// 					// 		if (selection[i] === item) {
// 					// 			break;
// 					// 		} else {
// 					// 			y += selection[i].clientHeight;
// 					// 		}
// 					// 	}
// 					// 	return y;
// 					// },
// 					swap: function(item) {
//
// 					},
// 					startDrag: function(event) {
//
// 						var selection = manager.getSelection();
//
// 						// var group = {};
// 						// group.box = {};
// 						// group.box.top = Number.MAX_VALUE;
// 						// group.box.left = Number.MAX_VALUE;
// 						// group.box.right = 0;
// 						// group.box.bottom = 0;
// 						// group.box.width = 0;
// 						// group.box.height = 0;
// 						// manager.getSelection().forEach(function(item) {
// 						// 	item.resetBox();
// 						// 	group.box.top = Math.min(group.box.top, item.box.top);
// 						// 	group.box.left = Math.min(group.box.left, item.box.left);
// 						// 	group.box.right = Math.max(group.box.right, item.box.right);
// 						// 	group.box.bottom = Math.max(group.box.bottom, item.box.bottom);
// 						// 	group.box.width = group.box.right - group.box.left;
// 						// 	group.box.height = group.box.bottom - group.box.top;
// 						// 	item.x = item.box.left - group.box.left;
// 						// 	item.y = item.box.bottom - group.box.bottom;
// 						// });
//
//
// 						var groupOffsetX = event.clientX - selection[0].box.left;
// 						var groupOffsetY = event.clientY - selection[0].box.top;
// 						var groupHeight = manager.selection.getOffsetY();
//
//
// 						var itemOffsetX = event.clientX - item.box.left;
// 						var itemOffsetY = event.clientY - item.box.top;
//
// 						// var groupX = 0;
// 						// var groupY = this.getGroupOffsetY(selection);
// 						function dragMove(event) {
//
//
// 							// var prev = index > 0 && manager.items[index-1];
// 							// var next = index < manager.items.length-1 && manager.items[index+1];
// 							var itemX = event.clientX - itemOffsetX;
// 							var itemY = event.clientY - itemOffsetY;
//
// 							var groupX = event.clientX - groupOffsetX;
// 							var groupY = event.clientY - groupOffsetY;
//
// 							var prevNeighbour = manager.items.find(function(item, index, items) {
// 								var neighbourBox = item.element.getBoundingClientRect();
// 								return !item.selected && index < items.length-1 && items[index+1].selected && groupY < neighbourBox.top + neighbourBox.height/2;
// 							});
// 							var nextNeighbour = manager.items.find(function(item, index, items) {
// 								var neighbourBox = item.element.getBoundingClientRect();
// 								return !item.selected && index > 0 && items[index-1].selected && groupY+groupHeight > neighbourBox.top + neighbourBox.height/2;
// 							});
//
// 							if (prevNeighbour) {
// 								if (selection[selection.length-1].element.nextSibling) {
// 									manager.element.insertBefore(prevNeighbour.element, selection[selection.length-1].element.nextSibling);
// 								} else {
// 									manager.element.appendChild(prevNeighbour.element);
// 								}
//
// 								var firstIndex = manager.items.indexOf(selection[0]);
// 								selection.forEach(function(item, i) {
// 									item.newIndex = firstIndex + i - 1;
// 									item.resetBox();
// 								});
// 								prevNeighbour.newIndex = manager.items.indexOf(selection[selection.length-1]);
// 								selection.forEach(function(item) {
// 									manager.items[item.newIndex] = item;
// 								});
// 								manager.items[prevNeighbour.newIndex] = prevNeighbour;
// 							}
// 							if (nextNeighbour) {
// 								manager.element.insertBefore(nextNeighbour.element, selection[0].element);
//
// 								var firstIndex = manager.items.indexOf(selection[0]);
// 								selection.forEach(function(item, i) {
// 									item.newIndex = firstIndex + i + 1;
// 									item.resetBox();
// 								});
// 								nextNeighbour.newIndex = manager.items.indexOf(selection[0]);
// 								selection.forEach(function(item) {
// 									manager.items[item.newIndex] = item;
// 								});
// 								manager.items[nextNeighbour.newIndex] = nextNeighbour;
// 							}
//
//
//
//
// 							// if (prev && y < item.box.top) {
// 							// 	prev.resetBox();
// 							// 	if (y < prev.box.top + prev.box.height/2) {
// 							// 		manager.element.insertBefore(element, prev.element);
// 							// 		item.resetBox();
// 							// 		manager.items[index-1] = item;
// 							// 		manager.items[index] = prev;
// 							// 		item.newIndex = index-1;
// 							// 		prev.newIndex = index;
// 							// 	}
// 							// } else if (next && y + item.box.height > item.box.bottom) {
// 							// 	next.resetBox();
// 							// 	if (y + item.box.height > next.box.top + next.box.height/2) {
// 							// 		if (next.element.nextSibling) {
// 							// 			manager.element.insertBefore(element, next.element.nextSibling);
// 							// 		} else {
// 							// 			manager.element.appendChild(element);
// 							// 		}
// 							// 		item.resetBox();
// 							// 		manager.items[index+1] = item;
// 							// 		manager.items[index] = next;
// 							// 		item.newIndex = index+1;
// 							// 		next.newIndex = index;
// 							// 	}
// 							// }
// 							// var tx = x - item.box.left;
// 							// var ty = y - item.box.top;
// 							// item.element.style.transform = "translate("+tx+"px, "+ty+"px)";
//
// 							// var itemOffsetY = manager.selection.getOffsetY(item);
//
//
// 							selection.forEach(function(item) {
// 								var tx = groupX - item.box.left;
// 								var ty = groupY + manager.selection.getOffsetY(item) - item.box.top;
// 								// console.log(tx, ty, item.y);
// 								item.element.style.transform = "translate("+tx+"px, "+ty+"px)";
// 							});
// 						}
// 						function dragComplete(event) {
// 							// if (item.onComplete) {
// 							// 	item.onComplete(event);
// 							// }
// 							manager.items.forEach(function(item) {
// 								if ((item.newIndex || item.newIndex === 0) && item.index !== item.newIndex) {
// 									if (item.onReorder) {
// 										item.onReorder(item.newIndex);
// 									}
// 									item.index = item.newIndex;
// 								}
// 								item.element.style.transform = "none";
// 							});
// 							// manager.clearSelection();
//
// 							window.removeEventListener("mousemove", dragMove);
// 							window.removeEventListener("mouseup", dragComplete);
// 						}
// 						window.addEventListener("mousemove", dragMove);
// 						window.addEventListener("mouseup", dragComplete);
// 					}
// 				};
// 				this.items.push(item);
// 				return item;
// 			}
// 		};
// 		return manager;
// 	}
// };
//


//
// var Sortable = {
// 	register: function(element) {
// 		var manager = {
// 			element: element,
// 			items: [],
// 			register: function(element) {
// 				var item = {
// 					index: this.items.length,
// 					element: element,
// 					resetBox: function() {
// 						element.style.transform = "none";
// 						this.box = element.getBoundingClientRect();
// 					},
// 					getGroupOffsetY: function(selection) {
// 						var y = 0;
// 						for (var i = 0; i < selection.length; i++) {
// 							if (selection[i] === item) {
// 								break;
// 							} else {
// 								y += selection[i].clientHeight;
// 							}
// 						}
// 						return y;
// 					},
// 					startDrag: function(event, selection) {
// 						this.resetBox();
// 						var offsetX = event.clientX - this.box.left;
// 						var offsetY = event.clientY - this.box.top;
// 						var groupX = 0;
// 						var groupY = this.getGroupOffsetY(selection);
// 						function dragMove(event) {
// 							var index = manager.items.indexOf(item);
// 							var prev = index > 0 && manager.items[index-1];
// 							var next = index < manager.items.length-1 && manager.items[index+1];
// 							var x = event.clientX - offsetX;
// 							var y = event.clientY - offsetY;
// 							if (prev && y < item.box.top) {
// 								prev.resetBox();
// 								if (y < prev.box.top + prev.box.height/2) {
// 									manager.element.insertBefore(element, prev.element);
// 									item.resetBox();
// 									manager.items[index-1] = item;
// 									manager.items[index] = prev;
// 									item.newIndex = index-1;
// 									prev.newIndex = index;
// 								}
// 							} else if (next && y + item.box.height > item.box.bottom) {
// 								next.resetBox();
// 								if (y + item.box.height > next.box.top + next.box.height/2) {
// 									if (next.element.nextSibling) {
// 										manager.element.insertBefore(element, next.element.nextSibling);
// 									} else {
// 										manager.element.appendChild(element);
// 									}
// 									item.resetBox();
// 									manager.items[index+1] = item;
// 									manager.items[index] = next;
// 									item.newIndex = index+1;
// 									next.newIndex = index;
// 								}
// 							}
// 							var tx = x - item.box.left;
// 							var ty = y - item.box.top;
// 							item.element.style.transform = "translate("+tx+"px, "+ty+"px)";
// 						}
// 						function dragComplete(event) {
// 							if (item.onComplete) {
// 								item.onComplete(event);
// 							}
// 							manager.items.forEach(function(item) {
// 								if ((item.newIndex || item.newIndex === 0) && item.index !== item.newIndex) {
// 									if (item.onReorder) {
// 										item.onReorder(item.newIndex);
// 									}
// 									item.index = item.newIndex;
// 								}
// 							});
// 							item.element.style.transform = "none";
// 							window.removeEventListener("mousemove", dragMove);
// 							window.removeEventListener("mouseup", dragComplete);
// 						}
// 						window.addEventListener("mousemove", dragMove);
// 						window.addEventListener("mouseup", dragComplete);
// 					}
// 				};
// 				this.items.push(item);
// 				return item;
// 			}
// 		};
// 		return manager;
// 	}
// };
