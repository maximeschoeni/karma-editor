// if (!window.KarmaMultimedia) {
// 	KarmaMultimedia = {};
// }






// KarmaFieldMedia.buildSection = function(section, post) {
//
//
// 	return build({
// 		class: "karma-field-section",
// 		child: KarmaFieldMedia.customfields[section.field || "group"](section, post)
// 	})
// }



KarmaFieldMedia.buildSection = function(section, post) {

	var manager = KarmaFieldMedia.createFieldManager(section, post);

	return build({
		class: "karma-field-section",
		child: manager.build()
	})
}


// KarmaFieldMedia.parseField = function(field, parent) {
// 	var manager = KarmaFieldMedia.createFieldManager(field);
// 	if (field.children) {
// 		field.children.forEach(function(child) {
// 			KarmaFieldMedia.parseField(child, manager);
// 		});
// 	}
// 	return manager;
// }


// KarmaFieldMedia.buildItems = function(items, post) {
// 	return build({
// 		class: "karma-field-group",
// 		children: items.map(function(item) {
// 			return KarmaFieldMedia.buildField(item, postURI);
// 		})
// 	})
// }
// KarmaFieldMedia.buildField = function(item, post, parentValue) {
// 	var promise;
// 	if (item.meta_key) {
// 		if (item.private) {
// 			promise = fetch(KarmaFields.rest+"/get/"+post.id+"/"+item.meta_key);
// 		} else {
// 			promise = fetch(KarmaFields.cache+"/"+post.uri+"/"+(item.cache_key || item.meta_key+""));
// 		}
//
//
// 			KarmaFieldMedia.get(cache_key, post.uri).then(function(result) {
// 				result.text().then(function(text) {
// 					textField.value = text;
// 					update();
// 				})
// 			})
// 		}
//
// 	}
//
//
//
// 	return build({
// 		class: "karma-field",
// 		init: function() {
//
// 		}
// 	});
//
// 	if (item.children) {
// 		return KarmaFieldMedia.buildFields(item.children, postURI);
// 	} else if (KarmaFieldMedia.fields[item.field]) {
// 		return KarmaFieldMedia.customfields[item.field](item, postURI);
// 	}
// }

KarmaFieldMedia.cache = {
	values: {},
	query: function(key) {
		return this.values[key];
	},
	put: function(key, value) {
		this.values[key] = value;
	},
	match: async function(key) {
		return this.values[key];
	}
	// createKey: function(request) {
	// 	var key = request.id+"/"+request.key;
	//
	// 	return key;
	// 	// var params = [];
	// 	// for (var i in request) {
	// 	// 	if (request[i] || request[i] === false) {
	// 	// 		params.push(i+"="+encodeURI(request[i]));
	// 	// 	}
	// 	// }
	// 	// params.sort();
	// 	// return params.join("&");
	// },
	// add: function(request, value) {
	// 	var key = this.createKey(request);
	// 	this.values[key] = value
	// },
	// find: function(request) {
	// 	var key = this.createKey(request);
	// 	return this.values[key];
	// }
}



