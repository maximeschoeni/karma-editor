<div id="karma-fields-field-<?php echo $index; ?>-container" class="karma-fields"></div>
<input type="hidden" name="karma-fields-items[]" id="karma-fields-input-<?php echo $index; ?>">

<?php
	$action = "karma_field-action";
	$nonce = "karma_field-nonce";

	wp_nonce_field($action, $nonce, false, true);
 ?>
<script>
	document.addEventListener("DOMContentLoaded", function() {
		var container = document.getElementById("karma-fields-field-<?php echo $index; ?>-container");
		var input = document.getElementById("karma-fields-input-<?php echo $index; ?>");
		let resource = <?php echo json_encode($args); ?>;
		let id = <?php echo $post->ID; ?>;
		let history = KarmaFields.History.createInstance();
		//  {
		// 	index: 0,
		// 	flux: undefined,
		// 	update: function(flux) {
		// 		if (flux !== this.flux || KarmaFields.History.current !== this) {
		// 			this.flux = flux;
		// 			KarmaFields.History.current = this;
		// 			this.index++;
		// 		}
		// 	}
		// };

		KarmaFields.build({
			init: function(item) {
				// let globalfield = KarmaFields.Field({
				// 	key: "posts"
				// });
				// let postfield = KarmaFields.Field({
				// 	key: id
				// });
				// let field = KarmaFields.Field(resource);

				let field = KarmaFields.Field({
					driver: "posts"
				}).createChild({
					key: id
				}).createChild(resource);

				field.events.update = function() {
					input.value = JSON.stringify(field.getRoot().getValue());
					item.render();
				}

				field.events.change = function(field) {
					history.update(field.state || field.getId());
					field.history.save(history.index);
				}

				field.queryValue();


				this.child = KarmaFields.Fields[resource.name || resource.field || "group"](field);
			}

		}, container);




		// window.fieldHistory = history; // -> for debug
		//
		// var fieldManager = history.createFieldManager(resource);
		// fieldManager.buffer = "input";
		// fieldManager.outputBuffer = "output";

		// fieldManager.uri = id;
		// fieldManager.events.update = function() {
		// 	var output = history.getValue(["output"]);
		// 	input.value = JSON.stringify(output);
		// };
		//
		// var fieldNode = KarmaFields.build({
		// 	children: fieldManager.build()
		// }, container);
		//
		//
		//
		// window.ktable = fieldNode; // -> for debug

		// container.addEventListener("focusin", function() {
		// 	KarmaFields.events.onUndo = function(event) {
		// 		history.undo();
		// 		fieldNode.render();
		// 		event.preventDefault();
		// 	}
		// 	KarmaFields.events.onRedo = function(event) {
		// 		history.redo();
		// 		event.preventDefault();
		// 	}
		// });

	});
</script>
