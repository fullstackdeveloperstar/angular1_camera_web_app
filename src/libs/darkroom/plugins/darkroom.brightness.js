;(function(window, document, Darkroom, fabric) {
  'use strict';

  var Brightness = Darkroom.Transformation.extend({
    applyTransformation: function(canvas, image, next) {
      var brightnessFilter = new fabric.Image.filters.Brightness({
        brightness: this.options.adjust
      });

      image.filters.push(brightnessFilter);
      image.applyFilters(function () {
        canvas.renderAll();
        next();
      });
    }
  });

  Darkroom.plugins['brightness'] = Darkroom.Plugin.extend({

    initialize: function () {
      var buttonGroup = this.darkroom.toolbar.createButtonGroup();

      this.upButton = buttonGroup.createButton({
        image: 'brighten',
      });

      this.upButton.addEventListener('click', this.up.bind(this));
    },

    down: function down() {
      this.brighten(-20);
    },

    up: function up() {
      this.brighten(20);
    },

    brighten: function brighten(adjust) {
      this.darkroom.applyTransformation(
        new Brightness({ adjust: adjust })
      );
    },
  });
})(window, document, Darkroom, fabric);
