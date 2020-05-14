/**
 * build (V4)
 */
function build(args) {
	var element = document.createElement(args.tag || "div");
	var child;
	var children;
	var update = function() {
		if (args.text && typeof args.text === "function") {
			element.innerHTML = args.text.apply(null, arguments) || "";
		}
		if (args.child && typeof args.child === "function") {
			if (child) {
				element.removeChild(child);
			}
			child = args.child.apply(null, arguments);
			if (child) {
				element.appendChild(child);
			}
		}
		if (args.children && typeof args.children === "function") {
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
	if (args.text && typeof args.text === "string") {
		var string = args.text;
		args.text = function() {
			return string;
		};
	}
	if (args.child && typeof args.child === "object") {
		var compatChild = args.child;
		args.child = function() {
			return compatChild;
		}
	}
	if (args.children && typeof args.children === "object") {
		var compatChildren = args.children;
		args.children = function() {
			return compatChildren;
		}
	}
	if (args.init) {
		args.init(element, update);
	} else {
		update();
	}

	return element;
}


































//
//
//
// var MyApp = function() {};
//
// MyApp.prototype.build = function() {
// 	var app = {};
// 	app.thingsToDo = [];
// 	return build({
// 		children: () => [
// 			MyApp.buildList(app),
// 			MyApp.buildForm(app)
// 		]
// 	});
// }
//
// MyApp.prototype.buildForm = function(app) {
// 	var form = {};
// 	return build({
// 		children: () => [
// 			build({
// 				tag: "h3",
// 				text: () => "TODO"
// 			}),
// 			build({
// 				tag: "form",
// 				children: () => [
// 					build({
// 						tag: "label",
// 						text: () => "What needs to be done?"
// 					}),
// 					build({
// 						tag: "input",
// 						init: (element) => {
// 							element.id = "new-todo";
// 							element.type = "text";
// 							element.onChange = () => {
// 								form.todo = element.value;
// 							}
// 						}
// 					}),
// 					build({
// 						tag: "button",
// 						text: () => "Add #"+app.thingsToDo.length,
// 						init: (element) => {
// 							element.onClick = () => {
// 								if (form.todo) {
// 									app.thingsToDo.push(form.todo);
// 									if (app.update) {
// 										app.update();
// 									}
// 								}
// 							}
// 						}
// 					})
// 				]
// 			})
// 		]
// 	})
// }
//
// MyApp.prototype.buildList = function(app) {
// 	return build({
// 		tag: "ul",
// 		init: (element, update) => {
// 			app.update = update;
// 		},
// 		children: () => app.thingsToDo.map(function(todo) {
// 			return build({
// 				tag: "li",
// 				text: () => todo
// 			})
// 		})
// 	})
// }
//
// var app = new App();
// document.body.getElementById("todos-example").appendChild(app.build());
//
//
































// class TodoApp extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { items: [], text: '' };
//     this.handleChange = this.handleChange.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//   }
//
//   render() {
//     return (
//       <div>
//         <h3>TODO</h3>
//         <TodoList items={this.state.items} />
//         <form onSubmit={this.handleSubmit}>
//           <label htmlFor="new-todo">
//             What needs to be done?
//           </label>
//           <input
//             id="new-todo"
//             onChange={this.handleChange}
//             value={this.state.text}
//           />
//           <button>
//             Add #{this.state.items.length + 1}
//           </button>
//         </form>
//       </div>
//     );
//   }
//
//   handleChange(e) {
//     this.setState({ text: e.target.value });
//   }
//
//   handleSubmit(e) {
//     e.preventDefault();
//     if (this.state.text.length === 0) {
//       return;
//     }
//     const newItem = {
//       text: this.state.text,
//       id: Date.now()
//     };
//     this.setState(state => ({
//       items: state.items.concat(newItem),
//       text: ''
//     }));
//   }
// }
//
// class TodoList extends React.Component {
//   render() {
//     return (
//       <ul>
//         {this.props.items.map(item => (
//           <li key={item.id}>{item.text}</li>
//         ))}
//       </ul>
//     );
//   }
// }
//
// ReactDOM.render(
//   <TodoApp />,
//   document.getElementById('todos-example')
// );



//
// function buildMyComponent() {
// 	var component = {};
// 	return build({
// 		children: function() {
// 			return [
// 				build({
// 					tag: "a",
// 					text: function() {
// 						return "click1";
// 					},
// 					init: function(a) {
// 						a.addEventListener("click", function() {
// 							component.update("image1");
// 						})
// 					}
// 				}),
// 				build({
// 					tag: "a",
// 					text: function() {
// 						return "click2";
// 					},
// 					init: function(a) {
// 						a.addEventListener("click", function() {
// 							component.update("image2");
// 						})
// 					}
// 				}),
// 				build({
// 					class: "img-container",
// 					init: function(img, update) {
// 						component.update = update;
// 					},
// 					child: function(arg) {
// 						if (arg === "image1") {
// 							return buildImage1();
// 						} else {
// 							return buildImage2();
// 						}
// 					}
// 				})
// 			];
// 		}
// 	});
// }
//
// function buildImage1() {
// 	return build({
// 		tag: "img",
// 		init: function(img) {
// 			img.src = "image1.jpg";
// 		}
// 	})
// }
// function buildImage2() {
// 	return build({
// 		tag: "img",
// 		init: function(img) {
// 			img.src = "image2.jpg";
// 		}
// 	})
// }
//
//
//
// function buildMyComponent() {
// 	var component = {};
// 	return build({
// 		children: function() {
// 			return [
// 				build({
// 					tag: "a",
// 					text: () => "click1",
// 					init: a => {
// 						a.addEventListener("click", () => {
// 							component.update("image1");
// 						})
// 					}
// 				}),
// 				build({
// 					tag: "a",
// 					text: () => "click2",
// 					init: a => {
// 						a.addEventListener("click", () => {
// 							component.update("image2");
// 						})
// 					}
// 				}),
// 				build({
// 					class: "img-container",
// 					init: (img, update) => {
// 						component.update = update;
// 					},
// 					child: buildImage
// 				})
// 			];
// 		}
// 	});
// }
// function buildImage(arg) {
// 	return build({
// 		tag: "img",
// 		init: (img) => {
// 			if (arg === "image2") {
// 				img.src = "image2.jpg";
// 			} else {
// 				img.src = "image1.jpg";
// 			}
// 		}
// 	})
// }
