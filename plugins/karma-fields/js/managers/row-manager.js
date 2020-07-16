KarmaFieldMedia.managers.row = function(post, table) {
	var manager = {
		fields: [],
		addField: function(fieldManager) {
			this.fields.push(fieldManager);

		},
		getURI: function() {
			return post.uri;
		},


		findCache: function(key) {
			var index = table.history.index;
			var item = JSON.parse(KarmaFieldMedia.cache.getItem(table.resource.middleware+"/"+post.uri+"/"+index));
			while (index > 0 && (item === null || item[key] === undefined)) {
				index--;
				item = JSON.parse(KarmaFieldMedia.cache.getItem(table.resource.middleware+"/"+post.uri+"/"+index));
			}
			return item[key];
		},

		getCache: function(index) {
			return JSON.parse(KarmaFieldMedia.cache.getItem(table.resource.middleware+"/"+post.uri+"/"+index));
		},
		updateCache: function(uri, value) {
			if (resource.type === "json") {
				value = JSON.stringify(value || "");
			}
			KarmaFieldMedia.cache.setItem(this.table.resource.middleware+"/"+uri+"/"+this.table.history.index+"/"+resource.key, value);
		},

	};

	return manager;
}
