// Segédfüggvények armadája
function $(element){
    return document.querySelector(element);
}

function $$(element){
    return document.querySelectorAll(element);
}

function addEventHandler(elem, tipus, kezelo) {
    console.log("almafa");
    //Szabványos módszer
    if (elem.addEventListener) {
        elem.addEventListener(tipus, kezelo, false);
    }
    //Microsoft módszer
    else if (elem.attachEvent) {
        elem.attachEvent('on' + tipus, function () {
            return kezelo.call(elem, window.event);
        });
    }
    //Tradicionális módszer
    else {
        elem['on' + tipus] = kezelo;
    }
}