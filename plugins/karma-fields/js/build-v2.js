//
// function parseArgs(element, args) {
// 	var update;
// 	if (args.class) {
// 		element.className = args.class;
// 	}
// 	if (args.text) {
// 		element.innerHTML = args.text;
// 	}
// 	if (args.child) {
// 		element.appendChild(args.child);
// 	}
// 	if (args.children) {
// 		for (var i = 0; i < args.children.length; i++) {
// 			if (args.children[i]) {
// 				element.appendChild(args.children[i]);
// 			}
// 		}
// 	}
// 	if (args.init) {
// 		var update;
// 		if (args.onUpdate || args.update) {
// 			var onUpdate = args.onUpdate || args.update;
// 			update = function(arg) {
// 				var newargs = onUpdate(arg, update, element);
// 				if (newargs) {
// 					unparseArgs(element, args);
// 					parseArgs(element, newargs);
// 					args = newargs;
// 				}
// 			};
// 		}
// 		var newargs = args.init(element, update);
// 		if (newargs) {
// 			parseArgs(element, newargs);
// 			args = newargs;
// 		}
// 	}
// }
// function unparseArgs(element, args) {
// 	if (args.children) {
// 		for (var i = 0; i < args.children.length; i++) {
// 			if (args.children[i]) {
// 				element.removeChild(args.children[i]);
// 			}
// 		}
// 	}
// 	if (args.child) {
// 		element.removeChild(args.child);
// 	}
// 	if (args.text) {
// 		element.innerHTML = "";
// 	}
// 	// if (args.class) {
// 	// 	element.className = "";
// 	// }
// }
//
// /**
//  * build (V3)
//  */
// function build(args) {
// 	var element = document.createElement(args.tag || "div");
// 	parseArgs(element, args);
// 	return element;
// }



function unparseArgs(element, args) {
	if (args.children) {
		for (var i = 0; i < args.children.length; i++) {
			if (args.children[i]) {
				element.removeChild(args.children[i]);
			}
		}
	}
	if (args.child) {
		element.removeChild(args.child);
	}
	if (args.text) {
		element.innerHTML = "";
	}
}
function parseArgs(element, args) {
	if (args.class) {
		element.className = args.class;
	}
	if (args.text) {
		element.innerHTML = args.text;
	}
	if (args.child) {
		element.appendChild(args.child);
	}
	if (args.children) {
		for (var i = 0; i < args.children.length; i++) {
			if (args.children[i]) {
				element.appendChild(args.children[i]);
			}
		}
	}
	if (args.init) {
		var update = args.update;
		var initArgs = args.init(element, update && function(arg) {
			unparseArgs(element, args);
			args = update(arg);
			parseArgs(element, args);
		});
		if (initArgs) {
			unparseArgs(element, args);
			args = initArgs;
			parseArgs(element, args);

		}
	}
}
function build(args) {
	var element = document.createElement(args.tag || "div");
	parseArgs(element, args);
	return element;
}