KarmaFieldMedia.createFieldManager = function(resource, post, parent) {
	var manager = {
		resource: resource,
		post: post,
		parent: parent,
		build: function() {
			if (KarmaFieldMedia.customfields[resource["field"] || "group"]) {
				return KarmaFieldMedia.customfields[resource["field"] || "group"](this);
			}
		},
		getChildren: function() {
			return resource.children.map(function(resource) {
				return KarmaFieldMedia.createFieldManager(resource, post, manager);
			});
		},
		value: function() {
			if (post.uri) {
				return this.request(post.uri);
			} else {
				return Promise.reject(new Error("Field ("+resource.key+") cannot get value: no uri"));
			}

			// if (resource.key) {
			// 	if (resource.object) {
			// 		var postURI = post[resource.locator || "uri"];
			// 		if (postURI) {
			// 			var file = postURI+"/"+resource.key+"."+(resource.extension || "json");
			// 			return this.query(file);
			// 		} else {
			// 			return Promise.reject(new Error("Field ("+resource.key+") cannot get value: no postURI"));
			// 		}
			// 	} else if (parent) {
			// 		return parent.value().then(function(result) {
			// 			return result[resource.key];
			// 		});
			// 	} else {
			// 		return Promise.reject(new Error("Field ("+resource.key+") cannot get value: no object and no parent"));
			// 	}
			// } else {
			// 	return Promise.reject(new Error("Field Manager cannot get value: no key"));
			// }
		},
		default: function() {
			if (post.default_uri) {
				return this.request(post.default_uri);
			} else {
				return Promise.resolve("");
			}
			// if (resource.key) {
			// 	if (resource.object) {
			// 		if (resource.default_locator) {
			// 			var postURI = post[resource.default_locator];
			// 			if (postURI) {
			// 				var file = postURI+"/"+resource.key+"."+(resource.extension || "json");
			// 				return this.query(file);
			// 			} else {
			// 				return Promise.reject(new Error("Field ("+resource.key+") cannot get default: no postURI"));
			// 			}
			// 		} else {
			// 			return Promise.resolve(resource.default || "");
			// 		}
			// 	} else if (parent) {
			// 		return parent.default().then(function(result) {
			// 			return result[key || field.key];
			// 		});
			// 	} else {
			// 		return Promise.reject(new Error("Field ("+resource.key+") cannot get default: no object and no parent"));
			// 	}
			// } else {
			// 	return Promise.reject(new Error("Field Manager cannot get default: no key"));
			// }
		},
		request: function(uri) {
			if (resource.key) {
				if (resource.object) {
					var file = uri+"/"+resource.key+(resource.extension || ".json");
					return this.query(file);
				} else if (parent) {
					return parent.request(uri).then(function(result) {
						return result[resource.key];
					});
				} else {
					return Promise.reject(new Error("Field ("+resource.key+") cannot request uri ("+uri+"): no object and no parent"));
				}
			} else if (parent) {
				return parent.request(uri).then(function(result) {
					return result;
				});
			} else {
				return Promise.reject(new Error("Field Manager cannot request uri ("+uri+"): no key and no parent"));
			}
		},
		format: function(response) {
			if (response.ok) {
				var result;
				if (response.url.slice(-5) === ".json") { // file.endsWith(".json")
					return response.json();
					// .then(function(result) {
					// 	if (typeof result !== "object") {
					// 		return {};
					// 	}
					// 	return result;
					// });
				} else {
					return response.text();
				}
			} else {
				return response;
			}
		},
		query: function(file) {
			var url = KarmaFields.queryPostURL+"/"+file;
			return (KarmaFieldMedia.cache.query(url) || fetch(url, {
				cache: "reload"
			})).then(function(response) {
				KarmaFieldMedia.cache.put(url, response);
				return manager.format(response);
			});

			// KarmaFieldMedia.cache.match(url).then(function(response) {
			// 	if (!response) {
			// 		return fetch(url, {
			// 			cache: "reload"
			// 		}).then(function(response) {
			// 			KarmaFieldMedia.cache.put(url, response);
			// 		});
			// 	}
			// 	return response;
			// }).then(function(response) {
			// 	return manager.format(response);
			// });


			// var promise = KarmaFieldMedia.cache.query(file);
			// if (!promise) {
			// 	var url = KarmaFields.queryPostURL+"/"+file;
			// 	// var isJson = file.slice(-5) === ".json"; // file.endsWith(".json")
			// 	// promise = fetch(url, {
			// 	// 	cache: "reload"
			// 	// }).then(function(response) {
			// 	// 	if (isJson) {
			// 	// 		return response.json();
			// 	// 	} else {
			// 	// 		return response.text();
			// 	// 	}
			// 	// }).then(function(value) {
			// 	// 	if (isJson && typeof value !== "object") {
			// 	// 		value = {};
			// 	// 	}
			// 	// 	return value;
			// 	// });
			// 	promise = KarmaFieldMedia.cache.query(file) || fetch(KarmaFields.queryPostURL+"/"+file, {
			// 		cache: "reload"
			// 	}).then(function(response) {
			// 		return manager.format(response);
			// 	});
			// 	KarmaFieldMedia.cache.add(file, promise);
			// }
			// return promise;
		},
		update: function(file, value) {
			return fetch(KarmaFields.savePostURL+"/"+file, {
				method: "post",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({
					value: value
				}),
				mode: "same-origin"
			}).then(function(response) {
				KarmaFieldMedia.cache.put(KarmaFields.queryPostURL+"/"+file, response);
				return response.json();
			});
		},
		save: function(value) {
			if (resource.key) {
				if (resource.object) {
					var postURI = post[resource.locator || "uri"];
					if (postURI) {
						var file = postURI+"/"+resource.key+(resource.extension || ".json");
						return this.update(file, value);
					} else {
						return Promise.reject(new Error("Field ("+resource.key+") cannot save: no postURI"));
					}
				} else if (parent) {
					return parent.value().then(function(result) {
						result[resource.key] = value;
						return parent.save(result);
					});
				} else {
					return Promise.reject(new Error("Field ("+resource.key+") cannot save: no object and no parent"));
				}
			} else if (parent) {
				return parent.save(value);
			} else {
				return Promise.reject(new Error("Field Manager cannot save: no key and no parent"));
			}
		}
	};
	// resource.children.forEach(function(resource) {
	// 	var child = KarmaFieldMedia.createFieldManager(resource, post, parent);
	// 	manager.children.push(child);
	// });
	return manager;
}

// KarmaFieldMedia.buildField = function(field, post, parent) {
// 	var manager = field.key && KarmaFieldMedia.createFieldManager(item, parent) || parent;
// 	var field = child.field || "group";
// 	var builder = KarmaFieldMedia.customfields[field];
// 	return builder && builder(manager);
// }




// KarmaFieldMedia.customfields.group = function(item, post, parent) {
// 	var manager = item.key && KarmaFieldMedia.createFieldManager(item, parent) || parent;
// 	return build({
// 		class: "karma-field-group",
// 		init: function(group, update) {
// 			if (item.class) {
// 				group.classList.add(item.class);
// 			}
// 			update();
// 		},
// 		children: function() {
// 			return [
// 				item.label && build({
// 					tag: "label",
// 					init: function(label) {
// 						label.htmlFor = item.key;
// 						label.innerHTML = item.label;
// 					}
// 				}),
// 				build({
// 					class: "karma-field-group-content",
// 					init: function(content, update) {
// 						update();
// 					},
// 					children: function() {
// 						return item.children && item.children.map(function(child) {
// 							if (KarmaFieldMedia.customfields[child.field || "group"]) {
// 								return KarmaFieldMedia.customfields[child.field || "group"](child, post, manager);
// 							}
// 						});
// 					}
// 				})
// 			];
// 		}
// 	});
// }


