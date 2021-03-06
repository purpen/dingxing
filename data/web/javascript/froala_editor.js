/*!
 * froala_editor v1.2.4 (http://editor.froala.com)
 * Copyright 2014-2014 Froala
 */

if (typeof jQuery === "undefined") { throw new Error("Froala requires jQuery") }

/*jslint browser: true, debug: true, vars: true, devel: true, expr: true, jQuery: true */

!function ($) {
  'use strict';

  // EDITABLE CLASS DEFINITION
  // =========================

  var Editable = function (element, options) {
    // Set options
    this.options = $.extend({}, Editable.DEFAULTS, $(element).data(), typeof options == 'object' && options);

    // Set valid nodes.
    this.valid_nodes = $.merge([], Editable.VALID_NODES);
    this.valid_nodes = $.merge(this.valid_nodes, $.map(Object.keys(this.options.blockTags), function (val) {
      return val.toUpperCase();
    }));

    // Find out browser
    this.browser = Editable.browser();

    // List of disabled options.
    this.disabledList = [];

    this._id = ++Editable.count;

    this._events = {};

    this.blurred = true;

    this.$window = $(window);
    this.$document = $(document);

    this.$original_element = $(element);

    this.init(element);

    $(element).on('editable.focus', $.proxy(function () {
      for (var i = 1; i <= $.Editable.count; i++) {
        if (i != this._id) {
          $(window).trigger('blur.' + i);
        }
      }
    }, this));
  };

  Editable.initializers = [];

  Editable.count = 0;

  Editable.VALID_NODES = ['P', 'DIV', 'LI', 'TD', 'TH'];

  Editable.LANGS = [];

  Editable.DEFAULTS = {
    allowedAttrs: ['accept', 'accept-charset', 'accesskey', 'action', 'align', 'alt', 'async', 'autocomplete', 'autofocus', 'autoplay', 'autosave', 'background', 'bgcolor', 'border', 'charset', 'cellpadding', 'cellspacing', 'checked', 'cite', 'class', 'color', 'cols', 'colspan', 'contenteditable', 'contextmenu', 'controls', 'coords', 'data', 'data-.*', 'datetime', 'default', 'defer', 'dir', 'dirname', 'disabled', 'download', 'draggable', 'dropzone', 'enctype', 'for', 'form', 'formaction', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'icon', 'id', 'ismap', 'itemprop', 'keytype', 'kind', 'label', 'lang', 'language', 'list', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'multiple', 'name', 'novalidate', 'open', 'optimum', 'pattern', 'ping', 'placeholder', 'poster', 'preload', 'pubdate', 'radiogroup', 'readonly', 'rel', 'required', 'reversed', 'rows', 'rowspan', 'sandbox', 'scope', 'scoped', 'scrolling', 'seamless', 'selected', 'shape', 'size', 'sizes', 'span', 'src', 'srcdoc', 'srclang', 'srcset', 'start', 'step', 'summary', 'spellcheck', 'style', 'tabindex', 'target', 'title', 'type', 'translate', 'usemap', 'value', 'valign', 'width', 'wrap'],
    allowedTags: ['!--', 'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'queue', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'],
    alwaysBlank: false,
    alwaysVisible: false,
    autosave: false,
    autosaveInterval: 10000,
    beautifyCode: true,
    blockTags: {
      n: 'Normal',
      blockquote: 'Quote',
      pre: 'Code',
      h1: 'Heading 1',
      h2: 'Heading 2',
      h3: 'Heading 3',
      h4: 'Heading 4',
      h5: 'Heading 5',
      h6: 'Heading 6'
    },
    buttons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontSize', 'fontFamily', 'color', 'sep',
      'formatBlock', 'blockStyle', 'align', 'insertOrderedList', 'insertUnorderedList', 'outdent', 'indent', 'sep',
      'createLink', 'insertImage', 'insertVideo', 'insertHorizontalRule', 'undo', 'redo', 'html'
    ],
    crossDomain: true,
    convertMailAddresses: true,
    customButtons: {},
    customDropdowns: {},
    customText: false,
    direction: 'ltr',
    disableRightClick: false,
    editInPopup: false,
    editorClass: '',
    formatTags: ['p', 'pre', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'ul', 'ol', 'li', 'table', 'tbody', 'thead', 'tfoot', 'tr', 'th', 'td'],
    headers: {},
    height: 'auto',
    icons: {}, // {cmd: {type: 'x', value: 'y'}}
    inlineMode: true,
    initOnClick: false,
    language: 'en_us',
    linkList: [],
    linkText: false,
    linkClasses: {},
    maxHeight: 'auto',
    minHeight: 'auto',
    noFollow: true,
    paragraphy: true,
    placeholder: 'Type something',
    plainPaste: false,
    preloaderSrc: '',
    saveURL: null,
    saveParams: {},
    saveRequestType: 'POST',
    simpleAmpersand: false,
    shortcuts: true,
    shortcutsAvailable: ['show', 'bold', 'italic', 'underline', 'createLink', 'insertImage', 'selectAll', 'indent',  'outdent', 'html', 'formatBlock n', 'formatBlock h1', 'formatBlock h2', 'formatBlock h3', 'formatBlock h4', 'formatBlock h5', 'formatBlock h6', 'formatBlock blockquote', 'formatBlock pre', 'strikeThrough'],
    spellcheck: false,
    theme: null,
    toolbarFixed: true,
    trackScroll: false,
    unlinkButton: true,
    tabSpaces: true,
    typingTimer: 500,
    pastedImagesUploadRequestType: 'POST',
    pastedImagesUploadURL: 'http://i.froala.com/upload_base64',
    width: 'auto',
    withCredentials: false,
    zIndex: 2000
  };

  /**
   * Destroy editable object.
   */
  Editable.prototype.destroy = function () {
    this.sync();

    this.addFrTag();

    this.hide();

    if (this.isHTML) {
      this.html();
    }

    if (this.$bttn_wrapper) {
      this.$bttn_wrapper.html('').removeData().remove();
    }

    if (this.$editor) {
      this.$editor.html('').removeData().remove();
    }

    this.raiseEvent('destroy');

    if (this.$popup_editor) {
      this.$popup_editor.html('').removeData().remove();
    }

    if (this.$placeholder) {
      this.$placeholder.html('').removeData().remove();
    }

    clearTimeout(this.ajaxInterval);
    clearTimeout(this.typingTimer);

    // Off element events.
    this.$element.off('mousedown mouseup click keydown keyup cut copy paste focus keypress touchstart touchend touch drop');
    this.$element.off('mousedown mouseup click keydown keyup cut copy paste focus keypress touchstart touchend touch drop', '**');

    // Off window events.
    $(window).off('mouseup.' + this._id);
    $(window).off('keydown.' + this._id);
    $(window).off('keyup.' + this._id);
    $(window).off('blur.' + this._id);
    $(window).off('hide.' + this._id);
    $(window).off('scroll.' + this._id);
    $(window).off('orientationchange.' + this._id);

    // Off document events.
    $(document).off('selectionchange.' + this._id);

    // Off editor events.
    this.$original_element.off('editable');

    if (this.$upload_frame !== undefined) {
      this.$upload_frame.remove();
    }

    if (this.$textarea) {
      this.$box.remove();
      this.$textarea.removeData('fa.editable');
      this.$textarea.show();
    }

    // Remove events.
    for (var k in this._events) {
      delete this._events[k];
    }

    if (this.$placeholder) this.$placeholder.remove();

    if (!this.isLink) {
      if (this.$wrapper) {
        this.$wrapper.replaceWith(this.getHTML())
      }
      else {
        this.$element.replaceWith(this.getHTML());
      }

      if (this.$box && !this.editableDisabled) {
        this.$box.removeClass('froala-box');
        this.$box.find('.html-switch').remove();
        this.$box.removeData('fa.editable');
        clearTimeout(this.typingTimer);
      }
    } else {
      this.$element.removeData('fa.editable');
    }
  };

  /**
   * Set callbacks.
   *
   * @param event - Event name
   * @param data - Data to pass to the callback.
   * @param sync - Do a sync after calling the callback.
   */
  Editable.prototype.triggerEvent = function (event, data, sync, cleanify) {
    if (sync === undefined) sync = true;
    if (cleanify === undefined) cleanify = false;

    // Will break image resize if does sync.
    if (sync === true) {
      if (!this.isResizing() && !this.editableDisabled && !this.imageMode && cleanify) {
        this.cleanify();
      }

      this.sync();
    }

    var resp = true;

    if (!data) data = [];
    resp = this.$original_element.triggerHandler('editable.' + event, $.merge([this], data));

    if (resp === undefined) {
      return true;
    }

    return resp;
  };

  /**
   * Cleanup before doing sync.
   *
   * @param $element - jQuery element to make cleanup on.
   */
  Editable.prototype.syncCleanHTML = function (html, keep_markers) {
    // Clear empty spans. Probably markers.
    var newHtml;

    if (keep_markers) {
      newHtml = html.replace(/<span((?!class\s*=\s*["']?f-marker["']?)[^>])*?><\/span>/gi, '');
      while (html != newHtml) {
        html = newHtml;
        newHtml = html.replace(/<span((?!class\s*=\s*["']?f-marker["']?)[^>])*?><\/span>/gi, '');
      }
    }
    else {
      // Remove span.
      newHtml = html.replace(/<span[^>]*?><\/span>/g, '');
      while (html != newHtml) {
        html = newHtml;
        newHtml = html.replace(/<span[^>]*?><\/span>/g, '');
      }
    }

    return html;
  }

  Editable.prototype.syncClean = function ($element, keep_markers) {
    // Clear empty spans. Probably markers.
    var e_selector = 'span:empty';
    if (keep_markers) {
      e_selector = 'span:empty:not(.f-marker)';
    }

    // Remove spans that do not have any attributes and are empty.
    var ok = false;
    var each_span = function (index, span) {
      if (span.attributes.length === 0) {
        $(span).remove();
        ok = false;
      }
    };

    var spans = $element.find(e_selector)
    while (spans.length && ok === false) {
      ok = true;
      spans.each (each_span);
      spans = $element.find(e_selector);
    }
  };

  /**
   * Sync between textarea and content.
   */
  Editable.prototype.sync = function () {
    if (!this.isHTML) {
      this.raiseEvent('sync');

      this.disableImageResize();

      // Check placeholder.
      if (!this.isLink && !this.isImage) {
        this.$element.trigger('placeholderCheck');
      }

      // Check if content has changed.
      var html = this.getHTML();

      if (this.trackHTML !== html && this.trackHTML != null) {
        this.refreshImageList();
        this.refreshButtons();
        this.cleanupLists();
        this.trackHTML = html;

        // Set textarea value.
        if (this.$textarea) {
          this.$textarea.val(this.getHTML(false, true));
        }

        // Save in undo stack.
        if (!this.doingRedo) this.saveUndoStep();

        this.triggerEvent('contentChanged', [], false);
      }

      else if (this.trackHTML == null) {
        this.trackHTML = html;
      }
    }
  };

  /**
   * Check if the element passed as argument is empty or not.
   *
   * @param element - Dom Object.
   */
  Editable.prototype.emptyElement = function (element) {
    if (element.tagName == 'IMG' || $(element).find('img').length > 0) {
      return false;
    }

    if ($(element).find('input, iframe').length > 0) {
      return false;
    }

    var text = $(element).text();

    for (var i = 0; i < text.length; i++) {
      if (text[i] !== '\n' && text[i] !== '\r' && text[i] !== '\t') {
        return false;
      }
    }

    return true;
  };

  Editable.prototype.initEvents = function () {
    if (this.mobile()) {
      this.mousedown = 'touchstart';
      this.mouseup = 'touchend';
      this.move = 'touchmove';
    }
    else {
      this.mousedown = 'mousedown';
      this.mouseup = 'mouseup';
      this.move = '';
    }

  }

  Editable.prototype.continueInit = function () {
    this.initEvents();

    this.browserFixes();

    if (!this.editableDisabled) {
      this.initUndoRedo();

      this.enableTyping();

      this.initShortcuts();
    }

    this.initTabs();

    this.initEditor();

    // Initializers.
    for (var i = 0; i < $.Editable.initializers.length; i++) {
      $.Editable.initializers[i].call(this);
    }

    this.initOptions();

    this.initEditorSelection();

    this.initAjaxSaver();

    this.setLanguage();

    this.setCustomText();

    if (!this.editableDisabled) {
      this.registerPaste();
    }

    this.refreshDisabledState();

    this.initialized = true;

    this.triggerEvent('initialized', [], false, false);
  }

  Editable.prototype.lateInit = function () {
    // this.$element.attr('contenteditable', false);
    this.saveSelectionByMarkers();
    this.continueInit();
    this.restoreSelectionByMarkers();
    this.$element.focus();

    this.hideOtherEditors();
  }

  /**
   * Init.
   *
   * @param element - The element on which to set editor.
   */
  Editable.prototype.init = function (element) {
    this.initElement(element);

    this.initElementStyle();

    if (!this.isLink || this.isImage) {
      this.initImageEvents();

      this.buildImageMove();
    }

    if (this.options.initOnClick) {
      if (!this.editableDisabled) {
        this.$element.attr('contenteditable', true);
        this.$element.attr('spellcheck', false);
      }

      this.$element.bind('mousedown.element', $.proxy(function (e) {
        if (!this.isLink) e.stopPropagation();
        this.$element.unbind('mousedown.element');

        this.lateInit();
      }, this))
    }
    else {
      this.continueInit();
    }
  };

  Editable.prototype.phone = function () {
    var check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  }

  // http://detectmobilebrowsers.com
  Editable.prototype.mobile = function () {
    return this.phone() || this.android() || this.iOS() || this.blackberry();
  }

  Editable.prototype.iOS = function () {
    return /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
  }

  Editable.prototype.iOSVersion = function () {
    if (/iP(hone|od|ad)/.test(navigator.platform)) {
      var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
      var version = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
      if (version && version[0]) return version[0];
    }

    return 0;
  }

  Editable.prototype.iPad = function () {
    return /(iPad)/g.test(navigator.userAgent);
  }

  Editable.prototype.iPhone = function () {
    return /(iPhone)/g.test(navigator.userAgent);
  }

  Editable.prototype.iPod = function () {
    return /(iPod)/g.test(navigator.userAgent);
  }

  Editable.prototype.android = function () {
    return /(Android)/g.test(navigator.userAgent);
  }

  Editable.prototype.blackberry = function () {
    return /(Blackberry)/g.test(navigator.userAgent);
  }

  Editable.prototype.initOnTextarea = function (element) {
    this.$textarea = $(element);

    if (this.$textarea.attr('placeholder') !== undefined && this.options.placeholder == 'Type something') {
      this.options.placeholder = this.$textarea.attr('placeholder');
    }

    this.$element = $('<div>').html(this.$textarea.val());
    this.$textarea.before(this.$element).hide();

    // Before submit textarea do a sync.
    this.$textarea.parents('form').bind('submit', $.proxy(function () {
      if (this.isHTML) {
        this.html();
      } else {
        this.sync();
      }
    }, this));
  }

  Editable.prototype.initOnLink = function (element) {
    this.isLink = true;
    this.options.linkText = true;
    this.selectionDisabled = true;
    this.editableDisabled = true;
    this.options.buttons = [];
    this.$element = $(element);
    this.options.paragraphy = false;
    this.options.countCharacters = false;
    this.$box = this.$element;
  }

  Editable.prototype.initOnImage = function (element) {
    var img_float = $(element).css('float')
    if ($(element).parent().get(0).tagName == 'A') {
      element = $(element).parent()
    }

    this.isImage = true;
    this.editableDisabled = true;
    this.imageList = [];
    this.options.buttons = [];
    this.options.paragraphy = false;
    this.options.imageMargin = 'auto';
    $(element).wrap('<div>');
    this.$element = $(element).parent();
    this.$element.css('display', 'inline-block');
    this.$element.css('max-width', '100%');
    this.$element.css('margin-left', 'auto');
    this.$element.css('margin-right', 'auto');
    this.$element.css('float', img_float);
    this.$element.addClass('f-image');
    this.$box = $(element);
  }

  Editable.prototype.initForPopup = function (element) {
    this.$element = $(element);
    this.$box = this.$element;
    this.editableDisabled = true;
    this.options.countCharacters = false;
    this.options.buttons = [];

    this.$element.on('click', $.proxy(function (e) {
      e.preventDefault();
    }, this));
  }

  Editable.prototype.initOnDefault = function (element) {
    // Remove format block if the element is not a DIV.
    if (element.tagName != 'DIV' && this.options.buttons.indexOf('formatBlock') >= 0) {
      this.disabledList.push('formatBlock');
    }

    this.$element = $(element);
  }

  /**
   * Init element.
   *
   * @param element
   */
  Editable.prototype.initElement = function (element) {
    if (element.tagName == 'TEXTAREA') this.initOnTextarea(element);
    else if (element.tagName == 'A') this.initOnLink(element);
    else if (element.tagName == 'IMG') this.initOnImage(element);
    else if (this.options.editInPopup) this.initForPopup(element);
    else this.initOnDefault(element);

    if (!this.editableDisabled) {
      this.$box = this.$element.addClass('froala-box');
      this.$wrapper = $('<div class="froala-wrapper">');
      this.$element = $('<div>');
      this.setHTML(this.$box.html(), false);
      this.$box.html(this.$wrapper.html(this.$element));

      this.$element.on('keyup', $.proxy(function (e) {
        var keyCode = e.which;

        // Check if there is any empty div.
        if (keyCode == 13) {
          this.webkitParagraphy();
        }
      }, this))
    }

    // Drop event.
    this.$element.on('drop', $.proxy(function () {
      setTimeout($.proxy(function () {
        $('html').click();
        this.$element.find('.f-img-wrap').each (function (i, e) {
          if ($(e).find('img').length === 0) {
            $(e).remove();
          }
        })

        this.$element.find('p:empty').remove();
      }, this), 1);
    }, this));

    // Sync.
    this.sync();
  };

  Editable.prototype.webkitParagraphy = function () {
    this.$element.find('*').each ($.proxy(function (index, elem) {
      if (this.emptyElement(elem) && elem.tagName === 'DIV' && $(elem).attr('class') === undefined) {
        if (this.options.paragraphy === true) {
          var $p = $('<p><br/></p>');
          $(elem).replaceWith($p);

          this.setSelection($p.get(0));
        }
      }
    }, this));
  }

  /**
   * Trim text.
   */
  Editable.prototype.trim = function (text) {
    return String(text).replace(/^\s+|\s+$/g, '');
  };

  /**
   * Unwrap text from editor.
   */
  Editable.prototype.unwrapText = function () {
    if (!this.options.paragraphy) {
      this.$element.find('div').each (function (index, elem) {
        if ($(elem).attr('style') === undefined) {
          $(elem).replaceWith($(elem).html() + '<br/>&#8203;');
        }
      })
    }
  }

  Editable.prototype.wrapTextInElement = function ($element, force_wrap) {
    if (force_wrap === undefined) force_wrap = false;

    var newWrap = [];
    var INSIDE_TAGS = ['SPAN', 'A', 'B', 'I', 'EM', 'U', 'S', 'STRONG', 'STRIKE', 'FONT', 'IMG', 'SUB', 'SUP'];

    var that = this;

    this.no_verify = true;

    var mergeText = function () {
      if (newWrap.length === 0) return false;

      var $div;
      if (that.options.paragraphy === true) {
        $div = $('<p>');
      } else {
        $div = $('<div>');
      }

      var $wrap_0 = $(newWrap[0]);
      if (newWrap.length == 1 && $wrap_0.attr('class') == 'f-marker') {
        newWrap = []
        return;
      }

      for (var i = 0; i < newWrap.length; i++) {
        var $wrap_obj = $(newWrap[i]);
        $div.append($wrap_obj.clone());
        if (i == newWrap.length - 1) {
          $wrap_obj.replaceWith($div);
        } else {
          $wrap_obj.remove();
        }
      }

      newWrap = [];
    }

    var start_marker = false;
    var end_marker = false;

    $element
      .contents()
      .filter(function () {
        var $this = $(this);

        if ($this.hasClass('f-marker') || $this.find('.f-marker').length) {
          var $marker = $this;
          if ($this.find('.f-marker').length) $marker = $($this.find('.f-marker')[0]);

          if ($marker.attr('data-type') === 'true') {
            start_marker = true;
            end_marker = false;
          }
          else {
            end_marker = true;
          }
        }

        // Check if node is text, not empty and it is an inside tag.
        if ((this.nodeType == Node.TEXT_NODE && $this.text().trim().length > 0) || INSIDE_TAGS.indexOf(this.tagName) >= 0) {
          newWrap.push(this);
        }

        // Empty text. Remove it.
        else if ((this.nodeType == Node.TEXT_NODE && $this.text().trim().length === 0) && that.options.beautifyCode) {
          $this.remove();
        }

        // Merge text so far.
        else {
          if (start_marker || force_wrap) {
            mergeText();

            if (this.tagName === 'BR') $this.remove();
          } else {
            newWrap = [];
          }

          if (end_marker) start_marker = false;
        }
      });

    if (start_marker || force_wrap) {
      mergeText();
    }

    // Add an invisible character at the end of empty elements.
    $element.find('> p').each (function (index, elem) {
      if ($(elem).text().trim().length === 0 &&
        $(elem).find('img').length === 0 &&
        $(elem).find('br').length === 0) {
        $(elem).append('<br/>');
      }
    });

    $element.find('div:empty:not([class])').remove();

    if ($element.is(':empty')) {
      if (that.options.paragraphy === true) {
        $element.append('<p><br/></p>');
      } else {
        $element.append('<br/>');
      }
    }

    this.no_verify = false;
  }

  /**
   * Wrap text from editor.
   */
  Editable.prototype.wrapText = function (force_wrap) {
    // No need to do it if image or link.
    if (this.isImage || this.isLink) {
      return false;
    }

    this.webkitParagraphy();

    this.wrapTextInElement(this.$element, force_wrap);
  };

  /**
   * Set a HTML into the current editor.
   *
   * @param html - The HTML to set.
   * @param sync - Passing false will not sync after setting the HTML.
   */
  Editable.prototype.setHTML = function (html, sync) {
    this.no_verify = true;
    if (sync === undefined) sync = true;

    // Clean.
    html = this.clean(html, true, false);

    // Remove unecessary spaces.
    html = html.replace(/>\s+</g, '><');

    this.$element.html(html);

    this.$element.find('pre').each (function (i, pre) {
      var $pre = $(pre);
      var content = $(pre).html();
      if (content.indexOf('\n') >= 0) {
        $pre.html(content.replace(/\n/g, '<br>'));
      }
    });

    this.imageList = [];
    this.refreshImageList();

    // Do paragraphy wrap.
    if (this.options.paragraphy) this.wrapText(true);

    // Sync if necessary.
    if (sync) {
      // Restore selection.
      this.restoreSelectionByMarkers();
      this.sync();
    }

    this.cleanupLists();

    this.$element.find('span').attr('data-fr-verified', true);

    this.no_verify = false;
  };

  Editable.prototype.beforePaste = function () {
    // Save selection
    this.saveSelectionByMarkers();

    // Set clipboard HTML.
    this.clipboardHTML = null;

    // Store scroll.
    this.scrollPosition = $(window).scrollTop();

    // Remove and store the editable content
    this.$pasteDiv = $('<div contenteditable="true" style="position: fixed; top: 0; left: -9999px; height: 100%; width: 0; z-index: 99999;"></div>').appendTo('body');

    this.$pasteDiv.focus();

    window.setTimeout($.proxy(this.processPaste, this), 1);
  }

  Editable.prototype.processPaste = function () {
    var pastedFrag = this.clipboardHTML;

    if (this.clipboardHTML === null) {
      pastedFrag = this.$pasteDiv.html();

      // Restore selection.
      this.restoreSelectionByMarkers();

      // Restore scroll.
      $(window).scrollTop(this.scrollPosition);
    }

    var clean_html;

    var response = this.triggerEvent('onPaste', [pastedFrag], false);
    if (typeof(response) === 'string') {
      pastedFrag = response;
    }

    // Add image pasted flag.
    pastedFrag = pastedFrag.replace(/<img /gi, '<img data-fr-image-pasted="true" ');

    // Word paste.
    if (pastedFrag.match(/(class=\"?Mso|style=\"[^\"]*\bmso\-|w:WordDocument)/gi)) {
      clean_html = this.wordClean(pastedFrag);
      clean_html = this.clean($('<div>').append(clean_html).html(), false, true);
      clean_html = this.removeEmptyTags(clean_html);
    }

    // Paste.
    else {
      clean_html = this.clean(pastedFrag, false, true);
      clean_html = this.removeEmptyTags(clean_html);
    }

    // Do plain paste cleanup.
    if (this.options.plainPaste) {
      clean_html = this.plainPasteClean(clean_html);
    }

    // Check if there is anything to clean.
    if (clean_html !== '') {
      // Insert HTML.
      this.insertHTML(clean_html);

      // Li cleanup.
      this.$element.find('li').each ($.proxy(function (index, li) {
        this.wrapTextInElement($(li), true);
      }, this));

      if (this.options.paragraphy) {
        this.wrapText(true);
      }

      this.cleanupLists();
    }

    this.afterPaste();
  }

  Editable.prototype.afterPaste = function () {
    this.focus();

    this.uploadPastedImages();

    this.$element.trigger('placeholderCheck');

    this.pasting = false;

    this.triggerEvent('afterPaste', [], true, true);
  }

  /**
   * Register paste event.
   */
  Editable.prototype.registerPaste = function () {
    this.$element.on('copy cut', $.proxy(function () {
      this.copiedText = this.text();
    }, this));

    this.$element.on('paste', $.proxy(function (e) {
      if (!this.isHTML) {
        if (e.originalEvent) e = e.originalEvent;

        if (!this.triggerEvent('beforePaste', [], false)) {
          return false;
        }

        // Clipboard paste.
        if (this.clipboardPaste(e)) return false;

        this.clipboardHTML = '';

        // Enable pasting.
        this.pasting = true;

        // Store scroll position.
        this.scrollPosition = $(window).scrollTop();

        // Read data from clipboard.
        var clipboard = false;
        if (e && e.clipboardData && e.clipboardData.getData) {
          var types = '';
          var clipboard_types = e.clipboardData.types;

          if ($.Editable.isArray(clipboard_types)) {
            for (var i = 0 ; i < clipboard_types.length; i++) {
              types += clipboard_types[i] + ';';
            }
          } else {
            types = clipboard_types;
          }

          // HTML.
          if (/text\/html/.test(types)) {
            this.clipboardHTML = e.clipboardData.getData('text/html');
          }

          // Safari HTML.
          else if (/text\/rtf/.test(types) && this.browser.safari) {
            this.clipboardHTML = e.clipboardData.getData('text/rtf');
          }

          else if (/text\/plain/.test(types) && !this.browser.mozilla) {
            this.clipboardHTML = e.clipboardData.getData('text/plain').replace(/\n/g, '<br/>');
          }

          if (this.clipboardHTML !== '') {
            clipboard = true;
          } else {
            this.clipboardHTML = null;
          }

          if (clipboard) {
            this.processPaste();

            if (e.preventDefault) {
              e.stopPropagation();
              e.preventDefault();
            }

            return false;
          }
        }

        // Normal paste.
        this.beforePaste();
      }
    }, this));
  };

  // Image upload Chrome. http://www.foliotek.com/devblog/copy-images-from-clipboard-in-javascript/
  Editable.prototype.clipboardPaste = function (e) {
    if (e && e.clipboardData) {
      if (e.clipboardData.items) {

        var file = e.clipboardData.items[0].getAsFile();

        if (file) {
          var reader = new FileReader();
          reader.onload = $.proxy(function (e) {
            var result = e.target.result;

            this.insertHTML('<img data-fr-image-pasted="true" src="' + result + '" />');

            this.afterPaste();
          }, this);

          reader.readAsDataURL(file);

          return true;
        }
      }
    }

    return false;
  }

  Editable.prototype.uploadPastedImages = function () {
    // Safari won't work https://bugs.webkit.org/show_bug.cgi?id=49141
    this.$element.find('img[data-fr-image-pasted]').each ($.proxy(function (index, img) {
      if (!this.options.pasteImage) {
        $(img).remove();
      }

      else {
        // Data images.
        if (img.src.indexOf('data:') === 0) {

          // Set image width.
          if (this.options.defaultImageWidth) {
            $(img).attr('width', this.options.defaultImageWidth);
          }

          if (this.options.pastedImagesUploadURL) {
            setTimeout($.proxy(function () {
              this.showImageLoader();
              this.$progress_bar.find('span').css('width', '100%').text('Please wait!');
              this.showByCoordinates($(img).offset().left + $(img).width() / 2, $(img).offset().top + $(img).height() + 10);
              this.isDisabled = true;
            }, this), 10);

            $.ajax({
              type: this.options.pastedImagesUploadRequestType,
              url: this.options.pastedImagesUploadURL,
              data: $.extend({ image: decodeURIComponent(img.src) }, this.options.imageUploadParams),
              crossDomain: this.options.crossDomain,
              xhrFields: {
                withCredentials: this.options.withCredentials
              },
              headers: this.options.headers,
              dataType: 'json'
            })
            .done($.proxy(function (resp) {
              try {
                if (resp.link) {
                  var img_x = new Image();

                  // Bad image url.
                  img_x.onerror = $.proxy(function () {
                    this.throwImageError(1);
                  }, this);

                  // Image loaded.
                  img_x.onload = $.proxy(function () {
                    img.src = resp.link;

                    this.hideImageLoader();
                    this.hide();
                    this.enable();

                    setTimeout (function () {
                      $(img).trigger('touchend');
                    }, 50);

                    this.triggerEvent('afterUploadPastedImage', [$(img)]);
                  }, this);

                  // Set image src.
                  img_x.src = resp.link;
                }

                else if (resp.error) {
                  this.throwImageErrorWithMessage(resp.error);
                }

                else {
                  // No link in upload request.
                  this.throwImageError(2);
                }
              } catch (ex) {
                // Bad response.
                this.throwImageError(4);
              }
            }, this))
            .fail($.proxy(function () {
              // Failed during upload.
              this.throwImageError(3);
            }, this));
          }
        }

        // Images without http (Safari ones.).
        else if (img.src.indexOf('http') !== 0) {
          $(img).remove();
        }

        $(img).removeAttr('data-fr-image-pasted');
      }
    }, this));
  }

  Editable.prototype.disable = function () {
    this.isDisabled = true;
    this.$element.blur();
  }

  Editable.prototype.enable = function () {
    this.isDisabled = false;
  }

  /**
   * Word clean.
   */
  Editable.prototype.wordClean = function (html) {
    // Keep only body.
    if (html.indexOf('<body') >= 0) {
      html = html.replace(/[.\s\S\w\W<>]*<body[^>]*>([.\s\S\w\W<>]*)<\/body>[.\s\S\w\W<>]*/g, '$1');
    }

    // Single item list.
    html = html.replace(
      /<p(.*?)class="?'?MsoListParagraph"?'?([\s\S]*?)>([\s\S]*?)<\/p>/gi,
      '<ul><li><p>$3</p></li></ul>'
    );

    // List start.
    html = html.replace(
      /<p(.*?)class="?'?MsoListParagraphCxSpFirst"?'?([\s\S]*?)>([\s\S]*?)<\/p>/gi,
      '<ul><li><p>$3</p></li>'
    );

    // List middle.
    html = html.replace(
      /<p(.*?)class="?'?MsoListParagraphCxSpMiddle"?'?([\s\S]*?)>([\s\S]*?)<\/p>/gi,
      '<li><p>$3</p></li>'
    );

    // List end.
    html = html.replace(/<p(.*?)class="?'?MsoListParagraphCxSpLast"?'?([\s\S]*?)>([\s\S]*?)<\/p>/gi, '<li><p>$3</p></li></ul>');

    // Clean list bullets.
    html = html.replace(/<span([^<]*?)style="?'?mso-list:Ignore"?'?([\s\S]*?)>([\s\S]*?)<span/gi, '<span><span');

    // Webkit clean list bullets.
    html = html.replace(/<!--\[if \!supportLists\]-->([\s\S]*?)<!--\[endif\]-->/gi, '');

    // Remove mso classes.
    html = html.replace(/(\n|\r| class=(")?Mso[a-zA-Z0-9]+(")?)/gi, ' ');

    // Remove comments.
    html = html.replace(/<!--[\s\S]*?-->/gi, '');

    // Remove tags but keep content.
    html = html.replace(/<(\/)*(meta|link|span|\\?xml:|st1:|o:|font)(.*?)>/gi, '');

    // Remove no needed tags.
    var word_tags = ['style', 'script', 'applet', 'embed', 'noframes', 'noscript'];
    for (var i = 0; i < word_tags.length; i++) {
      var regex = new RegExp('<' + word_tags[i] + '.*?' + word_tags[i] + '(.*?)>', 'gi');
      html = html.replace(regex, '');
    }

    // Remove attributes.
    html = html.replace(/([\w\-]*)=("[^<>"]*"|'[^<>']*'|\w+)/gi, '');

    // Remove spaces.
    html = html.replace(/&nbsp;/gi, '');

    // Remove empty tags.
    var oldHTML;
    do {
      oldHTML = html;
      html = html.replace(/<[^\/>][^>]*><\/[^>]+>/gi, '');
    } while (html != oldHTML);

    html = this.clean(html);

    // Clean empty links.
    html = html.replace(/<a>(.[^<]+)<\/a>/gi, '$1');

    return html;
  }

  Editable.prototype.tabs = function (tabs_no) {
    var html = '';

    for (var k = 0; k < tabs_no; k++) {
      html += '  ';
    }

    return html;
  }

  /**
   * Clean tags.
   */
  Editable.prototype.cleanTags = function (html, new_line_to_br) {
    if (new_line_to_br === undefined) new_line_to_br = false;

    var chr;
    var i;
    var ok;
    var last;

    var format_tags = this.options.formatTags;
    var open_tags = [];
    var dom = [];
    var is_pre = false;

    // Iterate through the html.
    for (i = 0; i < html.length; i++) {
      chr = html.charAt(i);

      // Tag start.
      if (chr == '<') {
        // Tag end.
        var j = html.indexOf('>', i + 1);
        if (j !== -1) {
          // Get tag.
          var tag = html.substring(i, j + 1);
          var tag_name = this.tagName(tag);

          // Closing tag.
          var is_closing = this.isClosingTag(tag);

          // Determine if pre.
          if (tag_name === 'pre') {
            if (is_closing) {
              is_pre = false;
            } else {
              is_pre = true;
            }
          }

          // Self enclosing tag.
          if (this.isSelfClosingTag(tag)) {
            if (tag_name === 'br' && is_pre) {
              dom.push('\n');
            }
            else {
              dom.push(tag);
            }
          }
          // New open tag.
          else if (!is_closing) {
            // Keep tag in dom.
            dom.push(tag);

            // Store open tag.
            open_tags.push({
              tag_name: tag_name,
              i: (dom.length - 1)
            });

          } else {
            ok = false;
            last = true;

            // Search for opened tag.
            while (ok === false && last !== undefined) {
              // Get last node.
              last = open_tags.pop();

              // Remove nodes that are not closed correctly.
              if (last !== undefined && last.tag_name !== tag_name) {
                dom.splice(last.i, 1);
              } else {
                ok = true;

                // Last tag should be the correct one and not undefined.
                if (last !== undefined) {
                  dom.push(tag);
                }
              }
            }
          }

          // Update i position.
          i = j;
        }
      }

      else {
        if (chr === '\n' && this.options.beautifyCode) {
          if (new_line_to_br && is_pre) {
            dom.push('<br/>');
          }
        } else if (chr !== '\u0009') {
          dom.push(chr);
        }
      }
    }

    // Remove open tags.
    while (open_tags.length > 0) {
      last = open_tags.pop();
      dom.splice(last.i, 1);
    }

    var new_line_sep = '\n';
    if (!this.options.beautifyCode) {
      new_line_sep = '';
    }

    // Build the new html.
    html = '';
    open_tags = 0;
    var remove_space = true;
    for (i = 0; i < dom.length; i++) {
      if (dom[i].length == 1) {
        if (!(remove_space && dom[i] === ' ')) {
          html += dom[i];
          remove_space = false;
        }
      }
      else if (format_tags.indexOf(this.tagName(dom[i]).toLowerCase()) < 0) {
        html += dom[i];
      }
      else if (this.isSelfClosingTag(dom[i])) {
        html += dom[i];
      }
      else if (!this.isClosingTag(dom[i])) {
        html += new_line_sep + this.tabs(open_tags) + dom[i];
        open_tags += 1;
      }
      else {
        open_tags -= 1;

        if (open_tags === 0) remove_space = true;

        if (html.length > 0 && html[html.length - 1] == new_line_sep) {
          html += this.tabs(open_tags);
        }

        html += dom[i] + new_line_sep;
      }
    }

    // Remove starting \n.
    if (html[0] == new_line_sep) {
      html = html.substring(1, html.length);
    }

    // Remove ending \n.
    if (html[html.length - 1] == new_line_sep) {
      html = html.substring(0, html.length - 1);
    }

    return html;
  };

  Editable.prototype.cleanupLists = function () {
    this.$element.find('ul, ol').each (function (index, list) {
      var $list = $(list);

      if ($list.find('.close-ul, .open-ul, .close-ol, .open-ol, .open-li, .close-li').length > 0) {
        var oldHTML = '<' + list.tagName.toLowerCase() + '>' + $list.html() + '</' + list.tagName.toLowerCase() + '>';
        oldHTML = oldHTML.replace(new RegExp('<span class="close-ul" data-fr-verified="true"></span>', 'g'), '</ul>');
        oldHTML = oldHTML.replace(new RegExp('<span class="open-ul" data-fr-verified="true"></span>', 'g'), '<ul>');
        oldHTML = oldHTML.replace(new RegExp('<span class="close-ol" data-fr-verified="true"></span>', 'g'), '</ol>');
        oldHTML = oldHTML.replace(new RegExp('<span class="open-ol" data-fr-verified="true"></span>', 'g'), '<ol>');
        oldHTML = oldHTML.replace(new RegExp('<span class="close-li" data-fr-verified="true"></span>', 'g'), '</li>');
        oldHTML = oldHTML.replace(new RegExp('<span class="open-li" data-fr-verified="true"></span>', 'g'), '<li>');

        $list.replaceWith(oldHTML);
      }
    });

    var lists = this.$element.find('ol + ol, ul + ul');
    for (var k = 0; k < lists.length; k++) {
      var $list = $(lists[k]);
      $list.prev().append($list.html());
      $list.remove();
    }

    this.$element.find('li > td').remove();
    this.$element.find('li:empty').remove();
    this.$element.find('li td:empty').append('</br>');

    // Remove empty ul and ol.
    this.$element.find('ul, ol').each ($.proxy(function (index, lst) {
      var $lst = $(lst);
      if ($lst.find(this.valid_nodes.join(',')).length === 0) {
        $lst.remove();
      }
    }, this));

    this.$element.find('li > td').remove();
    this.$element.find('li:empty').remove();
    this.$element.find('li td:empty').append('</br>');

    if (this.options.paragraphy) {
      this.$element.find('li').each ($.proxy(function (index, li) {
        this.wrapTextInElement($(li), true);
      }, this))
    }
  }

  /**
   * Clean the html.
   */
  Editable.prototype.clean = function (html, allow_id, clean_style, allowed_tags, allowed_attrs) {
    // List of allowed attributes.
    if (!allowed_attrs) allowed_attrs = $.merge([], this.options.allowedAttrs);

    // List of allowed tags.
    if (!allowed_tags) allowed_tags = $.merge([], this.options.allowedTags);

    // Remove the id.
    if (!allow_id) {
      if (allowed_attrs.indexOf('id') > -1) allowed_attrs.splice(allowed_attrs.indexOf('id'), 1);
    }

    // Remove script tag.
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove all tags not in allowed tags.
    var at_reg = new RegExp('<\\/?((?!(?:' + allowed_tags.join(' |') + '|' + allowed_tags.join('>|') + '))\\w+)[^>]*?>', 'gi');
    html = html.replace(at_reg, '');

    // Remove all attributes not in allowed attrs.
    var aa_reg = new RegExp('( (?!(?:' + allowed_attrs.join('|') + '))[a-zA-Z0-9-_]+)=((?:.(?!\\s+(?:\\S+)=|[>]|(\\/>)))+.)', 'gi');
    html = html.replace(/<\/?[^>]*?>/gi, function (all) {
      return all.replace(aa_reg, '');
    });

    // Sanitize SRC or HREF.
    var s_reg = new RegExp('<([^>]*)(src|href)=(\'[^\']*\'|""[^""]*""|[^\\s>]+)([^>]*)>', 'gi');
    html = html.replace(s_reg, $.proxy(function (str, a1, a2, a3, a4) {
      return '<' + a1 + a2 + '="' + this.sanitizeURL(a3.replace(/^["'](.*)["']\/?$/gi, '$1')) + '"' + a4 + '>';
    }, this));

    // Pasting.
    if (this.pasting && this.copiedText === $('<div>').html(html).text()) {
      clean_style = false;
      allow_id = true;
    }

    // Clean style.
    if (clean_style) {
      var style_reg = new RegExp('style=("[a-zA-Z0-9:;\\.\\s\\(\\)\\-\\,!\\/\'%]*"|\'[a-zA-Z0-9:;\\.\\s\\(\\)\\-\\,!\\/"%]*\')', 'gi');
      html = html.replace(style_reg, '');
    }

    // Clean tags.
    html = this.cleanTags(html, true);

    // Remove the class.
    if (!allow_id) {
      var $div = $('<div>').append(html);
      $div.find('[class]:not([class^="fr-"])').each (function (index, el) {
        $(el).removeAttr('class');
      })

      html = $div.html();
    }

    return html;
  };

  Editable.prototype.plainPasteClean = function (html) {
    var $div = $('<div>').html(html);

    $div.find('h1, h2, h3, h4, h5, h6, pre, blockquote').each (function (i, el) {
      $(el).replaceWith('<p>' + $(el).html() + '</p>');
    });

    var replacePlain = function (i, el) {
      $(el).replaceWith($(el).html());
    }

    while ($div.find('strong, em, strike, b, u, i, sup, sub, span, a').length) {
      $div.find('strong, em, strike, b, u, i, sup, sub, span, a').each (replacePlain);
    }

    return $div.html();
  }

  Editable.prototype.removeEmptyTags = function (html) {
    var i;
    var $div = $('<div>').html(html);

    // Clean empty tags.
    var empty_tags = $div.find('*:empty:not(br, img, td, th)');
    while (empty_tags.length) {
      for (i = 0; i < empty_tags.length; i++) {
        $(empty_tags[i]).remove();
      }

      empty_tags = $div.find('*:empty:not(br, img, td, th)');
    }

    // Workaround for Notepad paste.
    $div.find('> div').each(function (i, div) {
      $(div).replaceWith($(div).html() + '<br/>');
    })

    // Remove divs.
    var divs = $div.find('div');
    while (divs.length) {
      for (i = 0; i < divs.length; i++) {
        var $el = $(divs[i]);
        var text = $el.html().replace(/\u0009/gi, '').trim();

        $el.replaceWith(text);
      }

      divs = $div.find('div');
    }

    return $div.html();
  }

  /**
   * Init style for element.
   */
  Editable.prototype.initElementStyle = function () {
    // Enable content editable.
    if (!this.editableDisabled) {
      this.$element.attr('contenteditable', true);
    }

    var cls = 'froala-element ' + this.options.editorClass;

    if (this.browser.msie && Editable.getIEversion() < 9) {
      cls += ' ie8';
    }

    // Remove outline.
    this.$element.css('outline', 0);

    if (!this.browser.msie) {
      cls += ' not-msie';
    }

    this.$element.addClass(cls);
  };

  /**
   * Init undo support.
   */
  Editable.prototype.initUndoRedo = function () {
    // Undo stack array.
    this.undoStack = [];
    this.undoIndex = 0;
    this.saveUndoStep();

    this.disableBrowserUndo();
  };

  Editable.prototype.CJKclean = function (text) {
    var regex = /[\u3041-\u3096\u30A0-\u30FF\u4E00-\u9FFF\u3130-\u318F\uAC00-\uD7AF]/gi;
    return text.replace(regex, '');
  }

  /**
   * Typing is saved in undo stack.
   */
  Editable.prototype.enableTyping = function () {
    this.typingTimer = null;

    this.$element.on('keydown cut', $.proxy(function (e) {
      if (e.type === 'keydown' && !this.triggerEvent('keydown', [e.which, (e.ctrlKey || e.metaKey) && !e.altKey], false)) {
        return false;
      }

      clearTimeout(this.typingTimer);
      this.ajaxSave = false;

      this.oldHTML = this.getHTML(true);

      this.typingTimer = setTimeout($.proxy(function () {
        var html = this.getHTML(true);

        if (!this.ime && (this.CJKclean(html) !== this.CJKclean(this.oldHTML) && this.CJKclean(html) === html)) {
          // Do sync.
          this.sync();
        }
      }, this), Math.max(this.options.typingTimer, 500));
    }, this));
  };

  Editable.prototype.removeMarkersByRegex = function (html) {
    return html.replace(/<span[^>]*? class\s*=\s*["']?f-marker["']?[^>]+>([\S\s][^\/])*<\/span>/gi, '');
  };

  Editable.prototype.getImageHTML = function () {
    return JSON.stringify({
      src: this.$element.find('img').attr('src'),
      style: this.$element.find('img').attr('style'),
      alt: this.$element.find('img').attr('alt'),
      width: this.$element.find('img').attr('width'),
      link: this.$element.find('a').attr('href'),
      link_title: this.$element.find('a').attr('title'),
      link_target: this.$element.find('a').attr('target')
    })
  };

  Editable.prototype.getLinkHTML = function () {
    return JSON.stringify ({
      body: this.$element.html(),
      href: this.$element.attr('href'),
      title: this.$element.attr('title'),
      popout: this.$element.hasClass('popout'),
      nofollow: this.$element.attr('ref') == 'nofollow',
      blank: this.$element.attr('target') == '_blank',
      cls: !this.$element.attr('class') ? '' : this.$element.attr('class').replace(/froala-element ?|not-msie ?|/gi, '').trim()
    })
  };

  Editable.prototype.addFrTag = function () {
    this.$element.find(this.valid_nodes.join(',') + ', table, ul, ol, img').addClass('fr-tag');
  }

  Editable.prototype.removeFrTag = function () {
    // Restore fr-tag class.
    this.$element.find(this.valid_nodes.join(',') + ', table, ul, ol, img').removeClass('fr-tag');
  }

  /**
   * Get HTML from the editor.
   * Default: (false, false, true)
   */
  Editable.prototype.getHTML = function (keep_markers, add_fr_tag, remove_verifier) {
    if (add_fr_tag === undefined) add_fr_tag = false;
    if (keep_markers === undefined) keep_markers = false;
    if (remove_verifier === undefined) remove_verifier = true;

    if (this.$element.hasClass('f-placeholder') && !keep_markers) return '';

    if (this.isHTML) return this.$html_area.val();

    if (this.isImage) return this.getImageHTML();

    if (this.isLink) return this.getLinkHTML();

    // Add f-link to links.
    this.$element.find('a').data('fr-link', true);

    // fr-tag class.
    if (add_fr_tag) {
      this.addFrTag();
    }

    // Set image margin.
    this.$element.find('.f-img-editor > img').each($.proxy(function (index, elem) {
      this.addImageClass($(elem), this.getImageClass($(elem).parent().attr('class')));
    }, this));

    // Replace &nbsp; from pre.
    this.$element.find('pre').each ($.proxy(function (index, pre) {
      var $pre = $(pre);
      var old_html = $pre.html();
      var new_html = old_html.replace(/\&nbsp;/gi, ' ');

      if (old_html != new_html) {
        this.saveSelectionByMarkers();
        $pre.html(new_html);
        this.restoreSelectionByMarkers();
      }
    }, this));

    // Clone element.
    var html = this.$element.html();

    // Restore image margin.
    this.$element.find('.f-img-editor > img').removeClass('fr-fin fr-fil fr-fir');

    this.removeFrTag();

    // Clean unwanted elements.
    html = this.syncCleanHTML(html, keep_markers);

    // Remove empty link.
    html = html.replace(/<a[^>]*?><\/a>/g, '')

    if (!keep_markers) {
      // Remove markers.
      html = this.removeMarkersByRegex(html);
    }

    // Remove image handles.
    html = html.replace(/<span[^>]*? class\s*=\s*["']?f-img-handle[^>]+><\/span>/gi, '');

    // Remove f-img-editor.
    html = html.replace(/^([\S\s]*)<span[^>]*? class\s*=\s*["']?f-img-editor[^>]+>([\S\s]*)<\/span>([\S\s]*)$/gi, '$1$2$3');

    // Remove image wrapper.
    html = html.replace(/^([\S\s]*)<span[^>]*? class\s*=\s*["']?f-img-wrap[^>]+>([\S\s]*)<\/span>([\S\s]*)$/gi, '$1$2$3');

    // Ampersand fix.
    html = html.replace(/\&amp;/gi, '&');
    if (this.options.simpleAmpersand) {
      html = html.replace(/\&amp;/gi, '&');
    }

    // Remove data-fr-verified
    if (remove_verifier) {
      html = html.replace(/ data-fr-verified="true"/gi, '');
    }

    // Remove new lines.
    if (this.options.beautifyCode) {
      html = html.replace(/\n/gi, '');
    }

    // Remove invisible whitespace.
    html = html.replace(/\u200B/gi, '');

    // Trigger getHTML event.
    if (add_fr_tag) {
      var new_html = this.triggerEvent('getHTML', [html], false);
      if (typeof(new_html) === 'string') {
        return new_html
      }
    }

    return html;

  };

  /**
   * Get the text from the current element.
   */
  Editable.prototype.getText = function () {
    return this.$element.text();
  };

  /**
   * Set a dirty flag which indicates if there are any changes for autosave.
   */
  Editable.prototype.setDirty = function (dirty) {
    this.dirty = dirty;
  }


  /**
   * Make ajax requests if autosave is enabled.
   */
  Editable.prototype.initAjaxSaver = function () {
    this.ajaxHTML = this.getHTML();
    this.ajaxSave = true;

    this.ajaxInterval = setInterval($.proxy(function () {
      var html = this.getHTML();
      if ((this.ajaxHTML != html || this.dirty) && this.ajaxSave) {
        if (this.options.autosave) {
          this.save();
        }

        this.dirty = false;
        this.ajaxHTML = html;
      }

      this.ajaxSave = true;
    }, this), Math.max(this.options.autosaveInterval, 100));
  };

  /**
   * Disable browser undo.
   */
  Editable.prototype.disableBrowserUndo = function () {
    this.$element.keydown(function (e) {
      var keyCode = e.which;
      var ctrlKey = (e.ctrlKey || e.metaKey) && !e.altKey;

      if (!this.isHTML && ctrlKey) {
        if (keyCode == 75) {
          e.preventDefault();
          return false;
        }

        if (keyCode == 90 && e.shiftKey) {
          e.preventDefault();
          return false;
        }

        if (keyCode == 90) {
          e.preventDefault();
          return false;
        }
      }
    });
  };

  /**
   * Save current HTML in undo stack.
   */
  Editable.prototype.saveUndoStep = function () {
    if (!this.undoStack) return false;

    while (this.undoStack.length > this.undoIndex) {
      this.undoStack.pop();
    }

    var html = this.getHTML(true, false, false);

    if (this.undoStack[this.undoIndex - 1] && this.removeMarkersByRegex(this.undoStack[this.undoIndex - 1]) == html) {
      return false;
    }

    var sel_saved = false;
    if (this.selectionInEditor() && this.$element.is(':focus')) {
      this.saveSelectionByMarkers();
      sel_saved = true;
    }

    this.undoStack.push(this.getHTML(true, false, false));
    this.undoIndex++;

    if (sel_saved) {
      this.restoreSelectionByMarkers(false);
    }

    this.refreshUndo();
    this.refreshRedo();
  };

  Editable.prototype.shortcutEnabled = function (shortcut) {
    return this.options.shortcutsAvailable.indexOf(shortcut) >= 0;
  }

  Editable.prototype.shortcuts_map = {
    70: { cmd: 'show', params: [null], id: 'show' },
    69: { cmd: 'show', params: [null], id: 'show' },
    66: { cmd: 'exec', params: ['bold'], id: 'bold' },
    73: { cmd: 'exec', params: ['italic'], id: 'italic' },
    85: { cmd: 'exec', params: ['underline'], id: 'underline' },
    83: { cmd: 'exec', params: ['strikeThrough'], id: 'strikeThrough' },
    75: { cmd: 'exec', params: ['createLink'], id: 'createLink' },
    80: { cmd: 'exec', params: ['insertImage'], id: 'insertImage' },
    65: { cmd: 'exec', params: ['selectAll'], id: 'selectAll' },
    221: { cmd: 'exec', params: ['indent'], id: 'indent' },
    219: { cmd: 'exec', params: ['outdent'], id: 'outdent' },
    72: { cmd: 'exec', params: ['html'], id: 'html' },
    48: { cmd: 'exec', params: ['formatBlock', 'n'], id: 'formatBlock n' },
    49: { cmd: 'exec', params: ['formatBlock', 'h1'], id: 'formatBlock h1' },
    50: { cmd: 'exec', params: ['formatBlock', 'h2'], id: 'formatBlock h2' },
    51: { cmd: 'exec', params: ['formatBlock', 'h3'], id: 'formatBlock h3' },
    52: { cmd: 'exec', params: ['formatBlock', 'h4'], id: 'formatBlock h4' },
    53: { cmd: 'exec', params: ['formatBlock', 'h5'], id: 'formatBlock h5' },
    54: { cmd: 'exec', params: ['formatBlock', 'h6'], id: 'formatBlock h6' },
    222: { cmd: 'exec', params: ['formatBlock', 'blockquote'], id: 'formatBlock blockquote' },
    220: { cmd: 'exec', params: ['formatBlock', 'pre'], id: 'formatBlock pre' }
  };

  /**
   * Enable editor shortcuts.
   */
  Editable.prototype.initShortcuts = function () {
    if (this.options.shortcuts) {
      this.$element.on('keydown', $.proxy(function (e) {
        var keyCode = e.which;
        var ctrlKey = (e.ctrlKey || e.metaKey) && !e.altKey;

        if (!this.isHTML && ctrlKey) {
          if (this.shortcuts_map[keyCode] && this.shortcutEnabled(this.shortcuts_map[keyCode].id))  {
            return this.execDefaultShortcut(this.shortcuts_map[keyCode].cmd, this.shortcuts_map[keyCode].params);
          }

          // CTRL + SHIFT + z
          if (keyCode == 90 && e.shiftKey) {
            e.preventDefault();
            e.stopPropagation();

            this.redo();

            return false;
          }

          // CTRL + z
          if (keyCode == 90) {
            e.preventDefault();
            e.stopPropagation();

            this.undo();

            return false;
          }
        }
      }, this));
    }
  };

  Editable.prototype.initTabs = function () {
    this.$element.on('keydown', $.proxy(function (e) {
      var keyCode = e.which;

      // TAB.
      if (keyCode == 9 && !e.shiftKey) {
        if (!this.raiseEvent('tab')) {
          e.preventDefault();
        }

        else if (this.options.tabSpaces) {
          e.preventDefault();

          var spaces = '&nbsp;&nbsp;&nbsp;&nbsp;';
          var element = this.getSelectionElements()[0];
          if (element.tagName === 'PRE') {
            spaces = '    ';
          }

          this.insertHTML(spaces, false);
        }
        else {
          this.blur();
        }
      }

      // SHIFT + TAB.
      else if (keyCode == 9 && e.shiftKey) {
        if (!this.raiseEvent('shift+tab')) {
          e.preventDefault();
        }
        else if (this.options.tabSpaces) {
          e.preventDefault();
        }
        else {
          this.blur();
        }
      }
    }, this));
  }

  /*
   * Check if element is text empty.
   */
  Editable.prototype.textEmpty = function (element) {
    var text = $(element).text().replace(/(\r\n|\n|\r|\t)/gm, '');

    return (text === '' || element === this.$element.get(0)) && $(element).find('br').length === 0;
  }

  Editable.prototype.inEditor = function (el) {
    while (el && el.tagName !== 'BODY') {
      if (el === this.$element.get(0)) return true;
      el = el.parentNode;
    }

    return false;
  }

  /*
   * Focus in element.
   */
  Editable.prototype.focus = function (try_to_focus) {
    if (try_to_focus === undefined) try_to_focus = true;

    if (this.text() !== '' && !this.$element.is(':focus')) {
      if (!this.browser.msie) this.$element.focus();

      return;
    }

    if (!this.isHTML) {
      if (try_to_focus && !this.pasting && !this.browser.msie) {
        this.$element.focus();
      }

      if (this.pasting && !this.$element.is(':focus')) {
        this.$element.focus();
      }

      var range = this.getRange();

      if (this.text() === '' && (range && (range.startOffset === 0 || range.startContainer === this.$element.get(0) || !this.inEditor(range.startContainer)))) {
        var i;
        var element;
        var elements = this.getSelectionElements();

        // Keep focus in elements such as SPAN, STRONG, etc.
        if ($.merge(['IMG', 'BR'], this.valid_nodes).indexOf(this.getSelectionElement().tagName) < 0) {
          return false;
        }

        if ((range.startOffset > 0 && this.valid_nodes.indexOf(this.getSelectionElement().tagName) >= 0) ||  (range.startContainer && range.startContainer.nodeType === 3)) {
          return false;
        }

        // There is an element and not the main element.
        if (elements.length >= 1 && elements[0] !== this.$element.get(0)) {
          for (i = 0; i < elements.length; i++) {
            element = elements[i];
            if (!this.textEmpty(element) || this.browser.msie) {
              this.setSelection(element);
              return;
            }
          }
        }

        // Range starts in element at a higher position.
        if (range.startContainer === this.$element.get(0) && range.startOffset > 0 && !this.options.paragraphy) {
          this.setSelection(this.$element.get(0), range.startOffset);
          return;
        }

        elements = this.$element.find(this.valid_nodes.join(','));
        for (i = 0; i < elements.length; i++) {
          element = elements[i];
          if (!this.textEmpty(element) && $(element).find(this.valid_nodes.join(',')).length === 0) {
            this.setSelection(element);
            return;
          }
        }

        this.setSelection(this.$element.get(0));
      }
    }
  };

  Editable.prototype.addMarkersAtEnd = function ($element) {
    var elements = $element.find(this.valid_nodes.join(', '));
    if (elements.length === 0) elements.push($element.get(0))

    var el = elements[elements.length - 1];
    $(el).append('<span class="f-marker" data-type="false" data-id="0" data-fr-verified="true"></span><span class="f-marker" data-type="true" data-id="0" data-fr-verified="true"></span>');
  }

  Editable.prototype.setFocusAtEnd = function ($element) {
    if ($element === undefined) $element = this.$element;

    this.addMarkersAtEnd($element);

    this.restoreSelectionByMarkers();
  }

  Editable.prototype.breakHTML = function (clean_html) {
    // Clear selection first.
    this.removeMarkers();
    if (this.$element.find('break').length === 0) {
      this.insertSimpleHTML('<break></break>');
    }

    // Search for focus element.
    var element = this.$element.find('break').parents($.merge(['UL', 'OL'], this.valid_nodes).join(','))[0];

    // Special UL/OL parent case condition.
    if ($(element).parents('ul, ol').length) element = $(element).parents('ul, ol')[0];

    // Wrap pasted li content in UL. Firefox doesn't do that.
    if (['UL', 'OL'].indexOf(element.tagName) >= 0) {
      var $div = $('<div>').html(clean_html);
      $div.find('> li').wrap('<' + element.tagName + '>');
      clean_html = $div.html();
    }

    // Insert in main element.
    if (element == this.$element.get(0)) {
      if (this.$element.find('break').next().length) {
        this.$element.find('break').next().prepend('<span class="f-marker" data-type="false" data-id="0" data-fr-verified="true"></span><span class="f-marker" data-type="true" data-id="0" data-fr-verified="true"></span>');
        this.insertSimpleHTML(clean_html);
        this.restoreSelectionByMarkers();
      }
      else {
        this.insertSimpleHTML(clean_html);
        this.setFocusAtEnd();
      }

      this.$element.find('break').remove();
      this.checkPlaceholder();
      return true;
    }

    // Insert in TD.
    if (element.tagName === 'TD') {
      this.$element.find('break').remove();
      this.insertSimpleHTML(clean_html);
      return true;
    }

    // Set markers.
    var $divx = $('<div>').html(clean_html);
    this.addMarkersAtEnd($divx);
    clean_html = $divx.html();

    // Empty element.
    if (this.emptyElement($(element))) {
      $(element).replaceWith(clean_html);
      this.restoreSelectionByMarkers();
      this.checkPlaceholder();
      return true;
    }

    // Mark empty li.
    this.$element.find('li').each ($.proxy(function (index, li) {
      if (this.emptyElement(li)) $(li).addClass('empty-li');
    }, this));

    var html = $('<div></div>').append($(element).clone()).html();
    var tag;
    var open_tags = [];
    var tag_indexes = {};
    var li_html = [];
    var chr;
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
          if (tag_name == 'break') {
            if (!this.isClosingTag(tag)) {
              for (var k = open_tags.length - 1; k >= 0; k--) {
                var open_tag_name = this.tagName(open_tags[k]);

                li_html.push('</' + open_tag_name + '>');
              }

              li_html.push(clean_html);

              for (var p = 0; p < open_tags.length; p++) {
                li_html.push(open_tags[p]);
              }
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

    $(element).replaceWith(li_html.join(''));

    // Remove new empty li.
    this.$element.find('li').each ($.proxy(function (index, li) {
      var $li = $(li);
      if ($li.hasClass('empty-li')) {
        $li.removeClass('empty-li');
      }
      else if (this.emptyElement(li)) {
        $li.remove();
      }
    }, this));

    this.cleanupLists();
    this.restoreSelectionByMarkers();
  }

  Editable.prototype.insertSimpleHTML = function (html) {
    var sel;
    var range;
    this.no_verify = true;
    if (window.getSelection) {
      // IE9 and non-IE
      sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        range.deleteContents();

        var el = document.createElement('div');
        el.innerHTML = html;

        var frag = document.createDocumentFragment();
        var node;
        var lastNode;

        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node);
        }
        range.insertNode(frag);

        // Preserve the selection
        if (lastNode) {
          range = range.cloneRange();
          range.setStartAfter(lastNode);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    } else if ((sel = document.selection) && sel.type != 'Control') {
      // IE < 9
      var originalRange = sel.createRange();
      originalRange.collapse(true);
      sel.createRange().pasteHTML(html);
    }
    this.no_verify = false;
  }

  // http://stackoverflow.com/questions/6690752/insert-html-at-caret-in-a-contenteditable-div/6691294#6691294
  Editable.prototype.insertHTML = function (html, do_focus) {
    if (do_focus === undefined) do_focus = true;

    if (!this.isHTML && do_focus) {
      this.focus();
    }

    // Clear selection first.
    this.removeMarkers();
    this.insertSimpleHTML('<break></break>');
    this.checkPlaceholder(true);

    // Empty.
    if (this.$element.hasClass('f-placeholder')) {
      this.$element.html(html);
      if (this.options.paragraphy) this.wrapText(true);
      this.setFocusAtEnd();
      this.checkPlaceholder();
      return false;
    }

    // Break if it's necessary.
    var elems = $('<div>').append(html).find('*');
    for (var i = 0; i < elems.length; i++) {
      if (this.valid_nodes.indexOf(elems[i].tagName) >= 0) {
        this.breakHTML(html);
        return false;
      }
    }

    this.$element.find('break').remove();
    this.insertSimpleHTML(html);
  };

  /**
   * Run shortcut.
   *
   * @param command - Command name.
   * @param val - Command value.
   * @returns {boolean}
   */
  Editable.prototype.execDefaultShortcut = function (method, params) {
    this[method].apply(this, params);

    return false;
  };

  /**
   * Init editor.
   */
  Editable.prototype.initEditor = function () {
    var cls = 'froala-editor';
    if (this.mobile()) {
      cls += ' touch';
    }
    if (this.browser.msie && Editable.getIEversion() < 9) {
      cls += ' ie8';
    }

    this.$editor = $('<div class="' + cls + '" style="display: none;">');
    $('body').append(this.$editor);

    if (this.options.inlineMode) {
      this.initInlineEditor();
    } else {
      this.initBasicEditor();
    }
  };

  Editable.prototype.refreshToolbarPosition = function () {
    // Scroll is where the editor is.
    if ($(window).scrollTop() > this.$box.offset().top && $(window).scrollTop() < this.$box.offset().top + this.$box.outerHeight() - this.$editor.outerHeight()) {
      this.$element.css('padding-top', this.$editor.outerHeight() + this.$element.data('padding-top'))
      this.$placeholder.css('margin-top', this.$editor.outerHeight() + this.$element.data('padding-top'))

      this.$editor
        .addClass('f-scroll')
        .removeClass('f-scroll-abs')
        .css('bottom', '')
        .css('left', this.$box.offset().left + parseFloat(this.$box.css('padding-left'), 10) - $(window).scrollLeft())
        .width(this.$element.outerWidth() - parseFloat(this.$editor.css('border-left-width'), 10) - parseFloat(this.$editor.css('border-right-width'), 10))

      // IOS.
      if (this.iOS()) {
        if (this.$element.is(':focus')) {
          this.$editor.css('top', $(window).scrollTop())
        }
        else {
          this.$editor.css('top', '');
        }
      }
    }

    // Scroll is above or below the editor.
    else {
      // Scroll is above.
      if ($(window).scrollTop() < this.$box.offset().top) {
        if (this.iOS() && this.$element.is(':focus')) {
          this.$element.css('padding-top', this.$editor.outerHeight() + this.$element.data('padding-top'))
          this.$placeholder.css('margin-top', this.$editor.outerHeight() + this.$element.data('padding-top'))

          this.$editor
            .addClass('f-scroll')
            .removeClass('f-scroll-abs')
            .css('bottom', '')
            .css('left', this.$box.offset().left + parseFloat(this.$box.css('padding-left'), 10) - $(window).scrollLeft())
            .width(this.$element.outerWidth() - parseFloat(this.$editor.css('border-left-width'), 10) - parseFloat(this.$editor.css('border-right-width'), 10))

          this.$editor.css('top', this.$box.offset().top)
        }
        else {
          this.$editor
            .removeClass('f-scroll f-scroll-abs')
            .css('bottom', '')
            .css('top', '')
            .width('');

          this.$element.css('padding-top', '');
          this.$placeholder.css('margin-top', '');
        }
      }

      // Scroll is below.
      else if ($(window).scrollTop() > this.$box.offset().top + this.$box.outerHeight() - this.$editor.outerHeight() && !this.$editor.hasClass('f-scroll-abs')) {
        this.$element.css('padding-top', this.$editor.outerHeight() + this.$element.data('padding-top'))
        this.$placeholder.css('margin-top', this.$editor.outerHeight() + this.$element.data('padding-top'))

        this.$editor.removeClass('f-scroll').addClass('f-scroll-abs');
        this.$editor.css('bottom', 0).css('top', '').css('left', '');
      }
    }
  }

  Editable.prototype.toolbarTop = function () {
    if (!this.options.toolbarFixed && !this.options.inlineMode) {
      this.$element.data('padding-top', parseInt(this.$element.css('padding-top'), 10));
      $(window).on('scroll resize load', $.proxy(function () {
        this.refreshToolbarPosition();
      }, this));

      if (this.iOS()) {
        this.$element.on('focus blur', $.proxy(function () {
          this.refreshToolbarPosition();
        }, this));
      }
    }
  };

  /**
   * Basic editor.
   */
  Editable.prototype.initBasicEditor = function () {
    this.$element.addClass('f-basic');
    this.$wrapper.addClass('f-basic');

    this.$popup_editor = this.$editor.clone();
    this.$popup_editor.appendTo($('body')).addClass('f-inline');

    this.$editor.addClass('f-basic').show();
    this.$editor.insertBefore(this.$wrapper);

    this.toolbarTop();
  };

  /**
   * Inline editor.
   */
  Editable.prototype.initInlineEditor = function () {
    this.$editor.addClass('f-inline');
    this.$element.addClass('f-inline');

    this.$popup_editor = this.$editor;
  };

  /**
   * Init drag for image insertion.
   */
  Editable.prototype.initDrag = function () {
    // Drag and drop support.
    this.drag_support = {
      filereader: typeof FileReader != 'undefined',
      formdata: !!window.FormData,
      progress: 'upload' in new XMLHttpRequest()
    };
  };

  /**
   * Init options.
   */
  Editable.prototype.initOptions = function () {
    this.setDimensions();

    this.setSpellcheck();

    this.setImageUploadURL();

    this.setButtons();

    this.setDirection();

    this.setTextNearImage();

    this.setZIndex();

    this.setTheme();

    if (this.options.editInPopup) {
      this.buildEditPopup();
    }

    if (!this.editableDisabled) {
      this.setPlaceholder();

      this.setPlaceholderEvents();
    }
  };

  /**
   * Determine if is touch device.
   */
  Editable.prototype.isTouch = function () {
    return WYSIWYGModernizr.touch && window.Touch !== undefined;
  };

  /**
   * Selection events.
   */
  Editable.prototype.initEditorSelection = function () {
    this.$element.on('keyup', $.proxy(function (e) {
      return this.triggerEvent('keyup', [e], false);
    }, this));

    this.$element.on('focus', $.proxy(function () {
      if (this.blurred) {
        this.blurred = false;

        if (!this.pasting && this.text() === '') {
          this.focus(false);
        }

        this.triggerEvent('focus', [], false);
      }
    }, this));

    // Hide editor on mouse down.
    this.$element.on('mousedown touchstart', $.proxy(function () {
      if (this.isDisabled) return false;

      if (!this.isResizing()) {
        this.closeImageMode();
        this.hide();
      }
    }, this));

    if (this.options.disableRightClick) {
      // Disable right click.
      this.$element.contextmenu($.proxy(function (e) {
        e.preventDefault();

        if (this.options.inlineMode) {
          this.$element.focus();
        }

        return false;
      }, this))
    }

    // Mouse up on element.
    this.$element.on(this.mouseup, $.proxy(function (e) {
      if (this.isDisabled) return false;

      if (!this.isResizing()) {
        var text = this.text();

        e.stopPropagation();
        this.imageMode = false;

        // There is text selected.
        if ((text !== '' || this.options.alwaysVisible || this.options.editInPopup || ((e.which == 3 || e.button == 2) && this.options.inlineMode && !this.isImage && this.options.disableRightClick)) && !this.link && !this.imageMode) {
          setTimeout($.proxy(function () {
            text = this.text();
            if ((text !== '' || this.options.alwaysVisible || this.options.editInPopup || ((e.which == 3 || e.button == 2) && this.options.inlineMode && !this.isImage && this.options.disableRightClick)) && !this.link && !this.imageMode) {
              this.show(e);

              if (this.options.editInPopup) {
                this.showEditPopup();
              }
            }
          }, this), 0);
        }

        // We are in basic mode. Refresh button state.
        else if (!this.options.inlineMode) {
          this.refreshButtons();
        }
      }

      this.hideOtherEditors()
    }, this));


    // Hide editor if not in inline mode.
    this.$editor.on(this.mouseup, $.proxy(function (e) {
      if (this.isDisabled) return false;

      if (!this.isResizing()) {
        e.stopPropagation();

        if (this.options.inlineMode === false) {
          this.hide();
        }
      }
    }, this));


    this.$editor.on('mousedown', '.fr-dropdown-menu', $.proxy(function (e) {
      if (this.isDisabled) return false;

      e.stopPropagation();
      this.noHide = true;
    }, this));

    this.$popup_editor.on('mousedown', '.fr-dropdown-menu', $.proxy(function (e) {
      if (this.isDisabled) return false;

      e.stopPropagation();
      this.noHide = true;
    }, this));


    // Mouse up on editor. If we have text or we are in image mode stop it.
    this.$popup_editor.on('mouseup', $.proxy(function (e) {
      if (this.isDisabled) return false;

      if (!this.isResizing()) {
        e.stopPropagation();
      }
    }, this));


    // Stop event propagation in link wrapper.
    if (this.$edit_popup_wrapper) {
      this.$edit_popup_wrapper.on('mouseup', $.proxy(function (e) {
        if (this.isDisabled) return false;

        if (!this.isResizing()) {
          e.stopPropagation();
        }
      }, this));
    }

    this.setDocumentSelectionChangeEvent();

    this.setWindowMouseUpEvent();

    this.setWindowKeyDownEvent();

    this.setWindowKeyUpEvent();

    this.setWindowOrientationChangeEvent();

    this.setWindowHideEvent();

    this.setWindowBlurEvent();

    // Add scrolling event.
    if (this.options.trackScroll) {
      this.setWindowScrollEvent();
    }
  };

  Editable.prototype.blur = function (clear_selection) {
    if (!this.blurred && !this.pasting) {
      this.selectionDisabled = true;
      this.triggerEvent('blur', []);

      if (clear_selection && $('*:focus').length === 0) {
        this.clearSelection();
      }

      if (!this.isLink && !this.isImage) this.selectionDisabled = false;

      this.blurred = true;
    }
  }

  Editable.prototype.setWindowBlurEvent = function () {
    this.$window.on('blur.' + this._id, $.proxy(function (e, clear_selection) {
      this.blur(clear_selection);
    }, this));
  }

  Editable.prototype.setWindowHideEvent = function () {
    // Hide event.
    this.$window.on('hide.' + this._id, $.proxy(function () {
      if (!this.isResizing()) {
        this.hide(false);
      } else {
        this.$element.find('.f-img-handle').trigger('moveend');
      }
    }, this));
  }

  // Hide on orientation change.
  Editable.prototype.setWindowOrientationChangeEvent = function () {
    this.$window.on('orientationchange.' + this._id, $.proxy(function () {
      setTimeout($.proxy(function () {
        this.hide();
      }, this), 10);
    }, this));
  };

  Editable.prototype.setDocumentSelectionChangeEvent = function () {
    // Selection changed. Touch support..
    this.$document.on('selectionchange.' + this._id, $.proxy(function (e) {
      if (this.isDisabled) return false;

      if (!this.isResizing() && !this.isScrolling) {
        clearTimeout(this.selectionChangedTimeout);
        this.selectionChangedTimeout = setTimeout($.proxy(function () {
          if (this.options.inlineMode && this.selectionInEditor() && this.link !== true && this.isTouch()) {
            var text = this.text();

            // There is text selected.
            if (text !== '') {
              if (!this.iPod()) {
                this.show(null);
              } else if (this.options.alwaysVisible) {
                this.hide();
              }

              e.stopPropagation();
            } else if (!this.options.alwaysVisible) {
              this.hide();
              this.closeImageMode();
              this.imageMode = false;
            } else {
              this.show(null);
            }
          }
        }, this), 75);
      }
    }, this));
  }

  Editable.prototype.setWindowMouseUpEvent = function () {
    // Window mouseup for current editor.
    this.$window.on(this.mouseup + '.' + this._id, $.proxy(function () {
      if (this.isDisabled) return false;

      if (!this.isResizing() && !this.isScrolling) {
        this.$bttn_wrapper.find('button[data-cmd]').removeClass('active');

        if (this.selectionInEditor() && this.text() !== '' && !this.isTouch()) {
          this.show(null);
        } else if (this.$popup_editor.is(':visible')) {
          this.hide();
          this.closeImageMode();
          this.imageMode = false;
        }

        this.blur(true);
      }

      // Remove button down.
      $('[data-down]').removeAttr('data-down');
    }, this));
  }

  Editable.prototype.setWindowKeyDownEvent = function () {
    // Key down anywhere on window.
    this.$window.on('keydown.' + this._id, $.proxy(function (e) {
      var keyCode = e.which;

      if (this.imageMode) {
        // Insert br before image if enter is hit.
        if (keyCode == 13) {
          this.$element.find('.f-img-editor').parents('.f-img-wrap').before('<br/>')
          this.sync();
          this.$element.find('.f-img-editor img').click();
          return false;
        }

        // Delete.
        if (keyCode == 46 || keyCode == 8) {
          e.stopPropagation();
          e.preventDefault();
          setTimeout($.proxy(function () {
            this.removeImage(this.$element.find('.f-img-editor'));
          }, this), 0);
          return false;
        }
      }

      else if (this.selectionInEditor()) {
        if (this.isDisabled) return true;

        var ctrlKey = (e.ctrlKey || e.metaKey) && !e.altKey;
        if (!ctrlKey && this.$popup_editor.is(':visible')) {
          if (keyCode == 27 || (this.$bttn_wrapper.is(':visible') && this.options.inlineMode)) {
            this.hide();
            this.closeImageMode();
          }
        }
      }
    }, this));

  }

  Editable.prototype.setWindowKeyUpEvent = function () {
    // Key up anywhere on window.
    this.$window.on('keyup.' + this._id, $.proxy(function () {
      if (this.isDisabled) return false;

      if (this.selectionInEditor() && this.text() !== '' && !this.$popup_editor.is(':visible')) {
        this.repositionEditor();
      }
    }, this));
  }

  Editable.prototype.setWindowScrollEvent = function () {
    this.$window.on('scroll.' + this._id, $.proxy(function () {
      if (this.isDisabled) return false;

      clearTimeout(this.scrollTimer);
      this.isScrolling = true;
      this.scrollTimer = setTimeout($.proxy(function () {
        this.isScrolling = false;
      }, this), 2500);
    }, this));
  }

  /**
   * Set textNearImage.
   *
   * @param text - Placeholder text.
   */
  Editable.prototype.setTextNearImage = function (enable) {

    if (enable !== undefined) {
      this.options.textNearImage = enable;
    }

    if (this.options.textNearImage === true) {
      this.$element.removeClass('f-tni');
    } else {
      this.$element.addClass('f-tni');
    }
  };

  /**
   * Set placeholder.
   *
   * @param text - Placeholder text.
   */
  Editable.prototype.setPlaceholder = function (text) {
    if (text) {
      this.options.placeholder = text;
    }

    if (this.$textarea) {
      this.$textarea.attr('placeholder', this.options.placeholder);
    }

    if (!this.$placeholder) {
      this.$placeholder = $('<span class="fr-placeholder" unselectable="on"></span>')
        .bind('click', $.proxy(function () {
          this.focus();
        }, this));

      this.$element.after(this.$placeholder);
    }

    this.$placeholder.text(this.options.placeholder);
  };

  Editable.prototype.isEmpty = function () {
    var text = this.$element.text().replace(/(\r\n|\n|\r|\t|\u200B|\u0020)/gm, '');
    return text === '' &&
      this.$element.find('img, table, iframe, input, hr').length === 0 &&
      this.$element.find('p > br, div > br').length === 0 &&
      this.$element.find($.map(this.valid_nodes, function (val) {
        return ['P, DIV'].indexOf(val) >= 0 ? null : val;
      }).join(', ')).length === 0;
  };

  Editable.prototype.checkPlaceholder = function (ignore_flags) {
    if (this.isDisabled && !ignore_flags) return false;

    if (this.pasting && !ignore_flags) return false;

    this.$element.find('td:empty, th:empty').append('</br>');

    /* if (!this.browser.msie) {
       this.$element.find(this.valid_nodes.join(':empty, ') + ':empty').remove();
    } */

    if (!this.isHTML) {
      // Empty.
      if (this.isEmpty() && !this.fakeEmpty()) {
        var $p;
        var focused = this.selectionInEditor() || this.$element.is(':focus');

        if (this.options.paragraphy) {
          $p = $('<p><br/></p>');
          this.$element.html($p);

          if (focused) {
            this.setSelection($p.get(0));
          }

          this.$element.addClass('f-placeholder');
        } else {
          if (this.$element.find('br').length === 0) {
            this.$element.append('<br/>');
          }

          this.$element.addClass('f-placeholder');
        }
      }

      // There is a p.
      else if (!this.$element.find('p').length && this.options.paragraphy) {
        // Wrap text.
        this.wrapText(true);

        // Place cursor.
        if (this.$element.find('p').length && this.text() === '') {
          this.setSelection(this.$element.find('p')[0], this.$element.find('p').text().length, null, this.$element.find('p').text().length);
        } else {
          this.$element.removeClass('f-placeholder');
        }
      }

      // Not empty at all.
      else if (this.fakeEmpty() === false || this.$element.find(this.valid_nodes.join(',')).length > 1) {
        this.$element.removeClass('f-placeholder');
      }

      else {
        this.$element.addClass('f-placeholder');
      }
    }

    return true;
  }

  Editable.prototype.fakeEmpty = function ($element) {
    if ($element === undefined) {
      $element = this.$element;
    }

    var text = $element.text().replace(/(\r\n|\n|\r|\t|\u200B)/gm, '');
    return text === '' && ($element.find('p, div').length == 1 && $element.find('p > br, div > br').length == 1)
      && $element.find('img, table, iframe, input, hr').length === 0;
  }

  // For Korean keydown keyup events are not dispatched in Firefox.
  // https://bugzilla.mozilla.org/show_bug.cgi?id=354358
  Editable.prototype.setPlaceholderEvents = function () {
    if (!(this.browser.msie && Editable.getIEversion() < 9)) {
      this.$element.on('focus', $.proxy(function () {
        if (this.isDisabled) return false;

        if ((this.$element.text() === '') && !this.pasting) {
          this.focus(false);
        }
      }, this))

      this.$element.on('keyup keydown focus placeholderCheck', $.proxy(function () {
        return this.checkPlaceholder();
      }, this));

      this.$element.trigger('placeholderCheck');
    }
  };

  /**
   * Set element dimensions.
   *
   * @param width - Editor width.
   * @param height - Editor height.
   */
  Editable.prototype.setDimensions = function (height, width, minHeight, maxHeight) {

    if (height) {
      this.options.height = height;
    }

    if (width) {
      this.options.width = width;
    }

    if (minHeight) {
      this.options.minHeight = minHeight;
    }

    if (maxHeight) {
      this.options.maxHeight = maxHeight;
    }

    if (this.options.height != 'auto') {
      this.$element.css('height', this.options.height);
    }

    if (this.options.minHeight != 'auto') {
      this.$element.css('minHeight', this.options.minHeight);
    }

    if (this.options.maxHeight != 'auto') {
      this.$element.css('maxHeight', this.options.maxHeight);
    }

    if (this.options.width != 'auto') {
      this.$box.css('width', this.options.width);
    }
  };

  /**
   * Set element direction.
   *
   * @param dir - Text direction.
   */
  Editable.prototype.setDirection = function (dir) {
    if (dir) {
      this.options.direction = dir;
    }

    if (this.options.direction != 'ltr' && this.options.direction != 'rtl') {
      this.options.direction = 'ltr';
    }

    if (this.options.direction == 'rtl') {
      this.$element.addClass('f-rtl');
      this.$editor.addClass('f-rtl');
      this.$popup_editor.addClass('f-rtl');
      if (this.$image_modal) {
        this.$image_modal.addClass('f-rtl');
      }
    } else {
      this.$element.removeClass('f-rtl');
      this.$editor.removeClass('f-rtl');
      this.$popup_editor.removeClass('f-rtl');
      if (this.$image_modal) {
        this.$image_modal.removeClass('f-rtl');
      }
    }
  };

  Editable.prototype.setZIndex = function (zIndex) {
    if (zIndex) {
      this.options.zIndex = zIndex;
    }

    this.$editor.css('z-index', this.options.zIndex);
    this.$popup_editor.css('z-index', this.options.zIndex + 1);
    if (this.$overlay) {
      this.$overlay.css('z-index', this.options.zIndex + 2);
    }
    if (this.$image_modal) {
      this.$image_modal.css('z-index', this.options.zIndex + 3);
    }
  }

  Editable.prototype.setTheme = function (theme) {
    if (theme) {
      this.options.theme = theme;
    }

    if (this.options.theme != null) {
      this.$editor.addClass(this.options.theme + '-theme');
      this.$popup_editor.addClass(this.options.theme + '-theme');
      if (this.$box) {
        this.$box.addClass(this.options.theme + '-theme');
      }
      if (this.$image_modal) {
        this.$image_modal.addClass(this.options.theme + '-theme');
        // this.$overlay.addClass(this.options.theme + '-theme');
      }
    }
  }

  Editable.prototype.setSpellcheck = function (enable) {
    if (enable !== undefined) {
      this.options.spellcheck = enable;
    }

    this.$element.attr('spellcheck', this.options.spellcheck);
  };

  Editable.prototype.customizeText = function (customText) {
    if (customText) {
      var list = this.$editor.find('[title]').add(this.$popup_editor.find('[title]'));

      if (this.$image_modal) {
        list = list.add(this.$image_modal.find('[title]'));
      }

      list.each($.proxy(function (index, elem) {
        for (var old_text in customText) {
          if ($(elem).attr('title').toLowerCase() == old_text.toLowerCase()) {
            $(elem).attr('title', customText[old_text]);
          }
        }
      }, this));


      list = this.$editor.find('[data-text="true"]').add(this.$popup_editor.find('[data-text="true"]'))
      if (this.$image_modal) {
        list = list.add(this.$image_modal.find('[data-text="true"]'));
      }

      list.each($.proxy(function (index, elem) {
        for (var old_text in customText) {
          if ($(elem).text().toLowerCase() == old_text.toLowerCase()) {
            $(elem).text(customText[old_text]);
          }
        }
      }, this));
    }
  };

  Editable.prototype.setLanguage = function (lang) {
    if (lang !== undefined) {
      this.options.language = lang;
    }

    if ($.Editable.LANGS[this.options.language]) {
      this.customizeText($.Editable.LANGS[this.options.language].translation);
      if ($.Editable.LANGS[this.options.language].direction) {
        this.setDirection($.Editable.LANGS[this.options.language].direction);
      }

      if ($.Editable.LANGS[this.options.language].translation[this.options.placeholder]) {
        this.setPlaceholder($.Editable.LANGS[this.options.language].translation[this.options.placeholder]);
      }
    }
  };

  Editable.prototype.setCustomText = function (customText) {
    if (customText) {
      this.options.customText = customText;
    }

    if (this.options.customText) {
      this.customizeText(this.options.customText);
    }
  };

  Editable.prototype.execHTML = function () {
    this.html();
  };

  Editable.prototype.initHTMLArea = function () {
    this.$html_area = $('<textarea wrap="hard">')
      .keydown(function (e) {
        var keyCode = e.keyCode || e.which;

        if (keyCode == 9) {
          e.preventDefault();
          var start = $(this).get(0).selectionStart;
          var end = $(this).get(0).selectionEnd;

          // set textarea value to: text before caret + tab + text after caret
          $(this).val($(this).val().substring(0, start) + '\t' + $(this).val().substring(end));

          // put caret at right position again
          $(this).get(0).selectionStart = $(this).get(0).selectionEnd = start + 1;
        }
      })
      .focus($.proxy(function () {
        if (this.blurred) {
          this.blurred = false;

          this.triggerEvent('focus', [], false);
        }
      }, this))
      .mouseup($.proxy(function () {
        if (this.blurred) {
          this.blurred = false;

          this.triggerEvent('focus', [], false);
        }
      }, this))
  };

  Editable.prototype.command_dispatcher = {
    align: function (command) {
      var dropdown = this.buildDropdownAlign(command);
      var btn = this.buildDropdownButton(command, dropdown);
      return btn;
    },

    formatBlock: function (command) {
      var dropdown = this.buildDropdownFormatBlock(command);
      var btn = this.buildDropdownButton(command, dropdown);
      return btn;
    },

    html: function (command) {
      var btn = this.buildDefaultButton(command);

      if (this.options.inlineMode) {
        this.$box.append($(btn).clone(true).addClass('html-switch').attr('title', 'Hide HTML').click($.proxy(this.execHTML, this)));
      }

      this.initHTMLArea();

      return btn;
    }
  }

  /**
   * Set buttons for editor.
   *
   * @param buttons
   */
  Editable.prototype.setButtons = function (buttons) {
    if (buttons) {
      this.options.buttons = buttons;
    }

    this.$editor.append('<div class="bttn-wrapper" id="bttn-wrapper-' + this._id + '">');
    this.$bttn_wrapper = this.$editor.find('#bttn-wrapper-' + this._id);

    if (this.mobile()) {
      this.$bttn_wrapper.addClass('touch');
    }

    var dropdown;
    var btn;

    var btn_string = '';
    // Add commands to editor.
    for (var i = 0; i < this.options.buttons.length; i++) {
      var button_name = this.options.buttons[i];

      if (button_name == 'sep') {
        if (this.options.inlineMode) {
          btn_string += '<div class="f-clear"></div><hr/>';
        } else {
          btn_string += '<span class="f-sep"></span>';
        }
        continue;
      }

      // Look for custom button with that name.
      var command = Editable.commands[button_name];
      if (command === undefined) {
        command = this.options.customButtons[button_name];

        if (command === undefined) {
          command = this.options.customDropdowns[button_name];

          if (command === undefined) {
            continue;
          }
          else {
            btn = this.buildCustomDropdown(command, button_name);
            btn_string += btn;
            this.bindRefreshListener(command);
            continue;
          }
        } else {
          btn = this.buildCustomButton(command, button_name);
          btn_string += btn;
          this.bindRefreshListener(command);
          continue;
        }
      }

      command.cmd = button_name;
      var command_dispatch = this.command_dispatcher[command.cmd];

      if (command_dispatch) {
        btn_string += command_dispatch.apply(this, [command]);
      } else {
        if (command.seed) {
          dropdown = this.buildDefaultDropdown(command);
          btn = this.buildDropdownButton(command, dropdown);
          btn_string += btn;
        } else {
          btn = this.buildDefaultButton(command);
          btn_string += btn;
          this.bindRefreshListener(command);
        }
      }
    }

    this.$bttn_wrapper.html(btn_string);
    this.$bttn_wrapper.find('button[data-cmd="undo"], button[data-cmd="redo"]').prop('disabled', true);

    // Assign events.
    this.bindButtonEvents();
  };

  Editable.prototype.bindRefreshListener = function (command) {
    if (command.refresh) {
      this.addListener('refresh', $.proxy(function () {
        command.refresh.apply(this, [command.cmd])
      }, this));
    }
  }

  /**
   * Create button for command.
   *
   * @param command - Command name.
   * @returns {*}
   */
  Editable.prototype.buildDefaultButton = function (command) {
    var btn = '<button type="button" class="fr-bttn" title="' + command.title + '" data-cmd="' + command.cmd + '">';

    if (this.options.icons[command.cmd] === undefined) {
      btn += this.addButtonIcon(command);
    } else {
      btn += this.prepareIcon(this.options.icons[command.cmd], command.title);
    }

    btn += '</button>';

    return btn;
  };

  /*
   * Prepare icon.
   */
  Editable.prototype.prepareIcon = function (icon, title) {
    switch (icon.type) {
      case 'font':
        return this.addButtonIcon({
          icon: icon.value
        });

      case 'img':
        return this.addButtonIcon({
          icon_img: icon.value,
          title: title
        });

      case 'txt':
        return this.addButtonIcon({
          icon_txt: icon.value
        });
    }
  };


  /**
   * Add icon to button.
   *
   * @param $btn - jQuery object.
   * @param command - Command name.
   */
  Editable.prototype.addButtonIcon = function (command) {
    if (command.icon) {
      return '<i class="' + command.icon + '"></i>';
    } else if (command.icon_alt) {
      return '<i class="for-text">' + command.icon_alt + '</i>';
    } else if (command.icon_img) {
      return '<img src="' + command.icon_img + '" alt="' + command.title + '"/>';
    } else if (command.icon_txt) {
      return '<i>' + command.icon_txt + '</i>';
    } else {
      return command.title;
    }
  };

  Editable.prototype.buildCustomButton = function (button, button_name) {
    this['call_' + button_name] = button.callback;
    var btn = '<button type="button" class="fr-bttn" data-callback="call_' + button_name + '" data-cmd="button_name" data-name="' + button_name + '" title="' + button.title + '">' + this.prepareIcon(button.icon, button.title) + '</button>';

    return btn;
  };

  Editable.prototype.callDropdown = function (btn_name, callback) {
    this.$bttn_wrapper.on('click touch', '[data-name="' + btn_name + '"]', $.proxy(function (e) {
      e.preventDefault();
      e.stopPropagation();
      callback.apply(this);
    }, this))
  };

  Editable.prototype.buildCustomDropdown = function (button, button_name) {
    // Dropdown button.
    var btn_wrapper = '<div class="fr-bttn fr-dropdown">';

    btn_wrapper += '<button type="button" class="fr-trigger" title="' + button.title + '" data-name="' + button_name + '">' + this.prepareIcon(button.icon, button.title) + '</button>';

    btn_wrapper += '<ul class="fr-dropdown-menu">';

    var i = 0;
    for (var text in button.options) {
      this['call_' + button_name + i] = button.options[text];
      var m_btn = '<li data-callback="call_' + button_name + i + '" data-cmd="' + button_name + i + '" data-name="' + button_name + i + '"><a href="#">' + text + '</a></li>';

      btn_wrapper += m_btn;

      i++ ;
    }

    btn_wrapper += '</ul></div>';

    return btn_wrapper;
  };

  /**
   * Default dropdown.
   *
   * @param command - Command.
   * @param cls - Dropdown custom class.
   * @returns {*}
   */
  Editable.prototype.buildDropdownButton = function (command, dropdown, cls) {
    cls = cls || '';

    // Dropdown button.
    var btn_wrapper = '<div class="fr-bttn fr-dropdown ' + cls + '">';

    var icon = '';
    if (this.options.icons[command.cmd] === undefined) {
      icon += this.addButtonIcon(command);
    } else {
      icon += this.prepareIcon(this.options.icons[command.cmd], command.title);
    }

    var btn = '<button type="button" data-name="' + command.cmd + '" class="fr-trigger" title="' + command.title + '">' + icon + '</button>';

    btn_wrapper += btn;
    btn_wrapper += dropdown;
    btn_wrapper += '</div>';

    return btn_wrapper;
  };

  /**
   * Dropdown for align.
   *
   * @param command
   * @returns {*}
   */
  Editable.prototype.buildDropdownAlign = function (command) {
    this.bindRefreshListener(command);

    var dropdown = '<ul class="fr-dropdown-menu f-align">';

    // Iterate color seed.
    for (var j = 0; j < command.seed.length; j++) {
      var align = command.seed[j];

      dropdown += '<li data-cmd="align" data-val="' + align.cmd + '" title="' + align.title + '"><a href="#"><i class="' + align.icon + '"></i></a></li>';
    }

    dropdown += '</ul>';

    return dropdown;
  };



  /**
   * Dropdown for formatBlock.
   *
   * @param command
   * @returns {*}
   */
  Editable.prototype.buildDropdownFormatBlock = function (command) {
    var dropdown = '<ul class="fr-dropdown-menu">';

    // Iterate format block seed.
    for (var b_name in this.options.blockTags) {
      var format_btn = '<li data-cmd="' + command.cmd + '" data-val="' + b_name + '">';
      format_btn += '<a href="#" data-text="true" class="format-' + b_name + '" title="' + this.options.blockTags[b_name] + '">' + this.options.blockTags[b_name] + '</a></li>';

      dropdown += format_btn;
    }

    dropdown += '</ul>';

    return dropdown;
  };

  /**
   * Dropdown for formatBlock.
   *
   * @param command
   * @returns {*}
   */
  Editable.prototype.buildDefaultDropdown = function (command) {
    var dropdown = '<ul class="fr-dropdown-menu">';

    // Iterate format block seed.
    for (var j = 0; j < command.seed.length; j++) {
      var cmd = command.seed[j];

      var format_btn = '<li data-cmd="' + (cmd.cmd || command.cmd) + '" data-val="' + cmd.value + '" data-param="' + (cmd.param || command.param) + '">'
      format_btn += '<a href="#" data-text="true" class="' + cmd.value + '" title="' + cmd.title + '">' + cmd.title + '</a></li>';

      dropdown += format_btn;
    }

    dropdown += '</ul>';

    return dropdown;
  };

  Editable.prototype.createEditPopupHTML = function () {
    var html = '<div class="froala-popup froala-text-popup" style="display:none;">';
    html += '<h4><span data-text="true">Edit text</span><i title="Cancel" class="fa fa-times" id="f-text-close-' + this._id + '"></i></h4></h4>';
    html += '<div class="f-popup-line"><input type="text" placeholder="http://www.example.com" class="f-lu" id="f-ti-' + this._id + '">';
    html += '<button data-text="true" type="button" class="f-ok" id="f-edit-popup-ok-' + this._id + '">OK</button>';
    html += '</div>';
    html += '</div>';

    return html;
  }

  /**
   * Build create link.
   */
  Editable.prototype.buildEditPopup = function () {
    this.$edit_popup_wrapper = $(this.createEditPopupHTML());
    this.$popup_editor.append(this.$edit_popup_wrapper);

    this.$edit_popup_wrapper.find('#f-ti-' + this._id).on('mouseup keydown', function (e) {
      e.stopPropagation();
    });

    this.addListener('hidePopups', $.proxy(function () {
      this.$edit_popup_wrapper.hide();
    }, this));

    this.$edit_popup_wrapper.on('click', '#f-edit-popup-ok-' + this._id, $.proxy(function () {
      this.$element.text(this.$edit_popup_wrapper.find('#f-ti-' + this._id).val());
      this.sync();
      this.hide();
    }, this));

    // Close button.
    this.$edit_popup_wrapper
      .on('click', 'i#f-text-close-' + this._id, $.proxy(function () {
        this.hide();
      }, this))
  };

  /**
   * Make request with CORS.
   *
   * @param method
   * @param url
   * @returns {XMLHttpRequest}
   */
  Editable.prototype.createCORSRequest = function (method, url) {
    var xhr = new XMLHttpRequest();
    if ('withCredentials' in xhr) {

      // Check if the XMLHttpRequest object has a "withCredentials" property.
      // "withCredentials" only exists on XMLHTTPRequest2 objects.
      xhr.open(method, url, true);

      // Set with credentials.
      if (this.options.withCredentials) {
        xhr.withCredentials = true;
      }

      // Set headers.
      for (var header in this.options.headers) {
        xhr.setRequestHeader(header, this.options.headers[header]);
      }

    } else if (typeof XDomainRequest != 'undefined') {

      // Otherwise, check if XDomainRequest.
      // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
      xhr = new XDomainRequest();
      xhr.open(method, url);
    } else {
      // Otherwise, CORS is not supported by the browser.
      xhr = null;

    }
    return xhr;
  };

  /**
   * Check if command is enabled.
   *
   * @param cmd - Command name.
   * @returns {boolean}
   */
  Editable.prototype.isEnabled = function (cmd) {
    return $.inArray(cmd, this.options.buttons) >= 0;
  };


  /**
   * Bind events for buttons.
   */
  Editable.prototype.bindButtonEvents = function () {
    this.bindDropdownEvents();

    this.bindCommandEvents(this.$bttn_wrapper);
  };

  /**
   * Bind events for dropdown.
   */
  Editable.prototype.bindDropdownEvents = function () {
    var that = this;

    this.$bttn_wrapper.on(this.mousedown, '.fr-dropdown .fr-trigger:not([disabled])', function (e) {
      if (e.type === 'mousedown' && e.which !== 1) return true;

      if (!(this.tagName === 'LI' && e.type === 'touchstart' && that.android()) && !that.iOS()) {
        e.preventDefault();
      }

      // Simulate click.
      $(this).attr('data-down', true);
    });

    // Dropdown event.
    this.$bttn_wrapper.on(this.mouseup, '.fr-dropdown .fr-trigger:not([disabled])', function (e) {
      if (that.isDisabled) return false;

      e.stopPropagation();
      e.preventDefault();

      if (!$(this).attr('data-down')) {
        $('[data-down]').removeAttr('data-down');
        return false;
      }

      $('[data-down]').removeAttr('data-down');

      if (that.options.inlineMode === false) {
        that.hide();
      }

      $(this)
        .toggleClass('active')
        .trigger('blur');

      that.closeImageMode();
      that.imageMode = false;

      var refreshCallback;
      var btn_name = $(this).attr('data-name');

      if (Editable.commands[btn_name]) {
        refreshCallback = Editable.commands[btn_name].refreshOnShow;
      } else if (that.options.customDropdowns[btn_name]) {
        refreshCallback = that.options.customDropdowns[btn_name].refreshOnShow;
      }

      if (refreshCallback) {
        refreshCallback.call(that);
      }


      that.$bttn_wrapper.find('.fr-dropdown').not($(this).parent())
        .find('.fr-trigger')
        .removeClass('active');

      return false;
    });

    this.$bttn_wrapper.on(this.mouseup, '.fr-dropdown', function (e) {
      e.stopPropagation();
      e.preventDefault();
    });

    $(window).on('mouseup selectionchange', $.proxy(function () {
      if (this.isDisabled) return false;

      this.$bttn_wrapper.find('.fr-dropdown .fr-trigger').removeClass('active');
    }, this));

    this.$element.on('mouseup', 'img, a', $.proxy(function () {
      if (this.isDisabled) return false;

      this.$bttn_wrapper.find('.fr-dropdown .fr-trigger').removeClass('active');
    }, this));

    // Prevent click in A tag inside LI.
    this.$bttn_wrapper.on('click', 'li[data-cmd] > a', function (e) {
      e.preventDefault();
    });
  };

  /**
   * Bind events for button command.
   */
  Editable.prototype.bindCommandEvents = function ($div) {
    var that = this;

    $div.on(this.mousedown, 'button[data-cmd], li[data-cmd], span[data-cmd], a[data-cmd]', function (e) {
      if (e.type === 'mousedown' && e.which !== 1) return true;

      if (!(this.tagName === 'LI' && e.type === 'touchstart' && that.android()) && !that.iOS()) {
        e.preventDefault();
      }

      // Simulate click.
      $(this).attr('data-down', true);
    });

    $div.on(this.mouseup + ' ' + this.move, 'button[data-cmd], li[data-cmd], span[data-cmd], a[data-cmd]', $.proxy(function (e) {
      if (that.isDisabled) return false;

      if (e.type === 'mouseup' && e.which !== 1) return true;

      var elem = e.currentTarget;

      if (e.type != 'touchmove') {
        e.stopPropagation();
        e.preventDefault();

        // Simulate click.
        if (!$(elem).attr('data-down')) {
          $('[data-down]').removeAttr('data-down');
          return false;
        }
        $('[data-down]').removeAttr('data-down');

        if ($(elem).data('dragging')) {
          $(elem).removeData('dragging');
          return false;
        }

        var timeout = $(elem).data('timeout');
        if (timeout) {
          clearTimeout(timeout);
          $(elem).removeData('timeout');
        }


        var callback = $(elem).data('callback');
        if (callback) {
          that[callback]();
        }
        else {
          var cmd = $(elem).attr('data-cmd');
          var val = $(elem).attr('data-val');
          var param = $(elem).attr('data-param');
          that.exec(cmd, val, param);
          that.$bttn_wrapper.find('.fr-dropdown .fr-trigger').removeClass('active');
        }

        return false;
      }

      else {
        if (!$(elem).data('timeout')) {
          $(elem).data('timeout', setTimeout(function () {
            $(elem).data('dragging', true);
          }, 200));
        }
      }
    }, this));
  };

  /**
   * Undo.
   */
  Editable.prototype.undo = function () {
    this.no_verify = true;
    if (this.undoIndex > 1) {
      clearTimeout(this.typingTimer);

      var cHTML = this.getHTML();

      var step = this.undoStack[--this.undoIndex - 1];
      this.$element.html(step);
      this.restoreSelectionByMarkers();

      // (newHTML, oldHTML)
      this.doingRedo = true;
      this.triggerEvent('undo', [this.getHTML(), cHTML]);
      this.doingRedo = false;

      if (this.text() !== '') {
        this.repositionEditor();
      }
      else {
        this.hide();
      }

      this.$element.trigger('placeholderCheck');
      this.focus();
      this.refreshButtons();
    }
    this.no_verify = false;
  };

  /**
   * Redo.
   */
  Editable.prototype.redo = function () {
    this.no_verify = true;

    if (this.undoIndex < this.undoStack.length) {
      clearTimeout(this.typingTimer);

      var cHTML = this.getHTML();

      var step = this.undoStack[this.undoIndex++];
      this.$element.html(step);
      this.restoreSelectionByMarkers();

      // (newHTML, oldHTML)
      this.doingRedo = true;
      this.triggerEvent('redo', [this.getHTML(), cHTML]);
      this.doingRedo = false;

      if (this.text() !== '') {
        this.repositionEditor();
      }
      else {
        this.hide();
      }

      this.$element.trigger('placeholderCheck');
      this.focus();
      this.refreshButtons();
    }
    this.no_verify = false;
  };

  /**
   * Save in DB.
   */
  Editable.prototype.save = function () {
    if (!this.triggerEvent('beforeSave', [], false)) {
      return false;
    }

    if (this.options.saveURL) {
      var params = {};
      for (var key in this.options.saveParams) {
        var param = this.options.saveParams[key];
        if (typeof(param) == 'function') {
          params[key] = param.call(this);
        } else {
          params[key] = param;
        }
      }

      $.ajax({
        type: this.options.saveRequestType,
        url: this.options.saveURL,
        data: $.extend({ body: this.getHTML(false, true) }, this.options.saveParams),
        crossDomain: this.options.crossDomain,
        xhrFields: {
          withCredentials: this.options.withCredentials
        },
        headers: this.options.headers
      })
      .done($.proxy(function (data) {
        // data
        this.triggerEvent('afterSave', [data]);
      }, this))
      .fail($.proxy(function () {
        // (error)
        this.triggerEvent('saveError', ['Save request failed on the server.']);
      }, this));

    } else {
      // (error)
      this.triggerEvent('saveError', ['Missing save URL.']);
    }
  };

  Editable.prototype.sanitizeURL = function (url) {
    if (/^https?:\/\//.test(url)) {
      url = String(url)
              .replace(/</g, '%3C')
              .replace(/>/g, '%3E')
              .replace(/"/g, '%22')
              .replace(/ /g, '%20');


      var test_reg = /\(?(?:(http|https|ftp):\/\/)?(?:((?:[^\W\s]|\.|-|[:]{1})+)@{1})?((?:www.)?(?:[^\W\s]|\.|-)+[\.][^\W\s]{2,4}|(?:www.)?(?:[^\W\s]|\.|-)|localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::(\d*))?([\/]?[^\s\?]*[\/]{1})*(?:\/?([^\s\n\?\[\]\{\}\#]*(?:(?=\.)){1}|[^\s\n\?\[\]\{\}\.\#]*)?([\.]{1}[^\s\?\#]*)?)?(?:\?{1}([^\s\n\#\[\]]*))?([\#][^\s\n]*)?\)?/gi;
      if (!test_reg.test(url)) {
        return '';
      }
    }
    else {
      url = encodeURIComponent(url)
                .replace(/%23/g, '#')
                .replace(/%2F/g, '/')
                .replace(/%25/g, '%')
                .replace(/mailto%3A/g, 'mailto:')
                .replace(/tel%3A/g, 'tel:')
                .replace(/data%3Aimage/g, 'data:image')
                .replace(/webkit-fake-url%3A/g, 'webkit-fake-url:')
                .replace(/%3F/g, '?')
                .replace(/%3D/g, '=')
                .replace(/%26/g, '&')
                .replace(/&amp;/g, '&')
                .replace(/%2C/g, ',')
                .replace(/%3B/g, ';')
                .replace(/%2B/g, '+')
                .replace(/%40/g, '@');
    }

    return url;
  }

  Editable.prototype.option = function (prop, val) {
    if (prop === undefined) {
      return this.options;
    } else if (prop instanceof Object) {
      this.options = $.extend({}, this.options, prop);

      this.initOptions();
      this.setCustomText();
      this.setLanguage();
    } else if (val !== undefined) {
      this.options[prop] = val;

      switch (prop) {
        case 'direction':
          this.setDirection();
          break;
        case 'height':
        case 'width':
        case 'minHeight':
        case 'maxHeight':
          this.setDimensions();
          break;
        case 'spellcheck':
          this.setSpellcheck();
          break;
        case 'placeholder':
          this.setPlaceholder();
          break;
        case 'customText':
          this.setCustomText();
          break;
        case 'language':
          this.setLanguage();
          break;
        case 'textNearImage':
          this.setTextNearImage();
          break;
        case 'zIndex':
          this.setZIndex();
          break;
        case 'theme':
          this.setTheme();
          break;
      }
    } else {
      return this.options[prop];
    }
  };

  // EDITABLE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.editable;

  $.fn.editable = function (option) {
    var arg_list = [];
    for (var i = 0; i < arguments.length; i++) {
      arg_list.push(arguments[i]);
    }

    if (typeof option == 'string') {
      var returns = [];

      this.each(function () {
        var $this = $(this);
        var editor = $this.data('fa.editable');

        if (editor[option]) {
          var returned_value = editor[option].apply(editor, arg_list.slice(1));
          if (returned_value === undefined) {
            returns.push(this);
          } else if (returns.length === 0) {
            returns.push(returned_value);
          }
        }
        else {
          return $.error('Method ' +  option + ' does not exist in Froala Editor.');
        }
      });

      return (returns.length == 1) ? returns[0] : returns;
    }
    else if (typeof option === 'object' || !option) {
      return this.each(function () {
        var that = this;
        var $this = $(that);
        var editor = $this.data('fa.editable');

        if (!editor) $this.data('fa.editable', (editor = new Editable(that, option)));
      });
    }
  };

  $.fn.editable.Constructor = Editable;
  $.Editable = Editable;

  $.fn.editable.noConflict = function () {
    $.fn.editable = old;
    return this;
  };
}(window.jQuery);

(function ($) {
  /**
   * Refresh button state.
   */
  $.Editable.prototype.refreshButtons = function (force_refresh) {
    if (((!this.selectionInEditor() || this.isHTML) && !(this.browser.msie && $.Editable.getIEversion() < 9)) && !force_refresh) {
      return false;
    }

    // Remove class active from toolbar buttons.
    this.$editor.find('button[data-cmd]').removeClass('active');

    // Refresh disabled state.
    this.refreshDisabledState();

    // Trigger refresh event.
    this.raiseEvent('refresh');
  };

  $.Editable.prototype.refreshDisabledState = function () {
    // Add disabled where necessary.
    for (var i = 0; i < this.options.buttons.length; i++) {
      var button = this.options.buttons[i];
      if ($.Editable.commands[button] === undefined) {
        continue;
      }

      var disabled = false;
      if ($.isFunction($.Editable.commands[button].disabled)) {
        disabled = $.Editable.commands[button].disabled.apply(this);
      }
      else if ($.Editable.commands[button].disabled !== undefined) {
        disabled = true;
      }

      if (disabled) {
        this.$editor.find('button[data-cmd="' + button + '"]').prop('disabled', true);
        this.$editor.find('button[data-name="' + button + '"]').prop('disabled', true);
      }
      else {
        this.$editor.find('button[data-cmd="' + button + '"]').removeAttr('disabled');
        this.$editor.find('button[data-name="' + button + '"]').removeAttr('disabled');
      }
    }
  }

  $.Editable.prototype.refreshFormatBlocks = function () {
    var element = this.getSelectionElements()[0];
    var tag = element.tagName.toLowerCase();

    if (this.options.paragraphy && tag === 'p') {
      tag = 'n';
    }

    // Update format block first so that we can refresh block style list.
    this.$editor.find('.fr-bttn > button[data-name="formatBlock"] + ul li').removeClass('active');
    this.$bttn_wrapper.find('.fr-bttn > button[data-name="formatBlock"] + ul li[data-val="' + tag + '"]').addClass('active');
  }

  /**
   * Refresh undo, redo buttons.
   */
  $.Editable.prototype.refreshUndo = function () {
    if (this.isEnabled('undo')) {
      if (this.$editor === undefined) return;

      this.$bttn_wrapper.find('[data-cmd="undo"]').removeAttr('disabled');

      if (this.undoStack.length === 0 || this.undoIndex <= 1 || this.isHTML) {
        this.$bttn_wrapper.find('[data-cmd="undo"]').prop('disabled', true);
      }
    }
  };

  $.Editable.prototype.refreshRedo = function () {
    if (this.isEnabled('redo')) {
      if (this.$editor === undefined) return;

      this.$bttn_wrapper.find('[data-cmd="redo"]').removeAttr('disabled');

      if (this.undoIndex == this.undoStack.length || this.isHTML) {
        this.$bttn_wrapper.find('[data-cmd="redo"]').prop('disabled', true);
      }
    }
  };

  /**
   * Refresh default buttons.
   *
   * @param elem
   */
  $.Editable.prototype.refreshDefault = function (cmd) {
    try {
      if (document.queryCommandState(cmd) === true) {
        this.$editor.find('[data-cmd="' + cmd + '"]').addClass('active');
      }
    } catch (ex) {}
  };

  /**
   * Refresh alignment.
   *
   * @param elem
   */
  $.Editable.prototype.refreshAlign = function () {
    var $element = $(this.getSelectionElements()[0]);
    this.$editor.find('.fr-dropdown > button[data-name="align"] + ul li').removeClass('active');

    var cmd;
    var alignment = $element.css('text-align');
    if (['left', 'right', 'justify', 'center'].indexOf(alignment) < 0) alignment = 'left';

    if (alignment == 'left') {
      cmd = 'justifyLeft';
    } else if (alignment == 'right') {
      cmd = 'justifyRight';
    } else if (alignment == 'justify') {
      cmd = 'justifyFull';
    } else if (alignment == 'center') {
      cmd = 'justifyCenter';
    }

    this.$editor.find('.fr-dropdown > button[data-name="align"].fr-trigger i').attr('class', 'fa fa-align-' + alignment);
    this.$editor.find('.fr-dropdown > button[data-name="align"] + ul li[data-val="' + cmd + '"]').addClass('active');
  };

  $.Editable.prototype.refreshHTML = function () {
    if (this.isActive('html')) {
      this.$editor.find('[data-cmd="html"]').addClass('active');
    } else {
      this.$editor.find('[data-cmd="html"]').removeClass('active');
    }
  }

})(jQuery);

(function ($) {
  $.Editable.commands = {
    bold: {
      title: 'Bold',
      icon: 'fa fa-bold',
      shortcut: '(Ctrl + B)',
      refresh: $.Editable.prototype.refreshDefault,
      undo: true,
      callbackWithoutSelection: function (cmd) {
        this._startInDefault(cmd);
      }
    },

    italic: {
      title: 'Italic',
      icon: 'fa fa-italic',
      shortcut: '(Ctrl + I)',
      refresh: $.Editable.prototype.refreshDefault,
      undo: true,
      callbackWithoutSelection: function (cmd) {
        this._startInDefault(cmd);
      }
    },

    underline: {
      cmd: 'underline',
      title: 'Underline',
      icon: 'fa fa-underline',
      shortcut: '(Ctrl + U)',
      refresh: $.Editable.prototype.refreshDefault,
      undo: true,
      callbackWithoutSelection: function (cmd) {
        this._startInDefault(cmd);
      }
    },

    strikeThrough: {
      title: 'Strikethrough',
      icon: 'fa fa-strikethrough',
      refresh: $.Editable.prototype.refreshDefault,
      undo: true,
      callbackWithoutSelection: function (cmd) {
        this._startInDefault(cmd);
      }
    },

    subscript: {
      title: 'Subscript',
      icon: 'fa fa-subscript',
      refresh: $.Editable.prototype.refreshDefault,
      undo: true,
      callbackWithoutSelection: function (cmd) {
        this._startInDefault(cmd);
      }
    },

    superscript: {
      title: 'Superscript',
      icon: 'fa fa-superscript',
      refresh: $.Editable.prototype.refreshDefault,
      undo: true,
      callbackWithoutSelection: function (cmd) {
        this._startInDefault(cmd);
      }
    },

    formatBlock: {
      title: 'Format Block',
      icon: 'fa fa-paragraph',
      refreshOnShow: $.Editable.prototype.refreshFormatBlocks,
      callback: function (cmd, val) {
        this.formatBlock(val);
      },
      undo: true
    },

    align: {
      title: 'Alignment',
      icon: 'fa fa-align-left',
      refresh: $.Editable.prototype.refreshAlign,
      refreshOnShow: $.Editable.prototype.refreshAlign,
      seed: [{
        cmd: 'justifyLeft',
        title: 'Align Left',
        icon: 'fa fa-align-left'
      }, {
        cmd: 'justifyCenter',
        title: 'Align Center',
        icon: 'fa fa-align-center'
      }, {
        cmd: 'justifyRight',
        title: 'Align Right',
        icon: 'fa fa-align-right'
      }, {
        cmd: 'justifyFull',
        title: 'Justify',
        icon: 'fa fa-align-justify'
      }],
      callback: function (cmd, val) {
        this.align(val);
      },
      undo: true
    },

    outdent: {
      title: 'Indent Less',
      icon: 'fa fa-dedent',
      activeless: true,
      shortcut: '(Ctrl + <)',
      callback: function () {
        this.outdent(true);
      },
      undo: true
    },

    indent: {
      title: 'Indent More',
      icon: 'fa fa-indent',
      activeless: true,
      shortcut: '(Ctrl + >)',
      callback: function () {
        this.indent();
      },
      undo: true
    },

    selectAll: {
      title: 'Select All',
      icon: 'fa fa-file-text',
      shortcut: '(Ctrl + A)',
      callback: function (cmd, val) {
        this.$element.focus();
        this.execDefault(cmd, val);
      },
      undo: false
    },

    createLink: {
      title: 'Insert Link',
      icon: 'fa fa-link',
      shortcut: '(Ctrl + K)',
      callback: function () {
        this.insertLink();
      },
      undo: false
    },

    insertImage: {
      title: 'Insert Image',
      icon: 'fa fa-picture-o',
      activeless: true,
      shortcut: '(Ctrl + P)',
      callback: function () {
        this.insertImage();
      },
      undo: false
    },

    undo: {
      title: 'Undo',
      icon: 'fa fa-undo',
      activeless: true,
      shortcut: '(Ctrl+Z)',
      refresh: $.Editable.prototype.refreshUndo,
      callback: function () {
        this.undo();
      },
      undo: false
    },

    redo: {
      title: 'Redo',
      icon: 'fa fa-repeat',
      activeless: true,
      shortcut: '(Shift+Ctrl+Z)',
      refresh: $.Editable.prototype.refreshRedo,
      callback: function () {
        this.redo();
      },
      undo: false
    },

    html: {
      title: 'Show HTML',
      icon: 'fa fa-code',
      refresh: $.Editable.prototype.refreshHTML,
      callback: function () {
        this.html();
      },
      undo: false
    },

    save: {
      title: 'Save',
      icon: 'fa fa-floppy-o',
      callback: function () {
        this.save();
      },
      undo: false
    },

    insertHorizontalRule: {
      title: 'Insert Horizontal Line',
      icon: 'fa fa-minus',
      callback: function (cmd) {
        this.insertHR(cmd);
      },
      undo: true
    },

    removeFormat: {
      title: 'Clear formatting',
      icon: 'fa fa-eraser',
      activeless: true,
      callback: function () {
        this.removeFormat();
      },
      undo: true
    }
  };

  /**
   * Exec command.
   *
   * @param cmd
   * @param val
   * @returns {boolean}
   */
  $.Editable.prototype.exec = function (cmd, val, param) {
    if (!this.selectionInEditor() && $.Editable.commands[cmd].undo) this.focus();

    if (this.selectionInEditor() && this.text() === '') {
      if ($.Editable.commands[cmd].callbackWithoutSelection) {
        $.Editable.commands[cmd].callbackWithoutSelection.apply(this, [cmd, val, param]);
        return false;
      }
    }

    if ($.Editable.commands[cmd].callback) {
      $.Editable.commands[cmd].callback.apply(this, [cmd, val, param]);
    } else {
      this.execDefault(cmd, val);
    }
  };

  /**
   * Set html.
   */
  $.Editable.prototype.html = function () {
    var html;

    if (this.isHTML) {
      this.isHTML = false;

      html = this.$html_area.val();
      html = this.clean(html, true, false);

      this.$box.removeClass('f-html');
      this.$html_area.blur();

      this.no_verify = true;
      this.$element.html(html);
      this.cleanupLists();
      this.cleanify(false);
      this.no_verify = false;

      this.$element.attr('contenteditable', true);
      this.$editor.find('.fr-bttn:not([data-cmd="html"]), .fr-trigger').removeAttr('disabled');
      this.$editor.find('.fr-bttn[data-cmd="html"]').removeClass('active');

      if (this.options.paragraphy) {
        this.wrapText();
      }

      // Hack to focus right.
      this.$element.blur();
      this.focus();

      this.refreshButtons();

      // (html)
      this.triggerEvent('htmlHide', [html], true, true);

    } else {
      this.$box.removeClass('f-placeholder');

      this.cleanify(false);

      if (this.options.inlineMode) {
        html = '\n\n' + this.cleanTags(this.getHTML(false, false));
      } else {
        html = this.cleanTags(this.getHTML(false, false));
      }

      html = html.replace(/\&amp;/g, '&')

      this.$html_area.val(html).trigger('resize');

      this.$html_area.css('height', this.$element.height() - 1);
      this.$element.html('').append(this.$html_area).removeAttr('contenteditable');
      this.$box.addClass('f-html');
      this.$editor.find('button.fr-bttn:not([data-cmd="html"]), button.fr-trigger').attr('disabled', true);
      this.$editor.find('.fr-bttn[data-cmd="html"]').addClass('active');

      this.hide();
      this.imageMode = false;

      this.isHTML = true;

      this.$element.blur();

      this.$element.removeAttr('contenteditable');

      // html
      this.triggerEvent('htmlShow', [html], true, false);
    }
  };

  $.Editable.prototype.insertHR = function (cmd) {
    this.$element.find('hr').addClass('fr-tag');

    if (!this.$element.hasClass('f-placeholder')) {
      document.execCommand(cmd);
    }
    else {
      $(this.$element.find('> ' + this.valid_nodes.join(', >'))[0]).before('<hr/>');
    }

    this.hide();

    var nextElems = this.$element.find('hr:not(.fr-tag)').next(this.valid_nodes.join(','));
    if (nextElems.length > 0) {
      $(nextElems[0]).prepend(this.markers_html);
    }
    else {
      if (this.options.paragraphy) {
        this.$element.find('hr:not(.fr-tag)').after('<p>' + this.markers_html + '<br/></p>');
      }
      else {
        this.$element.find('hr:not(.fr-tag)').after(this.markers_html);
      }
    }

    this.restoreSelectionByMarkers();

    this.triggerEvent(cmd, [], true, false);
  }

  /**
   * Format block.
   *
   * @param val
   */
  $.Editable.prototype.formatBlock = function (val, cls, param) {
    if (this.disabledList.indexOf('formatBlock') >= 0) {
      return false;
    }

    if (this.browser.msie && $.Editable.getIEversion() < 9) {
      if (val == 'n') {
        if (this.options.paragraphy) val = 'p';
        else val = 'div';
      }

      document.execCommand('formatBlock', false, '<' + val + '>');
      this.triggerEvent('formatBlock');

      return false;
    }

    // Wrap text.
    this.saveSelectionByMarkers();
    this.wrapText();
    this.restoreSelectionByMarkers();


    var elements = this.getSelectionElements();
    if (elements[0] == this.$element.get(0)) {
      elements = this.$element.find('> ' + this.valid_nodes.join(', >'));
    }

    this.saveSelectionByMarkers();

    var $sel;

    var li_td = function ($el) {
      if ($el.get && ['LI', 'TD', 'TH'].indexOf($el.get(0).tagName) >= 0) return true;
      return false;
    }

    for (var i = 0; i < elements.length; i++) {
      var $element = $(elements[i]);

      if (this.fakeEmpty($element)) {
        continue;
      }

      // Format or no format.
      if (val == 'n') {
        if (this.options.paragraphy) {
          $sel = $('<p>').html($element.html());
        }
        else {
          $sel = $element.html() + '<br/>';
        }
      } else {
        $sel = $('<' + val + '>').html($element.html());
      }

      if ($element.get(0) != this.$element.get(0) && !li_td($sel)) {
        var attributes = $element.prop('attributes');

        // Set attributes but not class.
        if ($sel.attr) {
          for (var j = 0; j < attributes.length; j++) {
            if (attributes[j].name !== 'class') {
              $sel.attr(attributes[j].name, attributes[j].value);
            }
          }
        }

        var block_style;
        if (this.options.blockStyles) {
          this.options.blockStyles[val];
        }

        if (block_style === undefined) {
          block_style = this.options.defaultBlockStyle;
        }

        try {
          // Remove the class if it is checked.
          if ($element.hasClass(cls) && $element.get(0).tagName.toLowerCase() === val) {
            $sel.addClass($element.attr('class')).removeClass(cls);
          }

          // Class should be added. Remove other styles for it.
          else {
            // Filter class.
            if ($element.attr('class') !== undefined && block_style !== undefined && (this.options.blockStylesToggle || param == 'toggle')) {
              var classes = $element.attr('class').split(' ');

              // Check each class of the current element.
              for (var k = 0; k < classes.length; k++) {
                var m_cls = classes[k];

                // Add class to the element if it is not in the list.
                if (block_style[m_cls] === undefined && param === undefined) {
                  $sel.addClass(m_cls);
                } else if (block_style[m_cls] !== undefined && param === 'toggle') {
                  $sel.addClass(m_cls);
                }

                // Block type change.
                if ($element.get(0).tagName.toLowerCase() !== val && block_style[m_cls] !== undefined) {
                  $sel.addClass(m_cls);
                }
              }
            }
            else {
              $sel.addClass($element.attr('class'))
            }

            if (cls != '*') {
              $sel.addClass(cls);
            }
          }
        }
        catch (ex) { }

        if (li_td($element)) {
          $element.html($sel);
        } else {
          $element.replaceWith($sel);
        }
      }

      else {
        $element.html($sel);
      }
    }

    this.unwrapText();

    this.restoreSelectionByMarkers();

    this.triggerEvent('formatBlock');

    this.repositionEditor();
  };

  /**
   * Align.
   *
   * @param val
   */
  $.Editable.prototype.align = function (val) {
    if (this.browser.msie && $.Editable.getIEversion() < 9) {
      document.execCommand(val, false, false);

      // (val)
      this.triggerEvent('align', [val]);

      return false;
    }

    this.saveSelectionByMarkers();
    var elements = this.getSelectionElements();

    if (val == 'justifyLeft') {
      val = 'left';
    } else if (val == 'justifyRight') {
      val = 'right';
    } else if (val == 'justifyCenter') {
      val = 'center';
    } else if (val == 'justifyFull') {
      val = 'justify';
    }

    for (var i = 0; i < elements.length; i++) {
      $(elements[i]).css('text-align', val);
    }

    this.repositionEditor();

    this.restoreSelectionByMarkers();

    // (val)
    this.triggerEvent('align', [val]);
  };

  /**
   * Indent.
   *
   * @param outdent - boolean.
   */
  $.Editable.prototype.indent = function (outdent) {
    if (this.browser.msie && $.Editable.getIEversion() < 9) {
      if (!outdent) {
        document.execCommand('indent', false, false);
      } else {
        document.execCommand('outdent', false, false);
      }
      return false;
    }

    var margin = 20;
    if (outdent) {
      margin = -20;
    }

    // Wrap text.
    this.saveSelectionByMarkers();
    this.wrapText();
    this.restoreSelectionByMarkers();

    var elements = this.getSelectionElements();

    this.saveSelectionByMarkers();

    for (var i = 0; i < elements.length; i++) {
      var $element = $(elements[i]);

      if ($element.parentsUntil(this.$element, 'li').length > 0) {
        $element = $element.closest('li');
      }

      if ($element.get(0).tagName === 'LI' && $.isFunction(this.indentLi)) {
        if (!outdent) {
          this.indentLi($element);
        }
        else {
          this.outdentLi($element);
        }
      }
      else {
        if ($element.get(0) != this.$element.get(0)) {
          var oldMargin = parseInt($element.css('margin-left').replace(/px/, ''), 10);
          var newMargin = Math.max(0, oldMargin + margin);
          $element.css('marginLeft', newMargin);
        } else {
          var $sel = $('<div>').html($element.html());
          $element.html($sel);
          $sel.css('marginLeft', Math.max(0, margin));
        }
      }
    }

    this.cleanupLists();
    if (this.options.paragraphy) this.wrapText(true);

    this.unwrapText();
    this.restoreSelectionByMarkers();
    this.repositionEditor();

    if (!outdent) {
      this.triggerEvent('indent');
    }
  };

  /**
   * Outdent.
   */
  $.Editable.prototype.outdent = function () {
    this.indent(true);

    this.triggerEvent('outdent');
  };

  /**
   * Run default command.
   *
   * @param cmd - command name.
   * @param val - command value.
   */
  $.Editable.prototype.execDefault = function (cmd, val) {
    document.execCommand(cmd, false, val);

    this.triggerEvent(cmd, [], true, true);
  };

  $.Editable.prototype._startInDefault = function (cmd) {
    this.focus();

    document.execCommand(cmd, false, false);

    this.refreshButtons();
  }

  $.Editable.prototype._startInFontExec = function (prop, cmd, val) {
    this.focus();

    try {
      var range = this.getRange();
      var boundary = range.cloneRange();

      boundary.collapse(false);

      var $span = $('<span data-inserted="true" data-fr-verified="true" style="' + prop + ': ' + val + ';">&#8203;</span>', document);
      boundary.insertNode($span[0]);

      $span = this.$element.find('[data-inserted]');
      $span.removeAttr('data-inserted');

      this.setSelection($span.get(0), 1);
    }
    catch (ex) {}
  }

  /**
   * Remove format.
   */
  $.Editable.prototype.removeFormat = function () {
    document.execCommand('removeFormat', false, false);
    document.execCommand('unlink', false, false);
  };

  /**
   * Set font size or family.
   *
   * @param val
   */
  $.Editable.prototype.inlineStyle = function (prop, cmd, val) {
    // Preserve font size.
    if (this.browser.webkit && prop != 'font-size') {
      var hasFontSizeSet = function ($span) {
        return $span.attr('style').indexOf('font-size') >= 0;
      }

      this.$element.find('span').each (function (index, span) {
        var $span = $(span);

        if ($span.attr('style') && hasFontSizeSet($span)) {
          $span.data('font-size', $span.css('font-size'));
          $span.css('font-size', '');
        }
      })
    }

    // Apply format.
    document.execCommand('fontSize', false, 4);

    this.saveSelectionByMarkers();

    // Restore font size.
    if (this.browser.webkit && prop != 'font-size') {
      this.$element.find('span').each (function (index, span) {
        var $span = $(span);

        if ($span.data('font-size')) {
          $span.css('font-size', $span.data('font-size'));
          $span.removeData('font-size');
        }
      })
    }

    // Clean font.
    var clean_format = function (index, elem) {
      var $elem = $(elem);
      if ($elem.css(prop) != val) {
        $elem.css(prop, '');
      }

      if ($elem.attr('style') === '') {
        $elem.replaceWith($elem.html());
      }
    }

    // Remove all fonts with size=3.
    this.$element.find('font').each(function (index, elem) {
      var $span = $('<span data-fr-verified="true" style="' + prop + ': ' + val + ';">' + $(elem).html() + '</span>');
      $(elem).replaceWith($span);

      $span.find('span').each(clean_format);
    });

    this.restoreSelectionByMarkers();
    this.repositionEditor();

    this.triggerEvent(cmd, [val], true, true);
  };

})(jQuery);

(function ($) {
  $.Editable.prototype.addListener = function (event_name, callback) {
    var events      = this._events;
    var callbacks   = events[event_name] = events[event_name] || [];

    callbacks.push(callback);
  }

  $.Editable.prototype.raiseEvent = function (event_name, args) {
    if (args === undefined) args = [];

    var resp = true;

    var callbacks = this._events[event_name];

    if (callbacks) {
      for (var i = 0, l = callbacks.length; i < l; i++) {
        var i_resp = callbacks[i].apply(this, args);
        if (i_resp !== undefined && resp !== false) resp = i_resp;
      }
    }

    if (resp === undefined) resp = true;

    return resp;
  }
})(jQuery);

(function ($) {
  $.Editable.prototype.markers_html = '<span class="f-marker" data-type="false" data-id="0" data-fr-verified="true"></span><span class="f-marker" data-type="true" data-id="0" data-fr-verified="true"></span>';

  /**
   * Get selection text.
   *
   * @returns {string}
   */
  $.Editable.prototype.text = function () {
    var text = '';

    if (window.getSelection) {
      text = window.getSelection();
    } else if (document.getSelection) {
      text = document.getSelection();
    } else if (document.selection) {
      text = document.selection.createRange().text;
    }

    return text.toString();
  };

  /**
   * Determine if selection is inside current editor.
   *
   * @returns {boolean}
   */
  $.Editable.prototype.selectionInEditor = function () {
    var parent = this.getSelectionParent();
    var inside = false;

    if (parent == this.$element.get(0)) {
      inside = true;
    }

    if (inside === false) {
      $(parent).parents().each($.proxy(function (index, elem) {
        if (elem == this.$element.get(0)) {
          inside = true;
        }
      }, this));
    }

    return inside;
  };

  /**
   * Get current selection.
   *
   * @returns {string}
   */
  $.Editable.prototype.getSelection = function () {
    var selection = '';
    if (window.getSelection) {
      selection = window.getSelection();
    } else if (document.getSelection) {
      selection = document.getSelection();
    } else {
      selection = document.selection.createRange();
    }

    return selection;
  };

  /**
   * Get current range.
   *
   * @returns {*}
   */
  $.Editable.prototype.getRange = function () {
    var ranges = this.getRanges();
    if (ranges.length > 0) {
      return ranges[0];
    }

    return null;
  };

  $.Editable.prototype.getRanges = function () {
    var sel = this.getSelection();

    // Get ranges.
    if (sel.getRangeAt && sel.rangeCount) {
      var ranges = [];
      for (var i = 0; i < sel.rangeCount; i++) {
        ranges.push(sel.getRangeAt(i));
      }

      return ranges;
    }

    if (document.createRange) {
      return [document.createRange()];
    } else {
      return [];
    }
  }

  /**
   * Clear selection.
   *
   * @returns {*}
   */
  $.Editable.prototype.clearSelection = function () {
    var sel = this.getSelection();

    try {
      if (sel.removeAllRanges) {
        sel.removeAllRanges();
      } else if (sel.empty) {  // IE?
        sel.empty();
      } else if (sel.clear) {
        sel.clear();
      }
    }
    catch (ex) {}
  };

  /**
   * Get the element where the current selection starts.
   *
   * @returns {*}
   */
  $.Editable.prototype.getSelectionElement = function () {
    var sel = this.getSelection();

    if (sel.rangeCount) {
      var range = this.getRange();
      var node = range.startContainer;

      // Get parrent if node type is not DOM.
      if (node.nodeType != 1) {
        node = node.parentNode;
      }

      var node_found = false;

      // Search for node deeper.
      if (node.children.length > 0 && node.children[range.startOffset] && $(node.children[range.startOffset]).text() === this.text()) {
        node = node.children[range.startOffset];
        node_found = true;
      }

      if (!node_found && node.children.length > 0 && $(node.children[0]).text() === this.text() && ['BR', 'IMG'].indexOf(node.children[0].tagName) < 0) {
        node = node.children[0];
      }

      // Make sure the node is in editor.
      var p = node;
      while (p && p.tagName != 'BODY') {
        if (p == this.$element.get(0)) {
          return node;
        }

        p = $(p).parent()[0];
      }
    }

    return this.$element.get(0);
  };

  /**
   * Get the parent of the current selection.
   *
   * @returns {*}
   */
  $.Editable.prototype.getSelectionParent = function () {
    var parent = null;
    var sel;

    if (window.getSelection) {
      sel = window.getSelection();
      if (sel.rangeCount) {
        parent = sel.getRangeAt(0).commonAncestorContainer;
        if (parent.nodeType != 1) {
          parent = parent.parentNode;
        }
      }
    } else if ((sel = document.selection) && sel.type != 'Control') {
      parent = sel.createRange().parentElement();
    }

    if (parent != null && ($.inArray(this.$element.get(0), $(parent).parents()) >= 0 || parent == this.$element.get(0))) {
      return parent;
    }
    else {
      return null;
    }
  };

  /**
   * Check if DOM node is in range.
   *
   * @param range - A range object.
   * @param node - A DOM node object.
   * @returns {*}
   */
  // From: https://code.google.com/p/rangy/source/browse/trunk/test/intersectsnode.html
  $.Editable.prototype.nodeInRange = function (range, node) {
    var nodeRange;
    if (range.intersectsNode) {
      return range.intersectsNode(node);
    } else {
      nodeRange = node.ownerDocument.createRange();
      try {
        nodeRange.selectNode(node);
      } catch (e) {
        nodeRange.selectNodeContents(node);
      }

      return range.compareBoundaryPoints(Range.END_TO_START, nodeRange) == -1 &&
        range.compareBoundaryPoints(Range.START_TO_END, nodeRange) == 1;
    }
  };


  /**
   * Get the valid element of DOM node.
   *
   * @param node - DOM node.
   * @returns {*}
   */
  $.Editable.prototype.getElementFromNode = function (node) {
    if (node.nodeType != 1) {
      node = node.parentNode;
    }

    while (node !== null && this.valid_nodes.indexOf(node.tagName) < 0) {
      node = node.parentNode;
    }

    if (node != null && node.tagName == 'LI' && $(node).find(this.valid_nodes.join(',')).length > 0) {
      return null;
    }

    if ($.makeArray($(node).parents()).indexOf(this.$element.get(0)) >= 0) {
      return node;
    } else {
      return null;
    }
  };

  /**
   * Find next node as a child or as a sibling.
   *
   * @param node - Current node.
   * @returns {DOM Object}
   */
  $.Editable.prototype.nextNode = function (node, endNode) {
    if (node.hasChildNodes()) {
      return node.firstChild;
    } else {
      while (node && !node.nextSibling && node != endNode) {
        node = node.parentNode;
      }
      if (!node || node == endNode) {
        return null;
      }

      return node.nextSibling;
    }
  };

  /**
   * Find the nodes within the range passed as parameter.
   *
   * @param range - A range object.
   * @returns {Array}
   */
  $.Editable.prototype.getRangeSelectedNodes = function (range) {
    // Iterate nodes until we hit the end container
    var rangeNodes = [];

    var node = range.startContainer;
    var endNode = range.endContainer;

    // Special case for a range that is contained within a single node
    if (node == endNode && node.tagName != 'TR') {
      if (!node.hasChildNodes() || node.children.length === 0) {
        return [node];
      }
      else {
        var childs = node.children;
        for (var i = range.startOffset; i < range.endOffset; i++) {
          if (childs[i]) {
            rangeNodes.push(childs[i]);
          }
        }

        if (rangeNodes.length === 0) rangeNodes.push(node);

        return rangeNodes;
      }
    }

    if (node == endNode && node.tagName == 'TR') {
      var child_nodes = node.childNodes;
      var start_offset = range.startOffset;

      if (child_nodes.length > start_offset && start_offset >= 0) {
        var td = child_nodes[start_offset];
        if (td.tagName == 'TD' || td.tagName == 'TH') {
          return [td];
        }
      }
    }

    while (node && node != endNode) {
      rangeNodes.push(node = this.nextNode(node, endNode));
    }

    // Add partially selected nodes at the start of the range
    node = range.startContainer;
    while (node && node != range.commonAncestorContainer) {
      rangeNodes.unshift(node);
      node = node.parentNode;
    }

    return rangeNodes;
  };

  /**
   * Get the nodes that are in the current selection.
   *
   * @returns {Array}
   */
  // Addapted from http://stackoverflow.com/questions/7781963/js-get-array-of-all-selected-nodes-in-contenteditable-div
  $.Editable.prototype.getSelectedNodes = function () {
    // IE gt 9. Other browsers.
    if (window.getSelection) {
      var sel = window.getSelection();
      if (!sel.isCollapsed) {
        var ranges = this.getRanges();
        var nodes = [];
        for (var i = 0; i < ranges.length; i++) {
          nodes = $.merge(nodes, this.getRangeSelectedNodes(ranges[i]));
        }

        return nodes;
      } else if (this.selectionInEditor()) {
        var container = sel.getRangeAt(0).startContainer;
        if (container.nodeType == 3)
          return [container.parentNode];
        else
          return [container];
      }
    }

    return [];
  };


  /**
   * Get the elements that are selected.
   *
   * @returns {Array}
   */
  $.Editable.prototype.getSelectionElements = function () {
    var actualNodes = this.getSelectedNodes();
    var nodes = [];

    $.each(actualNodes, $.proxy(function (index, node) {
      if (node !== null) {
        var element = this.getElementFromNode(node);
        if (nodes.indexOf(element) < 0 && element != this.$element.get(0) && element !== null) {
          nodes.push(element);
        }
      }
    }, this));

    if (nodes.length === 0) {
      nodes.push(this.$element.get(0));
    }

    return nodes;
  };

  /**
   * Get the URL from selection.
   *
   * @returns {string}
   */
  $.Editable.prototype.getSelectionLink = function () {
    var links = this.getSelectionLinks();

    if (links.length > 0) {
      return $(links[0]).attr('href');
    }

    return null;
  };

  /**
   * Save current selection.
   */
  // From: http://stackoverflow.com/questions/5605401/insert-link-in-contenteditable-element
  $.Editable.prototype.saveSelection = function () {
    if (!this.selectionDisabled) {
      this.savedRanges = [];
      var selection_ranges = this.getRanges();

      for (var i = 0; i < selection_ranges.length; i++) {
        this.savedRanges.push(selection_ranges[i].cloneRange())
      }
    }
  };

  /**
   * Restore if there is any selection saved.
   */
  $.Editable.prototype.restoreSelection = function () {
    if (!this.selectionDisabled) {
      var i;
      var len;
      var sel = this.getSelection();

      if (this.savedRanges && this.savedRanges.length) {
        sel.removeAllRanges();
        for (i = 0, len = this.savedRanges.length; i < len; i += 1) {
          sel.addRange(this.savedRanges[i]);
        }
      }
    }
  };

  // https://developer.mozilla.org/en-US/docs/Web/API/document.caretPositionFromPoint
  // http://stackoverflow.com/questions/11191136/set-a-selection-range-from-a-to-b-in-absolute-position
  $.Editable.prototype.insertMarkersAtPoint = function (e) {
    var x = e.clientX;
    var y = e.clientY;

    // Clear markers.
    this.removeMarkers();

    var start;
    var range = null;

    // Default.
    if (typeof document.caretPositionFromPoint != 'undefined') {
      start = document.caretPositionFromPoint(x, y);
      range = document.createRange();

      range.setStart(start.offsetNode, start.offset);
      range.setEnd(start.offsetNode, start.offset);
    }

    // Webkit.
    else if (typeof document.caretRangeFromPoint != 'undefined') {
      start = document.caretRangeFromPoint(x, y);
      range = document.createRange();

      range.setStart(start.startContainer, start.startOffset);
      range.setEnd(start.startContainer, start.startOffset);
    }

    // Set ranges.
    if (range !== null && typeof window.getSelection != 'undefined') {
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }

    // MSIE.
    else if (typeof document.body.createTextRange != 'undefined') {
      try {
        range = document.body.createTextRange();
        range.moveToPoint(x, y);
        var end_range = range.duplicate();
        end_range.moveToPoint(x, y);
        range.setEndPoint('EndToEnd', end_range);
        range.select();
      }
      catch (ex) {

      }
    }

    // Place markers.
    this.placeMarker(range, true, 0);
    this.placeMarker(range, false, 0);
  }

  /**
   * Save selection using markers.
   */
  $.Editable.prototype.saveSelectionByMarkers = function () {
    if (!this.selectionDisabled) {
      if (!this.selectionInEditor()) this.focus();

      this.removeMarkers();

      var ranges = this.getRanges();

      for (var i = 0; i < ranges.length; i++) {
        if (ranges[i].startContainer !== document) {
          var range = ranges[i];
          this.placeMarker(range, true, i); // Start.
          this.placeMarker(range, false, i); // End.
        }
      }
    }
  };

  /**
   * Check if there is any selection stored.
   */
  $.Editable.prototype.hasSelectionByMarkers = function () {
    // Get markers.
    var markers = this.$element.find('.f-marker[data-type="true"]');

    if (markers.length > 0) {
      return true;
    }

    return false;
  }

  /**
   * Restore selection using markers.
   */
  $.Editable.prototype.restoreSelectionByMarkers = function (clear_ranges) {
    if (clear_ranges === undefined) clear_ranges = true;

    if (!this.selectionDisabled) {
      // Get markers.
      var markers = this.$element.find('.f-marker[data-type="true"]');

      // No markers.
      if (markers.length === 0) {
        return false;
      }

      // Focus before restoring selection.
      if (!this.$element.is(':focus') && !this.browser.msie) {
        this.$element.focus();
      }

      var sel = this.getSelection();

      if (clear_ranges || (this.getRange() && !this.getRange().collapsed) || !$(markers[0]).attr('data-collapsed')) {
        if (!(this.browser.msie && $.Editable.getIEversion() < 9)) {
          this.clearSelection();
          clear_ranges = true;
        }
      }

      // Add ranges.
      for (var i = 0; i < markers.length; i++) {
        var id = $(markers[i]).data('id');
        var start_marker = markers[i];
        var end_marker = this.$element.find('.f-marker[data-type="false"][data-id="' + id + '"]');

        // IE 8 workaround.
        if (this.browser.msie && $.Editable.getIEversion() < 9) {
          this.setSelection(start_marker, 0, end_marker, 0);

          // Remove used markers.
          this.removeMarkers();

          return false;
        }

        var range;

        if (clear_ranges) {
          range = document.createRange();
        } else {
          // Get ranges.
          range = this.getRange();
        }

        // Make sure there is an start marker.
        if (end_marker.length > 0) {
          end_marker = end_marker[0];

          try {
            range.setStartAfter(start_marker);
            range.setEndBefore(end_marker);
          } catch (ex) {
          }
        }

        if (clear_ranges) {
          sel.addRange(range);
        }
      }

      // Remove used markers.
      this.removeMarkers();
    }
  };

  /**
   * Set selection start.
   *
   * @param sn - Start node.
   * @param fn - Final node.
   */
  $.Editable.prototype.setSelection = function (sn, so, fn, fo) {
    // Check if there is any selection first.
    var sel = this.getSelection();
    if (!sel) return;

    // Clean other ranges.
    this.clearSelection();

    // Sometimes this throws an error.
    try {
      // Start selection.
      if (!fn) fn = sn;
      if (so === undefined) so = 0;
      if (fo === undefined) fo = so;

      // Set ranges (https://developer.mozilla.org/en-US/docs/Web/API/range.setStart)
      var range = this.getRange();
      range.setStart(sn, so);
      range.setEnd(fn, so);

      // Add range to current selection.
      sel.addRange(range);
    } catch (e) { }
  };

  $.Editable.prototype.buildMarker = function (marker, id, collapsed) {
    if (collapsed === undefined) collapsed = '';

    return $('<span class="f-marker"' + collapsed + ' style="display:none; line-height: 0;" data-fr-verified="true" data-id="' + id + '" data-type="' + marker + '">', document)[0];
  };

  /**
   * Insert marker at start/end of range.
   *
   * @param range
   * @param marker - true/false for begin/end.
   */
  $.Editable.prototype.placeMarker = function (range, marker, id) {
    var collapsed = '';
    if (range.collapsed) {
      collapsed = ' data-collapsed="true"';
    }

    try {
      var boundary = range.cloneRange();
      boundary.collapse(marker);

      boundary.insertNode(this.buildMarker(marker, id, collapsed));
      if (marker === true && collapsed) {
        var sibling = this.$element.find('span.f-marker[data-type="true"][data-id="' + id + '"]').get(0).nextSibling;
        while (sibling.nodeType === 3 && sibling.data.length === 0) {
          $(sibling).remove();
          sibling = this.$element.find('span.f-marker[data-type="true"][data-id="' + id + '"]').get(0).nextSibling;
        }
      }
    }
    catch (ex) {
    }
  };

  /**
   * Remove markers.
   */
  $.Editable.prototype.removeMarkers = function () {
    this.$element.find('.f-marker').remove();
  };

  // From: http://www.coderexception.com/0B1B33z1NyQxUQSJ/contenteditable-div-how-can-i-determine-if-the-cursor-is-at-the-start-or-end-of-the-content
  $.Editable.prototype.getSelectionTextInfo = function (el) {
    var atStart = false;
    var atEnd = false;
    var selRange;
    var testRange;

    if (window.getSelection) {
      var sel = window.getSelection();
      if (sel.rangeCount) {
        selRange = sel.getRangeAt(0);
        testRange = selRange.cloneRange();

        testRange.selectNodeContents(el);
        testRange.setEnd(selRange.startContainer, selRange.startOffset);
        atStart = (testRange.toString() === '');

        testRange.selectNodeContents(el);
        testRange.setStart(selRange.endContainer, selRange.endOffset);
        atEnd = (testRange.toString() === '');
      }
    } else if (document.selection && document.selection.type != 'Control') {
      selRange = document.selection.createRange();
      testRange = selRange.duplicate();

      testRange.moveToElementText(el);
      testRange.setEndPoint('EndToStart', selRange);
      atStart = (testRange.text === '');

      testRange.moveToElementText(el);
      testRange.setEndPoint('StartToEnd', selRange);
      atEnd = (testRange.text === '');
    }

    return { atStart: atStart, atEnd: atEnd };
  };

  /**
   * Check if selection is at the end of block.
   */
  $.Editable.prototype.endsWith = function (string, suffix) {
    return string.indexOf(suffix, string.length - suffix.length) !== -1;
  }
})(jQuery);

(function ($) {
  /**
   * Transform a hex value to an RGB array.
   *
   * @param hex - HEX string.
   * @returns {Array}
   */
  $.Editable.hexToRGB = function (hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  /**
   * Transform a hex string to an RGB string.
   *
   * @param val - HEX string.
   * @returns {string}
   */
  $.Editable.hexToRGBString = function (val) {
    var rgb = this.hexToRGB(val);
    if (rgb) {
      return 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
    }
    else {
      return '';
    }
  };

  $.Editable.RGBToHex = function (rgb) {
    function hex(x) {
      return ('0' + parseInt(x, 10).toString(16)).slice(-2);
    }

    try {
      if (!rgb || rgb === 'transparent') return '';

      if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;

      rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

      return ('#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3])).toUpperCase();
    }
    catch (ex) {
      return null;
    }
  }

  /**
   * Find the IE version.
   *
   * @returns {integer}
   */
  $.Editable.getIEversion = function () {
    /*global navigator */
    var rv = -1;
    var ua;
    var re;

    if (navigator.appName == 'Microsoft Internet Explorer') {
      ua = navigator.userAgent;
      re = new RegExp('MSIE ([0-9]{1,}[\\.0-9]{0,})');
      if (re.exec(ua) !== null)
        rv = parseFloat(RegExp.$1);
    } else if (navigator.appName == 'Netscape') {
      ua = navigator.userAgent;
      re = new RegExp('Trident/.*rv:([0-9]{1,}[\\.0-9]{0,})');
      if (re.exec(ua) !== null)
        rv = parseFloat(RegExp.$1);
    }
    return rv;
  };

  /**
   * Find current browser.
   *
   * @returns {Object}
   */
  $.Editable.browser = function () {
    var browser = {};

    if (this.getIEversion() > 0) {
      browser.msie = true;
    } else {
      var ua = navigator.userAgent.toLowerCase();

      var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
        /(webkit)[ \/]([\w.]+)/.exec(ua) ||
        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
        /(msie) ([\w.]+)/.exec(ua) ||
        ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
        [];

      var matched = {
        browser: match[1] || '',
        version: match[2] || '0'
      };

      if (match[1]) browser[matched.browser] = true;
      if (parseInt(matched.version, 10) < 9 && browser.msie) browser.oldMsie = true;

      // Chrome is Webkit, but Webkit is also Safari.
      if (browser.chrome) {
        browser.webkit = true;
      } else if (browser.webkit) {
        browser.safari = true;
      }
    }

    return browser;
  };

  $.Editable.isArray = function (obj) {
    return obj && !(obj.propertyIsEnumerable('length')) &&
            typeof obj === 'object' && typeof obj.length === 'number';
  }

  $.Editable.uniq = function (array) {
    return $.grep(array, function (el, index) {
      return index == $.inArray(el, array);
    });
  }

})(jQuery);

(function ($) {
  /**
   * Show editor
   */
  $.Editable.prototype.show = function (e) {

    if (e === undefined) return;

    if (this.options.inlineMode || this.options.editInPopup) {
      if (e !== null && e.type !== 'touchend') {
        var x = e.pageX;
        var y = e.pageY;

        // Fix releasing cursor outside.
        if (x < this.$element.offset().left) {
          x = this.$element.offset().left;
        }

        if (x > this.$element.offset().left + this.$element.width()) {
          x = this.$element.offset().left + this.$element.width();
        }

        if (y < this.$element.offset.top) {
          y = this.$element.offset().top;
        }

        if (y > this.$element.offset().top + this.$element.height()) {
          y = this.$element.offset().top + this.$element.height();
        }

        // Make coordinates decent.
        if (x < 20) x = 20;
        if (y < 0) y = 0;

        // Show by coordinates.
        this.showByCoordinates(x, y);

        // Hide other editors.
        $('.froala-editor:not(.f-basic)').hide();

        // Show editor.
        this.$editor.show();

        if (this.options.buttons.length === 0 && !this.options.editInPopup) {
          this.$editor.hide();
        }
      }
      else {
        $('.froala-editor:not(.f-basic)').hide();
        this.$editor.show();
        this.repositionEditor();
      }
    }

    this.hidePopups();
    if (!this.options.editInPopup) {
      this.showEditPopupWrapper();
    }

    this.$bttn_wrapper.show();
    this.refreshButtons();

    this.imageMode = false;
  };

  $.Editable.prototype.hideDropdowns = function () {
    this.$bttn_wrapper.find('.fr-dropdown .fr-trigger').removeClass('active');
    this.$bttn_wrapper.find('.fr-dropdown .fr-trigger');
  };

  /**
   * Hide inline editor.
   */
  $.Editable.prototype.hide = function (propagateable) {

    if (!this.initialized) {
      return false;
    }

    if (propagateable === undefined) {
      propagateable = true;
    }

    // Hide other editors.
    if (propagateable) {
      this.hideOtherEditors();
    }

    // Command to hide from another editor.
    else {
      this.closeImageMode();
      this.imageMode = false;
    }

    this.$popup_editor.hide();
    this.hidePopups(false);
    this.hideDropdowns();
    this.link = false;
  };

  /**
   * Hide other editors from page.
   */
  $.Editable.prototype.hideOtherEditors = function () {
    for (var i = 1; i <= $.Editable.count; i++) {
      if (i != this._id) {
        $(window).trigger('hide.' + i);
      }
    }
  }

  $.Editable.prototype.hideBttnWrapper = function () {
    if (this.options.inlineMode) {
      this.$bttn_wrapper.hide();
    }
  };

  $.Editable.prototype.showBttnWrapper = function () {
    if (this.options.inlineMode) {
      this.$bttn_wrapper.show();
    }
  };

  $.Editable.prototype.showEditPopupWrapper = function () {
    if (this.$edit_popup_wrapper) {
      this.$edit_popup_wrapper.show();

      setTimeout($.proxy(function () {
        this.$edit_popup_wrapper.find('input').val(this.$element.text()).focus().select()
      }, this), 1);
    }
  };

  $.Editable.prototype.hidePopups = function (hide_btn_wrapper) {
    if (hide_btn_wrapper === undefined) hide_btn_wrapper = true;

    if (hide_btn_wrapper) {
      this.hideBttnWrapper();
    }

    this.raiseEvent('hidePopups');
  }

  $.Editable.prototype.showEditPopup = function () {
    this.showEditPopupWrapper();
  };
})(jQuery);

(function ($) {
  /**
   * Get bounding rect around selection.
   *
   * @returns {Object}
   */
  $.Editable.prototype.getBoundingRect = function () {
    var boundingRect;

    if (!this.isLink) {
      if (this.getRange() && this.getRange().collapsed) {
        var $element = $(this.getSelectionElement());
        this.saveSelectionByMarkers();
        var $marker = this.$element.find('.f-marker:first');
        $marker.css('display', 'inline');
        var offset = $marker.offset();
        $marker.css('display', 'none');

        boundingRect = {}
        boundingRect.left = offset.left - $(window).scrollLeft();
        boundingRect.width = 0;
        boundingRect.height = (parseInt($element.css('line-height').replace('px', ''), 10) || 10) - 10 - $(window).scrollTop();
        boundingRect.top = offset.top;
        boundingRect.right = 1;
        boundingRect.bottom = 1;
        boundingRect.ok = true;

        this.removeMarkers();
      }
      else if (this.getRange()) {
        boundingRect = this.getRange().getBoundingClientRect();
      }
    } else {
      boundingRect = {}
      var $link = this.$element;

      boundingRect.left = $link.offset().left - $(window).scrollLeft();
      boundingRect.top = $link.offset().top - $(window).scrollTop();
      boundingRect.width = $link.outerWidth();
      boundingRect.height = parseInt($link.css('padding-top').replace('px', ''), 10) + $link.height();
      boundingRect.right = 1;
      boundingRect.bottom = 1;
      boundingRect.ok = true;
    }

    return boundingRect;
  };

  /**
   * Reposition editor using boundingRect.
   *
   * @param position - Force showing the editor.
   */
  $.Editable.prototype.repositionEditor = function (position) {
    var boundingRect;
    var x;
    var y;

    if (this.options.inlineMode || position) {
      boundingRect = this.getBoundingRect();
      this.showBttnWrapper();

      if (boundingRect.ok || (boundingRect.left >= 0 && boundingRect.top >= 0 && boundingRect.right > 0 && boundingRect.bottom > 0)) {
        x = boundingRect.left + (boundingRect.width) / 2;
        y = boundingRect.top + boundingRect.height;

        if (!(this.iOS() && this.iOSVersion() < 8)) {
          x = x + $(window).scrollLeft();
          y = y + $(window).scrollTop();
        }

        this.showByCoordinates(x, y);
      } else if (!this.options.alwaysVisible) {
        var el_offset = this.$element.offset();
        this.showByCoordinates(el_offset.left, el_offset.top + 10);
      } else {
        this.hide();
      }

      if (this.options.buttons.length === 0) {
        this.hide();
      }
    }
  };

  $.Editable.prototype.showByCoordinates = function (x, y) {
    x = x - 20;
    y = y + 15;

    var editor_width = Math.max(this.$popup_editor.width(), 250);

    if (x + editor_width >= $(window).width() - 50 && (x + 40) - editor_width > 0) {
      this.$popup_editor.addClass('right-side');
      x = $(window).width() - (x + 40);
      this.$popup_editor.css('top', y);
      this.$popup_editor.css('right', x);
      this.$popup_editor.css('left', 'auto');
    } else if (x + editor_width < $(window).width() - 50) {
      this.$popup_editor.removeClass('right-side');
      this.$popup_editor.css('top', y);
      this.$popup_editor.css('left', x);
      this.$popup_editor.css('right', 'auto');
    } else {
      this.$popup_editor.removeClass('right-side');
      this.$popup_editor.css('top', y);
      this.$popup_editor.css('left', Math.max(($(window).width() - editor_width), 10) / 2);
      this.$popup_editor.css('right', 'auto');
    }

    this.$popup_editor.show();
  };

  /**
   * Set position for popup editor.
   */
  $.Editable.prototype.positionPopup = function (command) {
    if ($(this.$editor.find('button.fr-bttn[data-cmd="' + command + '"]')).length) {
      var $btn = this.$editor.find('button.fr-bttn[data-cmd="' + command + '"]');
      var w = $btn.width();
      var h = $btn.height() - 15;
      var x = $btn.offset().left + w / 2;
      var y = $btn.offset().top + h;
      this.showByCoordinates(x, y)
    }
  };

})(jQuery);

(function ($) {
  $.Editable.image_commands = {
    floatImageLeft: {
      title: 'Float Left',
      icon: {
        type: 'font',
        value: 'fa fa-align-left'
      }
    },

    floatImageNone: {
      title: 'Float None',
      icon: {
        type: 'font',
        value: 'fa fa-align-justify'
      }
    },

    floatImageRight: {
      title: 'Float Right',
      icon: {
        type: 'font',
        value: 'fa fa-align-right'
      }
    },

    linkImage: {
      title: 'Insert Link',
      icon: {
        type: 'font',
        value: 'fa fa-link'
      }
    },

    replaceImage: {
      title: 'Replace Image',
      icon: {
        type: 'font',
        value: 'fa fa-exchange'
      }
    },

    removeImage: {
      title: 'Remove Image',
      icon: {
        type: 'font',
        value: 'fa fa-trash-o'
      }
    }
  };

  $.Editable.DEFAULTS = $.extend($.Editable.DEFAULTS, {
    allowedImageTypes: ['jpeg', 'jpg', 'png', 'gif'],
    defaultImageTitle: 'Image title',
    defaultImageWidth: 300,
    imageButtons: ['floatImageLeft', 'floatImageNone', 'floatImageRight', 'linkImage', 'replaceImage', 'removeImage'],
    imageDeleteConfirmation: true,
    imageDeleteURL: null,
    imageDeleteParams: {},
    imageMove: true,
    imageResize: true,
    imageLink: true,
    imageTitle: true,
    imageUpload: true,
    imageUploadParams: {},
    imageUploadParam: 'file',
    imageUploadToS3: false,
    imageUploadURL: 'http://i.froala.com/upload',
    maxImageSize: 1024 * 1024 * 10, // 10 Mb.,
    pasteImage: true,
    textNearImage: true
  })

  $.Editable.prototype.hideImageEditorPopup = function () {
    if (this.$image_editor) {
      this.$image_editor.hide();
    }
  };

  $.Editable.prototype.showImageEditorPopup = function () {
    if (this.$image_editor) {
      this.$image_editor.show();
    }

    if (!this.options.imageMove) {
      this.$element.attr('contenteditable', false);
    }
  };

  $.Editable.prototype.showImageWrapper = function () {
    if (this.$image_wrapper) {
      this.$image_wrapper.show();
    }
  };

  $.Editable.prototype.hideImageWrapper = function (image_mode) {
    if (this.$image_wrapper) {
      if (!this.$element.attr('data-resize') && !image_mode) {
        this.closeImageMode();
        this.imageMode = false;
      }

      this.$image_wrapper.hide();
      this.$image_wrapper.find('input').blur()
    }
  };

  $.Editable.prototype.showInsertImage = function () {
    this.hidePopups();

    this.showImageWrapper();
  };

  $.Editable.prototype.showImageEditor = function () {
    this.hidePopups();

    this.showImageEditorPopup();
  };

  $.Editable.prototype.insertImageHTML = function () {
    var html = '<div class="froala-popup froala-image-popup" style="display: none;"><h4><span data-text="true">Insert Image</span><span data-text="true">Uploading image</span><i title="Cancel" class="fa fa-times" id="f-image-close-' + this._id + '"></i></h4>';

    html += '<div id="f-image-list-' + this._id + '">';

    if (this.options.imageUpload) {
      html += '<div class="f-popup-line drop-upload">';
      html += '<div class="f-upload" id="f-upload-div-' + this._id + '"><strong data-text="true">Drop Image</strong><br>(<span data-text="true">or click</span>)<form target="frame-' + this._id + '" enctype="multipart/form-data" encoding="multipart/form-data" action="' + this.options.imageUploadURL + '" method="post" id="f-upload-form-' + this._id + '"><input id="f-file-upload-' + this._id + '" type="file" name="' + this.options.imageUploadParam + '" accept="image/*"></form></div>';

      if (this.browser.msie && $.Editable.getIEversion() <= 9) {
        html += '<iframe id="frame-' + this._id + '" name="frame-' + this._id + '" src="javascript:false;" style="width:0; height:0; border:0px solid #FFF; position: fixed; z-index: -1;"></iframe>';
      }

      html += '</div>';
    }

    if (this.options.imageLink) {
      html += '<div class="f-popup-line"><label><span data-text="true">Enter URL</span>: </label><input id="f-image-url-' + this._id + '" type="text" placeholder="http://example.com"><button class="f-browse fr-p-bttn" id="f-browser-' + this._id + '"><i class="fa fa-search"></i></button><button data-text="true" class="f-ok fr-p-bttn" id="f-image-ok-' + this._id + '">OK</button></div>';
    }

    html += '</div>';
    html += '<p class="f-progress" id="f-progress-' + this._id + '"><span></span></p>';
    html += '</div>';

    return html;
  }

  $.Editable.prototype.iFrameLoad = function () {
    var $iframe = this.$image_wrapper.find('iframe#frame-' + this._id);
    if (!$iframe.attr('data-loaded')) {
      $iframe.attr('data-loaded', true);
      return false;
    }

    try {
      var $form = this.$image_wrapper.find('#f-upload-form-' + this._id);

      // S3 upload.
      if (this.options.imageUploadToS3) {
        var domain = $form.attr('action')
        var key = $form.find('input[name="key"]').val()
        var url = domain + key;

        this.writeImage(url);
        if (this.options.imageUploadToS3.callback) {
          this.options.imageUploadToS3.callback.call(this, url, key);
        }
      }

      // Normal upload.
      else {
        var response = $iframe.contents().text();
        this.parseImageResponse(response);
      }
    }
    catch (ex) {
      // Same domain.
      this.throwImageError(7);
    }
  }

  $.Editable.prototype.initImage = function () {
    this.buildInsertImage();

    if (!this.isLink || this.isImage) {
      this.initImagePopup();
    }

    this.addListener('destroy', this.destroyImage);
  }

  $.Editable.initializers.push($.Editable.prototype.initImage);

  $.Editable.prototype.destroyImage = function () {
    if (this.$image_editor) this.$image_editor.html('').removeData().remove();
    if (this.$image_wrapper) this.$image_wrapper.html('').removeData().remove();
  }

  /**
   * Build insert image.
   */
  $.Editable.prototype.buildInsertImage = function () {
    // Add image wrapper to editor.
    this.$image_wrapper = $(this.insertImageHTML());
    this.$popup_editor.append(this.$image_wrapper);

    var that = this;

    // Stop event propagation in image.
    this.$image_wrapper.on('mouseup touchend', $.proxy(function (e) {
      if (!this.isResizing()) {
        e.stopPropagation();
      }
    }, this));

    this.addListener('hidePopups', $.proxy(function () {
      this.hideImageWrapper(true);
    }), this);

    // Init progress bar.
    this.$progress_bar = this.$image_wrapper.find('p#f-progress-' + this._id);

    // Build drag and drop upload.
    if (this.options.imageUpload) {
      // Build upload frame.
      if (this.browser.msie && $.Editable.getIEversion() <= 9) {
        var iFrame = this.$image_wrapper.find('iframe').get(0);

        if (iFrame.attachEvent) {
          iFrame.attachEvent('onload', function () { that.iFrameLoad() });
        } else {
          iFrame.onload  = function () { that.iFrameLoad() };
        }
      }

      // File was picked.
      this.$image_wrapper.on('change', 'input[type="file"]', function () {
        // Files were picked.
        if (this.files !== undefined) {
          that.uploadImage(this.files);
        }

        // IE 9 upload.
        else {
          var $form = $(this).parents('form');
          $form.find('input[type="hidden"]').remove();
          var key;
          for (key in that.options.imageUploadParams) {
            $form.prepend('<input type="hidden" name="' + key + '" value="' + that.options.imageUploadParams[key] + '" />');
          }

          if (that.options.imageUploadToS3 !== false) {
            for (key in that.options.imageUploadToS3.params) {
              $form.prepend('<input type="hidden" name="' + key + '" value="' + that.options.imageUploadToS3.params[key] + '" />');
            }

            $form.prepend('<input type="hidden" name="' + 'success_action_status' + '" value="' + 201 + '" />');
            $form.prepend('<input type="hidden" name="' + 'X-Requested-With' + '" value="' + 'xhr' + '" />');
            $form.prepend('<input type="hidden" name="' + 'Content-Type' + '" value="' + '' + '" />');
            $form.prepend('<input type="hidden" name="' + 'key' + '" value="' + that.options.imageUploadToS3.keyStart + (new Date()).getTime() + '-' + $(this).val().match(/[^\/\\]+$/) + '" />');
          } else {
            $form.prepend('<input type="hidden" name="XHR_CORS_TRARGETORIGIN" value="' + window.location.href + '" />');
          }

          that.showInsertImage();
          that.showImageLoader(true);
          that.disable();

          $form.submit();
        }

        // Chrome fix.
        $(this).val('');
      });
    }

    // Add drag and drop support.
    this.buildDragUpload();

    // URL input for insert image.
    this.$image_wrapper.on('mouseup keydown', '#f-image-url-' + this._id, $.proxy(function (e) {
      var keyCode = e.which;
      if (!keyCode || keyCode !== 27) {
        e.stopPropagation();
      }
    }, this));

    // Create a list with all the items from the popup.
    this.$image_wrapper.on('click', '#f-image-ok-' + this._id, $.proxy(function () {
      this.writeImage(this.$image_wrapper.find('#f-image-url-' + this._id).val(), true);
    }, this));

    // Wrap things in image wrapper.
    this.$image_wrapper.on(this.mouseup, '#f-image-close-' + this._id, $.proxy(function (e) {
      if (this.isDisabled) return false;

      e.stopPropagation();

      this.$bttn_wrapper.show();
      this.hideImageWrapper(true);

      if (this.options.inlineMode && this.options.buttons.length === 0) {
        if (this.imageMode) {
          this.showImageEditor();
        } else {
          this.hide();
        }
      }

      if (!this.imageMode) {
        this.restoreSelection();
        this.focus();
      }

      if (!this.options.inlineMode && !this.imageMode) {
        this.hide();
      } else if (this.imageMode) {
        this.showImageEditor();
      }
    }, this))

    this.$image_wrapper.on('click', function (e) {
      e.stopPropagation();
    });

    this.$image_wrapper.on('click', '*', function (e) {
      e.stopPropagation();
    });
  };


  // Delete an image.
  $.Editable.prototype.deleteImage = function ($img) {
    if (this.options.imageDeleteURL) {
      var deleteParams = this.options.imageDeleteParams;
      deleteParams.info = $img.data('info');
      deleteParams.src = $img.attr('src');
      $.ajax({
        type: 'POST',
        url: this.options.imageDeleteURL,
        data: deleteParams,
        crossDomain: this.options.crossDomain,
        xhrFields: {
          withCredentials: this.options.withCredentials
        },
        headers: this.options.headers
      })
      .done($.proxy(function (data) {
        // In media manager.
        if ($img.parent().parent().hasClass('f-image-list')) {
          $img.parent().remove();
        }

        // Normal delete.
        else {
          $img.parent().removeClass('f-img-deleting');
        }

        this.triggerEvent('imageDeleteSuccess', [data], false);
      }, this))
      .fail($.proxy(function () {
        $img.parent().removeClass('f-img-deleting');
        this.triggerEvent('imageDeleteError', ['Error during image delete.'], false);
      }, this));
    }
    else {
      $img.parent().removeClass('f-img-deleting');
      this.triggerEvent('imageDeleteError', ['Missing imageDeleteURL option.'], false);
    }
  };

  /**
   * Initialize actions for image handles.
   */
  $.Editable.prototype.imageHandle = function () {
    var that = this;

    var $handle = $('<span data-fr-verified="true">').addClass('f-img-handle').on({
      // Start to drag.
      movestart: function (e) {
        that.hide();
        that.$element.addClass('f-non-selectable').attr('contenteditable', false);
        that.$element.attr('data-resize', true);

        $(this).attr('data-start-x', e.startX);
        $(this).attr('data-start-y', e.startY);
      },

      // Still moving.
      move: function (e) {
        var $elem = $(this);
        var diffX = e.pageX - parseInt($elem.attr('data-start-x'), 10);

        $elem.attr('data-start-x', e.pageX);
        $elem.attr('data-start-y', e.pageY);

        var $img = $elem.prevAll('img');
        var width = $img.width();
        if ($elem.hasClass('f-h-ne') || $elem.hasClass('f-h-se')) {
          $img.attr('width', width + diffX);
        } else {
          $img.attr('width', width - diffX);
        }

        that.triggerEvent('imageResize', [], false);
      },

      // Drag end.
      moveend: function () {
        $(this).removeAttr('data-start-x');
        $(this).removeAttr('data-start-y');

        that.$element.removeClass('f-non-selectable');
        if (!that.isImage) {
          that.$element.attr('contenteditable', true);
        }

        that.triggerEvent('imageResizeEnd');

        $(this).trigger('mouseup');
      },

      // Issue #221.
      touchend: function () {
        $(this).trigger('moveend');
      }
    });

    return $handle;
  };

  /**
   * Disable image resizing from browser.
   */
  $.Editable.prototype.disableImageResize = function () {
    // Disable resize for FF.
    if (this.browser.mozilla) {
      try {
        document.execCommand('enableObjectResizing', false, false);
        document.execCommand('enableInlineTableEditing', false, false);
      } catch (ex) {}
    }
  };

  $.Editable.prototype.isResizing = function () {
    return this.$element.attr('data-resize');
  };

  $.Editable.prototype.getImageClass = function (cls) {
    var classes = cls.split(' ');

    if (classes.indexOf('fr-fir') >= 0) {
      return 'fr-fir';
    }

    if (classes.indexOf('fr-fil') >= 0) {
      return 'fr-fil';
    }

    return 'fr-fin';
  };

  $.Editable.prototype.addImageClass = function ($obj, cls) {
    $obj.removeClass('fr-fin fr-fir fr-fil').addClass(cls);
  };

  /**
   * Image controls.
   */
  $.Editable.prototype.initImageEvents = function () {

    // Image drop.
    if (document.addEventListener && !document.dropAssigned) {
      document.dropAssigned = true;
      document.addEventListener('drop', $.proxy(function (e) {
        e.preventDefault();
        e.stopPropagation();
        $('.froala-element img.fr-image-move').removeClass('fr-image-move');
        return false;
      }, this));
    }

    this.disableImageResize();

    var that = this;

    // Image mouse down.
    this.$element.on('mousedown', 'img:not([contenteditable="false"])', function (e) {
      if (that.isDisabled) return false;

      if (!that.isResizing()) {
        // Stop propagation.
        if (that.initialized) e.stopPropagation();

        // Remove content editable if move is not allowed or MSIE.
        that.$element.attr('contenteditable', false);
        $(this).addClass('fr-image-move');
      }
    });

    // Image mouse up.
    this.$element.on('mouseup', 'img:not([contenteditable="false"])', function () {
      if (that.isDisabled) return false;

      if (!that.isResizing()) {
        // Add contenteditable back after move.
        if (!that.options.imageMove && !that.isImage && !that.isHTML) {
          that.$element.attr('contenteditable', true);
        }

        $(this).removeClass('fr-image-move');
      }
    });

    // Image click.
    this.$element.on('click touchend', 'img:not([contenteditable="false"])', function (e) {
      if (that.isDisabled) return false;

      if (!that.isResizing() && that.initialized) {
        e.preventDefault();
        e.stopPropagation();

        // Close other images.
        that.closeImageMode();

        // iPad Fix.
        that.$element.blur();

        // Unmark active buttons in the popup.
        that.$image_editor.find('button').removeClass('active');

        // Mark active float.
        var image_float = $(this).css('float');

        if ($(this).hasClass('fr-fil')) {
          image_float = 'left';
        } else if ($(this).hasClass('fr-fir')) {
          image_float = 'right';
        }

        that.$image_editor.find('button[data-cmd="floatImage' + image_float.charAt(0).toUpperCase() + image_float.slice(1) + '"]').addClass('active');

        // Set alt for image.
        that.$image_editor.find('.f-image-alt input[type="text"]').val($(this).attr('alt') || $(this).attr('title'));

        // Hide basic editor.
        that.showImageEditor();

        // Wrap image with image editor.
        if (!($(this).parent().hasClass('f-img-editor') && $(this).parent().get(0).tagName == 'SPAN')) {
          var image_class = that.getImageClass($(this).attr('class'));

          $(this).wrap('<span data-fr-verified="true" class="f-img-editor ' + image_class + '"></span>');

          if ($(this).parents('.f-img-wrap').length === 0 && !that.isImage) {
            if ($(this).parents('a').length > 0) {
              $(this).parents('a:first').wrap('<span data-fr-verified="true" class="f-img-wrap ' + image_class + '"></span>');
            } else {
              $(this).parent().wrap('<span data-fr-verified="true" class="f-img-wrap ' + image_class + '"></span>');
            }
          } else {
            that.addImageClass($(this).parents('.f-img-wrap'), image_class);
          }
        }

        // Get image handle.
        var $handle = that.imageHandle();

        // Remove old handles.
        $(this).parent().find('.f-img-handle').remove();

        // Add Handles.
        if (that.options.imageResize) {
          $(this).parent().append($handle.clone(true).addClass('f-h-ne'));
          $(this).parent().append($handle.clone(true).addClass('f-h-se'));
          $(this).parent().append($handle.clone(true).addClass('f-h-sw'));
          $(this).parent().append($handle.clone(true).addClass('f-h-nw'));
        }

        // Reposition editor.
        that.showByCoordinates($(this).offset().left + $(this).width() / 2, $(this).offset().top + $(this).height());

        // Image mode power.
        that.imageMode = true;

        that.$bttn_wrapper.find('.fr-bttn').removeClass('active');

        // No selection needed. We have image.
        that.clearSelection();
      }
    });

    // Add resizing data.
    this.$element.on('mousedown touchstart', '.f-img-handle', $.proxy(function () {
      if (that.isDisabled) return false;

      this.$element.attr('data-resize', true);
    }, this));


    // Remove resizing data.
    this.$element.on('mouseup', '.f-img-handle', $.proxy(function (e) {
      if (that.isDisabled) return false;

      var $img = $(e.target).prevAll('img');
      setTimeout($.proxy(function () {
        this.$element.removeAttr('data-resize');
        $img.click();
      }, this), 0);
    }, this));
  };

  /**
   * Init popup for image.
   */
  $.Editable.prototype.initImagePopup = function () {
    this.$image_editor = $('<div class="froala-popup froala-image-editor-popup" style="display: none">');

    var $buttons = $('<div class="f-popup-line f-popup-toolbar">').appendTo(this.$image_editor);
    for (var i = 0; i < this.options.imageButtons.length; i++) {
      var cmd = this.options.imageButtons[i];
      if ($.Editable.image_commands[cmd] === undefined) {
        continue;
      }
      var button = $.Editable.image_commands[cmd];

      var btn = '<button class="fr-bttn" data-callback="' + cmd + '" data-cmd="' + cmd + '" title="' + button.title + '">';

      if (this.options.icons[cmd] !== undefined) {
        btn += this.prepareIcon(this.options.icons[cmd], button.title);
      } else {
        btn += this.prepareIcon(button.icon, button.title);
      }

      btn += '</button>';

      $buttons.append(btn);
    }

    this.addListener('hidePopups', this.hideImageEditorPopup);

    if (this.options.imageTitle) {
      $('<div class="f-popup-line f-image-alt">')
        .append('<label><span data-text="true">Title</span>: </label>')
        .append($('<input type="text">').on('mouseup keydown', function (e) {
          var keyCode = e.which;
          if (!keyCode || keyCode !== 27) {
            e.stopPropagation();
          }
        }))
        .append('<button class="fr-p-bttn f-ok" data-text="true" data-callback="setImageAlt" data-cmd="setImageAlt" title="OK">OK</button>')
        .appendTo(this.$image_editor);
    }

    this.$popup_editor.append(this.$image_editor);

    this.bindCommandEvents(this.$image_editor);
  };

  /**
   * Float image to the left.
   */
  $.Editable.prototype.floatImageLeft = function () {
    var $image_editor = this.$element.find('span.f-img-editor');
    this.addImageClass($image_editor, 'fr-fil');

    if (this.isImage) {
      this.$element.css('float', 'left')
    }


    this.triggerEvent('imageFloatedLeft');

    $image_editor.find('img').click();
  };

  /**
   * Align image center.
   */
  $.Editable.prototype.floatImageNone = function () {
    var $image_editor = this.$element.find('span.f-img-editor');
    this.addImageClass($image_editor, 'fr-fin');

    if (!this.isImage) {
      if ($image_editor.parent().get(0) == this.$element.get(0)) {
        $image_editor.wrap('<div style="text-align: center;"></div>');
      } else {
        $image_editor.parents('.f-img-wrap:first').css('text-align', 'center');
      }
    }

    if (this.isImage) {
      this.$element.css('float', 'none')
    }


    this.triggerEvent('imageFloatedNone');

    $image_editor.find('img').click();
  };

  /**
   * Float image to the right.
   */
  $.Editable.prototype.floatImageRight = function () {
    var $image_editor = this.$element.find('span.f-img-editor');
    this.addImageClass($image_editor, 'fr-fir');

    if (this.isImage) {
      this.$element.css('float', 'right')
    }


    this.triggerEvent('imageFloatedRight');

    $image_editor.find('img').click();
  };

  /**
   * Link image.
   */
  $.Editable.prototype.linkImage = function () {
    var $image_editor = this.$element.find('span.f-img-editor');
    this.showInsertLink();

    this.imageMode = true;

    if ($image_editor.parent().get(0).tagName == 'A') {
      this.$link_wrapper.find('input[type="text"]').val($image_editor.parent().attr('href'));
      this.$link_wrapper.find('.f-external-link').attr('href', $image_editor.parent().attr('href'));

      if ($image_editor.parent().attr('target') == '_blank') {
        this.$link_wrapper.find('input[type="checkbox"]').prop('checked', true);
      } else {
        this.$link_wrapper.find('input[type="checkbox"]').prop('checked', false);
      }
      this.$link_wrapper.find('a.f-external-link, button.f-unlink').show();
    } else {
      this.$link_wrapper.find('input[type="text"]').val('http://');
      this.$link_wrapper.find('.f-external-link').attr('href', '#');
      this.$link_wrapper.find('input[type="checkbox"]').prop('checked', this.options.alwaysBlank);
      this.$link_wrapper.find('a.f-external-link, button.f-unlink').hide();
    }
  };

  /**
   * Replace image with another one.
   */
  $.Editable.prototype.replaceImage = function () {
    var $image_editor = this.$element.find('span.f-img-editor');
    this.showInsertImage();
    this.imageMode = true;

    this.$image_wrapper.find('input[type="text"]').val($image_editor.find('img').attr('src'));

    var $img = $image_editor.find('img');
    this.showByCoordinates($img.offset().left + $img.width() / 2, $img.offset().top + $img.height());
  };

  /**
   * Remove image.
   */
  $.Editable.prototype.removeImage = function () {
    var $image_editor = this.$element.find('span.f-img-editor');
    if ($image_editor.length === 0) return false;

    var img = $image_editor.find('img').get(0);

    var message = 'Are you sure? Image will be deleted.';
    if ($.Editable.LANGS[this.options.language]) {
      message = $.Editable.LANGS[this.options.language].translation[message];
    }

    // Ask to remove.
    if (!this.options.imageDeleteConfirmation || confirm(message)) {
      // (src)
      if (this.triggerEvent('beforeRemoveImage', [$(img)], false)) {
        var img_parent = $image_editor.parents(this.valid_nodes.join(','));

        if ($image_editor.parents('.f-img-wrap').length) {
          $image_editor.parents('.f-img-wrap').remove();
        } else {
          $image_editor.remove();
        }
        this.refreshImageList(true);
        this.hide();

        if (img_parent.length && img_parent[0] != this.$element.get(0)) {
          if ($(img_parent[0]).text() === '') {
            $(img_parent[0]).remove()
          }
        }


        this.wrapText();

        this.triggerEvent('afterRemoveImage', [$(img)]);
        this.focus();

        this.imageMode = false;
      }
    }
    else {
      $image_editor.find('img').click();
    }
  };

  /**
   * Set image alt.
   */
  $.Editable.prototype.setImageAlt = function () {
    var $image_editor = this.$element.find('span.f-img-editor');
    $image_editor.find('img').attr('alt', this.$image_editor.find('.f-image-alt input[type="text"]').val());
    $image_editor.find('img').attr('title', this.$image_editor.find('.f-image-alt input[type="text"]').val());


    this.hide();
    this.closeImageMode();
    this.triggerEvent('imageAltSet');
  };

  $.Editable.prototype.buildImageMove = function () {
    var that = this;

    if (!this.isLink) {
      this.initDrag();
    }

    that.$element.on('dragover dragenter dragend', function () {
      return false;
    });

    that.$element.on('drop', function (e) {
      that.closeImageMode();
      that.hide();
      that.imageMode = false;

      // Init editor if not initialized.
      if (!that.initialized) {
        that.$element.unbind('mousedown.element');
        that.lateInit();
      }

      if (that.options.imageUpload && $('.froala-element img.fr-image-move').length === 0) {
        if (e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files && e.originalEvent.dataTransfer.files.length) {
          if (that.isDisabled) return false;

          that.insertMarkersAtPoint(e.originalEvent);
          that.showByCoordinates(e.originalEvent.pageX, e.originalEvent.pageY);
          that.uploadImage(e.originalEvent.dataTransfer.files);
          e.preventDefault();
          e.stopPropagation();
        }
      } else {
        // MSIE drag and drop workaround.
        if ($('.froala-element .fr-image-move').length > 0 && that.options.imageMove) {
          e.preventDefault();
          e.stopPropagation();
          that.insertMarkersAtPoint(e.originalEvent);
          that.restoreSelectionByMarkers();
          var html = $('<div>')
              .append(
                $('.froala-element img.fr-image-move')
                  .clone()
                  .removeClass('fr-image-move')
                  .addClass('fr-image-dropped')
              ).html();

          that.insertHTML(html);

          $('.froala-element img.fr-image-move').remove();

          that.clearSelection();

          if (that.initialized) {
            setTimeout(function () {
              that.$element
                .find('.fr-image-dropped')
                .removeClass('.fr-image-dropped')
                .click();
            }, 0);
          } else {
            that.$element
              .find('.fr-image-dropped')
              .removeClass('.fr-image-dropped')
          }

          that.sync();
          that.hideOtherEditors();
        } else {
          e.preventDefault();
          e.stopPropagation();
          $('.froala-element img.fr-image-move').removeClass('fr-image-move');
        }

        return false;
      }
    })
  }

  /**
   * Add drag and drop upload.
   *
   * @param $holder - jQuery object.
   */
  $.Editable.prototype.buildDragUpload = function () {
    var that = this;

    that.$image_wrapper.on('dragover', '#f-upload-div-' + this._id, function () {
      $(this).addClass('f-hover');
      return false;
    });

    that.$image_wrapper.on('dragend', '#f-upload-div-' + this._id, function () {
      $(this).removeClass('f-hover');
      return false;
    });

    that.$image_wrapper.on('drop', '#f-upload-div-' + this._id, function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (!that.options.imageUpload) return false;

      $(this).removeClass('f-hover');

      that.uploadImage(e.originalEvent.dataTransfer.files);
    });
  };

  $.Editable.prototype.showImageLoader = function (waiting) {
    if (waiting === undefined) waiting = false;

    if (!waiting) {
      this.$image_wrapper.find('h4').addClass('uploading');
    }
    else {
      var message = 'Please wait!';
      if ($.Editable.LANGS[this.options.language]) {
        message = $.Editable.LANGS[this.options.language].translation[message];
      }

      this.$progress_bar.find('span').css('width', '100%').text(message);
    }

    this.$image_wrapper.find('#f-image-list-' + this._id).hide();
    this.$progress_bar.show();
    this.showInsertImage();
  }

  $.Editable.prototype.hideImageLoader = function () {
    this.$progress_bar.hide();
    this.$progress_bar.find('span').css('width', '0%').text('');
    this.$image_wrapper.find('#f-image-list-' + this._id).show();
    this.$image_wrapper.find('h4').removeClass('uploading');
  };

  /**
   * Insert image command.
   *
   * @param image_link
   */
  $.Editable.prototype.writeImage = function (image_link, sanitize) {
    if (sanitize) {
      image_link = this.sanitizeURL(image_link);
      if (image_link === '') {
        return false;
      }
    }

    var img = new Image();
    img.onerror = $.proxy(function () {
      this.hideImageLoader();
      this.throwImageError(1);
    }, this);

    if (this.imageMode) {
      img.onload = $.proxy(function () {
        var $img = this.$element.find('.f-img-editor > img');
        $img.attr('src', image_link);

        this.hide();
        this.hideImageLoader();
        this.$image_editor.show();



        this.enable();

        // call with (image HTML)
        this.triggerEvent('imageReplaced', [$img]);

        setTimeout(function () {
          $img.trigger('click');
        }, 0);
      }, this);
    }

    else {
      img.onload = $.proxy(function () {
        this.insertLoadedImage(image_link);
      }, this);
    }

    this.showImageLoader(true);

    img.src = image_link;
  };

  $.Editable.prototype.processInsertImage = function (image_link, image_preview) {
    if (image_preview === undefined) image_preview = true;

    this.enable();

    // Restore saved selection.
    this.restoreSelection();
    this.focus();

    var image_width = '';
    if (parseInt(this.options.defaultImageWidth, 10) || 0 > 0) {
      image_width = ' width="' + this.options.defaultImageWidth + '"';
    }

    // Build image string.
    var img_s = '<img class="fr-fin fr-just-inserted" alt="' + this.options.defaultImageTitle + '" src="' + image_link + '"' + image_width + '>';

    // Search for start container.
    var selected_element = this.getSelectionElements()[0];
    var range = this.getRange();
    var $span = (!this.browser.msie && $.Editable.getIEversion() > 8 ? $(range.startContainer) : null);

    // Insert was called with image selected.
    if ($span && $span.hasClass('f-img-wrap')) {
      // Insert image after.
      if (range.startOffset === 1) {
        $span.after('<p><span class="f-marker" data-type="true" data-id="0"></span><br/><span class="f-marker" data-type="false" data-id="0"></span></p>');
        this.restoreSelectionByMarkers();
        this.getSelection().collapseToStart();
      }

      // Insert image before.
      else if (range.startOffset === 0) {
        $span.before('<p><span class="f-marker" data-type="true" data-id="0"></span><br/><span class="f-marker" data-type="false" data-id="0"></span></p>');
        this.restoreSelectionByMarkers();
        this.getSelection().collapseToStart();
      }

      // Add image.
      this.insertHTML(img_s);
    }

    // Insert in table.
    else if (this.getSelectionTextInfo(selected_element).atStart && selected_element != this.$element.get(0) && selected_element.tagName != 'TD' && selected_element.tagName != 'TH' && selected_element.tagName != 'LI') {
      $(selected_element).before('<p>' + img_s + '</p>');
    }

    // Normal insert.
    else {
      this.insertHTML(img_s);
    }

    this.disable();
  }

  $.Editable.prototype.insertLoadedImage = function (image_link) {
    // Image was loaded fine.
    this.triggerEvent('imageLoaded', [image_link], false);

    this.processInsertImage(image_link, false);

    // IE fix.
    if (this.browser.msie) {
      this.$element.find('img').each(function (index, elem) {
        elem.oncontrolselect = function () {
          return false;
        };
      });
    }

    this.enable();

    // Hide image controls.
    this.hide();
    this.hideImageLoader();

    // Have to wrap image.
    this.wrapText();

    // (jquery image)
    this.triggerEvent('imageInserted', [this.$element.find('img.fr-just-inserted')]);

    // Select image.
    setTimeout($.proxy(function () {
      this.$element.find('img.fr-just-inserted').removeClass('fr-just-inserted').trigger('touchend');
    }, this), 50);
  };

  $.Editable.prototype.throwImageErrorWithMessage = function (message) {
    this.enable();

    this.triggerEvent('imageError', [{
      message: message,
      code: 0
    }], false);

    this.hideImageLoader();
  }

  $.Editable.prototype.throwImageError = function (code) {
    this.enable();

    var status = 'Unknown image upload error.';
    if (code == 1) {
      status = 'Bad link.';
    } else if (code == 2) {
      status = 'No link in upload response.';
    } else if (code == 3) {
      status = 'Error during file upload.';
    } else if (code == 4) {
      status = 'Parsing response failed.';
    } else if (code == 5) {
      status = 'Image too large.';
    } else if (code == 6) {
      status = 'Invalid image type.';
    } else if (code == 7) {
      status = 'Image can be uploaded only to same domain in IE 8 and IE 9.'
    }

    this.triggerEvent('imageError', [{
      code: code,
      message: status
    }], false);

    this.hideImageLoader();
  };

  /**
   * Upload files to server.
   *
   * @param files
   */
  $.Editable.prototype.uploadImage = function (files) {
    if (!this.triggerEvent('beforeImageUpload', [files], false)) {
      return false;
    }

    if (files !== undefined && files.length > 0) {
      var formData;

      if (this.drag_support.formdata) {
        formData = this.drag_support.formdata ? new FormData() : null;
      }

      if (formData) {
        var key;
        for (key in this.options.imageUploadParams) {
          formData.append(key, this.options.imageUploadParams[key]);
        }

        // Upload to S3.
        if (this.options.imageUploadToS3 !== false) {
          for (key in this.options.imageUploadToS3.params) {
            formData.append(key, this.options.imageUploadToS3.params[key]);
          }

          formData.append('success_action_status', '201');
          formData.append('X-Requested-With', 'xhr');
          formData.append('Content-Type', files[0].type);
          formData.append('key', this.options.imageUploadToS3.keyStart + (new Date()).getTime() + '-' + files[0].name);
        }

        formData.append(this.options.imageUploadParam, files[0]);

        // Check image max size.
        if (files[0].size > this.options.maxImageSize) {
          this.throwImageError(5);
          return false;
        }

        // Check image types.
        if (this.options.allowedImageTypes.indexOf(files[0].type.replace(/image\//g,'')) < 0) {
          this.throwImageError(6);
          return false;
        }
      }

      if (formData) {
        var xhr;
        if (this.options.crossDomain) {
          xhr = this.createCORSRequest('POST', this.options.imageUploadURL);
        } else {
          xhr = new XMLHttpRequest();
          xhr.open('POST', this.options.imageUploadURL);

          for (var h_key in this.options.headers) {
            xhr.setRequestHeader(h_key, this.options.headers[h_key]);
          }
        }

        xhr.onload = $.proxy(function () {
          var message = 'Please wait!';
          if ($.Editable.LANGS[this.options.language]) {
            message = $.Editable.LANGS[this.options.language].translation[message];
          }

          this.$progress_bar.find('span').css('width', '100%').text(message);
          try {
            if (this.options.imageUploadToS3) {
              if (xhr.status == 201) {
                this.parseImageResponseXML(xhr.responseXML);
              } else {
                this.throwImageError(3);
              }
            }
            else {
              if (xhr.status >= 200 && xhr.status < 300) {
                this.parseImageResponse(xhr.responseText);
              } else {
                this.throwImageError(3);
              }
            }
          } catch (ex) {
            // Bad response.
            this.throwImageError(4);
          }
        }, this);

        xhr.onerror = $.proxy(function () {
          // Error on uploading file.
          this.throwImageError(3);

        }, this);

        xhr.upload.onprogress = $.proxy(function (event) {
          if (event.lengthComputable) {
            var complete = (event.loaded / event.total * 100 | 0);
            this.$progress_bar.find('span').css('width', complete + '%');
          }
        }, this);

        // Keep the editor only for uploading.
        this.disable();

        xhr.send(formData);

        // Prepare progress bar for uploading.
        this.showImageLoader();
      }
    }
  };

  $.Editable.prototype.parseImageResponse = function (response) {
    try {
      var resp = $.parseJSON(response);
      if (resp.link) {
        this.writeImage(resp.link);
      } else if (resp.error) {
        this.throwImageErrorWithMessage(resp.error);
      } else {
        // No link in upload request.
        this.throwImageError(2);
      }
    } catch (ex) {
      // Bad response.
      this.throwImageError(4);
    }
  };

  $.Editable.prototype.parseImageResponseXML = function (xml_doc) {
    try {
      var link = $(xml_doc).find('Location').text();
      var key = $(xml_doc).find('Key').text();

      // Callback.
      this.options.imageUploadToS3.callback.call(this, link, key);

      if (link) {
        this.writeImage(link);
      } else {
        // No link in upload request.
        this.throwImageError(2);
      }
    } catch (ex) {
      // Bad response.
      this.throwImageError(4);
    }
  }


  $.Editable.prototype.setImageUploadURL = function (url) {
    if (url) {
      this.options.imageUploadURL = url;
    }

    if (this.options.imageUploadToS3) {
      this.options.imageUploadURL = 'https://' + this.options.imageUploadToS3.bucket + '.' + this.options.imageUploadToS3.region + '.amazonaws.com/';
    }
  }

  $.Editable.prototype.closeImageMode = function () {
    this.$element.find('span.f-img-editor > img').each($.proxy(function (index, elem) {
      this.addImageClass($(elem), this.getImageClass($(elem).parent().attr('class')));

      if ($(elem).parents('.f-img-wrap').length > 0) {
        if ($(elem).parent().parent().get(0).tagName == 'A') {
          $(elem).siblings('span.f-img-handle').remove().end().unwrap().parent().unwrap();
        } else {
          $(elem).siblings('span.f-img-handle').remove().end().unwrap().unwrap();
        }
      } else {
        $(elem).siblings('span.f-img-handle').remove().end().unwrap();
      }
    }, this));

    if (this.$element.find('span.f-img-editor').length) {
      this.$element.find('span.f-img-editor').remove();
      this.$element.parents('span.f-img-editor').remove();
    }

    this.$element.removeClass('f-non-selectable');
    if (!this.editableDisabled && !this.isHTML) {
      this.$element.attr('contenteditable', true);
    }

    if (this.$image_editor) {
      this.$image_editor.hide();
    }

    if (this.$link_wrapper && this.options.linkText) {
      this.$link_wrapper.find('input[type="text"].f-lt').parent().removeClass('fr-hidden');
    }
  };

  $.Editable.prototype.refreshImageList = function (no_check) {
    if (!this.isLink && !this.options.editInPopup) {
      var newListSrc = [];
      var newList = [];
      var that = this;
      this.$element.find('img').each (function (index, img) {
        var $img = $(img);
        newListSrc.push($img.attr('src'));
        newList.push($img);

        // Add the right class.
        if ($img.parents('.f-img-editor').length === 0 && !$img.hasClass('fr-fil') && !$img.hasClass('fr-fir') && !$img.hasClass('fr-fin')) {
          // Set floating margin.
          var $parent;
          if ($img.css('float') == 'right') {
            $parent = $img.parent();
            if ($parent.hasClass('f-img-editor')) {
              $parent.addClass('fr-fir');
            } else {
              $img.addClass('fr-fir');
            }
          } else if ($img.css('float') == 'left') {
            $parent = $img.parent();
            if ($parent.hasClass('f-img-editor')) {
              $parent.addClass('fr-fil');
            } else {
              $img.addClass('fr-fil');
            }
          } else {
            $parent = $img.parent();
            if ($parent.hasClass('f-img-editor')) {
              $parent.addClass('fr-fin');
            } else {
              $img.addClass('fr-fin');
            }
          }
        }

        if (!that.options.textNearImage) {
          $img.addClass('fr-tni');
        } else {
          $img.removeClass('fr-tni');
        }

        $img.css('margin', '');
        $img.css('float', '');
      });

      if (no_check === undefined) {
        for (var i = 0; i < this.imageList.length; i++) {
          if (newListSrc.indexOf(this.imageList[i].attr('src')) < 0) {
            this.triggerEvent('afterRemoveImage', [this.imageList[i]], false);
          }
        }
      }

      this.imageList = newList;
    }
  };

  /**
   * Insert image.
   */
  $.Editable.prototype.insertImage = function () {
    if (!this.options.inlineMode) {
      this.closeImageMode();
      this.imageMode = false;
      this.positionPopup('insertImage');
    }

    if (this.selectionInEditor()) {
      this.saveSelection();
    }

    this.showInsertImage();

    this.imageMode = false;

    this.$image_wrapper.find('input[type="text"]').val('');
  };

})(jQuery);

(function ($) {
  $.Editable.prototype.showLinkWrapper = function () {
    if (this.$link_wrapper) {
      this.$link_wrapper.show();
      this.$link_wrapper.trigger('hideLinkList');
      this.$link_wrapper.trigger('hideLinkClassList');

      this.$link_wrapper.find('input.f-lu').removeClass('fr-error');

      // Show or not the text link.
      if (this.imageMode || !this.options.linkText) {
        this.$link_wrapper.find('input[type="text"].f-lt').parent().addClass('fr-hidden');
      } else {
        this.$link_wrapper.find('input[type="text"].f-lt').parent().removeClass('fr-hidden');
      }

      // Url for link disabled or not.
      if (this.imageMode) {
        this.$link_wrapper.find('input[type="text"].f-lu').removeAttr('disabled');
      }

      if (!this.phone()) {
        setTimeout($.proxy(function () {
          this.$link_wrapper.find('input[type="text"].f-lu').focus().select();
        }, this), 0);
      } else {
        this.$document.scrollTop(this.$link_wrapper.offset().top - 10);
      }

      this.link = true;
    }
  };

  $.Editable.prototype.hideLinkWrapper = function () {
    if (this.$link_wrapper) {
      this.$link_wrapper.hide();
      this.$link_wrapper.find('input').blur()
    }
  };

  $.Editable.prototype.showInsertLink = function () {
    this.hidePopups();

    this.showLinkWrapper();
  };

  $.Editable.prototype.initLinkEvents = function () {
    var that = this;

    var cancel_click = function (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    var link_click = function (e) {
      e.stopPropagation();
      e.preventDefault();

      if (that.isDisabled) return false;

      if (that.text() !== '') {
        that.hide();
        return false;
      }

      that.link = true;

      that.clearSelection();
      that.removeMarkers();

      if (!that.selectionDisabled) {
        $(this).before('<span class="f-marker" data-type="true" data-id="0" data-fr-verified="true"></span>');
        $(this).after('<span class="f-marker" data-type="false" data-id="0" data-fr-verified="true"></span>');
        that.restoreSelectionByMarkers();
      }

      that.exec('createLink');

      var href = $(this).attr('href') || '';

      // Set link text.
      that.$link_wrapper.find('input.f-lt').val($(this).text());

      // Set href.
      if (!that.isLink) {
        // Simple ampersand.
        that.$link_wrapper.find('input.f-lu').val(href.replace(/\&amp;/g, '&'));
        that.$link_wrapper.find('.f-external-link').attr('href', href);
      }
      else {
        if (href == '#') {
          href = '';
        }

        // Simple ampersand.
        that.$link_wrapper.find('input#f-lu-' + that._id).val(href.replace(/\&amp;/g, '&'));
        that.$link_wrapper.find('.f-external-link').attr('href', href || '#');
      }

      // Set blank.
      that.$link_wrapper.find('input[type="checkbox"]').prop('checked', $(this).attr('target') == '_blank');

      // Set link classes.
      that.$link_wrapper.find('li.f-choose-link-class').each ($.proxy(function (index, elem) {
        if ($(this).hasClass($(elem).data('class'))) {
          $(elem).click();
        }
      }, this));

      // Show editor.
      that.showByCoordinates($(this).offset().left + $(this).outerWidth() / 2, $(this).offset().top + (parseInt($(this).css('padding-top'), 10) || 0) + $(this).height());

      // Keep these 2 lines in this order for issue #224.
      // Show link wrapper.
      that.showInsertLink();

      // File link.
      if ($(this).hasClass('fr-file')) {
        that.$link_wrapper.find('input.f-lu').attr('disabled', 'disabled');
      } else {
        that.$link_wrapper.find('input.f-lu').removeAttr('disabled');
      }

      // Make sure we close image mode.
      that.closeImageMode();
    };

    // Link click. stop propagation.
    this.$element.on('mousedown', 'a', $.proxy(function (e) {
      if (!this.isResizing()) {
        e.stopPropagation();
      }
    }, this));

    // Click on a link.
    if (!this.isLink) {
      if (this.iOS()) {
        this.$element.on('touchstart', 'a:not([contenteditable="false"])', cancel_click);
        this.$element.on('touchend', 'a:not([contenteditable="false"])', link_click);

        this.$element.on('touchstart', 'a[contenteditable="false"]', cancel_click);
        this.$element.on('touchend', 'a[contenteditable="false"]', cancel_click);
      } else {
        this.$element.on('click', 'a:not([contenteditable="false"])', link_click);
        this.$element.on('click', 'a[contenteditable="false"]', cancel_click);
      }
    } else {
      if (this.iOS()) {
        this.$element.on('touchstart', cancel_click);
        this.$element.on('touchend', link_click);
      } else {
        this.$element.on('click', link_click);
      }
    }
  }

  $.Editable.prototype.destroyLink = function () {
    this.$link_wrapper.html('').removeData().remove();
  }

  /**
   * Initialize links.
   */
  $.Editable.prototype.initLink = function () {
    this.buildCreateLink();

    this.initLinkEvents();

    this.addListener('destroy', this.destroyLink);
  };

  $.Editable.initializers.push($.Editable.prototype.initLink);

  /**
   * Remove link
   */
  $.Editable.prototype.removeLink = function () {
    if (this.imageMode) {
      if (this.$element.find('.f-img-editor').parent().get(0).tagName == 'A') {
        $(this.$element.find('.f-img-editor').get(0)).unwrap();
      }

      this.triggerEvent('imageLinkRemoved');


      this.showImageEditor();
      this.$element.find('.f-img-editor').find('img').click();

      this.link = false;
    }

    else {
      this.restoreSelection();
      document.execCommand('unlink', false, null);

      if (!this.isLink) {
        this.$element.find('a:empty').remove();
      }

      this.triggerEvent('linkRemoved');



      this.hideLinkWrapper();
      this.$bttn_wrapper.show();

      if (!this.options.inlineMode || this.isLink) {
        this.hide();
      }

      this.link = false;
    }
  };

  /**
   * Write link in document.
   *
   * @param url - Link URL.
   * @param blank - New tab.
   */
  $.Editable.prototype.writeLink = function (url, text, cls, blank, nofollow) {
    var links;

    if (this.options.noFollow) {
      nofollow = true;
    }

    if (this.options.alwaysBlank) {
      blank = true;
    }

    var nofollow_string = '';
    var blank_string = '';

    // No follow and link is external.
    if (nofollow === true && /^https?:\/\//.test(url)) {
      nofollow_string = 'rel="nofollow"';
    }

    if (blank === true) {
      blank_string = 'target="_blank"';
    }

    var original_url = url;
    url = this.sanitizeURL(url);

    if (this.options.convertMailAddresses) {
      var regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;

      if (regex.test(url) && url.indexOf('mailto:') !== 0) {
        url = 'mailto:' + url;
      }
    }

    if (url === '') {
      this.$link_wrapper.find('input.f-lu').addClass('fr-error').focus();
      this.triggerEvent('badLink', [original_url], false);
      return false;
    }

    this.$link_wrapper.find('input.f-lu').removeClass('fr-error');

    // Insert link to image.
    if (this.imageMode) {
      if (this.$element.find('.f-img-editor').parent().get(0).tagName != 'A') {
        this.$element.find('.f-img-editor').wrap('<a data-fr-link="true" href="' + url + '" ' + blank_string + ' ' + nofollow_string + '></a>');
      } else {

        var $link = this.$element.find('.f-img-editor').parent();

        if (blank === true) {
          $link.attr('target', '_blank');
        } else {
          $link.removeAttr('target');
        }

        if (nofollow === true) {
          $link.attr('rel', 'nofollow');
        } else {
          $link.removeAttr('rel');
        }

        $link.removeClass(Object.keys(this.options.linkClasses).join(' '));
        $link.attr('href', url).addClass(cls);
      }

      // (URL)
      this.triggerEvent('imageLinkInserted', [url]);


      this.showImageEditor();
      this.$element.find('.f-img-editor').find('img').click();

      this.link = false;
    }

    // Insert link.
    else {
      var attributes = null;

      if (!this.isLink) {
        this.restoreSelection();

        links = this.getSelectionLinks();
        if (links.length > 0) {
          attributes = links[0].attributes;
          is_file = $(links[0]).hasClass('fr-file');
        }

        this.saveSelectionByMarkers();
        document.execCommand('unlink', false, url);
        this.$element.find('span[data-fr-link="true"]').each(function (index, elem) {
          $(elem).replaceWith($(elem).html());
        });
        this.restoreSelectionByMarkers();
      } else {
        if (text === '') {
          text = this.$element.text();
        }
      }

      // URL is not empty.
      if (!this.isLink) {
        this.removeMarkers();
        if (this.options.linkText || this.text() === '') {
          this.insertHTML('<span class="f-marker" data-fr-verified="true" data-id="0" data-type="true"></span>' + (text || url) + '<span class="f-marker" data-fr-verified="true" data-id="0" data-type="false"></span>');
          this.restoreSelectionByMarkers();
        }

        document.execCommand('createLink', false, url);
        links = this.getSelectionLinks();
      }
      else {
        this.$element.text(text);
        links = [this.$element.attr('href', url).get(0)];
      }

      for (var i = 0; i < links.length; i++) {
        if (attributes) {
          for (var l = 0; l < attributes.length; l++) {
            if (attributes[l].nodeName != 'href') {
              $(links[i]).attr(attributes[l].nodeName, attributes[l].value);
            }
          }
        }

        if (blank === true) {
          $(links[i]).attr('target', '_blank');
        } else {
          $(links[i]).removeAttr('target');
        }

        if (nofollow === true && /^https?:\/\//.test(url)) {
          $(links[i]).attr('rel', 'nofollow');
        } else {
          $(links[i]).removeAttr('rel');
        }

        $(links[i]).data('fr-link', true);
        $(links[i]).removeClass(Object.keys(this.options.linkClasses).join(' '));
        $(links[i]).addClass(cls);
      }

      this.$element.find('a:empty').remove();

      this.triggerEvent('linkInserted', [url]);



      this.hideLinkWrapper();
      this.$bttn_wrapper.show();

      if (!this.options.inlineMode || this.isLink) this.hide();

      this.link = false;
    }
  };

  $.Editable.prototype.createLinkHTML = function () {
    var html = '<div class="froala-popup froala-link-popup" style="display: none;">';
    html += '<h4><span data-text="true">Insert Link</span><a target="_blank" title="Open Link" class="f-external-link" href="#"><i class="fa fa-external-link"></i></a><i title="Cancel" class="fa fa-times" id="f-link-close-' + this._id + '"></i></h4>';
    html += '<div class="f-popup-line fr-hidden"><input type="text" placeholder="Text" class="f-lt" id="f-lt-' + this._id + '"></div>';

    var browse_cls = '';
    if (this.options.linkList.length) {
      browse_cls = 'f-bi';
    }

    html += '<div class="f-popup-line"><input type="text" placeholder="http://www.example.com" class="f-lu ' + browse_cls + '" id="f-lu-' + this._id + '"/>';
    if (this.options.linkList.length) {
      html += '<button class="fr-p-bttn f-browse-links" id="f-browse-links-' + this._id + '"><i class="fa fa-chevron-down"></i></button>';
      html += '<ul id="f-link-list-' + this._id + '">';

      for (var i = 0; i < this.options.linkList.length; i++) {
        var link = this.options.linkList[i];
        html += '<li class="f-choose-link" data-nofollow="' + link.nofollow + '" data-blank="' + link.blank + '" data-body="' + link.body + '" data-title="' + link.title + '" data-href="' + link.href + '">' + link.body + '</li>';
      }

      html += '</ul>';
    }
    html += '</div>';

    if (Object.keys(this.options.linkClasses).length) {
      html += '<div class="f-popup-line"><input type="text" placeholder="Choose link type" class="f-bi" id="f-luc-' + this._id + '" disabled="disabled"/>';

      html += '<button class="fr-p-bttn f-browse-links" id="f-links-class-' + this._id + '"><i class="fa fa-chevron-down"></i></button>';
      html += '<ul id="f-link-class-list-' + this._id + '">';

      for (var l_class in this.options.linkClasses) {
        var l_name = this.options.linkClasses[l_class];

        html += '<li class="f-choose-link-class" data-class="' + l_class + '">' + l_name + '</li>';
      }

      html += '</ul>';

      html += '</div>';
    }

    html += '<div class="f-popup-line"><input type="checkbox" id="f-checkbox-' + this._id + '"> <label data-text="true" for="f-checkbox-' + this._id + '">Open in new tab</label><button data-text="true" type="button" class="fr-p-bttn f-ok" id="f-ok-' + this._id + '">OK</button>';
    if (this.options.unlinkButton) {
      html += '<button type="button" data-text="true" class="fr-p-bttn f-ok f-unlink" id="f-unlink-' + this._id + '">UNLINK</button>';
    }

    html += '</div></div>';

    return html;
  }

  /**
   * Build create link.
   */
  $.Editable.prototype.buildCreateLink = function () {
    this.$link_wrapper = $(this.createLinkHTML());
    this.$popup_editor.append(this.$link_wrapper);

    var that = this;

    // Link wrapper to hidePopups listener.
    this.addListener('hidePopups', this.hideLinkWrapper);

    // Stop event propagation in link.
    this.$link_wrapper.on('mouseup touchend', $.proxy(function (e) {
      if (!this.isResizing()) {
        e.stopPropagation();
        this.$link_wrapper.trigger('hideLinkList');
      }
    }, this));

    // Field to edit text.
    if (this.options.linkText) {
      this.$link_wrapper
        .on('mouseup keydown', 'input#f-lt-' + this._id, $.proxy(function (e) {
          var keyCode = e.which;
          if (!keyCode || keyCode !== 27) {
            e.stopPropagation();
          }

          this.$link_wrapper.trigger('hideLinkList');
          this.$link_wrapper.trigger('hideLinkClassList');
        }, this));
    }

    // Set URL events.
    this.$link_wrapper
      .on('mouseup keydown', 'input#f-lu-' + this._id, $.proxy(function (e) {
        var keyCode = e.which;
        if (!keyCode || keyCode !== 27) {
          e.stopPropagation();
        }

        this.$link_wrapper.trigger('hideLinkList');
        this.$link_wrapper.trigger('hideLinkClassList');
      }, this));

    // Blank url event.
    this.$link_wrapper.on('click keydown', 'input#f-checkbox-' + this._id, function (e) {
      var keyCode = e.which;
      if (!keyCode || keyCode !== 27) {
        e.stopPropagation();
      }
    });

    // OK button.
    this.$link_wrapper
      .on('touchend', 'button#f-ok-' + this._id, function (e) {
        e.stopPropagation();
      })
      .on('click', 'button#f-ok-' + this._id, $.proxy(function () {
        var text;
        var $text = this.$link_wrapper.find('input#f-lt-' + this._id);
        var $url = this.$link_wrapper.find('input#f-lu-' + this._id);
        var $lcls = this.$link_wrapper.find('input#f-luc-' + this._id);
        var $blank_url = this.$link_wrapper.find('input#f-checkbox-' + this._id);

        if ($text) {
          text = $text.val();
        }
        else {
          text = '';
        }

        var url = $url.val();
        if (this.isLink && url === '') {
          url = '#';
        }

        var cls = '';
        if ($lcls) {
          cls = $lcls.data('class');
        }

        this.writeLink(url, text, cls, $blank_url.prop('checked'));
      }, this));

    // Unlink button.
    this.$link_wrapper.on('click touch', 'button#f-unlink-' + this._id, $.proxy(function () {
      this.link = true;
      this.removeLink();
    }, this));

    // Predefined link list.
    if (this.options.linkList.length) {
      this.$link_wrapper
        .on('click touch', 'li.f-choose-link', function () {
          var $link_list_button = that.$link_wrapper.find('button#f-browse-links-' + that._id);
          var $text = that.$link_wrapper.find('input#f-lt-' + that._id);
          var $url = that.$link_wrapper.find('input#f-lu-' + that._id);
          var $blank_url = that.$link_wrapper.find('input#f-checkbox-' + that._id);

          if ($text) {
            $text.val($(this).data('body'));
          }

          $url.val($(this).data('href'));
          $blank_url.prop('checked', $(this).data('blank'));

          $link_list_button.click();
        })
        .on('mouseup', 'li.f-choose-link', function (e) {
          e.stopPropagation();
        })

      this.$link_wrapper
        .on('click', 'button#f-browse-links-' + this._id, function (e) {
          e.stopPropagation();
          var $link_list = that.$link_wrapper.find('ul#f-link-list-' + that._id);
          that.$link_wrapper.trigger('hideLinkClassList')
          $(this).find('i').toggleClass('fa-chevron-down')
          $(this).find('i').toggleClass('fa-chevron-up')
          $link_list.toggle();
        })
        .on('mouseup', 'button#f-browse-links-' + this._id, function (e) {
          e.stopPropagation();
        })

      this.$link_wrapper.bind('hideLinkList', function () {
        var $link_list = that.$link_wrapper.find('ul#f-link-list-' + that._id);
        var $link_list_button = that.$link_wrapper.find('button#f-browse-links-' + that._id);
        if ($link_list && $link_list.is(':visible')) {
          $link_list_button.click();
        }
      })
    }

    // Link classes.
    if (Object.keys(this.options.linkClasses).length) {
      this.$link_wrapper
        .on('mouseup keydown', 'input#f-luc-' + this._id, $.proxy(function (e) {
          var keyCode = e.which;
          if (!keyCode || keyCode !== 27) {
            e.stopPropagation();
          }

          this.$link_wrapper.trigger('hideLinkList');
          this.$link_wrapper.trigger('hideLinkClassList');
        }, this));

      this.$link_wrapper
        .on('click touch', 'li.f-choose-link-class', function () {
          var $label = that.$link_wrapper.find('input#f-luc-' + that._id);

          $label.val($(this).text());
          $label.data('class', $(this).data('class'));

          that.$link_wrapper.trigger('hideLinkClassList');
        })
        .on('mouseup', 'li.f-choose-link-class', function (e) {
          e.stopPropagation();
        })

      this.$link_wrapper
        .on('click', 'button#f-links-class-' + this._id, function (e) {
          e.stopPropagation();
          that.$link_wrapper.trigger('hideLinkList')
          var $link_list = that.$link_wrapper.find('ul#f-link-class-list-' + that._id);
          $(this).find('i').toggleClass('fa-chevron-down')
          $(this).find('i').toggleClass('fa-chevron-up')
          $link_list.toggle();
        })
        .on('mouseup', 'button#f-links-class-' + this._id, function (e) {
          e.stopPropagation();
        })

      this.$link_wrapper.bind('hideLinkClassList', function () {
        var $link_list = that.$link_wrapper.find('ul#f-link-class-list-' + that._id);
        var $link_list_button = that.$link_wrapper.find('button#f-links-class-' + that._id);
        if ($link_list && $link_list.is(':visible')) {
          $link_list_button.click();
        }
      })
    }

    // Close button.
    this.$link_wrapper
      .on(this.mouseup, 'i#f-link-close-' + this._id, $.proxy(function () {
        this.$bttn_wrapper.show();
        this.hideLinkWrapper();

        if ((!this.options.inlineMode && !this.imageMode) || this.isLink || this.options.buttons.length === 0) {
          this.hide();
        }

        if (!this.imageMode) {
          this.restoreSelection();
          this.focus();
        } else {
          this.showImageEditor();
        }
      }, this))
  };

  /**
   * Get links from selection.
   *
   * @returns {Array}
   */
  // From: http://stackoverflow.com/questions/5605401/insert-link-in-contenteditable-element
  $.Editable.prototype.getSelectionLinks = function () {
    var selectedLinks = [];
    var range;
    var containerEl;
    var links;
    var linkRange;

    if (window.getSelection) {
      var sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        linkRange = document.createRange();
        for (var r = 0; r < sel.rangeCount; ++r) {
          range = sel.getRangeAt(r);
          containerEl = range.commonAncestorContainer;

          if (containerEl && containerEl.nodeType != 1) {
            containerEl = containerEl.parentNode;
          }

          if (containerEl && containerEl.nodeName.toLowerCase() == 'a') {
            selectedLinks.push(containerEl);
          } else {
            links = containerEl.getElementsByTagName('a');
            for (var i = 0; i < links.length; ++i) {
              linkRange.selectNodeContents(links[i]);
              if (linkRange.compareBoundaryPoints(range.END_TO_START, range) < 1 && linkRange.compareBoundaryPoints(range.START_TO_END, range) > -1) {
                selectedLinks.push(links[i]);
              }
            }
          }
        }
        // linkRange.detach();
      }
    } else if (document.selection && document.selection.type != 'Control') {
      range = document.selection.createRange();
      containerEl = range.parentElement();
      if (containerEl.nodeName.toLowerCase() == 'a') {
        selectedLinks.push(containerEl);
      } else {
        links = containerEl.getElementsByTagName('a');
        linkRange = document.body.createTextRange();
        for (var j = 0; j < links.length; ++j) {
          linkRange.moveToElementText(links[j]);
          if (linkRange.compareEndPoints('StartToEnd', range) > -1 && linkRange.compareEndPoints('EndToStart', range) < 1) {
            selectedLinks.push(links[j]);
          }
        }
      }
    }

    return selectedLinks;
  };

  /**
   * Insert link.
   */
  $.Editable.prototype.insertLink = function () {
    if (!this.options.inlineMode) {
      this.closeImageMode();
      this.imageMode = false;
      this.positionPopup('createLink');
    }

    if (this.selectionInEditor()) {
      this.saveSelection();
    }

    this.showInsertLink();

    var link = this.getSelectionLink() || '';
    var links = this.getSelectionLinks();
    if (links.length > 0) {
      this.$link_wrapper.find('input[type="checkbox"]').prop('checked', $(links[0]).attr('target') == '_blank');
      this.$link_wrapper.find('input[type="text"].f-lt').val($(links[0]).text() || '');

      if ($(links[0]).hasClass('fr-file')) {
        this.$link_wrapper.find('input[type="text"].f-lu').attr('disabled', 'disabled');
      } else {
        this.$link_wrapper.find('input[type="text"].f-lu').removeAttr('disabled');
      }

      this.$link_wrapper.find('a.f-external-link, button.f-unlink').show();
    } else {
      this.$link_wrapper.find('input[type="checkbox"]').prop('checked', this.options.alwaysBlank);
      this.$link_wrapper.find('input[type="text"].f-lt').val(this.text());
      this.$link_wrapper.find('input[type="text"].f-lu').removeAttr('disabled');
      this.$link_wrapper.find('a.f-external-link, button.f-unlink').hide();
    }

    this.$link_wrapper.find('.f-external-link').attr('href', link || '#');
    this.$link_wrapper.find('input[type="text"].f-lu').val(link.replace(/\&amp;/g, '&') || 'http://');
  };

})(jQuery);

(function ($) {
  $.Editable.prototype.browserFixes = function () {
    this.preBlockquoteEnter();

    this.enterNoParagraphy();

    this.backspaceEmpty();

    this.fixHR();

    this.domInsert();

    this.fixIME();
  }

  $.Editable.prototype.fixHR = function () {
    this.$element.on ('keydown', $.proxy (function (e) {
      var $pseduoEl = $(this.getSelectionElement());
      if ($pseduoEl.is('hr') || $pseduoEl.parents('hr').length) return false;

      var keydown = e.which;

      var $element = $(this.getSelectionElements()[0]);

      if (keydown == 8 && $element.prev().is('hr') && this.getSelectionTextInfo($element.get(0)).atStart) {
        this.saveSelectionByMarkers();
        $element.prev().remove();
        this.restoreSelectionByMarkers();
        e.preventDefault();
      }
    }, this));
  }

  $.Editable.prototype.backspaceEmpty = function () {
    this.$element.on('keydown', $.proxy(function (e) {
      var keyCode = e.which;

      if (!this.isHTML && keyCode == 8 && this.$element.hasClass('f-placeholder')) {
        e.preventDefault();
      }
    }, this));
  };

  // Enter for PRE and BLOCKQUOTE.
  $.Editable.prototype.preBlockquoteEnter = function () {
    if (!this.isImage && !this.isLink && !this.options.editInPopup) {
      this.$element.on('keydown', $.proxy(function (e) {
        var keyCode = e.which;
        var deniedTags = ['PRE', 'BLOCKQUOTE'];
        var element = this.getSelectionElements()[0];
        if (keyCode == 13 && this.text() === '' && deniedTags.indexOf((element).tagName) >= 0 && $(element).parents('ul, ol').length === 0) {
          if (this.getSelectionTextInfo(element).atEnd && !e.shiftKey) {
            e.preventDefault();
            var $p = $('<p><br></p>');
            $(element).after($p);
            this.setSelection($p.get(0));
          }
          else if (this.browser.webkit || this.browser.msie) {
            e.preventDefault();
            if (this.endsWith($(element).html(), '<br>') || !this.getSelectionTextInfo(element).atEnd) {
              this.insertHTML('<br>');
            }
            else {
              this.insertHTML('<br><br>');
            }
          }
        }
      }, this));
    }
  };

  $.Editable.prototype.enterNoParagraphy = function () {
    if ((this.browser.webkit || this.browser.msie) && !this.options.paragraphy) {
      this.$element.on('keydown', $.proxy(function (e) {
        var keyCode = e.which;

        if (keyCode == 13) {
          e.preventDefault();
          this.insertHTML('</br>&#8203;<span class="f-marker" data-type="false" data-id="0" data-fr-verified="true"></span><span class="f-marker" data-type="true" data-id="0" data-fr-verified="true"></span>');
          this.restoreSelectionByMarkers();
        }
      }, this))
    }
  }

  $.Editable.prototype.domInsert = function () {
    this.$element.on('keydown', $.proxy(function (e) {
      var keyCode = e.which;
      if (keyCode === 8) {
        this.no_verify = true;
      }

      if (keyCode === 13) {
        this.add_br = true;
      }
    }, this));

    this.$element.on('DOMNodeInserted', $.proxy(function (e) {
      if (e.target.tagName === 'SPAN' && !$(e.target).attr('data-fr-verified') && !this.no_verify && !this.textEmpty(e.target)) {
        $(e.target).replaceWith($(e.target).contents());
      }

      // Enter before and after table.
      if (this.options.paragraphy && this.add_br && e.target.tagName === 'BR') {
        if (($(e.target).prev().length && $(e.target).prev().get(0).tagName === 'TABLE') || ($(e.target).next().length && $(e.target).next().get(0).tagName === 'TABLE')) {
          $(e.target).wrap('<p class="fr-p-wrap">');
          var $p = this.$element.find('p.fr-p-wrap').removeAttr('class');
          this.setSelection($p.get(0));
        }
      }
    }, this));

    this.$element.on('keyup', $.proxy(function (e) {
      var keyCode = e.which;
      if (keyCode === 8) {
        this.$element.find('span:not(.fr-verified)').attr('data-fr-verified', true);
        this.no_verify = false;
      }

      if (keyCode === 13) {
        this.add_br = true;
      }
    }, this));
  };

  $.Editable.prototype.fixIME = function () {
    if (this.$element.get(0).msGetInputContext) {
      this.$element.get(0).msGetInputContext().addEventListener('MSCandidateWindowShow', $.proxy(function () {
        this.ime = true;
      }, this))

      this.$element.get(0).msGetInputContext().addEventListener('MSCandidateWindowHide', $.proxy(function () {
        this.ime = false;
        this.$element.trigger('keydown');
        this.oldHTML = '';
      }, this))
    }
  }

})(jQuery);

// jquery.event.move
//
// 1.3.6
//
// Stephen Band
//
// Triggers 'movestart', 'move' and 'moveend' events after
// mousemoves following a mousedown cross a distance threshold,
// similar to the native 'dragstart', 'drag' and 'dragend' events.
// Move events are throttled to animation frames. Move event objects
// have the properties:
//
// pageX:
// pageY:   Page coordinates of pointer.
// startX:
// startY:  Page coordinates of pointer at movestart.
// distX:
// distY:  Distance the pointer has moved since movestart.
// deltaX:
// deltaY:  Distance the finger has moved since last event.
// velocityX:
// velocityY:  Average velocity over last few events.


(function (module) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], module);
	} else {
		// Browser globals
		module(jQuery);
	}
})(function(jQuery, undefined){

	var // Number of pixels a pressed pointer travels before movestart
	    // event is fired.
	    threshold = 6,

	    add = jQuery.event.add,

	    remove = jQuery.event.remove,

	    // Just sugar, so we can have arguments in the same order as
	    // add and remove.
	    trigger = function(node, type, data) {
	    	jQuery.event.trigger(type, data, node);
	    },

	    // Shim for requestAnimationFrame, falling back to timer. See:
	    // see http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	    requestFrame = (function(){
	    	return (
	    		window.requestAnimationFrame ||
	    		window.webkitRequestAnimationFrame ||
	    		window.mozRequestAnimationFrame ||
	    		window.oRequestAnimationFrame ||
	    		window.msRequestAnimationFrame ||
	    		function(fn, element){
	    			return window.setTimeout(function(){
	    				fn();
	    			}, 25);
	    		}
	    	);
	    })(),

	    ignoreTags = {
	    	textarea: true,
	    	input: true,
	    	select: true,
	    	button: true
	    },

	    mouseevents = {
	    	move: 'mousemove',
	    	cancel: 'mouseup dragstart',
	    	end: 'mouseup'
	    },

	    touchevents = {
	    	move: 'touchmove',
	    	cancel: 'touchend',
	    	end: 'touchend'
	    };


	// Constructors

	function Timer(fn){
		var callback = fn,
		    active = false,
		    running = false;

		function trigger(time) {
			if (active){
				callback();
				requestFrame(trigger);
				running = true;
				active = false;
			}
			else {
				running = false;
			}
		}

		this.kick = function(fn) {
			active = true;
			if (!running) { trigger(); }
		};

		this.end = function(fn) {
			var cb = callback;

			if (!fn) { return; }

			// If the timer is not running, simply call the end callback.
			if (!running) {
				fn();
			}
			// If the timer is running, and has been kicked lately, then
			// queue up the current callback and the end callback, otherwise
			// just the end callback.
			else {
				callback = active ?
					function(){ cb(); fn(); } :
					fn ;

				active = true;
			}
		};
	}


	// Functions

	function returnTrue() {
		return true;
	}

	function returnFalse() {
		return false;
	}

	function preventDefault(e) {
		e.preventDefault();
	}

	function preventIgnoreTags(e) {
		// Don't prevent interaction with form elements.
		if (ignoreTags[ e.target.tagName.toLowerCase() ]) { return; }

		e.preventDefault();
	}

	function isLeftButton(e) {
		// Ignore mousedowns on any button other than the left (or primary)
		// mouse button, or when a modifier key is pressed.
		return (e.which === 1 && !e.ctrlKey && !e.altKey);
	}

	function identifiedTouch(touchList, id) {
		var i, l;

		if (touchList.identifiedTouch) {
			return touchList.identifiedTouch(id);
		}

		// touchList.identifiedTouch() does not exist in
		// webkit yet… we must do the search ourselves...

		i = -1;
		l = touchList.length;

		while (++i < l) {
			if (touchList[i].identifier === id) {
				return touchList[i];
			}
		}
	}

	function changedTouch(e, event) {
		var touch = identifiedTouch(e.changedTouches, event.identifier);

		// This isn't the touch you're looking for.
		if (!touch) { return; }

		// Chrome Android (at least) includes touches that have not
		// changed in e.changedTouches. That's a bit annoying. Check
		// that this touch has changed.
		if (touch.pageX === event.pageX && touch.pageY === event.pageY) { return; }

		return touch;
	}


	// Handlers that decide when the first movestart is triggered

	function mousedown(e){
		var data;

		if (!isLeftButton(e)) { return; }

		data = {
			target: e.target,
			startX: e.pageX,
			startY: e.pageY,
			timeStamp: e.timeStamp
		};

		add(document, mouseevents.move, mousemove, data);
		add(document, mouseevents.cancel, mouseend, data);
	}

	function mousemove(e){
		var data = e.data;

		checkThreshold(e, data, e, removeMouse);
	}

	function mouseend(e) {
		removeMouse();
	}

	function removeMouse() {
		remove(document, mouseevents.move, mousemove);
		remove(document, mouseevents.cancel, mouseend);
	}

	function touchstart(e) {
		var touch, template;

		// Don't get in the way of interaction with form elements.
		if (ignoreTags[ e.target.tagName.toLowerCase() ]) { return; }

		touch = e.changedTouches[0];

		// iOS live updates the touch objects whereas Android gives us copies.
		// That means we can't trust the touchstart object to stay the same,
		// so we must copy the data. This object acts as a template for
		// movestart, move and moveend event objects.
		template = {
			target: touch.target,
			startX: touch.pageX,
			startY: touch.pageY,
			timeStamp: e.timeStamp,
			identifier: touch.identifier
		};

		// Use the touch identifier as a namespace, so that we can later
		// remove handlers pertaining only to this touch.
		add(document, touchevents.move + '.' + touch.identifier, touchmove, template);
		add(document, touchevents.cancel + '.' + touch.identifier, touchend, template);
	}

	function touchmove(e){
		var data = e.data,
		    touch = changedTouch(e, data);

		if (!touch) { return; }

		checkThreshold(e, data, touch, removeTouch);
	}

	function touchend(e) {
		var template = e.data,
		    touch = identifiedTouch(e.changedTouches, template.identifier);

		if (!touch) { return; }

		removeTouch(template.identifier);
	}

	function removeTouch(identifier) {
		remove(document, '.' + identifier, touchmove);
		remove(document, '.' + identifier, touchend);
	}


	// Logic for deciding when to trigger a movestart.

	function checkThreshold(e, template, touch, fn) {
		var distX = touch.pageX - template.startX,
		    distY = touch.pageY - template.startY;

		// Do nothing if the threshold has not been crossed.
		if ((distX * distX) + (distY * distY) < (threshold * threshold)) { return; }

		triggerStart(e, template, touch, distX, distY, fn);
	}

	function handled() {
		// this._handled should return false once, and after return true.
		this._handled = returnTrue;
		return false;
	}

	function flagAsHandled(e) {
    try {
      e._handled();
    }
    catch(ex) {
      return false;
    }
	}

	function triggerStart(e, template, touch, distX, distY, fn) {
		var node = template.target,
		    touches, time;

		touches = e.targetTouches;
		time = e.timeStamp - template.timeStamp;

		// Create a movestart object with some special properties that
		// are passed only to the movestart handlers.
		template.type = 'movestart';
		template.distX = distX;
		template.distY = distY;
		template.deltaX = distX;
		template.deltaY = distY;
		template.pageX = touch.pageX;
		template.pageY = touch.pageY;
		template.velocityX = distX / time;
		template.velocityY = distY / time;
		template.targetTouches = touches;
		template.finger = touches ?
			touches.length :
			1 ;

		// The _handled method is fired to tell the default movestart
		// handler that one of the move events is bound.
		template._handled = handled;

		// Pass the touchmove event so it can be prevented if or when
		// movestart is handled.
		template._preventTouchmoveDefault = function() {
			e.preventDefault();
		};

		// Trigger the movestart event.
		trigger(template.target, template);

		// Unbind handlers that tracked the touch or mouse up till now.
		fn(template.identifier);
	}


	// Handlers that control what happens following a movestart

	function activeMousemove(e) {
		var timer = e.data.timer;

		e.data.touch = e;
		e.data.timeStamp = e.timeStamp;
		timer.kick();
	}

	function activeMouseend(e) {
		var event = e.data.event,
		    timer = e.data.timer;

		removeActiveMouse();

		endEvent(event, timer, function() {
			// Unbind the click suppressor, waiting until after mouseup
			// has been handled.
			setTimeout(function(){
				remove(event.target, 'click', returnFalse);
			}, 0);
		});
	}

	function removeActiveMouse(event) {
		remove(document, mouseevents.move, activeMousemove);
		remove(document, mouseevents.end, activeMouseend);
	}

	function activeTouchmove(e) {
		var event = e.data.event,
		    timer = e.data.timer,
		    touch = changedTouch(e, event);

		if (!touch) { return; }

		// Stop the interface from gesturing
		e.preventDefault();

		event.targetTouches = e.targetTouches;
		e.data.touch = touch;
		e.data.timeStamp = e.timeStamp;
		timer.kick();
	}

	function activeTouchend(e) {
		var event = e.data.event,
		    timer = e.data.timer,
		    touch = identifiedTouch(e.changedTouches, event.identifier);

		// This isn't the touch you're looking for.
		if (!touch) { return; }

		removeActiveTouch(event);
		endEvent(event, timer);
	}

	function removeActiveTouch(event) {
		remove(document, '.' + event.identifier, activeTouchmove);
		remove(document, '.' + event.identifier, activeTouchend);
	}


	// Logic for triggering move and moveend events

	function updateEvent(event, touch, timeStamp, timer) {
		var time = timeStamp - event.timeStamp;

		event.type = 'move';
		event.distX =  touch.pageX - event.startX;
		event.distY =  touch.pageY - event.startY;
		event.deltaX = touch.pageX - event.pageX;
		event.deltaY = touch.pageY - event.pageY;

		// Average the velocity of the last few events using a decay
		// curve to even out spurious jumps in values.
		event.velocityX = 0.3 * event.velocityX + 0.7 * event.deltaX / time;
		event.velocityY = 0.3 * event.velocityY + 0.7 * event.deltaY / time;
		event.pageX =  touch.pageX;
		event.pageY =  touch.pageY;
	}

	function endEvent(event, timer, fn) {
		timer.end(function(){
			event.type = 'moveend';

			trigger(event.target, event);

			return fn && fn();
		});
	}


	// jQuery special event definition

	function setup(data, namespaces, eventHandle) {
		// Stop the node from being dragged
		//add(this, 'dragstart.move drag.move', preventDefault);

		// Prevent text selection and touch interface scrolling
		//add(this, 'mousedown.move', preventIgnoreTags);

		// Tell movestart default handler that we've handled this
		add(this, 'movestart.move', flagAsHandled);

		// Don't bind to the DOM. For speed.
		return true;
	}

	function teardown(namespaces) {
		remove(this, 'dragstart drag', preventDefault);
		remove(this, 'mousedown touchstart', preventIgnoreTags);
		remove(this, 'movestart', flagAsHandled);

		// Don't bind to the DOM. For speed.
		return true;
	}

	function addMethod(handleObj) {
		// We're not interested in preventing defaults for handlers that
		// come from internal move or moveend bindings
		if (handleObj.namespace === "move" || handleObj.namespace === "moveend") {
			return;
		}

		// Stop the node from being dragged
		add(this, 'dragstart.' + handleObj.guid + ' drag.' + handleObj.guid, preventDefault, undefined, handleObj.selector);

		// Prevent text selection and touch interface scrolling
		add(this, 'mousedown.' + handleObj.guid, preventIgnoreTags, undefined, handleObj.selector);
	}

	function removeMethod(handleObj) {
		if (handleObj.namespace === "move" || handleObj.namespace === "moveend") {
			return;
		}

		remove(this, 'dragstart.' + handleObj.guid + ' drag.' + handleObj.guid);
		remove(this, 'mousedown.' + handleObj.guid);
	}

	jQuery.event.special.movestart = {
		setup: setup,
		teardown: teardown,
		add: addMethod,
		remove: removeMethod,

		_default: function(e) {
			var event, data;

			// If no move events were bound to any ancestors of this
			// target, high tail it out of here.
			if (!e._handled()) { return; }

			function update(time) {
				updateEvent(event, data.touch, data.timeStamp);
				trigger(e.target, event);
			}

			event = {
				target: e.target,
				startX: e.startX,
				startY: e.startY,
				pageX: e.pageX,
				pageY: e.pageY,
				distX: e.distX,
				distY: e.distY,
				deltaX: e.deltaX,
				deltaY: e.deltaY,
				velocityX: e.velocityX,
				velocityY: e.velocityY,
				timeStamp: e.timeStamp,
				identifier: e.identifier,
				targetTouches: e.targetTouches,
				finger: e.finger
			};

			data = {
				event: event,
				timer: new Timer(update),
				touch: undefined,
				timeStamp: undefined
			};

			if (e.identifier === undefined) {
				// We're dealing with a mouse
				// Stop clicks from propagating during a move
				add(e.target, 'click', returnFalse);
				add(document, mouseevents.move, activeMousemove, data);
				add(document, mouseevents.end, activeMouseend, data);
			}
			else {
				// We're dealing with a touch. Stop touchmove doing
				// anything defaulty.
				e._preventTouchmoveDefault();
				add(document, touchevents.move + '.' + e.identifier, activeTouchmove, data);
				add(document, touchevents.end + '.' + e.identifier, activeTouchend, data);
			}
		}
	};

	jQuery.event.special.move = {
		setup: function() {
			// Bind a noop to movestart. Why? It's the movestart
			// setup that decides whether other move events are fired.
			add(this, 'movestart.move', jQuery.noop);
		},

		teardown: function() {
			remove(this, 'movestart.move', jQuery.noop);
		}
	};

	jQuery.event.special.moveend = {
		setup: function() {
			// Bind a noop to movestart. Why? It's the movestart
			// setup that decides whether other move events are fired.
			add(this, 'movestart.moveend', jQuery.noop);
		},

		teardown: function() {
			remove(this, 'movestart.moveend', jQuery.noop);
		}
	};

	add(document, 'mousedown.move', mousedown);
	add(document, 'touchstart.move', touchstart);

	// Make jQuery copy touch event properties over to the jQuery event
	// object, if they are not already listed. But only do the ones we
	// really need. IE7/8 do not have Array#indexOf(), but nor do they
	// have touch events, so let's assume we can ignore them.
	if (typeof Array.prototype.indexOf === 'function') {
		(function(jQuery, undefined){
			var props = ["changedTouches", "targetTouches"],
			    l = props.length;

			while (l--) {
				if (jQuery.event.props.indexOf(props[l]) === -1) {
					jQuery.event.props.push(props[l]);
				}
			}
		})(jQuery);
	};
});

/* WYSIWYGModernizr 2.7.1 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-touch-mq-teststyles-prefixes
 */
;



window.WYSIWYGModernizr = (function( window, document, undefined ) {

    var version = '2.7.1',

    WYSIWYGModernizr = {},


    docElement = document.documentElement,

    mod = 'modernizr',
    modElem = document.createElement(mod),
    mStyle = modElem.style,

    inputElem  ,


    toString = {}.toString,

    prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),



    tests = {},
    inputs = {},
    attrs = {},

    classes = [],

    slice = classes.slice,

    featureName,


    injectElementWithStyles = function( rule, callback, nodes, testnames ) {

      var style, ret, node, docOverflow,
          div = document.createElement('div'),
                body = document.body,
                fakeBody = body || document.createElement('body');

      if ( parseInt(nodes, 10) ) {
                      while ( nodes-- ) {
              node = document.createElement('div');
              node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
              div.appendChild(node);
          }
      }

                style = ['&#173;','<style id="s', mod, '">', rule, '</style>'].join('');
      div.id = mod;
          (body ? div : fakeBody).innerHTML += style;
      fakeBody.appendChild(div);
      if ( !body ) {
                fakeBody.style.background = '';
                fakeBody.style.overflow = 'hidden';
          docOverflow = docElement.style.overflow;
          docElement.style.overflow = 'hidden';
          docElement.appendChild(fakeBody);
      }

      ret = callback(div, rule);
        if ( !body ) {
          fakeBody.parentNode.removeChild(fakeBody);
          docElement.style.overflow = docOverflow;
      } else {
          div.parentNode.removeChild(div);
      }

      return !!ret;

    },

    testMediaQuery = function( mq ) {

      var matchMedia = window.matchMedia || window.msMatchMedia;
      if ( matchMedia ) {
        return matchMedia(mq).matches;
      }

      var bool;

      injectElementWithStyles('@media ' + mq + ' { #' + mod + ' { position: absolute; } }', function( node ) {
        bool = (window.getComputedStyle ?
                  getComputedStyle(node, null) :
                  node.currentStyle)['position'] == 'absolute';
      });

      return bool;

     },
    _hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;

    if ( !is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined') ) {
      hasOwnProp = function (object, property) {
        return _hasOwnProperty.call(object, property);
      };
    }
    else {
      hasOwnProp = function (object, property) {
        return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
      };
    }


    if (!Function.prototype.bind) {
      Function.prototype.bind = function bind(that) {

        var target = this;

        if (typeof target != "function") {
            throw new TypeError();
        }

        var args = slice.call(arguments, 1),
            bound = function () {

            if (this instanceof bound) {

              var F = function(){};
              F.prototype = target.prototype;
              var self = new F();

              var result = target.apply(
                  self,
                  args.concat(slice.call(arguments))
              );
              if (Object(result) === result) {
                  return result;
              }
              return self;

            } else {

              return target.apply(
                  that,
                  args.concat(slice.call(arguments))
              );

            }

        };

        return bound;
      };
    }

    function setCss( str ) {
        mStyle.cssText = str;
    }

    function setCssAll( str1, str2 ) {
        return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
    }

    function is( obj, type ) {
        return typeof obj === type;
    }

    function contains( str, substr ) {
        return !!~('' + str).indexOf(substr);
    }


    function testDOMProps( props, obj, elem ) {
        for ( var i in props ) {
            var item = obj[props[i]];
            if ( item !== undefined) {

                            if (elem === false) return props[i];

                            if (is(item, 'function')){
                                return item.bind(elem || obj);
                }

                            return item;
            }
        }
        return false;
    }
    tests['touch'] = function() {
        var bool;

        if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
          bool = true;
        } else {
          injectElementWithStyles(['@media (',prefixes.join('touch-enabled),('),mod,')','{#modernizr{top:9px;position:absolute}}'].join(''), function( node ) {
            bool = node.offsetTop === 9;
          });
        }

        return bool;
    };
    for ( var feature in tests ) {
        if ( hasOwnProp(tests, feature) ) {
                                    featureName  = feature.toLowerCase();
            WYSIWYGModernizr[featureName] = tests[feature]();

            classes.push((WYSIWYGModernizr[featureName] ? '' : 'no-') + featureName);
        }
    }



     WYSIWYGModernizr.addTest = function ( feature, test ) {
       if ( typeof feature == 'object' ) {
         for ( var key in feature ) {
           if ( hasOwnProp( feature, key ) ) {
             WYSIWYGModernizr.addTest( key, feature[ key ] );
           }
         }
       } else {

         feature = feature.toLowerCase();

         if ( WYSIWYGModernizr[feature] !== undefined ) {
                                              return WYSIWYGModernizr;
         }

         test = typeof test == 'function' ? test() : test;

         if (typeof enableClasses !== "undefined" && enableClasses) {
           docElement.className += ' ' + (test ? '' : 'no-') + feature;
         }
         WYSIWYGModernizr[feature] = test;

       }

       return WYSIWYGModernizr;
     };


    setCss('');
    modElem = inputElem = null;


    WYSIWYGModernizr._version      = version;

    WYSIWYGModernizr._prefixes     = prefixes;

    WYSIWYGModernizr.mq            = testMediaQuery;
    WYSIWYGModernizr.testStyles    = injectElementWithStyles;
    return WYSIWYGModernizr;

})(this, this.document);
;
/*!
 * froala_editor v1.2.4 (http://editor.froala.com)
 * Copyright 2014-2014 Froala
 */
!function(a){a.Editable.DEFAULTS=a.extend(a.Editable.DEFAULTS,{allowedEmptyTags:["table","thead","tbody","tfoot","tr","th","td","a","span","iframe","div","object","param","embed","video","source","i"],selfClosingTags:["br","button","input","img","hr","param","!--","source","embed"]}),a.Editable.TAG_ORDER=["main","section","header","footer","article","details","legend","summary","table","thead","tbody","tfoot","tr","th","td","ul","ol","li","h1","h2","h3","h4","h5","h6","pre","blockquote","p","a","strong","em","strike","u","span","iframe","object","param","video","source","embed"],a.Editable.prototype.isClosingTag=function(a){return a?null!==a.match(/^<\/([a-zA-Z0-9]+)([^<]+)*>$/gi):!1},a.Editable.prototype.tagName=function(a){return a.replace(/^<\/?([a-zA-Z0-9-!]+)([^<]+)*>$/gi,"$1").toLowerCase()},a.Editable.SELF_CLOSING_AFTER=["source"],a.Editable.prototype.isSelfClosingTag=function(a){var b=this.tagName(a);return this.options.selfClosingTags.indexOf(b.toLowerCase())>=0},a.Editable.prototype.tagKey=function(a){return a.type+(a.attrs||[]).sort().join("|")},a.Editable.prototype.extendedKey=function(a){return this.tagKey(a)+JSON.stringify(a.style)},a.Editable.prototype.mergeStyle=function(b,c){for(var d={},e=a.Editable.uniq(a.merge(Object.keys(b.style),Object.keys(c.style))),f=0;f<e.length;f++){var g=e[f];d[g]=null!=c.style[g]?c.style[g]:b.style[g]}return d},a.Editable.prototype.mapDOM=function(b,c){void 0===c&&(c=!0);var d,e,f,g,h=0,i=0,j=[],k="",l=[],m={},n={},o=!1;c&&(b=b.replace(/\u200B/gi,""));for(var p=0;p<b.length;p++)if(d=b.charAt(p),"<"==d){var q=b.indexOf(">",p+1);if(-1!==q){if(i++,e=b.substring(p,q+1),g=this.tagName(e),this.isSelfClosingTag(e)){n[h]||(n[h]=[]),n[h].push({i:i,content:e}),p=q;continue}var r=null,s=e.replace(/^<[\S\s]* style=("[^"]+"|'[^']+')[\S\s]*>$/gi,"$1"),t={};if(s!=e&&(s=s.substring(1,s.length-1),matches=s.match(/([^:]*):([^:;]*;|$)/gi)))for(var u=0;u<matches.length;u++){var v=matches[u].split(":"),w=v.slice(1).join(":").trim();";"==w[w.length-1]&&(w=w.substr(0,w.length-1)),t[v[0].trim()]=w}r=e.match(/([\w\-]*)=("[^<>"]*"|'[^<>']*'|\w+)/gi);var x=null;if(r)for(var y=0;y<r.length;y++)0===r[y].indexOf("class=")&&(x=r[y]),0===r[y].indexOf("style=")&&r.splice(y,1);"b"==g&&(g="strong"),"i"==g&&(!x||x.indexOf("fa-")<0)&&o===!1&&(g="em");var z=this.isClosingTag(e);if("i"==g&&(o=z?!1:!0),z){var A=m[g].pop();h==j[A].start&&this.options.allowedEmptyTags.indexOf(g.toLowerCase())>=0&&(n[h]||(n[h]=[]),n[h].push({i:j[A].i,content:j[A].original}),n[h].push({i:i,content:e}))}else this.valid_nodes.indexOf(g.toUpperCase())>=0&&(r?r.push('data-fr-idx="'+p+'"'):r=['data-fr-idx="'+p+'"']),j.push({type:g,attrs:r,style:t,start:h,i:i,original:e}),m[g]||(m[g]=[]),m[g].push(j.length-1);p=q}}else{k+=d,l[h]={};for(g in m){f=m[g];for(var B=0;B<f.length;B++){e=j[f[B]];var C=this.tagKey(e);l[h][C]?l[h][C].style=this.mergeStyle(l[h][C],e):l[h][C]=a.extend({},e)}}h++}var D=[];for(p=0;p<l.length;p++){D[p]={};for(var E in l[p])D[p][this.extendedKey(l[p][E])]=l[p][E]}return{text:k,format:D,simple_tags:n}},a.Editable.prototype.froalaDOM=function(b){for(var c,d=[],e={},f=0;f<b.length;f++){var g=b[f];for(c in e)g[c]||(e[c].end=f,d.push(a.extend({},e[c])),delete e[c]);for(var h in g)e[h]||(g[h].start=f,e[h]=g[h])}for(c in e)e[c].end=b.length,d.push(e[c]);return d},a.Editable.prototype.sortNodes=function(b,c){return a.Editable.TAG_ORDER.indexOf(b.type)-a.Editable.TAG_ORDER.indexOf(c.type)},a.Editable.prototype.sortSimpleTags=function(a,b){return a.i-b.i},a.Editable.prototype.openTag=function(a){var b="<"+a.type;if(a.attrs){a.attrs.sort();for(var c=0;c<a.attrs.length;c++)b+=" "+a.attrs[c]}var d="";for(var e in a.style)null!=a.style[e]&&(d+=e.replace("_","-")+": "+a.style[e]+"; ");return""!==d&&(b+=' style="'+d.trim()+'"'),b+=">"},a.Editable.prototype.cleanOutput=function(b,c){var d,e,f,g,h=this.mapDOM(b,c),i=this.froalaDOM(h.format),j=h.simple_tags,k=h.text,l={};for(e=0;e<i.length;e++)d=i[e],l[d.start]||(l[d.start]=[]),l[d.start].push(d);var m={};for(b="",e=0;e<=k.length;e++){var n=[];if(m[e]){for(var o in m)if(o>e)for(f=0;f<m[o].length;f++){var p=m[o][f];p.start>=m[e][m[e].length-1].start&&a.Editable.TAG_ORDER.indexOf(p.type)>a.Editable.TAG_ORDER.indexOf(m[e][m[e].length-1].type)&&this.valid_nodes.indexOf(p.type.toUpperCase())<0&&(b+="</"+p.type+">",n.push(p),m[o].splice(f,1))}for(f=0;f<m[e].length;f++)b+="</"+m[e][f].type+">"}for(l[e]||(l[e]=[]);n.length>0;){var q=n.pop();q.start=e,l[e].push(q)}if(l[e])for(l[e]=l[e].sort(this.sortNodes),f=0;f<l[e].length;f++)d=l[e][f],m[d.end]||(m[d.end]=[]),m[d.end].push(d),b+=this.openTag(d);if(j[e])for(j[e]=j[e].sort(this.sortSimpleTags),g=0;g<j[e].length;g++)b+=j[e][g].content;e!=k.length&&(b+=k[e])}return b},a.Editable.prototype.cleanify=function(b,c){var d;if(this.isHTML)return!1;void 0===b&&(b=!0),this.no_verify=!0,this.saveSelectionByMarkers(),d=b?this.getSelectionElements():this.$element.find(this.valid_nodes.join(","));var e,f;if(d[0]!=this.$element.get(0))for(var g=0;g<d.length;g++){var h=a(d[g]);0===h.find(this.valid_nodes.join(",")).length&&(e=h.html(),f=this.cleanOutput(e,c),f!==e&&h.html(f))}else 0===this.$element.find(this.valid_nodes.join(",")).length&&(e=this.$element.html(),f=this.cleanOutput(e,c),f!==e&&this.$element.html(f));this.$element.find("[data-fr-idx]").removeAttr("data-fr-idx"),this.restoreSelectionByMarkers(),this.focus(),this.$element.find("span").attr("data-fr-verified",!0),this.no_verify=!1}}(jQuery);