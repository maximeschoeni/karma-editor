KarmaFields.Object = {};
// KarmaFields.Object.getValue = function(object, keys) {
// 	if (keys.length) {
// 		var key = keys.shift();
// 		if (key) {
// 			if (typeof object[key] === "object") {
// 				return this.getValue(object[key], keys);
// 			}
// 			return object[key];
// 		}
// 	}
// 	return object;
// };
KarmaFields.Object.getValue = function(object, keys) {
	var key = keys[0];
	if (key) {
		if (object[key] && typeof object[key] === "object") {
			return this.getValue(object[key], keys.slice(1));
		}
		return this.clone(object[key]);
	}
	return object;
};

KarmaFields.Object.empty = function(object, keys) {
	var key = keys[0];
	if (keys.length > 1 && object[key] && typeof object[key] === "object") {
		this.empty(object[key], keys.slice(1));
	} else if (key) {
		object[key] = {};
	}
};
// KarmaFields.Object.setValue = function(object, keys, value, soft) {
// 	if (keys[1]) {
// 		var key = keys.shift();
// 		if (!object[key]) {
// 			object[key] = {};
// 		}
// 		this.setValue(object[key], keys, value);
// 	// } else if (keys[0] && typeof value === "object") {
// 	// 	object[keys[0]] = object[keys[0]] || {};
// 	// 	this.merge(object[key], value, soft);
// 	} else if (keys[0] && (!soft || object[keys[0]] === undefined)) {
// 		object[keys[0]] = value;
// 	}
// }
// KarmaFields.Object.setValue = function(object, keys, value, soft) {
// 	if (keys[1]) {
// 		var key = keys.shift();
// 		if (!object[key]) {
// 			object[key] = {};
// 		}
// 		this.setValue(object[key], keys, value);
// 	} else if (keys[0]) {
// 		if (typeof value === "object") {
// 			if (!object[keys[0]]) {
// 				if (Array.isArray(value)) {
// 					object[keys[0]] = [];
// 				} else {
// 					object[keys[0]] = {};
// 				}
// 			}
// 			object[keys[0]] = object[keys[0]] || {};
// 			this.merge(object[keys[0]], value, soft);
// 		} else if (!soft || object[keys[0]] === undefined) {
// 			object[keys[0]] = value;
// 		}
// 	}
// }

// {
// 	a: {
// 		b: {
// 			c: [
// 				"x"
// 			]
// 		}
// 	}
// }
KarmaFields.Object.setValue = function(object, keys, value, soft) {
	if (keys[1]) {
		var key = keys[0];
		if (!object[key]) {
			object[key] = {};
		}
		this.setValue(object[key], keys.slice(1), value, soft);
	} else if (keys[0]) {
		if (object && typeof value === "object" && !Array.isArray(value)) {
			if (!object[keys[0]]) {
				// if (Array.isArray(value)) {
				// 	object[keys[0]] = [];
				// } else {
				// 	object[keys[0]] = {};
				// }
				object[keys[0]] = {};
			}
			object[keys[0]] = object[keys[0]] || {};
			this.merge(object[keys[0]], value, soft);
		} else if (!soft || object[keys[0]] === undefined) {
			object[keys[0]] = this.clone(value);
		}
	}
}
KarmaFields.Object.delete = function(object, keys) {
	this.setValue(object, keys, undefined);
}
KarmaFields.Object.merge = function(object1, object2, soft) {
	for (var i in object2) {
		if (object2[i] && typeof object2[i] === "object" && !Array.isArray(object2[i])) {
			if (!object1[i]) {
				// if (Array.isArray(object2[i])) {
				// 	object1[i] = [];
				// } else {
				// 	object1[i] = {};
				// }
				object1[i] = {};
			}
			this.merge(object1[i], object2[i], soft);
		} else if (object2[i] !== undefined && (!soft || object1[i] === undefined)) {
			object1[i] = this.clone(object2[i]);
		}
	}
	return object1;
}
KarmaFields.Object.clone = function(object) {
	if (object && typeof object === "object") {
		if (Array.isArray(object)) {
			// return this.merge([], object);
			return object.slice();
		}
		return this.merge({}, object);
	}
	return object;
};
// KarmaFields.Object.hasDiff = function(obj1, obj2) {
//   if (obj1 && typeof obj1 === "object") {
//     for (var i in obj1) {
//       if (!obj2 || this.hasDiff(obj1[i], obj2[i] || {})) {
//         return true;
//       }
//     }
//   } else {
//     return obj1 !== obj2;
//   }
// };
KarmaFields.Object.diff = function(obj1, obj2) {
  var diff = null;
  for (var i in obj1) {
    if (obj1[i] && typeof obj1[i] === "object" && !Array.isArray(obj1[i])) {
      var sub = this.diff(obj1[i], obj2[i] || {});
      if (sub) {
        diff = diff || {};
        diff[i] = sub;
      }
    } else if (obj1[i] !== obj2[i]) {
      diff = diff || {};
      diff[i] = obj1[i];
    }
  }
  return diff;
};
KarmaFields.Object.diff = function(obj1, obj2) {
  var diff = null;
	if (obj1 && typeof obj1 === "object" && !Array.isArray(obj1)) {
		for (var i in obj1) {
			var sub = this.diff(obj1[i], obj2[i] || {});
      if (sub) {
        diff = diff || {};
        diff[i] = sub;
      }
		}
	} else {
		diff = this.clone(obj2)
	}
  return diff;
};
KarmaFields.Object.contain = function(obj1, obj2) {
	if (obj1 && obj2 && typeof obj2 === "object" && !Array.isArray(obj2)) {
		for (var i in obj2) {
      if (!this.contain(obj1[i], obj2[i])) {
        return false;
      }
		}
		return true;
	} else {
		return obj1 === obj2;
	}
};


KarmaFields.Object.mask = function(obj, mask) {
  var result = {};
  for (var i in mask) {
    if (mask[i] && typeof mask[i] === "object" && !Array.isArray(mask[i])) {
      result[i] = this.mask(obj[i] || {}, mask[i]);
    } else {
      result[i] = this.clone(obj[i]);
    }
  }
  return result;
};

// KarmaFields.Object.clean = function(object) {
// 	var isNotEmpty;
// 	if (object && typeof object === "object") {
// 		for (var i in object) {
//
// 			if (object[i] !== undefined || typeof object[i] === "object") {
//
// 			}
// 		}
// 	}
//
// 	return object;
// };
KarmaFields.Object.isEmpty = function(object) {
	if (object && typeof object === "object") {
		for (var i in object) {
			if (!KarmaFields.Object.isEmpty(object[i])) {
				return false;
			}
		}
	} else if (object !== undefined) {
		return false;
	}
	return true;
};
KarmaFields.Object.serialize = function(object) {
	var params = [];
	for (var key in object) {
    params.push(key + "=" + encodeURIComponent(object[key]));
	}
	return params.join("&");
}
