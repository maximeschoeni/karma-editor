KarmaFields.Transfer = {}
KarmaFields.Transfer.cache = {};
KarmaFields.Transfer.serialize = function(object) {
	var params = [];
	for (var key in object) {
		if (object[key]) {
			params.push(key + "=" + encodeURIComponent(object[key]));
		}
	}
	return params.join("&");
}
KarmaFields.Transfer.clean = function(object) {
	var params = {};
	for (var key in object) {
		if (object[key]) {
			params[key] = object[key];
		}
	}
	return params;
}
KarmaFields.Transfer.query = function(driver, params) {
	var file = KarmaFields.restURL+"/query/"+driver;
	var serial = this.serialize(params);
	if (serial) {
		file += "?"+serial;
	}
	return fetch(file, {
		cache: "default" // force-cache
	}).then(function(response) {
		return response.json();
	});
};
KarmaFields.Transfer.update = function(driver, params) {
	var file = KarmaFields.restURL+"/update/"; //+driver
	var params = this.clean(params);
	return fetch(file, {
		method: "post",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify(params),
		mode: "same-origin"
	}).then(function(response) {
		return response.json();
	});
};
KarmaFields.Transfer.add = function(driver, params) {
	var file = KarmaFields.restURL+"/add/"+driver
	return fetch(file, {
		method: "post",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify(params),
		mode: "same-origin"
	}).then(function(response) {
		return response.json();
	});
};
KarmaFields.Transfer.get = function(driver, path, key, cache) {
	var file;
	if (cache && KarmaFields.cacheURL) {
		file = [KarmaFields.cacheURL, driver, path || [], cache].join("/");
	} else {
		file = [KarmaFields.restURL, "get", driver, path || [], key].join("/");
	}
	return fetch(file, {
		cache: "reload"
	}).then(function(response) {
		if (!cache || cache.slice(-5) === ".json") {
			return response.json();
		} else {
			return response.text();
		}
	});

	// if (!this.cache[file]) {
	// 	this.cache[file] = fetch(file, {
	// 		cache: "reload"
	// 	}).then(function(response) {
	// 		if (!cache || cache.slice(-5) === ".json") {
	// 			return response.json();
	// 		} else {
	// 			return response.text();
	// 		}
	// 	});
	// 	return this.cache[file];
	// }
};
KarmaFields.Transfer.fetch = function(driver, key, params) {
	var file = [].concat(KarmaFields.restURL, "fetch", driver, key).join("/");
	var serial = this.serialize(params);
	if (serial) {
		file += "?"+serial;
	}
	if (!this.cache[file]) {
		this.cache[file] = fetch(file, {
			cache: "default" // force-cache
		}).then(function(response) {
			return response.json();
		});
	}
	return this.cache[file];
};
