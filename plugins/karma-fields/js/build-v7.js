/**
 * build (V7)
 */
KarmaFields.build = function(args, parent, prevElement) {
	if (args) {
		var element;
		var render = function() {
			if (args.text !== undefined) {
				element.innerHTML = args.text;
				// requestAnimationFrame(function() {
        //   element.innerHTML = args.text;
        // });
			}
			var children = args.children || [args.child];
			for (var i = 0; i < Math.max(children.length, element.children.length); i++) {
				KarmaFields.build(children[i], element, element.children[i]);
			}
		}
		if (!prevElement || (args.id || args.tag || "div") !== prevElement.stateId) {
		// if (!prevElement || (args.tag || "div").toUpperCase() !== prevElement.tagName || args.id && (args.id !== prevElement.id)) {
			// var tag = args.tag || "div";
			element = document.createElement(args.tag || "div");
			element.stateId = args.id || args.tag || "div";
			if (args.class) {
				element.className = args.class;
			}
			if (prevElement) {
				parent.replaceChild(element, prevElement);
			} else {
				parent.appendChild(element);
			}
			if (args.init) {
				args.init(element, render, args);
			}
			// args.init && args.init(element, render, args) || render();
		} else {
			element = prevElement;
			// args.update && args.update(element, render, args) || render();
		}
		if (args.update) {
			args.update(element, render, args);
		}
		render();
		return render;
	} else if (prevElement) {
		parent.removeChild(prevElement);
	}
};
