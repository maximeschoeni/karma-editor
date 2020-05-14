/**
 * build (V4)
 */
function build(args) {
	var element = document.createElement(args.tag || "div");
	var child;
	var children;
	var update = function() {
		if (args.text) {
			element.innerHTML = args.text.apply(null, arguments) || "";
		}
		if (args.child) {
			if (child) {
				element.removeChild(child);
			}
			child = args.child.apply(null, arguments);
			if (child) {
				element.appendChild(child);
			}
		}
		if (args.children) {
			if (children) {
				for (var i = 0; i < children.length; i++) {
					element.removeChild(children[i]);
				}
			}
			children = args.children.apply(null, arguments);
			if (children) {
				for (var i = 0; i < children.length; i++) {
					if (children[i]) {
						element.appendChild(children[i]);
					}
				}
			}
		}
	};
	if (args.class) {
		element.className = args.class;
	}
	if (args.init) {
		args.init(element, update);
	} else {
		update();
	}
	return element;
}
