/*!
 * froala_editor v1.2.4 (http://editor.froala.com)
 * Copyright 2014-2014 Froala
 */

(function ($) {
  $.Editable.DEFAULTS = $.extend($.Editable.DEFAULTS, {
    colors: [
      '#61BD6D', '#1ABC9C', '#54ACD2', '#2C82C9', '#9365B8', '#475577', '#CCCCCC',
      '#41A85F', '#00A885', '#3D8EB9', '#2969B0', '#553982', '#28324E', '#000000',
      '#F7DA64', '#FBA026', '#EB6B56', '#E25041', '#A38F84', '#EFEFEF', '#FFFFFF',
      '#FAC51C', '#F37934', '#D14841', '#B8312F', '#7C706B', '#D1D5D8', 'REMOVE'
    ],
    colorsStep: 7
  });

  $.Editable.prototype.refreshColors = function () {
    var element = this.getSelectionElement();
    this.$editor.find('.fr-color-picker button.fr-color-bttn').removeClass('active');
    this.refreshColor(element, 'background-color', 'backColor');
    this.refreshColor(element, 'color', 'foreColor');
  };

  $.Editable.prototype.refreshColor = function (element, color_type, cmd) {
    while ($(element).get(0) != this.$element.get(0)) {
      // Not transparent.
      if (!($(element).css(color_type) === 'transparent' || $(element).css(color_type) === 'rgba(0, 0, 0, 0)')) {
        this.$editor.find('.fr-color-picker button.fr-color-bttn[data-param="' + cmd + '"][data-val="' + $.Editable.RGBToHex($(element).css(color_type)) + '"]').addClass('active');
        break;
      } else {
        element = $(element).parent();
      }
    }
  }

  $.Editable.commands = $.extend($.Editable.commands, {
    color: {
      icon: 'fa fa-tint',
      title: 'Color',
      refreshOnShow: $.Editable.prototype.refreshColors,
      seed: [{
        cmd: 'backColor'
      }, {
        cmd: 'foreColor'
      }],
      callback: function (cmd, val, param) {
        this[param].apply(this, [val]);
      },
      callbackWithoutSelection: function (cmd, val, param) {
        if (param === 'backColor') param = 'background-color';
        if (param === 'foreColor') param = 'color';

        this._startInFontExec(param, cmd, val);

        if (val === '#123456' && this.text() === '') {
          this.cleanify(true, false);

          this.$element.find('span').each(function (index, span) {
            var $span = $(span);
            var color = $span.css('background-color');

            if (color === '#123456' || $.Editable.RGBToHex(color) === '#123456') {
              $span.css('background-color', '');
            }

            color = $span.css('color');

            if (color === '#123456' || $.Editable.RGBToHex(color) === '#123456') {
              $span.css('color', '');
            }
          });
        }
      },
      undo: true
    }
  });

  $.Editable.prototype.command_dispatcher = $.extend($.Editable.prototype.command_dispatcher, {
    color: function (command) {
      var dropdown = this.buildDropdownColor(command);
      var btn = this.buildDropdownButton(command, dropdown, 'fr-color-picker');
      return btn;
    }
  });

  /**
   * Dropdown for color.
   *
   * @param command
   * @returns {*}
   */
  $.Editable.prototype.buildDropdownColor = function () {
    var dropdown = '<div class="fr-dropdown-menu">';

    // Color headline.
    var color_el = '<div>';

    // Iterate color blocks.
    for (var k = 0; k < this.options.colors.length; k++) {

      // Color block.
      var color = this.options.colors[k];

      if (color !== 'REMOVE') {
        color_el += '<button type="button" class="fr-color-bttn" data-val="' + color + '" data-cmd="color" data-param="backColor" style="background: ' + color + ';">&nbsp;</button>';
      } else {
        color_el += '<button type="button" class="fr-color-bttn" data-val="#123456" data-cmd="color" data-param="backColor" style="background: #FFF;"><i class="fa fa-eraser"></i></button>';
      }

      // New line.
      if (k % this.options.colorsStep == (this.options.colorsStep - 1) && k > 0) {
        color_el += '<hr/>';

        // Higher new line.
        if ((k == this.options.colorsStep - 1 || k == this.options.colorsStep * 2 - 1) && this.options.colorsTopChoices) {
          color_el += '<div class="separator"></div>';
        }
      }
    }

    color_el += '</div><p><span class="fr-choose-color active" data-text="true" data-param="backColor">Background</span> <span class="fr-choose-color" data-text="true" data-param="foreColor">Text</span></p>';

    // Append color element to dropdown.
    dropdown += color_el;

    dropdown += '</div>';

    this.$bttn_wrapper.on(this.mousedown, '.fr-choose-color', function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (e.type === 'mousedown' && e.which !== 1) return true;
    })

    var that = this;
    this.$bttn_wrapper.on(this.mouseup, '.fr-choose-color', function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (e.type === 'mouseup' && e.which !== 1) return true;

      var $this = $(this);
      $this.siblings().removeClass('active');
      $this.addClass('active');

      $this.parents('.fr-dropdown-menu').find('button').attr('data-param', $this.attr('data-param'));

      that.refreshColors();
    });

    return dropdown;
  };

  /**
   * Set background color.
   *
   * @param val
   */
  $.Editable.prototype.backColor = function (val) {
    this.inlineStyle('background-color', 'backColor', val);

    this.saveSelectionByMarkers();
    this.$element.find('span').each(function (index, span) {
      var $span = $(span);
      var color = $span.css('background-color');

      if (color === '#123456' || $.Editable.RGBToHex(color) === '#123456') {
        $span.css('background-color', '');
      }

      if ($span.attr('style') === '' && !$span.hasClass('f-marker')) {
        $span.replaceWith($span.contents());
      }
    });
    this.restoreSelectionByMarkers();

    // Mark current color selected.
    var $elem = this.$editor.find('button.fr-color-bttn[data-cmd="backColor"][data-val="' + val + '"]');
    $elem.addClass('active');
    $elem.siblings().removeClass('active');
  };

  /**
   * Set foreground color.
   *
   * @param val
   */
  $.Editable.prototype.foreColor = function (val) {
    this.inlineStyle('color', 'foreColor', val);

    this.saveSelectionByMarkers();
    this.$element.find('span').each(function (index, span) {
      var $span = $(span);
      var color = $span.css('color');

      if (color === '#123456' || $.Editable.RGBToHex(color) === '#123456') {
        $span.css('color', '');
      }

      if ($span.attr('style') === '' && !$span.hasClass('f-marker')) {
        $span.replaceWith($span.contents());
      }
    });
    this.restoreSelectionByMarkers();

    // Mark current color selected.
    var $elem = this.$editor.find('button.fr-color-bttn[data-cmd="foreColor"][data-val="' + val + '"]');
    $elem.addClass('active');
    $elem.siblings().removeClass('active');
  };
})(jQuery);