KarmaFieldMedia.customfields.group = function(field) {
	return build({
		class: "karma-field-group",
		init: function(group, update) {
			if (field.resource.class) {
				group.classList.add(field.resource.class);
			}
			update();
		},
		children: function() {
			return [
				field.resource.label && build({
					tag: "label",
					init: function(label) {
						label.htmlFor = field.resource.key;
						label.innerHTML = field.resource.label;
					}
				}),
				build({
					class: "karma-field-group-content karma-field-input",
					init: function(content, update) {
						update();
					},
					children: function() {
						return field.getChildren().map(function(child) {
							return child.build();
						});
					}
				})
			];
		}
	});
}


// KarmaFieldMedia.buildField = function(item, post, parent) {
// 	var manager = item.key && KarmaFieldMedia.createFieldManager(item, parent) || parent;
// 	var fieldname = child.field || "group";
// 	if (KarmaFieldMedia.customfields[fieldname]) {
// 		return KarmaFieldMedia.customfields[fieldname](manager);
// 	}
// }
//
// KarmaFieldMedia.buildGroup = function(item, post, parent) {
// 	var manager = item.key && KarmaFieldMedia.createFieldManager(item, parent) || parent;
// 	return build({
// 		class: "karma-field-group",
// 		init: function(group, update) {
// 			if (item.class) {
// 				group.classList.add(item.class);
// 			}
// 			update();
// 		},
// 		children: function() {
// 			return [
// 				item.label && build({
// 					tag: "label",
// 					init: function(label) {
// 						label.htmlFor = item.key;
// 						label.innerHTML = item.label;
// 					}
// 				}),
// 				build({
// 					class: "karma-field-group-content",
// 					init: function(content, update) {
// 						update();
// 					},
// 					children: function() {
// 						return item.children && item.children.map(function(child) {
// 							// return KarmaFieldMedia.buildField(child, post, manager);
// 							// var builder = KarmaFieldMedia.customfields[child.field || "group"];
// 							// var manager = KarmaFieldMedia.createFieldManager(child, post, parent);
// 							// return builder && builder(manager);
//
// 							var manager = KarmaFieldMedia.createFieldManager(child, post, parent);
//
// 							if (KarmaFieldMedia.v2_fields[child.field]) {
// 								return builder && KarmaFieldMedia.customfields[child.field](manager);
// 							} else {
// 								return KarmaFieldMedia.buildGroup(child, post, manager);
// 							}
//
// 							// return builder && builder(manager);
// 						});
// 					}
// 				})
// 			];
// 		}
// 	});
// }



// KarmaFieldMedia.customfields.text = function(item, post, parent) {
// 	var manager = KarmaFieldMedia.createFieldManager(item, parent);
// 	return build({
// 		class: "karma-field-text-input",
// 		children: function() {
// 			return [
// 				item.label && build({
// 					tag: "label",
// 					init: function(label) {
// 						label.htmlFor = item.key;
// 						label.innerHTML = item.label;
// 					}
// 				}),
// 				build({
// 					tag: "input",
// 					class: "text",
// 					init: function(input) {
// 						input.type = item.type || "text";
// 						input.id = item.key;
// 						// if (post.legacy_uri && post.legacy_uri !== post.uri) {
// 						// 	manager.query(post.legacy_uri).then(function(result) {
// 						// 		input.placeholder = result || item.placeholder || "";
// 						// 	});
// 						// }
// 						manager.legacy().then(function(result) {
// 							input.placeholder = result || item.placeholder || "";
// 						});
// 						manager.value().then(function(result) {
// 							input.value = result || "";
// 						});
// 						input.addEventListener("blur", function() {
//
// 							manager.save(input.value);
// 						});
// 					}
// 				})
// 			];
// 		}
// 	})
// }

KarmaFieldMedia.customfields.text = function(field) {
	return build({
		class: "karma-field-text-input",
		children: function() {
			return [
				field.resource.label && build({
					tag: "label",
					init: function(label) {
						label.htmlFor = field.resource.key;
						label.innerHTML = field.resource.label;
					}
				}),
				build({
					tag: "input",
					class: "karma-field-input",
					init: function(input) {
						input.type = field.resource.type || "text";
						input.id = field.resource.key;
						field.default().then(function(result) {
							input.placeholder = result;
						});
						field.value().then(function(result) {
							input.value = result;
						});
						input.addEventListener("blur", function() {
							field.save(input.value);
						});
					}
				})
			];
		}
	});
}


KarmaFieldMedia.customfields.select = function(field) {
	return build({
		class: "karma-field-select-input",
		children: function() {
			return [
				field.resource.label && build({
					tag: "label",
					init: function(label) {
						label.htmlFor = field.resource.key;
						label.innerHTML = field.resource.label;
					}
				}),
				build({
					tag: "select",
					class: "karma-field-input",
					children: function(value) {
						return field.resource.options.map(function(option) {
							return build({
								tag: "option",
								init: function(element) {
									element.innerHTML = option.name;
									element.value = option.key;
									element.selected = option.key === value;
								}
							});
						});
					},
					init: function(select, update) {
						select.addEventListener("change", function() {
							field.save(select.value);
						});
						field.value().then(function(value) {
							update(value);
						});
					}
				})
			];
		}
	});
};

