



var PLMPages = {
    self: null,
    pageclass: 'plm-page',
    hash: null,
    pages: [],
    activepage: null,
    init: function () {
        self = this;
        //Get all the pages in the document
        self.pages = document.querySelectorAll('.' + self.pageclass);

        self.hash = window.location.hash != '' ? window.location.hash : '#' + self.pages[0].id;
        //Set window hash to the first page if there is no hash
        if (window.location.hash == '') {
            window.location.hash = self.hash;
        }
        //hide all the pages
        self.pages.forEach(function (page) { page.classList.add('plm-page-hidden') });
        //Make hash page visible
        self.makePageVisible(self.hash)

        window.setInterval(function () {
            if (window.location.hash != self.hash) {
                self.hash = window.location.hash != '' ? window.location.hash : self.hash;
                self.makePageVisible(self.hash);
            }
        }, 100);
    },

    makePageVisible: function (id) {
        if (id != '') {
            //hide the old page
            //var activepage = document.querySelector('.' + self.pageclass + '.plm-page-visible');

            var newActivepage = document.querySelector(id);

            if (self.activepage != null && newActivepage != null) {
                self.activepage.classList.add('plm-page-hidden');
                self.activepage.classList.remove('plm-page-visible');
            }

            if (newActivepage != null) {
                newActivepage.classList.remove('plm-page-hidden');
                newActivepage.classList.add('plm-page-visible');
                self.activepage = document.querySelector('.' + self.pageclass + '.plm-page-visible');
            }

            // var layout = document.querySelector('.mdl-layout');
            // var material = layout.MaterialLayout;
            //trick to hide the drawer
            var obofuscator = document.querySelector('.mdl-layout__obfuscator');
            if (obofuscator != null)
                if (obofuscator.classList.contains('is-visible'))
                    obofuscator.click();
            self.hash = window.location.hash;
        }

    }

}

PLMPages.init();
// var PLMPages = function PLMPages(){this.init();}
