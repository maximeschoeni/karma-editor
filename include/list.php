<div class="wrap">
<h1 class="wp-heading-inline">Pages</h1><a href="http://localhost:8888/wordpress/wp-admin/post-new.php?post_type=page" class="page-title-action">Add New</a>
<hr class="wp-header-end">
<div id="karma-editor-list"></div>
<script>
  addEventListener("DOMContentLoaded", function() {
    var post_type = "<?php echo $post_type; ?>";
    var post_type_object = <?php echo json_encode(get_post_type_object($post_type)); ?>;
    var options = <?php echo json_encode($options); ?>;
    var container = document.getElementById("karma-editor-list");
    container.appendChild(
      Karma.buildList(post_type_object, options)
    );
  });
</script>
</div>
