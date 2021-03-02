<?php


class Karma_Cheat_Options {

	/**
	 * options name
	 */
	var $option_name = 'karma_cheat';

	/**
	 *	options cache
	 */
	var $options;

	/**
	 *	get option
	 */
	public function get_option($name, $fallback = false) {

		$options = $this->get_options();

		if (isset($options[$name])) {

			return $options[$name];

		}

		return $fallback;
	}

	/**
	 *	get options
	 */
	public function get_options() {

		if (!isset($this->options)) {

			$this->options = get_option($this->option_name);

		}

		return $this->options;
	}

	/**
	 * Update option
	 */
	public function update_option($name, $value) {

		$this->options = $this->get_options();

		$this->options[$name] = $value;

		update_option($this->option_name, $this->options);

	}

}
