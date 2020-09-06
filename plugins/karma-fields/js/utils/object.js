KarmaFields.Object = {};
KarmaFields.Object.getValue = function(object, keys) {
	if (keys.length) {
		var key = keys.shift();
		if (key) {
			if (typeof object[key] === "object") {
				return this.getValue(object[key], keys);
			}
			return object[key];
		}
	}
	return object;
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
KarmaFields.Object.setValue = function(object, keys, value, soft) {
	if (keys[1]) {
		var key = keys.shift();
		if (!object[key]) {
			object[key] = {};
		}
		this.setValue(object[key], keys, value);
	} else if (keys[0]) {
		if (typeof value === "object") {
			if (!object[keys[0]]) {
				if (Array.isArray(value)) {
					object[keys[0]] = [];
				} else {
					object[keys[0]] = {};
				}
			}
			object[keys[0]] = object[keys[0]] || {};
			this.merge(object[keys[0]], value, soft);
		} else if (!soft || object[keys[0]] === undefined) {
			object[keys[0]] = value;
		}
	}
}
KarmaFields.Object.merge = function(object1, object2, soft) {
	for (var i in object2) {
		if (object2[i] && typeof object2[i] === "object") {
			this.merge(object1[i] || {}, object2[i]);
		} else if (!soft || object1[i] === undefined) {
			object1[i] = object2[i];
		}
	}
	return object1;
}
KarmaFields.Object.clone = function(object) {
	if (typeof object === "object") {
		if (Array.isArray(object)) {
			return this.merge([], object);
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
    if (obj1[i] === "object") {
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
KarmaFields.Object.mask = function(obj, mask) {
  var result = {};
  for (var i in mask) {
    if (mask[i] === "object") {
      result[i] = this.mask(mask[i], obj[i] || {});
    } else {
      result[i] = obj[i];
    }
  }
  return result;
};
KarmaFields.Object.isEmpty = function(object) {
	for (var i in object) {
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
