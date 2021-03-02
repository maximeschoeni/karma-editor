KarmaFields.fields.dropdown = function(field) {
	return {
		tag: "select",
		class: "dropdown",
		init: function(container) {
			this.element.id = field.getId();
			this.element.onchange = function() {
				field.setValue(this.value, "change");
			}
			// if (field.resource.style) {
			// 	this.element.style = field.resource.style;
			// }
			if (field.resource.script_init) {
				(new Function("element", "field", field.resource.script_init))(this.element, field);
			}

			field.data.loading = true;
			field.trigger("update");

			Promise.resolve(field.resource.options || field.trigger("fetch", "querykey", {key: field.resource.key})).then(function(results) {

				let items = results.items || results || [];

				if (field.resource.novalue !== undefined) {
					let emptyValue;
					if (field.resource.datatype === "boolean") {
						emptyValue = "false";
					} else if (field.resource.datatype === "number") {
						emptyValue = "0";
					} else {
						emptyValue = "";
					}
					let emptyName = typeof field.resource.novalue === "string" && field.resource.novalue || "-";
					items = [{
						key: emptyValue,
						name: emptyName
					}].concat(items);
				}

				if (items.length && !items.some(function(item) {
					return item.key == field.value;
				})) {
					value = items[0].key;
					field.setValue(value, "set");
				}

				if (items.length && items.some(function(item) {
					return item.group;
				})) {
					// optgroups ->
					let groups = items.reduce(function(obj, item) {
						if (!obj[item.group || "default"]) {
							obj[item.group || "default"] = [];
						}
						obj[item.group || "default"].push(item);
						return obj;
					}, {});

					field.data.optgroups = Object.entries(groups).map(function(entry) {
						return {
							name: entry[0],
							children: entry[1]
						}
					});

				} else {
					field.data.options = items;
				}

				field.data.loading = false;
				field.trigger("update");
				field.trigger("render");
			});
		},
		update: function(dropdown) {
			if (field.data.options) {
				this.children = field.data.options.map(function(option) {
					return {
						tag: "option",
						update: function() {
							this.element.textContent = option.name;
							this.element.value = option.key;
							this.element.selected = field.value == option.key;
						}
					};
				});
			} else if (field.data.optgroups) {
				this.children = field.data.optgroups.map(function(option) {
					return {
						tag: "optgroup",
						update: function() {
							this.label = option.name;
							this.children = option.children.map(function(item, index) {
								return {
									tag: "option",
									update: function() {
										this.element.textContent = item.name;
										this.element.value = item.key;
										this.element.selected = field.value == item.key;
									}
								};
							})
						}
					};
				});
			}
		}
	}
}


// KarmaFields.fields.dropdown = function(field) {
// 	return {
// 		class: "dropdown-container",
// 		init: function(container) {
// 			return field.fetchValue().then(function() {
// 				// return Promise.resolve(field.getAttribute("options") || field.fetchOptions());
// 				return Promise.resolve(field.resource.options || field.fetchOptions());
// 			}).then(function(results) {
// 				let items = results.items || results;
//
// 				if (field.resource.novalue !== undefined) {
// 					items = [{
// 						key: "",
// 						name: typeof field.resource.novalue === "string" && field.resource.novalue || "-"
// 					}].concat(items);
// 				}
//
// 				if (items.length && items.every(function(item) {
// 					return item.key != field.getValue();
// 				})) {
// 					value = items[0].key;
// 					field.write(value);
// 				}
//
// 				if (items.length && items.some(function(item) {
// 					return item.group;
// 				})) {
// 					// optgroups ->
// 					let groups = items.reduce(function(obj, item) {
// 						if (!obj[item.group || "default"]) {
// 							obj[item.group || "default"] = [];
// 						}
// 						obj[item.group || "default"].push(item);
// 						return obj;
// 					}, {});
//
// 					field.data.optgroups = Object.entries(groups).map(function(entry) {
// 						return {
// 							name: entry[0],
// 							children: entry[1]
// 						}
// 					});
//
// 				} else {
// 					field.data.options = items;
// 				}
//
//
// 				container.render();
// 			});
//
// 		},
// 		child: {
// 			tag: "select",
// 			class: "dropdown",
// 			init: function(dropdown) {
// 				this.element.id = field.getId();
// 				this.element.onchange = function() {
// 					field.setValue(this.value, "change");
// 				}
// 				if (field.resource.style) {
// 					this.element.style = field.resource.style;
// 				}
// 				if (field.resource.script_init) {
// 					(new Function("element", "field", field.resource.script_init))(this.element, field);
// 				}
//
// 			},
// 			update: function(dropdown) {
// 				let value = field.getValue();
//
//
// 				if (field.data.options) {
// 					this.children = field.data.options.map(function(option) {
// 						return {
// 							tag: "option",
// 							update: function() {
// 								// let item = items[index];
// 								this.element.textContent = option.name;
// 								this.element.value = option.key;
// 								this.element.selected = value == option.key;
// 							}
// 						};
// 					});
// 				} else if (field.data.optgroups) {
// 					this.children = field.data.optgroups.map(function(option) {
// 						return {
// 							tag: "optgroup",
// 							update: function() {
// 								this.label = option.name;
// 								this.children = option.children.map(function(item, index) {
// 									return {
// 										tag: "option",
// 										update: function() {
// 											// let item = items[index];
// 											this.element.textContent = item.name;
// 											this.element.value = item.key;
// 											this.element.selected = value == item.key;
// 										}
// 									};
// 								})
// 							}
// 						};
// 					});
// 				}
// 			}
// 		}
// 	};
// }

