/* eslint-disable import/no-extraneous-dependencies */
import 'jquery-ui/ui/widgets/dialog';
import 'notifyjs-browser';
import View from './View';
import '../../common/binary-ui/dropdown';
import Elevio from '../../common/elevio';
import GTM from '../../common/gtm';
import { isProduction } from '../../common/utils/tools';
import { load } from './blockly/index';

$.ajaxSetup({
    cache: false,
});

// eslint-disable-next-line no-underscore-dangle
window._trackJs = {
    token      : '346262e7ffef497d85874322fff3bbf8',
    application: 'binary-bot',
    enabled    : isProduction(),
    console    : {
        display: false,
    },
};

// Should stay below the window._trackJs config
require('trackjs');

const view = new View();

view.initPromise.then(() => {
    $('.show-on-load').show();
    $('.barspinner').hide();
    $('#save-xml').hide();
    $('#load-xml').hide();
    // $('#toolbox').append('<button onClick=\'\'>Carregar Strack bot!</button>');

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            load(xhttp.responseText);
            setTimeout(() => {
                const x = document.getElementsByClassName('blocklyDraggable');
                for (let j = 0; j < 1000; j++) {
                    for (let i = 0; i < x.length; i++) {
                        x[i].remove();
                    }
                }
            }, 1000);
        }
    };
    xhttp.open('GET', 'https://guizox.github.io/strack-bot/xml/strack.xml', true);
    xhttp.send();

    window.dispatchEvent(new Event('resize'));
    Elevio.init();
    GTM.init();
    trackJs.configure({
        userId: $('.account-id')
            .first()
            .text(),
    });
});
