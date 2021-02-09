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
		var resource = <?php echo json_encode($args); ?>;
		var history = {
			index: 0
		};

		let field = KarmaFields.Field(resource);


		KarmaFields.build({
			init: function(item) {
				field.events.change = function() {
					KarmaFields.History.update(currentField);
					currentField.history.save();
					input.value = JSON.stringify(field.getValue());
				};
				field.events.render = function() {
					item.render();
				};
			},
			child: KarmaFields.fields["group"](field)
		}, container);



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