KarmaFieldMedia.customfields.taxonomy = function(field) {
	// var selector = {};
	var url = KarmaFields.queryTermsURL+"/"+field.resource.key;
	// (KarmaFieldMedia.cache.query(url) || fetch(url, {
	// 	cache: "default"
	// })).then(function(response) {
	// 	return response.json();
	// }).then(function(results) {
	// 	selector.options = results.map(function(term) {
	// 		return {
	// 			key: term.term_id,
	// 			name: term.name + (field.count && " (" + term.count + ")" || "")
	// 		};
	// 	});
	// 	return results;
	// });

	var options = (KarmaFieldMedia.cache.query(url) || fetch(url, {
		cache: "default"
	})).then(function(response) {
		KarmaFieldMedia.cache.put(url, response);
		return response.json();
	});

	return build({
		class: "karma-field-text-input",
		children: function() {
			return [
				field.resource.label && build({
					tag: "label",
					init: function(label) {
						label.htmlFor = field.resource.key;
						label.innerHTML = field.resource.label;
					}
				}),
				field.resource.object === 'term' && build({
					tag: "select",
					class: "karma-field-input",
					children: function(options, value) {
						return options.map(function(option) {
							return build({
								tag: "option",
								init: function(element) {
									element.innerHTML = option.name;
									element.value = option.key;
									element.selected = option.key === value;
								}
							});
						});
					},
					init: function(select, update) {
						select.addEventListener("change", function() {
							field.save(select.value);
						});
						field.value().then(function(value) {
							options.then(function(results) {
								var items = results.map(function(option) {
									return {
										key: option.term_id,
										name: option.name
									}
								});
								items.unshift({
									key: "",
									name: "-"
								});
								update(items, value && value.id);
							});
						});
					}
				})
			];
		}
	});
};









