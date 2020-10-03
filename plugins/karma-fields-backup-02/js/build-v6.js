/**
 * build (V6)
 */
KarmaFields.build = function(args, parent, prevElement) {
	var element;
	var child;
	var children;
	var lastSignature;
	var render;
	if (args) {
		render = function(param) {
			var signature = args.update && args.update(element) || args.signature;
			if (args.child) {
				if (child && signature === lastSignature) {
					child(param);
				} else {
					child = KarmaFields.build(args.child(param), element, element.children[0]);
				}
			}
			if (args.children) {
				if (children && signature === lastSignature) {
					children.forEach(function(render) {
						render(param);
					});
				} else {
					children = [];
					var childrenArgs = args.children(param);
					for (var i = 0; i < Math.max(childrenArgs.length, element.children.length); i++) {
						var render = KarmaFields.build(childrenArgs[i], element, element.children[i]);
						if (render) {
							children.push(render);
						}
					}
				}
			}
			lastSignature = signature;
		}
		element = document.createElement(args.tag || "div");
		if (args.class) {
			element.className = args.class;
		}
		if (prevElement) {
			parent.replaceChild(element, prevElement);
		} else {
			parent.appendChild(element);
		}
		if (args.init) {
			args.init(element, render);
		} else {
			render();
		}
		return render;
	} else if (prevElement) {
		parent.removeChild(prevElement);
	}
};


//
// /**
//  * build (V6)
//  */
// KarmaFields.build = function(args, parent, prevElement) {
// 	var element;
// 	var child;
// 	var children;
// 	var lastSignature;
// 	var render;
// 	if (args) {
// 		render = function(param) {
// 			var signature = args.update && args.update(element) || args.signature;
// 			if (args.child) {
// 				if (child && signature === lastSignature) {
// 					child();
// 				} else {
// 					Promise.resolve(args.child(param)).then(function(childArgs) {
// 						child = KarmaFields.build(childArgs, element, element.children[0]);
// 					});
// 				}
// 			}
// 			if (args.children) {
// 				if (children && signature === lastSignature) {
// 					children.forEach(function(render) {
// 						render();
// 					});
// 				} else {
// 					children = [];
// 					Promise.resolve(args.children(param)).then(function(childrenArgs) {
// 						for (var i = 0; i < Math.max(childrenArgs.length, element.children.length); i++) {
// 							var render = KarmaFields.build(childrenArgs[i], element, element.children[i]);
// 							if (render) {
// 								children.push(render);
// 							}
// 						}
// 					})
// 				}
// 			}
// 			lastSignature = signature;
// 		}
// 		element = document.createElement(args.tag || "div");
// 		if (args.class) {
// 			element.className = args.class;
// 		}
// 		if (prevElement) {
// 			parent.replaceChild(element, prevElement);
// 		} else {
// 			parent.appendChild(element);
// 		}
// 		if (args.init) {
// 			args.init(element, render);
// 		} else {
// 			render();
// 		}
// 		return render;
// 	} else if (prevElement) {
// 		parent.removeChild(prevElement);
// 	}
// }
