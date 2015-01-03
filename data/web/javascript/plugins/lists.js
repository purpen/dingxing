/*!
 * froala_editor v1.2.4 (http://editor.froala.com)
 * Copyright 2014-2014 Froala
 */

(function ($) {
  $.Editable.commands = $.extend($.Editable.commands, {
    insertOrderedList: {
      title: 'Numbered List',
      icon: 'fa fa-list-ol',
      refresh: $.Editable.prototype.refreshDefault,
      callback: function (cmd) {
        this.formatList(cmd);
      },
      undo: true
    },

    insertUnorderedList: {
      title: 'Bulleted List',
      icon: 'fa fa-list-ul',
      refresh: $.Editable.prototype.refreshDefault,
      callback: function (cmd) {
        this.formatList(cmd);
      },
      undo: true
    }
  });

  $.Editable.prototype.processBackspace = function ($li) {
    var $prev_li = $li.prev();

    if ($prev_li.length) {
      this.removeMarkers();

      // There is an UL or OL before. Join with the last li.
      if ($prev_li.get(0).tagName == 'UL' || $prev_li.get(0).tagName == 'OL') {
        $prev_li = $prev_li.find('li:last');
      }

      while ($prev_li.find('> ul, > ol').length) {
        $prev_li = $prev_li.find('> ul li:last, > ol li:last');
      }

      var blocks = $prev_li.find('> p, > h1, > h3, > h4, > h5, > h6, > div, > pre, > blockquote');
      if ($prev_li.text().length === 0 && $prev_li.find('img, table, input, iframe, video').length === 0) {
        $prev_li.remove();
      }
      else {
        this.keep_enter = true;
        $li.find('> p, > h1, > h3, > h4, > h5, > h6, > div, > pre, > blockquote').each (function (index, el) {
          $(el).replaceWith($(el).html());
        })
        this.keep_enter = false;

        if (blocks.length) {
          $(blocks[blocks.length - 1]).append('<span class="f-marker" data-type="false" data-id="0" data-fr-verified="true"></span><span class="f-marker" data-type="true" data-id="0" data-fr-verified="true"></span>');
          $(blocks[blocks.length - 1]).append($li.html());
        } else {
          $prev_li.append('<span class="f-marker" data-type="false" data-id="0" data-fr-verified="true"></span><span class="f-marker" data-type="true" data-id="0" data-fr-verified="true"></span>');
          $prev_li.append($li.html());
        }

        $li.remove();

        this.restoreSelectionByMarkers();
      }
      this.$element.find('breakli').remove();
    } else {
      this.$element.find('breakli').remove();

      if ($li.parents('ul').length) {
        this.formatList('insertUnorderedList');
      } else {
        this.formatList('insertOrderedList');
      }
    }

    this.sync();
  }

  $.Editable.prototype.liBackspace = function () {
    if (this.text() !== '') return true;

    var $li;
    var element = this.getSelectionElement();

    // We are in table. Resume default action.
    var possible_parents = $(element).parents('table, li');
    if (possible_parents.length > 0 && possible_parents[0].tagName === 'TABLE') {
      return true;
    }

    if (element.tagName == 'LI') {
      $li = $(element);
    } else {
      $li = $(element).parents('li:first');
    }

    this.removeMarkers();
    this.insertHTML('<breakli></breakli>');

    if ($li.find('breakli').prev().length && $li.find('breakli').prev().get(0).tagName === 'TABLE') {
      if ($li.find('breakli').next().length && $li.find('breakli').next().get(0).tagName === 'BR') {
        this.setSelection($li.find('breakli').prev().find('td:first').get(0));

        $li.find('breakli').next().remove();

        this.$element.find('breakli').remove();
        return false;
      }
    }

    var html = $li.html();
    var tag;
    var li_html = [];

    for (var i = 0; i < html.length; i++) {
      chr = html.charAt(i);

      // Tag start.
      if (chr == '<') {
        // Tag end.
        var j = html.indexOf('>', i + 1);
        if (j !== -1) {

          // Get tag.
          tag = html.substring(i, j + 1);
          var tag_name = this.tagName(tag);
          i = j;

          // Do break here.
          if (tag_name == 'breakli') {
            if (!this.isClosingTag(tag)) {
              if (!this.isClosingTag(li_html[li_html.length - 1])) {
                this.processBackspace($li);
                return false;
              }
            }
          } else {
            li_html.push(tag);
          }
        }
      } else {
        this.$element.find('breakli').remove();
        return true;
      }
    }

    this.$element.find('breakli').remove();
    return true;
  }

  $.Editable.prototype.textLiEnter = function ($li) {
    this.removeMarkers();
    this.insertHTML('<breakli></breakli>', false);

    var html = $li.html();
    var tag;
    var open_tags = [];
    var tag_indexes = {};
    var li_html = [];
    var chars = 0;

    for (var i = 0; i < html.length; i++) {
      chr = html.charAt(i);

      // Tag start.
      if (chr == '<') {
        // Tag end.
        var j = html.indexOf('>', i + 1);
        if (j !== -1) {

          // Get tag.
          tag = html.substring(i, j + 1);
          var tag_name = this.tagName(tag);
          i = j;

          // Do break here.
          if (tag_name == 'breakli') {
            if (!this.isClosingTag(tag)) {
              for (var k = open_tags.length - 1; k >= 0; k--) {
                var open_tag_name = this.tagName(open_tags[k]);

                li_html.push('</' + open_tag_name + '>');
              }

              li_html.push('</li>');
              li_html.push('<li>');

              for (var p = 0; p < open_tags.length; p++) {
                li_html.push(open_tags[p]);
              }

              li_html.push('<span class="f-marker" data-type="false" data-collapsed="true" data-id="0" data-fr-verified="true"></span><span class="f-marker" data-type="true" data-collapsed="true" data-id="0" data-fr-verified="true"></span>');
            }
          } else {
            li_html.push(tag);

            if (!this.isSelfClosingTag(tag)) {
              if (this.isClosingTag(tag)) {
                var idx = tag_indexes[tag_name].pop();

                // Remove the open tag.
                open_tags.splice(idx, 1);

              } else {
                open_tags.push(tag);

                if (tag_indexes[tag_name] === undefined) tag_indexes[tag_name] = [];
                tag_indexes[tag_name].push(open_tags.length - 1);
              }
            }
          }
        }
      }
      else {
        chars++;
        li_html.push(chr);
      }
    }

    var $li_parent = $($li.parents('ul, ol')[0]);

    $li.replaceWith('<li>' + li_html.join('') + '</li>');

    // Make tables consistent in p.
    $li_parent.find('p:empty + table').prev().remove();

    $li_parent.find('p + table').each (function (index, table) {
      var $table = $(table);
      $table.prev().append($table.clone())
      $table.remove();
    })

    $li_parent.find('table + p').each (function (index, p) {
      var $p = $(p);
      $p.append($p.prev().clone())
      $p.prev().remove();
    })

    $li_parent.find(this.valid_nodes.join(',')).each (function (index, el) {
      if (el.tagName != 'LI' && $(el).find('br').length === 0 && $(el).text().trim() === '') {
        $(el).append('<br/>');
      }
    });

    $li_parent.find('li').each ($.proxy(function (index, el) {
      this.wrapTextInElement($(el));
    }, this));
  }

  $.Editable.prototype.liEnter = function () {
    var $li;
    var element = this.getSelectionElement();

    // We are in table. Resume default action.
    var possible_parents = $(element).parents('table, li')
    if (possible_parents.length > 0 && possible_parents[0].tagName == 'TABLE') {
      return true;
    }

    if (element.tagName == 'LI') {
      $li = $(element);
    } else {
      $li = $(element).parents('li:first');
    }

    if ($li.text().length === 0 && $li.find('img, table, iframe, input, object').length === 0) {
      this.outdent();
      return false;
    } else {
      this.textLiEnter($li);
    }

    this.$element.find('breakli').remove();

    this.restoreSelectionByMarkers();

    this.sync();

    return false;
  }

  $.Editable.prototype.listTab = function () {
    var $el = $(this.getSelectionElement());
    if ($el.parents('ul, ol').length > 0) {
      this.indent();

      return false;
    }
  }

  $.Editable.prototype.listShiftTab = function () {
    var $el = $(this.getSelectionElement());
    if ($el.parents('ul, ol').length > 0) {
      this.outdent();

      return false;
    }
  }

  $.Editable.prototype.initList = function () {
    this.addListener('tab', this.listTab);
    this.addListener('shift+tab', this.listShiftTab);

    this.domInsertList();

    if (!this.isImage && !this.isLink && !this.options.editInPopup) {
      this.$element.on('keydown', $.proxy(function (e) {
        var keyCode = e.which;

        var element = this.getSelectionElement();

        if (element.tagName == 'LI' || $(element).parents('li').length > 0) {
          // Enter on Safari.
          if (keyCode == 13 && !e.shiftKey) {
            return this.liEnter();
          }

          if (keyCode == 8) {
            return this.liBackspace();
          }
        }
      }, this));
    }
  };

  $.Editable.initializers.push($.Editable.prototype.initList);

  /**
   * Format list.
   *
   * @param val
   */
  $.Editable.prototype.formatList = function (cmd) {
    if (this.browser.msie && $.Editable.getIEversion() < 9) {
      document.execCommand(cmd, false, false);
      return false;
    }

    var tag_name;
    var replace_list = false;
    var all = true;
    var replaced = false;

    var $element;
    var elements = this.getSelectionElements();

    // Check if lists should be replaced.
    var $parents = $(elements[0]).parents('ul, ol');
    if ($parents.length) {
      if ($parents[0].tagName === 'UL') {
        if (cmd != 'insertUnorderedList') {
          replace_list = true;
        }
      } else {
        if (cmd != 'insertOrderedList') {
          replace_list = true;
        }
      }
    }

    this.saveSelectionByMarkers();

    if (replace_list) {
      tag_name = 'ol';
      if (cmd === 'insertUnorderedList') tag_name = 'ul';
      var $list = $($parents[0]);
      $list.replaceWith('<' + tag_name + '>' + $list.html() + '</' + tag_name + '>');
    }

    else {
      // Clean elements.
      for (var i = 0; i < elements.length; i++) {
        $element = $(elements[i]);

        // Wrap
        if ($element.get(0).tagName == 'TD' || $element.get(0).tagName == 'TH') {
          this.wrapTextInElement($element);
        }

        // Check if current element rezides in LI.
        if ($element.parents('li').length > 0 || $element.get(0).tagName == 'LI') {
          var $li;
          if ($element.get(0).tagName == 'LI') {
            $li = $element;
          }
          else {
            $li = $($element.parents('li')[0]);
          }

          // Mark where to close and open again ol.
          var $p_list = $element.parents('ul, ol');
          if ($p_list.length > 0) {
            tag_name = $p_list[0].tagName.toLowerCase();
            $li.before('<span class="close-' + tag_name + '" data-fr-verified="true"></span>');
            $li.after('<span class="open-' + tag_name + '" data-fr-verified="true"></span>');
          }

          if ($($p_list[0]).parents('ol, ul').length === 0 || replace_list) {
            if ($li.find(this.valid_nodes.join(',')).length === 0) {
              $li.replaceWith($li.html() + '<br>');
            } else {
              $li.replaceWith($li.html());
            }
          }

          replaced = true;
        }

        else {
          all = false;
        }
      }

      if (replaced) {
        this.cleanupLists();
      }

      if (all === false || replace_list === true) {

        this.wrapText();

        this.restoreSelectionByMarkers();

        elements = this.getSelectionElements();

        this.saveSelectionByMarkers();

        this.elementsToList(elements, cmd);

        this.unwrapText();

        this.cleanupLists();
      }
    }

    if (this.options.paragraphy) this.wrapText(true);

    this.restoreSelectionByMarkers();

    this.repositionEditor();

    if (cmd == 'insertUnorderedList') {
      cmd = 'unorderedListInserted';
    } else {
      cmd = 'orderedListInserted';
    }

    this.triggerEvent(cmd);
  };

  $.Editable.prototype.elementsToList = function (elements, cmd) {
    var $list = $('<ol>');
    if (cmd == 'insertUnorderedList') {
      $list = $('<ul>');
    }

    if (elements[0] == this.$element.get(0)) {
      elements = this.$element.find('> ' + this.valid_nodes.join(', >'));
    }

    for (var j = 0; j < elements.length; j++) {
      $element = $(elements[j]);

      if ($element.get(0) == this.$element.get(0)) {
        continue;
      }

      if ($element.get(0).tagName === 'TD' || $element.get(0).tagName === 'TH') {
        this.wrapTextInElement($element);
        this.elementsToList($element.find('> ' + this.valid_nodes.join(', >')), cmd);
      }
      else {
        // Append cloned list.
        $list.append($('<li>').html($element.clone()));
        if ($list.find('li').length > 1) {
          $element.remove();
        } else {
          $element.replaceWith($list);
        }
      }
    }
  }

  $.Editable.prototype.indentLi = function ($li) {
    var $list = $li.parents('ul, ol');
    var tag_name = $list.get(0).tagName.toLowerCase();

    if ($li.find('> ul, > ol').length > 0 && $li.prev('li').length > 0) {
      this.wrapTextInElement($li);
      $li.find('> ' + this.valid_nodes.join(' , > ')).each (function (i, el) {
        $(el).wrap('<' + tag_name + '></' + tag_name + '>').wrap('<li></li>');
      });

      $li.prev('li').append($li.find('> ul, > ol'))
      $li.remove()

      this.cleanupLists();
    }
    else if ($li.find('> ul, > ol').length === 0 && $li.prev('li').length > 0) {
      $li.prev().append($('<' + tag_name + '>').append($li.clone()));
      $li.remove();

      $($list.find('li').get().reverse()).each(function (i, el) {
        var $el = $(el);
        if ($el.find(' > ul, > ol').length > 0) {
          if ($el.prev() && $el.prev().find(' > ul, > ol').length > 0 && $el.contents().length === 1) {
            $el.prev().append($el.html())
            $el.remove();
          }
        }
      });

      this.cleanupLists();
    }
  }

  $.Editable.prototype.outdentLi = function ($li) {
    var $list = $($li.parents('ul, ol')[0]);
    var $list_parent = $list.parents('ul, ol');

    var tag_name = $list.get(0).tagName.toLowerCase();

    // The first li in a nested list.
    if ($li.prev('li').length === 0 && $li.parents('li').length > 0) {
      $li.before('<span class="close-' + tag_name + '" data-fr-verified="true"></span>');
      $li.before('<span class="close-li" data-fr-verified="true"></span>');
      $li.before('<span class="open-li" data-fr-verified="true"></span>');
      $li.after('<span class="open-' + tag_name + '" data-fr-verified="true"></span>');
      $li.replaceWith($li.html());
    }
    else {
      $li.before('<span class="close-' + tag_name + '" data-fr-verified="true"></span>');
      $li.after('<span class="open-' + tag_name + '" data-fr-verified="true"></span>');

      // Nested list item.
      if ($li.parents('li').length > 0) {
        $li.before('<span class="close-li" data-fr-verified="true"></span>');
        $li.after('<span class="open-li" data-fr-verified="true"></span>');
      }
    }

    // First item in list.
    if (!$list_parent.length) {
      if ($li.find(this.valid_nodes.join(',')).length === 0) {
        $li.replaceWith($li.html() + '<br>');
      } else {
        $li.replaceWith($li.html());
      }
    }
  }

  $.Editable.prototype.domInsertList = function () {
    this.$element.on('DOMNodeInserted', $.proxy(function (e) {
      // Mozilla fix when deleting the last char in a li.
      if (e.target.tagName === 'BR' && $(e.target).parent().get(0).tagName === 'LI' && !this.keep_enter) {
        $(e.target).remove();
      }
    }, this));
  }

})(jQuery);
