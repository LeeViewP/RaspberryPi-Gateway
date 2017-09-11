NodeList.prototype.contains = function (elem) {
    for (var i in this) {
        if ('#' + this[i].id == elem)
            return true;
    }
    return false;
}


function NavigationPage() {
    'use strict';
    this.init();
    return this;
}

NavigationPage.prototype.CssClasses_ = {
    /**
     * Class names should use camelCase and be prefixed with the word "material"
     * to minimize conflict with 3rd party systems.
     */
    SHOW: 'navigation-page-visible',
    HIDE: 'navigation-page-hidden',
    PAGE: 'navigation-page',

};

NavigationPage.prototype.hash = null;

NavigationPage.prototype.activepage_ = null;


NavigationPage.prototype.pages_ = [];


NavigationPage.prototype.locknavigation_  =false;

NavigationPage.prototype.init = function () {

    this.pages_ = document.querySelectorAll('.' + this.CssClasses_.PAGE);

    this.hash = window.location.hash != '' ? window.location.hash : '#' + this.pages_[0].id;
    //Set window hash to the first page if there is no hash
    if (window.location.hash == '') {
        window.location.hash = this.hash;
    }
    //hide all the pages
    this.pages_.forEach(function (page) {
        page.classList.add(this.CssClasses_.HIDE)
    }, this
    );

    //Make hash page visible
    this.makePageVisible(this.hash)

};

NavigationPage.prototype.navigate = function (id) {
    if (this.locknavigation_) return;
    if (id != '' && this.pages_.contains(id))
        window.location.hash = id;
};

NavigationPage.prototype.locknavigation = function (value) {
    this.locknavigation_ = value;
};


NavigationPage.prototype.hideDrawer_ = function () {
    //trick to hide the drawer
    var obofuscator = document.querySelector('.mdl-layout__obfuscator');
    if (obofuscator != null)
        if (obofuscator.classList.contains('is-visible'))
            obofuscator.click();
};


NavigationPage.prototype.makePageVisible = function (id) {

    if (id != '' && !this.locknavigation_) {
        var newActivepage = document.querySelector(id);

        if (this.activepage_ != null && newActivepage != null) {
            this.activepage_.classList.add(this.CssClasses_.HIDE);
            this.activepage_.classList.remove(this.CssClasses_.SHOW);
        }

        if (newActivepage != null) {
            newActivepage.classList.remove(this.CssClasses_.HIDE);
            newActivepage.classList.add(this.CssClasses_.SHOW);
            this.activepage_ = document.querySelector('.' + this.CssClasses_.PAGE + '.' + this.CssClasses_.SHOW);
        }
        this.hideDrawer_();
        this.hash = window.location.hash;
    }
    else
     window.location.hash = this.hash;

}

var navigationPage = new NavigationPage();

window.setInterval(function () {
    if (window.location.hash != navigationPage.hash) {
        navigationPage.hash = window.location.hash != '' && !navigationPage.locknavigation_ ? window.location.hash : navigationPage.hash;
        navigationPage.makePageVisible(navigationPage.hash);
    }
}, 100);