KarmaFieldMedia.fields.multimedia = function(value, options, onSave) {
	var columns = options.columns;
	var items = value || [];
	var sortableManager = createSortableManager();
	// var dispatcher = {};
	// var onUpdateTable;

	sortableManager.checkTarget = function(target) {
		return sortableManager.items.indexOf(target.parentNode) > -1;
	};
	sortableManager.createPlaceholder = function(draggedElement) {
		placeholder = build({
			tag: "tr",
			class: "media-box-row placeholder",
			children: columns.map(function() {
				return build({
					tag: "td"
				});
			}).concat([
				build({
					tag: "td"
				})
			])
		});
		placeholder.style.height = draggedElement.clientHeight.toFixed()+"px";
		return placeholder;
	};
	sortableManager.onChange = function(dragFrom, dragTo) {
		var itemToMove = items.splice(dragFrom, 1)[0];
		items.splice(dragTo, 0, itemToMove);
	};
	sortableManager.onEndDrag = function(draggedElement, placeholder) {
		onSave && onSave(items);
	};



	var tableManager = {
		items: items,
		columns: columns
	};


	return build({
		class: "karma-multimedia",
		children: [
			build({
				tag: "table",
				class: "media-box-table widefat striped",
				update: function() {
					return {
						children: items.length && [
							options.columns.some(function(column) {
								return column.name;
							}) && build({
								tag: "thead",
								child: build({
									tag: "tr",
									children: columns.map(function(column) {
										return build({
											tag: "th",
											text: column.name,
											init: function(th) {
												th.style.width = column.width || (100/columns.length).toFixed(4)+"%";
											}
										});
									}).concat([
										build({
											tag: "th",
											init: function(th) {
												th.style.width = (100/columns.length).toFixed(4)+"%";
											}
										})
									])
								})
							}),
							build({
								tag: "tbody",
								children: items.map(function(item, itemIndex) {
									return build({
										tag: "tr",
										class: "media-box-row",
										update: function(groupManager) {
											return {
												children: columns.map(function(column) {
													return build({
														tag: "td",
														class: "media-box-cell.column-"+(column.key || "default"),
														child: column.field && KarmaFieldMedia.fields[column.field] && column.field && KarmaFieldMedia.fields[column.field](item[column.key], column, function(value) {
															item[column.key] = value;
															onSave && onSave(items);
														}, groupManager),
														init: function(cell) {
															cell.style.width = column.width || (100/columns.length).toFixed(4)+"%";
														}
													});
												}).concat(
													[build({
														tag: "td",
														class: "media-box-cell remove",
														child: build({
															tag: "button",
															class: "button",
															text: "✕",
															init: function(button) {
																button.onclick = function(event) {
																	event.preventDefault();
																	items.splice(itemIndex, 1);
																	onSave && onSave(items);
																	tableManager.update();
																}
															}
														})
													})]
												)
											};
										},
										init: function(row, update) {
											var groupManager = {};
											groupManager.item = item;
											groupManager.parent = tableManager;
											groupManager.onUpdate = update;
											update(groupManager);
											sortableManager.addItem(row);
										}
									});
								}),
								init: function(tbody) {
									sortableManager.reset();
									sortableManager.container = tbody;
								}
							})
						]
					};
				},
				init: function(table, update) {
					tableManager.update = update;
					update();
				}
			}),
			build({
				class: "media-box-control",
				children: [
					build({
						tag: "button",
						class: "button",
						text: options.button || "Add",
						init: function(button) {
							button.onclick = function(event) {
								event.preventDefault();
								items.push({});
								onSave && onSave(items);
								tableManager.update();
							}
						}
					})
					// build({
					// 	tag: "input",
					// 	init: function(input) {
					// 		input.type = "hidden";
					// 		// onSave = function() {
					// 		// 	input.value = items.length && JSON.stringify(items) || "";
					// 		// }
					// 	}
					// })
				]
			})
		]
	});
	//
	// // var settings = KarmaMultimedia.settings && KarmaMultimedia.settings[key] || {};
	//
	// return buildNode("div.karma-multimedia", function(update) {
	//
	//
	//
	// 	return build("div",
	//
	// 		items.length && build("table.media-box-table.widefat.striped",
	// 			build("thead",
	// 				build("tr",
	// 					columns.map(function(column) {
	// 						return build("th", column.name, function() {
	// 							this.style.width = column.width || (100/columns.length).toFixed(4)+"%";
	// 						});
	// 					}),
	// 					build("th.remove", "")
	// 				)
	// 			),
	// 			buildNode("tbody", function(updateTBody) {
	// 				sortableManager.reset();
	// 				sortableManager.container = this;
	// 				return items.map(function(item, itemIndex) {
	// 					var row = buildNode("tr.media-box-row", function(updateRow) {
	// 						return columns.map(function(column) {
	// 							// var input = column.input || column.inputs && (item.type && createCollection(column.inputs).getItem("type", item.type) || column.inputs[0]);
	// 							var currentInput = column.input;
	// 							if (column.inputs) {
	// 								// column.inputs.filter(function(input) {
	// 								// 	return input.type !== item.type;
	// 								// }).forEach(function(input) {
	// 								// 	item[input.key] = null;
	// 								// });
	//
	// 								column.inputs.forEach(function(input) {
	// 									if (input.type === item.type) {
	// 										currentInput = input;
	// 									}
	// 									// else {
	// 									// 	item[input.key] = null;
	// 									// }
	// 								});
	// 							}
	// 							var child = currentInput && KarmaMultimedia[currentInput.builder] && KarmaMultimedia[currentInput.builder](item, currentInput, column, items, columns, updateRow, dispatcher, update);
	// 							return build("td.media-box-cell.column-"+(currentInput.key || "default"), child, function() {
	// 								this.style.width = column.width || (100/columns.length).toFixed(4)+"%";
	// 							});
	// 						}).concat(
	// 							build("td.media-box-cell.remove",
	// 								build("button.button", "✕", function() {
	// 									this.addEventListener("click", function(event) {
	// 										event.preventDefault();
	// 										items.splice(itemIndex, 1);
	// 										update();
	// 									});
	// 								})
	// 							)
	// 						);
	// 					});
	// 					sortableManager.addItem(row);
	// 					return row;
	// 				});
	// 			})
	// 		),
	// 		build("div.media-box-control",
	// 			build("button.button.add-media", settings.add_button || "Ajouter", function() {
	// 				this.addEventListener("click", function(event) {
	// 					event.preventDefault();
	// 					// items.push(Object.assign && items.length > 0 && Object.assign({}, items[items.length-1]) || {});
	//
	// 					items.push({});
	// 					update();
	// 				});
	// 			}),
	// 			settings.copypast && build("button.button.add-media", "Copy/Past", function() {
	// 				this.addEventListener("click", function(event) {
	// 					event.preventDefault();
	// 					visibleInput = !visibleInput;
	// 					update();
	// 				});
	// 			}),
	// 			build("input.full-width", function(element) {
	// 				this.type = visibleInput ? "text" : "hidden";
	// 				this.name = name;
	// 				this.addEventListener("input", function() {
	// 					items = this.value && JSON.parse(this.value) || [];
	// 					update();
	// 				});
	// 				dispatcher.save = function() {
	// 					element.value = items.length && JSON.stringify(items) || "";
	// 				}
	// 				dispatcher.save();
	// 			})
	// 		)
	// 	);
	// });
};


KarmaFieldMedia.buildSelector = function(values, current, onChange) {
	return build({
		tag: "select",
		children: values.map(function(value) {
			return build({
				tag: "option",
				text: value.name,
				init: function(option) {
					option.value = value.key;
					option.selected = current && value.key.toString() === current.toString();
				}
			});
		}),
		init: function(select) {
			select.addEventListener("change", onChange);
		}
	});
};
KarmaFieldMedia.fields.select = function(value, options, save) {
	var values = options.values;
	return KarmaFieldMedia.buildSelector(values, value, function() { // [{key: "", name:"-"}].concat(
		save(this.value);
	})
};
KarmaFieldMedia.fields.modes = function(value, options, save, group) {
	return KarmaFieldMedia.buildSelector(options.values, value, function() {
		save(this.value);
		group.update();
	})
};

