  /**
   * build (V8.2.2)
   */
KarmaFields.build = functionbuild(node, parent, element) {
  	if (node) {
  		if (!node.element || !node.render) {
  			if (!element || node.clear || node.reflow) {
  				node.element = document.createElement(node.tag || "div");
  				if (node.class) {
  					node.element.className = node.class;
  				}
  				if (element) {
  					parent.replaceChild(node.element, element);
  				} else {
  					parent.appendChild(node.element);
  				}
  				if (node.init) {
  					node.init(node);
  				}
  			} else {
  				node.element = element;
  			}
  			node.render = function() {
  				let children = node.children || node.child && [node.child] || [];
  				let i = 0;
  				let child = node.element.firstElementChild;
  				while (i < children.length) {
  					KarmaFields.build(children[i], node.element, child);
  					i++;
  					child = node.element.firstElementChild;
  				}
  				while (child) {
  					let next = child.nextElementSibling;
  					KarmaFields.build(null, node.element, child);
  					child = next;
  				}
  			}
  		}
  		if (node.update) {
  			node.update(node);
  		}
  		if (node.render) {
  			node.render();
  		}
  	} else if (parent && element) {
  		parent.removeChild(element);
  	}
  	return node;
  };