// KarmaFields.fields.dropdown = function(field) {
// 	return {
// 		tag: "select",
// 		class: "dropdown",
// 		children: field.data.options && field.data.options.map(function(option) {
//
// 			return {
// 				tag: "option",
// 				update: function() {
// 					// let item = items[index];
// 					this.textContent = item.name;
// 					this.value = item.key;
// 					this.selected = value == item.key;
// 				}
// 			};
// 		}) || field.data.optgroups && field.data.optgroups.map(function(option) {
// 			return {
// 				tag: "optgroup",
// 				update: function() {
// 					this.label = option.name;
// 					this.kids = option.children.map(function(item, index) {
// 						return {
// 							tag: "option",
// 							update: function() {
// 								// let item = items[index];
// 								this.textContent = item.name;
// 								this.value = item.key;
// 								this.selected = value == item.key;
// 							}
// 						};
// 					})
// 				}
// 			};
// 		}) || [],
// 		init: function(dropdown) {
// 			this.element.id = field.getId();
// 			this.element.onChange = function() {
// 				field.setValue(this.element.value, "change");
// 			}
// 			if (field.resource.style) {
// 				this.element.style = field.resource.style;
// 			}
// 			if (field.resource.script_init) {
// 				(new Function("element", "field", field.resource.script_init))(this.element, field);
// 			}
// 			return field.fetchValue().then(function() {
// 				// return Promise.resolve(field.getAttribute("options") || field.fetchOptions());
// 				return Promise.resolve(field.resource.options || field.fetchOptions());
// 			}).then(function(results) {
// 				let items = results.items || results;
//
// 				if (field.resource.novalue !== undefined) {
// 					items.unshift({
// 						key: "",
// 						name: typeof field.resource.novalue === "string" && field.resource.novalue || "-"
// 					});
// 				}
//
// 				if (items.length && items.every(function(item) {
// 					return item.key != field.getValue();
// 				})) {
// 					value = items[0].key;
// 					field.write(value);
// 				}
//
// 				if (items.length && items.some(function(item) {
// 					return item.group;
// 				})) {
// 					// optgroups ->
// 					let groups = items.reduce(function(obj, item) {
// 						if (!obj[item.group || "default"]) {
// 							obj[item.group || "default"] = [];
// 						}
// 						obj[item.group || "default"].push(item);
// 						return obj;
// 					}, {});
//
// 					field.data.optgroups = Object.entries(groups).map(function(entry) {
// 						return {
// 							name: entry[0],
// 							children: entry[1]
// 						}
// 					});
//
// 				} else {
// 					field.data.options = items;
// 				}
//
// 				console.log(field.data.options);
//
// 				dropdown.render();
// 			});
// 		}
// 	};
// }


// KarmaFields.fields.dropdown = function(field) {
// 	return {
// 		class: "dropdown-container",
// 		init: function(container) {
// 			return field.fetchValue().then(function() {
// 				return Promise.resolve(field.getAttribute("options") || field.fetchOptions());
// 			}).then(function(results) {
// 				field.data.options = results;
// 				container.render();
// 			});
// 		},
// 		child: {
// 			tag: "select",
// 			class: "dropdown",
// 			init: function() {
// 				this.element.id = field.getId();
// 				this.element.onChange = function() {
// 					field.setValue(this.element.value, "change");
// 				}
// 				if (field.resource.style) {
// 					this.element.style = field.resource.style;
// 				}
// 				if (field.resource.script_init) {
// 					(new Function("element", "field", field.resource.script_init))(this.element, field);
// 				}
// 				return field.fetchValue().then(function() {
// 					return Promise.resolve(field.getAttribute("options") || field.fetchOptions());
// 				}).then(function(results) {
// 					field.data.options = results;
//
// 				});
// 			},
// 			update: function(dropdown) {
//
// 				if (field.resource.script_update) {
// 					let f = new Function("element", "field", field.resource.script_update);
// 					f(this.element, field);
// 				}
//
// 				return field.fetchValue().then(function() {
// 					return Promise.resolve(field.getAttribute("options") || field.fetchOptions());
// 				}).then(function(results) {
//
// 					let value = field.getValue();
// 					let items = results.items || results; // compat !
//
// 					if (field.resource.novalue !== undefined) {
// 						items = [{
// 							key: "",
// 							name: typeof field.resource.novalue === "string" && field.resource.novalue || "-"
// 						}].concat(items);
// 					}
// 					if (items.length && items.every(function(item) {
// 						return item.key != value;
// 					})) {
// 						value = items[0].key;
// 						field.write(value);
// 					}
//
//
// 					if (items.length && items.some(function(item) {
// 						return item.group;
// 					})) {
// 						// optgroups ->
// 						var groups = items.reduce(function(obj, item) {
// 							if (!obj[item.group || "default"]) {
// 								obj[item.group || "default"] = [];
// 							}
// 							obj[item.group || "default"].push(item);
// 							return obj;
// 						}, {});
// 						dropdown.kids = Object.entries(groups).map(function(entry) {
// 							return {
// 								tag: "optgroup",
// 								update: function() {
//
// 									this.label = entry[0];
// 									this.kids = entry[1].map(function(item, index) {
// 										return {
// 											tag: "option",
// 											update: function() {
// 												let item = items[index];
// 												this.textContent = item.name;
// 												this.value = item.key;
// 												this.selected = value == item.key;
// 											}
// 										};
// 									})
// 								}
// 							};
// 						});
//
// 					} else {
// 						dropdown.kids = items.map(function(item, index) {
// 							return {
// 								tag: "option",
// 								update: function() {
// 									let item = items[index];
// 									this.textContent = item.name;
// 									this.value = item.key;
// 									this.selected = value == item.key;
// 								}
// 							};
// 						});
// 					}
//
//
// 					dropdown.render();
//
// 					// console.log(dropdown, value);
// 					// dropdown.value = value;
// 				});
//
// 			}
// 		}
// 	};
// }
