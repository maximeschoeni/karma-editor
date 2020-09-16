<div id="karma-fields-table-<?php echo $id; ?>-container" class="karma-fields-table"></div>
<script>
	// (function() {
	document.addEventListener("DOMContentLoaded", function() {
		var container = document.getElementById("karma-fields-table-<?php echo $id; ?>-container");
		var resource = <?php echo json_encode($args); ?>;


		var tableManager = KarmaFields.managers.table(resource);

		window.tableManager = tableManager;


		KarmaFields.build(tableManager.build(), container);

	});
	// })();
</script>
