<div id="karma-fields-table-<?php echo $id; ?>-container" class="karma-fields-table"></div>

<script>
	// (function() {
	document.addEventListener("DOMContentLoaded", function() {
		var container = document.getElementById("karma-fields-table-<?php echo $id; ?>-container");
		var resource = <?php echo json_encode($args); ?>;



		// var save = <?php //echo $save; ?>;

		var history = KarmaFields.History.createInstance();



		// history.store = save.store || {};
		// history.undos = save.undos || [];
		// history.redos = save.redos || [];
		// history.temp = save.temp || {};

		// if (Array.isArray(history.store.output)) {
		// 	history.store.output = {};
		// }
		// if (Array.isArray(history.store.input)) {
		// 	history.store.input = {};
		// }
		// if (Array.isArray(history.store.inner)) {
		// 	history.store.inner = {};
		// }
		// if (Array.isArray(history.temp)) {
		// 	history.temp = {};
		// }
		// history.store.static = {};

		var tableManager = KarmaFields.managers.table(resource, history);

		window.tableManager = tableManager;

		KarmaFields.build(tableManager.build(), container);

	});
	// })();
</script>