KarmaFieldMedia.fields.text = function(value, options, save) {
	return build({
		tag: "input",
		class: "text",
		init: function(input) {
			input.type = options.type || "text";
			input.value = value || "";
			if (options.placeholder) {
				input.placeholder = options.placeholder;
			}
			input.addEventListener("input", function() {
				save(input.value);
			});
		}
	});
};
KarmaFieldMedia.fields.textarea = function(value, options, save) {
	return build({
		tag: "textarea",
		class: "text",
		init: function(element) {
			element.value = value || "";
			if (options.placeholder) {
				element.placeholder = options.placeholder;
			}
			element.addEventListener("input", function() {
				save(element.value);
			});
		}
	});
}

KarmaFieldMedia.fields.checkbox = function(label, current, onChange) {
	return build({
		tag: "label",
		children: [
			build({
				tag: "input",
				init: function(input) {
					input.type = "checkbox",
					input.checked = current,
					input.addEventListener("change", function() {
						onChange(this.checked);
					});
				}
			}),
			build({
				tag: "span",
				text: label
			})
		]
	});
};

KarmaFieldMedia.fields.checkboxes = function(values, current, onChange) {
	return build({
		tag: "ul",
		class: "karma-field-checkboxes",
		init: function(ul) {
			ul.style.columnWidth = "200px";
		},
		children: values.map(function(value) {
			return build({
				tag: "li",
				child: KarmaFieldMedia.fields.checkbox(value.name, current.indexOf(value.key) > -1, function(checked) {
					var index = current.indexOf(value.key);
					if (checked && index === -1) {
						current.push(value.key);
					} else if (!checked && index > -1) {
						current.splice(index, 1);
					}
					onChange(current);
				})
			});
		})
	});
};

KarmaFieldMedia.fields.taxonomy = function(options, current, onChange) {
	return build({
		classes: "karma-field-taxonomy-field",
		init: function(element, update) {
			KarmaFieldMedia.terms.getPromise(options.taxonomy).then(function(terms) {
				update(terms);
			});
		},
		update: function(terms) {
			var values = terms.map(function(term) {
				var count = options.count && " (" + term.count + ")" || "";
				return {
					key: term.term_id,
					name: term.name + count
				};
			});
			if (options.type === "dropdown") {
				return {
					child: KarmaFieldMedia.buildSelector(values, current, function() {
						onChange([parseInt(this.value)]);
					})
				};
			} else {
				return {
					child: KarmaFieldMedia.fields.checkboxes(values, current, onChange)
				};
			}
		}
	});
};


// KarmaMultimedia.buildSelector = function(values, current, onChange) {
// 	return build("select",
// 		values.map(function(value) {
// 			return build("option", value.name, function() {
// 				this.value = value.key;
// 				this.selected = value.key.toString() === current.toString();
// 			});
// 		}), function() {
// 			this.addEventListener("change", onChange);
// 		}
// 	);
// };

// KarmaMultimedia.buildTypeSelector = function(item, input, column, items, columns, updateRow, dispatcher) {
// 	item.type = item.type || input.values[0].key;
// 	return KarmaMultimedia.buildSelector(input.values, item.type, function() { // [{key: "", name:"-"}].concat(
// 		item.type = this.value;
// 		if (dispatcher.save) {
// 			dispatcher.save();
// 		}
// 		updateRow();
// 	})
// };


KarmaFieldMedia.fields.image = function(value, options, save) {
	var imageManager = KarmaFieldMedia.createImageUploader();
	imageManager.imageId = value || null;
	imageManager.mimeType = options.mimeType || null;
	return build({
		class: "image-input",
		update: function(attachment) {
			if (attachment) {
				return {
					child: build({
						class: "image-box",
						children: [
							build({
								tag: "img",
								init: function(img) {
									img.src = attachment.url;
								}
							}),
							build({
								class: "image-name",
								text: attachment.filename || "?"
							})
						],
						init: function(imageBox) {
							imageBox.addEventListener("click", function() {
								imageManager.open();
							});
						}
					})
				};
			} else {
				return {
					child: build({
						tag: "button",
						class: "button",
						text: "Ajouter",
						init: function(button) {
							button.onclick = function(event) {
								event.preventDefault();
								imageManager.open();
							};
						}
					})
				};
			}
		},
		init: function(element, update) {

			imageManager.onSelect = function(attachments) {
				if (attachments.length) {
					var attachment = attachments[0];
					value = attachment.id;
					update({
						url: attachment.sizes && attachment.sizes.thumbnail.url || attachment.icon,
						filename: attachment.filename
					});
				} else {
					value = null;
					update();
				}
				save(value);
			};

			if (imageManager.imageId) {
				KarmaFieldMedia.getImageSrc(imageManager.imageId).then(function(results) {
					update({
						url: results.url,
						filename: results.filename || "?"
					});
				});
			} else {
				update();
			}
		}
	});
}







