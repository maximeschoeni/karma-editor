<?php


Class Karma_Query_Taxonomy {

  public function __construct($request) {
    global $wpdb;

    $this->request = $request;

    $query = new stdClass();

    $this->sql = $wpdb->prepare("SELECT t.term_id AS id, t.slug, t.name FROM $wpdb->terms AS t
    INNER JOIN $wpdb->term_taxonomy AS tt ON (t.term_id = tt.term_id)
    WHERE tt.taxonomy = %s
    ORDER BY t.name ASC", $request['taxonomy']);


    $this->terms = $wpdb->get_results($this->sql);

    $this->query = $query;

  }


}
