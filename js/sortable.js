

var Sortable = {
	register: function(element) {
		var manager = {
			element: element,
			items: [],
			register: function(element) {
				var item = {
					index: this.items.length,
					element: element,
					startDrag: function(event) {
						var box = element.getBoundingClientRect();
						var mouseX = event.clientX - box.left;
						var mouseY = event.clientY - box.top;
						function dragMove(event) {
							var index = manager.items.indexOf(item);
							if (event.clientY < box.top && index > 0) {
								var prev = manager.items[index-1];
								box = prev.element.getBoundingClientRect();
								manager.element.insertBefore(element, prev.element);
								manager.items[index-1] = item;
								manager.items[index] = prev;
								item.newIndex = index-1;
								prev.newIndex = index;
							}
							if (event.clientY > box.bottom && index < manager.items.length-1) {
								var next = manager.items[index+1];
								box = next.element.getBoundingClientRect();
								if (next.element.nextSibling) {
									manager.element.insertBefore(element, element.nextSibling.nextSibling);
								} else {
									manager.element.appendChild(element);
								}
								manager.items[index+1] = item;
								manager.items[index] = next;
								item.newIndex = index+1;
								next.newIndex = index;
							}
							var x = event.clientX - mouseX - box.left;
							var y = event.clientY - mouseY - box.top;
							item.element.style.transform = "translate("+x+"px, "+y+"px)";
						}
						function dragComplete(event) {
							if (item.onComplete) {
								item.onComplete(event);
							}
							manager.items.forEach(function(item) {
								if ((item.newIndex || item.newIndex === 0) && item.index !== item.newIndex) {
									if (item.onReorder) {
										item.onReorder(item.newIndex);
									}
									item.index = item.newIndex;
								}
							});
							item.element.style.transform = "none";
							window.removeEventListener("mousemove", dragMove);
							window.removeEventListener("mouseup", dragComplete);
						}
						window.addEventListener("mousemove", dragMove);
						window.addEventListener("mouseup", dragComplete);
					}
				};
				this.items.push(item);
				return item;
			}
		};
		return manager;
	}
};
