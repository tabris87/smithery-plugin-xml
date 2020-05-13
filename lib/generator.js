"use strict";
const xmlJS = require('xml-js');
const {
    visitorKeys
} = require('./parser');

function transformToXMLjs(oAST) {
    let oReturnObject = {};
    if (oAST.type && (oAST.type === "element")) {
        oReturnObject.type = oAST.type;
    }

    if (oAST.xmlType && oAST.xmlType !== "") {
        oReturnObject.name = oAST.xmlType;
    }

    function createSubParts(propertyKey, oObject, oParts) {
        if (oParts && Array.isArray(oParts)) {
            if (propertyKey === "elements") {
                oObject.elements = oParts.map((oPart) => transformToXMLjs(oPart));
            }
        } else if (oParts && typeof oParts === "object") {
            debugger;
        } else if (oParts) {
            debugger;
        }
    }

    var aVKeys = visitorKeys[oAST.type];
    aVKeys.forEach(sKey => {
        if (oAST[sKey]) {
            if (typeof oAST[sKey] !== "undefined" && oAST[sKey].length > 0) {
                createSubParts(sKey, oReturnObject, oAST[sKey]);
            }
        }
    });
    debugger;
    return oReturnObject;
}

function generate(oAST) {
    let oPrepared = transformToXMLjs(oAST);
    let sXMLString = xmlJS.js2xml(oPrepared);
    return sXMLString;
}

module.exports = {
    generate: generate
}