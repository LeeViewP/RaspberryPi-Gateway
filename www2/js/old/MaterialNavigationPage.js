/**
 * An example Class constructor for a MDL component. Note capital camel case.
 * Implements MDL component design pattern defined at:
 * https://github.com/jasonmayes/mdl-component-design-pattern
 * Which therefore works in conjunction with the ComponentHandler available in
 * global scope. This file is intentionally over commented / coded to show
 * potential example usage.
 * @param {HTMLElement} element The element that will be upgraded.
 */
function MaterialNavigationPage(element) {
  'use strict';

  // Example private variable. Uses underscore notation to denote private
  // variable.
  this.element_ = element;

  // Other private variables can go here as needed... For example:
  this.blah_ = 'something';

  // Initialize instance.
  this.init();
}


/**
 * Store constants in one place so they can be updated easily.
 * @enum {string | number}
 * @private
 */
MaterialNavigationPage.prototype.Constant_ = {
  /**
   * Name should be descriptive so no comment needed.
   */
  MEANING_OF_LIFE: 42,
  SPECIAL_WORD: 'HTML5'
};


/**
 * Store strings for class names defined by this component that are used in
 * JavaScript. This allows us to simply change it in one place should we
 * decide to modify at a later date.
 * @enum {string}
 * @private
 */
MaterialNavigationPage.prototype.CssClasses_ = {
  /**
   * Class names should use camelCase and be prefixed with the word "material"
   * to minimize conflict with 3rd party systems.
   */
  SHOW: 'navigation-page-visible',
  /**
   * Explain what the class is for.
   */
  HIDE: 'navigation-page-hidden',

  PAGE: 'navigation-page',

  UPGRADED_CLASS: 'is-upgraded',

  MDL_JS_RIPPLE_EFFECT: 'mdl-js-ripple-effect',
  MDL_RIPPLE_CONTAINER: 'mdl-tabs__ripple-container',
  MDL_RIPPLE: 'mdl-ripple',
  MDL_JS_RIPPLE_EFFECT_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events'
};


/**
 * Example of a private function, note the underscore and 2 blank lines
 * between function definition and previous lines of code.
 * @param {Event} event The event that fired.
 * @private
 */
MaterialNavigationPage.prototype.privateFunction_ = function (event) {
  'use strict';
  // Your code here...
  console.log(this.Constant_.SPECIAL_WORD + ' is cool!');
};


// Other private functions could be defined here. 2 lines space between each.
// Public functions can also be defined here, simply without underscores at
// end of function name as shown next...


/**
 * Initialize element.
 */
MaterialNavigationPage.prototype.init = function () {
  if (this.element_) {
  if (this.element_.classList.contains(this.CssClasses_.MDL_JS_RIPPLE_EFFECT)) {
    this.element_.classList.add(
      this.CssClasses_.MDL_JS_RIPPLE_EFFECT_IGNORE_EVENTS);
  }

  // Select element tabs, document panels
  // this.pages_ = this.element_.querySelectorAll('.' + this.CssClasses_.PAGE);
  

  // Create new tabs for each tab element
  // for (var i = 0; i < this.pages_.length; i++) {
  //   new MaterialNavigationPage(this.pages_[i], this);
  // }

  this.element_.classList.add(this.CssClasses_.UPGRADED_CLASS);

  }

  // In this example we will add an event listener to the element.
  // if (this.element_) {
  //   this.element_.addEventListener('click', this.privateFunction_.bind(this));
  // }
}



// The component registers itself. It can assume componentHandler is
// available in the global scope.
componentHandler.register({
  constructor: MaterialNavigationPage,
  classAsString: 'MaterialNavigationPage',
  cssClass: 'navigation-page'
});