// KarmaMultimedia.buildImageInput = function(item, input, column, items, columns, updateRow, dispatcher, updateAll) {
// 	var imageManager = createImageUploader(input.mimetype, input.multiple);
// 	return buildNode("div.image-input", function(update) {
// 		imageManager.imageId = item[input.key];
// 		imageManager.onSelect = function(attachments) {
// 			if (attachments.length) {
// 				var attachment = attachments.shift();
// 				item[input.key] = attachment.id;
// 				// KarmaMultimedia.attachments[attachment.id] = {
// 				// 	filename: attachment.filename,
// 				// 	src: attachment.sizes && attachment.sizes.thumbnail && attachment.sizes.thumbnail.url || attachment.icon
// 				// };
// 				if (input.multiple && attachments.length) {
// 					attachments.forEach(function(attachment) {
// 						var newitem = {
// 							type: item.type
// 						}
// 						newitem[input.key] = attachment.id;
// 						items.push(newitem);
// 						// KarmaMultimedia.attachments[attachment.id] = {
// 						// 	filename: attachment.filename,
// 						// 	src: attachment.sizes && attachment.sizes.thumbnail && attachment.sizes.thumbnail.url || attachment.icon
// 						// };
// 					});
// 					updateAll();
// 				} else {
// 					update();
// 				}
// 				if (dispatcher.save) {
// 					dispatcher.save();
// 				}
// 			}
//
// 		};
// 		if (item[input.key]) {
// 			return build("div.media-box-image",
// 				buildPromise("div.image-box", null, function(updateImage, results) {
// 					this.addEventListener("click", function() {
// 						imageManager.open();
// 					});
// 					return build("div.image-box-content",
// 						build("img", function() {
// 							this.src = results.url;
// 						}),
// 						build("span.image-name", results.filename || "?")
// 					);
// 				}, KarmaMultimedia.getImageSrc(item[input.key])),
//
// 				// buildPromise("img", null, function(updateImage, results) {
// 				// 	this.src = results.url;
// 				// 	this.addEventListener("click", function() {
// 				// 		imageManager.open();
// 				// 	});
// 				// }, KarmaMultimedia.getImageSrc(item[input.key])),
// 				// build("span.image-name", attachment && attachment.filename || "?")
//
// 			);
// 		} else {
// 			return build("button.button", "Ajouter", function() {
// 				this.addEventListener("click", function(event) {
// 					event.preventDefault();
// 					imageManager.open();
// 				});
// 			});
// 		}
// 	});
// };




KarmaFieldMedia.fields.gallery = function(value, options, save) {
	var galleryManager = KarmaFieldMedia.createGalleryUploader();
	galleryManager.mimeTypes = options.mimeTypes || ["image"];
	galleryManager.imageIds = value;

	return build({
		class: "gallery-input",
		update: function(attachments) {
			if (attachments.length) {
				return {
					child: build({
						class: "image-box",
						children: attachments.map(function(attachment) {
							return build({
								class: "image-box-thumb",
								update: function(src) {
									return {
										child: build({
											tag: "img",
											init: function(img) {
												img.src = src;
											}
										})
									};
								},
								init: function(thumb, update) {
									if (typeof attachment === "object") {
										update(attachment.attributes.sizes && attachment.attributes.sizes.thumbnail.url || attachment.attributes.icon);
									} else {
										KarmaFieldMedia.getImageSrc(attachment).then(function(results) {
											update(results.url);
										});
									}
								}
							});
						}),
						init: function(galleryBox) {
							galleryBox.addEventListener("click", function() {
								galleryManager.open();
							});
						}
					}),
				};
			} else {
				return {
					child: build({
						tag: "button",
						class: "button",
						text: "Ajouter",
						init: function(button) {
							button.onclick = function(event) {
								event.preventDefault();
								galleryManager.open();
							};
						}
					})
				};
			}
		},
		init: function(element, update) {
			galleryManager.onChange = function(attachments) {
				value = attachments.map(function(attachment) {
					return attachment.id;
				});
				update(attachments);
				save(value);
			};
			update(galleryManager.imageIds || []);
		}
	});
}


// KarmaMultimedia.buildGalleryInput = function(item, input, column, items, columns, updateRow, dispatcher) {
// 	var manager = createGalleryUploader();
// 	return buildNode("div.gallery-input", function(update) {
// 		manager.imageIds = item[input.key];
// 		manager.onChange = function(attachments) {
// 			item[input.key] = attachments.map(function(attachment) {
// 				// KarmaMultimedia.attachments[attachment.id] = {
// 				// 	filename: attachment.filename,
// 				// 	src: attachment.sizes && attachment.sizes.thumbnail && attachment.sizes.thumbnail.url || attachment.icon
// 				// };
// 				return attachment.id;
// 			});
// 			if (dispatcher.save) {
// 				dispatcher.save();
// 			}
// 			update();
// 		};
// 		if (item[input.key]) {
// 			return build("div.media-box-gallery", item[input.key].map(function(id) {
// 				// var attachment = KarmaMultimedia.attachments && KarmaMultimedia.attachments[id];
// 				return build("div.media-box-gallery-thumb",
// 					// build("img", function() {
// 					// 	this.src = attachment && attachment.src || KarmaMultimedia.ajax_url+"?action=karma_multimedia_get_image&id="+id;
// 					// }),
// 					buildPromise("img", null, function(updateImage, results) {
// 						this.src = results.url;
// 					}, KarmaMultimedia.getImageSrc(id))
// 					// build("input", function() {
// 					// 	this.type = "hidden";
// 					// 	this.name = "karma-mm-attachments[]";
// 					// 	this.value = id;
// 					// })
// 				);
// 				// var img = build("img");
// 				// img.src = KarmaMultimedia.ajax_url+"?action=karma_multimedia_get_image&id="+id;
// 				// return img;
// 			}), function() {
// 				this.addEventListener("click", function() {
// 					manager.open();
// 				});
// 			});
// 		} else {
// 			return build("button.button", "Ajouter", function() {
// 				this.addEventListener("click", function(event) {
// 					event.preventDefault();
// 					manager.open();
// 				});
// 			});
// 		}
// 	});
// };

