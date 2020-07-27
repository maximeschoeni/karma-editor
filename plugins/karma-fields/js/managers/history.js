KarmaFieldMedia.managers.history = function() {
	var history = {
		index: 0,
		initialIndex: 0,
		total: 0,
		pool: KarmaFieldMedia.managers.pool(),
		posts: [],
		archives: [],
		save: function() {

			this.archives[this.index] = JSON.stringify(this.posts);
			this.index++;
			this.pool.deleteUp(this.index);
			if (this.archives.length > this.index) {
				this.archives.splice(this.index, this.archives.length - this.index);
			}
			this.total = this.index;
		},
		undo: function() {
			// console.log("undo", this.pool);
			if (this.index > 0) {
				this.archives[this.index] = JSON.stringify(this.posts);
				this.index--;
				this.posts = JSON.parse(this.archives[this.index]);
				if (this.onUpdate) {
					this.onUpdate();
					// if (manager.render) {
					// 	manager.render();
					// }
					// if (manager.renderFooter) {
					// 	manager.renderFooter();
					// }
				}
			}
		},
		redo: function() {
			if (this.index < this.total) {

				this.index++;
				this.posts = JSON.parse(this.archives[this.index]);

				if (this.onUpdate) {
					this.onUpdate();
					// if (manager.render) {
					// 	manager.render();
					// }
					// if (manager.renderFooter) {
					// 	manager.renderFooter();
					// }
				}
			}
		},
		get: function(uri, key) {
			return this.pool.get(uri, key, this.index);
		},
		set: function(uri, key, value) {
			this.pool.set(uri, key, this.index, value);
		}
		// updatePool: function(uri, key, value) {
		// 	this.pool.setAt(value, this.index, uri, key);
		// }
	};
	return history;
}