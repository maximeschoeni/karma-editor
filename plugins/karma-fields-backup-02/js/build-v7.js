/**
 * build (V7)
 */
// KarmaFields.build = function(args, parent, prevElement) {
// 	if (args) {
// 		var element;
// 		var render = function() {
// 			if (args.text !== undefined) {
// 				element.innerHTML = args.text;
// 				// requestAnimationFrame(function() {
//         //   element.innerHTML = args.text;
//         // });
// 			}
// 			var children = args.children || [args.child];
// 			for (var i = 0; i < Math.max(children.length, element.children.length); i++) {
// 				KarmaFields.build(children[i], element, element.children[i]);
// 			}
// 		}
// 		if (!prevElement || (args.id || args.tag || "div") !== prevElement.stateId) {
//
// 		// if (!prevElement || (args.tag || "div").toUpperCase() !== prevElement.tagName || args.id && (args.id !== prevElement.id)) {
// 			// var tag = args.tag || "div";
// 			element = document.createElement(args.tag || "div");
// 			element.stateId = args.id || args.tag || "div";
// 			if (args.class) {
// 				element.className = args.class;
// 			}
// 			if (prevElement) {
// 				parent.replaceChild(element, prevElement);
// 			} else {
// 				parent.appendChild(element);
// 			}
// 			if (args.init) {
// 				args.init(element, render, args);
// 			}
//
// 			// args.init && args.init(element, render, args) || render();
// 		} else {
// 			element = prevElement;
// 			// args.update && args.update(element, render, args) || render();
// 		}
// 		if (args.update) {
// 			args.update(element, render, args);
// 		}
// 		render();
// 		return render;
// 	} else if (prevElement) {
// 		parent.removeChild(prevElement);
// 	}
// };


// KarmaFields.build = function(args, parent, element) {
// 	if (args) {
//
//     function render() {
//       var children = args.children || args.child && [args.child] || [];
//       for (var i = 0; i < Math.max(children.length, element.children.length); i++) {
//         KarmaFields.build(children[i], element, element.children[i]);
//       }
//     }
//
// 		if (!element || (args.id || args.tag || "div") !== element.stateId) {
//
//     // if (!element) {
//
//
// 			var newElement = document.createElement(args.tag || "div");
// 			newElement.stateId = args.id || args.tag || "div";
// 			if (args.class) {
// 				newElement.className = args.class;
// 			}
// 			if (element) {
// 				parent.replaceChild(newElement, element);
// 			} else {
// 				parent.appendChild(newElement);
// 			}
//       element = newElement;
// 			if (args.init) {
// 				args.init(element, render, args);
// 			}
//
//
//
// 			// args.init && args.init(element, render, args) || render();
// 		}
// 		if (args.update) {
// 			args.update(element, render, args);
// 		}
// 		render();
// 		return render;
// 	} else if (element) {
//
// 		// console.log();
// 		parent.removeChild(element)
// 	}
// };



KarmaFields.build = function(args, parent, element) {
	if (args) {
		var tag = args.tag || "div";
		var stateId = args.stateId || tag;
		var render = function() {
			var childArgs = args.children || [args.child];
			var children = Array.from(element.children);
			for (var i = 0; i < Math.max(childArgs.length, children.length); i++) {
				KarmaFields.build(childArgs[i], element, children[i]);
			}
		}
		if (!element || stateId !== element.stateId) {
			var newElement = document.createElement(tag);
			if (args.class) {
				newElement.className = args.class;
			}
			newElement.stateId = stateId;
			if (element) {
				parent.replaceChild(newElement, element);
			} else {
				parent.appendChild(newElement);
			}
      element = newElement;
			if (args.init) {
				args.init(element, render, args);
			}
		}
		if (args.update) {
			args.update(element, render, args);
		}
		render();
		return render;
	} else if (element) {
		parent.removeChild(element);
	}
};
