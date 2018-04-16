/*! Baze Validation v1.2.0 | (c) @_bobbylie | http://git.io/bxW4 */

;(function ( $, window, document, undefined ) {

  var pluginName = 'bazeValidate';


  /**
   * Plugin's default settings
   * @config {string} classInvalid
   * @config {string} classValid
   * @config {string} classMsg
   * @config {string} msgEmpty
   * @config {string} msgEmail
   * @config {string} msgNumber
   */
  var defaults = {
    classInvalid  : 'input-invalid',
    classValid    : 'input-valid',
    classMsg      : 'msg-error',
    msgEmpty      : 'This field is required.',
    msgEmail      : 'Invalid email address.',
    msgNumber     : 'Input must be number.',
    msgExceedMin  : 'Minimum number is %s.',
    msgExceedMax  : 'Maximum number is %s.',
    onValidating  : null,
    onValidated   : null
  };


  /**
   * Represents the plugin instance
   * @param {DOM Object} element - The DOM Object
   * @param {Object} options - User options
   */
  function Plugin ( element, options ) {
    this.element    = element;
    this.$element   = $(element);
    this.settings   = $.extend( {}, defaults, options );
    this._defaults  = defaults;
    this._name      = pluginName;

    this.init();
  }

  Plugin.prototype.init = function () {
    var userOpts = this.settings;


    /**
     * Set novalidate attribute to prevent browser validation
     */
    this.element.setAttribute('novalidate', '');


    /**
     * set aria-required attribute to each required inputs
     */
    this.$element.find('[required]').attr('aria-required', 'true');


    /**
     * @param {jQuery object} form
     */
    var clearAllMessages = function ( form ) {
      var msgs = form.find('.' + userOpts.classMsg);

      $(msgs).remove();
    };


    /**
     * @param {jQuery object} field
     * @param {string} message
     */
    var addMessage = function ( field, message ) {
      var hasMsg  = field.next('.' + userOpts.classMsg),
          id      = getUID(),
          msg     = $(document.createElement('span'));


      /**
       * Remove existing message
       */
      if ( hasMsg.length ) {
        hasMsg.remove();
      }


      /**
       * Add aria-describedBy and aria-invalid to invalid field
       */
      field.attr({
        'aria-describedBy': id,
        'aria-invalid': 'true'
      });


      /**
       * Place message after input element
       */
      msg
        .addClass( userOpts.classMsg )
        .attr('id', id)
        .text( message )
        .insertAfter( field );
    };


    /**
     * @param {jQuery object} fields
     */
    var resetFields = function ( fields ) {
      fields
        .removeAttr('aria-invalid aria-describedBy')
        .removeClass( userOpts.classInvalid )
        .removeClass( userOpts.classValid );
    };


    /**
     * @param {jQuery object} fields
     * @return {boolean}
     */
    var validateEmpty = function ( fields ) {
      var allIsWell = true;

      fields.each( function () {
        var $field  = $(this),
            value   = $field.val();

        if ( this.hasAttribute('disabled') ) return;

        if ( value === '' || value === null || $.trim(value) === '' ) {
          $field.addClass( userOpts.classInvalid );
          addMessage( $field, userOpts.msgEmpty );

          allIsWell = false;
        } else {
          $field.addClass( userOpts.classValid );
        }
      });

      return allIsWell;
    };


    /**
     * @param {jQuery object} fields
     * @return {boolean}
     */
    var validateEmail = function ( fields ) {
      var allIsWell = true;

      for (var i = 0, j = fields.length; i < j; i++) {
        var el    = fields[i],
            $el   = $(el),
            value = el.value,

            /**
             * el.type return text in IE8, so use getAttribute instead
             */
            type  = el.getAttribute('type');

        if ( el.hasAttribute('disabled') ) continue;

        /**
         * Ignore if input type is not email
         */
        if ( type !== 'email' ) {
          continue;
        }

        if ( !isEmailValid( value ) ) {
          resetFields( $el );
          $el.addClass( userOpts.classInvalid );
          addMessage( $el, userOpts.msgEmail );

          allIsWell = false;
        }
      }

      return allIsWell;
    };


    /**
     * @param {jQuery object} fields
     * @return {boolean}
     */
    var validateNumeric = function ( fields ) {
      var allIsWell = true;

      for (var i = 0, j = fields.length; i < j; i++) {
        var el      = fields[i],
            $el     = $(el),
            value   = el.value,

            /**
             * el.type return text in IE8, so use getAttribute instead
             */
            type    = el.getAttribute('type'),
            min     = el.getAttribute('min') || false,
            max     = el.getAttribute('max') || false,
            nValue  = Math.floor(value),
            nMin    = Math.floor(min),
            nMax    = Math.floor(max);

        if ( el.hasAttribute('disabled') ) continue;

        /**
         * Ignore if input type is not number
         */
        if ( type !== 'number' ) {
          continue;
        }

        if ( !isNumber( value ) ) {
          resetFields( $el );
          $el.addClass( userOpts.classInvalid );
          addMessage( $el, userOpts.msgNumber );

          allIsWell = false;
        } else {

          if ( !!min && nValue < nMin ) {
            resetFields( $el );
            $el.addClass( userOpts.classInvalid );
            addMessage( $el, userOpts.msgExceedMin.replace(/\%s/g, min));

            allIsWell = false;
          } else if ( !!max && nValue > nMax ) {
            resetFields( $el );
            $el.addClass( userOpts.classInvalid );
            addMessage( $el, userOpts.msgExceedMax.replace(/\%s/g, max));

            allIsWell = false;
          }

        }
      }

      return allIsWell;
    };

    var validateFields = function ( evt ) {
      var $this   = $(this),
          fields  = $this.find('[required]'),
          isOK    = true,
          valid   = true,
          focusedField,
          msg;

      var checkValidationResult = function () {
        if ( !isOK ) {
          evt.preventDefault();
          $this.find('.' + userOpts.classInvalid).eq(0).focus();

          valid = false;
        }
      };

      resetFields( fields );
      clearAllMessages( $this );

      isOK = validateEmpty( fields );
      checkValidationResult();

      isOK = validateEmail( fields );
      checkValidationResult();

      isOK = validateNumeric( fields );
      checkValidationResult();

      if ( $.isFunction(userOpts.onValidating) ) {
        userOpts.onValidating(evt)
      }

      if ( valid && $.isFunction(userOpts.onValidated) ) {
        userOpts.onValidated(evt);
      }
    };


    /**
     * Attach validateFields on form submit
     */
    this.$element.on('submit', validateFields);


    /**
     * Remove validateFields from submit event
     */
    this.$element.on('bazevalidate.destroy', function () {
      var $this = $(this);

      $this
        .off('submit', validateFields)
        .removeAttr('novalidate');
      $.removeData( $this[0], 'plugin_' + pluginName );
    });
  };


  /**
   * @param {string} email
   * @return {boolean}
   */
  function isEmailValid( email ) {
    // http://badsyntax.co/post/javascript-email-validation-rfc822
    return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test( email );
  }


  /**
   * @param {string||number} n
   * @return {boolean}
   */
  function isNumber( n ) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }


  /**
   * @return {string} unique ID
   */
  function getUID() {
    var randInt = Math.floor((new Date()).getTime()) + Math.floor((Math.random() * 100));
    var UID = 'BV' + randInt;

    return UID;
  }

  $.fn[ pluginName ] = function ( options ) {
    this.each(function() {
      if ( !$.data( this, "plugin_" + pluginName ) ) {
        $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
      }
    });

    return this;
  };

})( jQuery, window, document );
