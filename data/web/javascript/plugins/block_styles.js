/*!
 * froala_editor v1.2.4 (http://editor.froala.com)
 * Copyright 2014-2014 Froala
 */

(function ($) {
  /**
   * Update block styles.
   */
  $.Editable.prototype.refreshBlockStyles = function () {
    var element = this.getSelectionElements()[0];
    var active_block_tag = element.tagName.toLowerCase();

    // Clear styles.
    this.$bttn_wrapper.find('.fr-block-style').empty();

    var block_style = this.options.blockStyles[active_block_tag];
    if (block_style === undefined) {
      block_style = this.options.defaultBlockStyle;
    }

    // Check if there are any block styles available.
    if (block_style !== undefined) {
      this.$bttn_wrapper.find('.fr-dropdown > button[data-name="blockStyle"].fr-trigger').removeAttr('disabled');

      for (var cls in block_style) {
        var style = block_style[cls];
        var active = '';
        if ($(element).hasClass(cls)) {
          active = ' class="active"';
        }

        this.$bttn_wrapper.find('.fr-block-style').append(
          $('<li' + active + '>').append($('<a href="#" data-text="true">').text(style).addClass(cls))
            .attr('data-cmd', 'blockStyle')
            .attr('data-val', cls)
        )
      }
    }
  };

  $.Editable.commands = $.extend($.Editable.commands, {
    blockStyle: {
      title: 'Block Style',
      icon: 'fa fa-magic',
      refreshOnShow: $.Editable.prototype.refreshBlockStyles,
      callback: function (cmd, val, param) {
        this.blockStyle(val, param);
      },
      undo: true
    }
  });

  $.Editable.DEFAULTS = $.extend($.Editable.DEFAULTS, {
    defaultBlockStyle: {
      'f-italic': 'Italic',
      'f-typewriter': 'Typewriter',
      'f-spaced': 'Spaced',
      'f-uppercase': 'Uppercase'
    },
    blockStylesToggle: true,
    blockStyles: {}
  })

  $.Editable.prototype.command_dispatcher = $.extend($.Editable.prototype.command_dispatcher, {
    blockStyle: function (command) {
      var dropdown = this.buildDropdownBlockStyle(command);
      var btn = this.buildDropdownButton(command, dropdown);
      return btn;
    }
  });

  /**
   * Dropdown for formatBlock.
   *
   * @param command
   * @returns {*}
   */
  $.Editable.prototype.buildDropdownBlockStyle = function () {
    var dropdown = '<ul class="fr-dropdown-menu fr-block-style">';

    dropdown += '</ul>';

    return dropdown;
  };

  /**
   * Block style.
   *
   * @param val
   */
  $.Editable.prototype.blockStyle = function (val, param) {
    var element = this.getSelectionElements()[0];
    var active_block_tag = element.tagName.toLowerCase();

    this.formatBlock(active_block_tag, val, param);
  };

})(jQuery);
