/**
 * build (V7.1)
 */

// function render() {
// 	let childArgs = this.children || this.child && [this.child] || [];
// 	let children = Array.from(this.element.children);
// 	for (let i = 0; i < Math.max(childArgs.length, children.length); i++) {
// 		build(childArgs[i], this.element, children[i]);
// 	}
// }
KarmaFields.build = function(args, parent, element) {
	if (args) {
		args.render = function() {
			let childArgs = this.children || this.child && [this.child] || [];
			let children = Array.from(this.element.children);
			for (let i = 0; i < Math.max(childArgs.length, children.length); i++) {
				KarmaFields.build(childArgs[i], this.element, children[i]);
			}
		};
		// args.render = render;
		if (element && !args.clear) {
			 args.element = element;
		} else {
			args.element = document.createElement(args.tag || "div");
			if (args.class) {
				args.element.className = args.class;
			}
			if (element) {
				parent.replaceChild(args.element, element);
			} else {
				parent.appendChild(args.element);
			}
			if (args.init) {
				args.init(args);
			}
		}
		if (args.update) {
			args.update(args);
		}
		args.render();
	} else if (element) {
		parent.removeChild(element);
	}
};