// KarmaMultimedia.buildCustomSelector = function(item, input, column, items, columns, updateRow, dispatcher) {
// 	item[input.key] = item[input.key] || input.values[0].key.toString();
// 	return KarmaMultimedia.buildSelector(input.values, item[input.key.toString()], function() { // [{key: "", name:"-"}].concat(
// 		item[input.key] = this.value;
// 		if (dispatcher.save) {
// 			dispatcher.save();
// 		}
// 	})
// };



// KarmaMultimedia.buildTextInput = function(item, input, column, items, columns, updateRow, dispatcher) {
// 	if (!item[input.key] || typeof item[input.key] === "string") {
// 		item[input.key] = {};
// 	}
// 	return build("input.text", function() {
// 		this.type = "text";
// 		if (input.translatable) {
// 			this.placeholder = item[input.key].placeholder || "";
// 		} else if (input.placeholder) {
// 			this.placeholder = input.placeholder;
// 		}
// 		this.value = item[input.key].text || input.default || "";
// 		this.addEventListener("blur", function() {
// 			item[input.key].text = this.value;
// 			if (dispatcher.save) {
// 				dispatcher.save();
// 			}
// 		});
// 	});
// }
// KarmaMultimedia.buildBasicTextInput = function(item, input, column, items, columns, updateRow, dispatcher) {
// 	return build("input.text", function() {
// 		this.type = "text";
// 		this.value = item[input.key] || input.default_key && item[input.default_key] || "";
// 		if (input.placeholder) {
// 			this.placeholder = input.placeholder;
// 		}
// 		this.addEventListener("input", function() {
// 			item[input.key] = this.value;
// 			if (dispatcher.save) {
// 				dispatcher.save();
// 			}
// 		});
// 	});
// }
// KarmaMultimedia.buildBasicTextArea = function(item, input, column, items, columns, updateRow, dispatcher) {
// 	return build("textarea.text", function() {
// 		this.value = item[input.key] || input.default_key && item[input.default_key] || "";
// 		if (input.placeholder) {
// 			this.placeholder = input.placeholder;
// 		}
// 		this.addEventListener("input", function() {
// 			item[input.key] = this.value;
// 			if (dispatcher.save) {
// 				dispatcher.save();
// 			}
// 		});
// 	});
// }

// KarmaMultimedia.fields.date = function(item, input, column, items, columns, save) {
// 	return DateField.buildDateField(item[input.key], input, function(sqlDate) {
// 		item[input.key] = sqlDate;
// 		save();
// 	});
// }

// KarmaMultimedia.buildDateInput = function(item, input, column, items, columns, updateRow, dispatcher) {
// 	return build("input.text", function() {
// 		var dateManager = createDatePopupManager(this);
// 		dateManager.sqlDate = item[input.key] || input.default_key && item[input.default_key] || "";
// 		dateManager.init();
// 		this.type = "text";
//
// 		// this.value = item[input.key] || input.default_key && item[input.default_key] || "";
// 		if (input.placeholder) {
// 			this.placeholder = input.placeholder;
// 		}
//
// 		dateManager.onUpdate = function() {
//
// 			item[input.key] = dateManager.sqlDate;
// 			if (dispatcher.save) {
// 				dispatcher.save();
// 			}
// 		};
// 	});
// }

// KarmaMultimedia.fields.multidate = function(item, input, column, items, columns, updateRow, dispatcher) {
// 	if (!item[input.key]) {
// 		item[input.key] = [""];
// 	}
// 	return buildNode("div.multidate", function(updateDates) {
// 		return build("div.multidate-content",
// 			item[input.key] && item[input.key].length && build("ul", item[input.key].map(function(sqlDate, index) {
// 				return build("li",
// 					build("input.text", function() {
// 						var dateManager = createDatePopupManager(this);
// 						dateManager.sqlDate = sqlDate;
// 						dateManager.init();
// 						dateManager.onUpdate = function() {
//
// 							item[input.key][index] = dateManager.sqlDate;
// 							// updateDates();
// 							if (dispatcher.save) {
// 								dispatcher.save();
// 							}
// 						};
// 					}),
// 					index > 0 && build("button.button", "✕", function() {
// 						this.addEventListener("click", function(event) {
// 							event.preventDefault();
// 							item[input.key].splice(index, 1);
// 							updateDates();
// 						});
// 					})
// 				);
// 			})),
// 			build("button.button", input.more_button || "+", function() {
// 				this.addEventListener("click", function(event) {
// 					event.preventDefault();
// 					item[input.key].push(item[input.key].length && item[input.key][item[input.key].length-1] || "");
// 					updateDates();
// 				});
// 			})
// 		);
// 	});
// }


// KarmaFieldMedia.fields.select_post = function(value, options, save) {
// 	return build({
// 		class: "post-selector",
// 		onUpdate: function(posts) {
// 			return {
// 				child: KarmaFieldMedia.fields.select(posts, options, save)
// 			}
// 		},
// 		init: function(container) {
// 			KarmaFieldMedia.karma_field_query_posts({
// 				post_type: "trainer"
// 			}).then(function(results) {
// 				console.log(results);
// 				update(results.posts || []);
// 			});
// 		}
// 	});
// };
