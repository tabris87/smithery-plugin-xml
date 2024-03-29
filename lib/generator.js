"use strict";
const xmlJS = require('xml-js');
const {
    visitorKeys
} = require('./parser');

function transformToXMLjs(oAST) {
    let oReturnObject = {};
    if (oAST.type && (oAST.type === "element" || oAST.type === "comment")) {
        oReturnObject.type = oAST.type;
    }

    if (oAST.xmlType && oAST.xmlType !== "") {
        oReturnObject.name = oAST.xmlType;
    }

    if (oAST.type && (oAST.type === "comment")) {
        oReturnObject.comment = oAST.value;
    }

    function createSubParts(propertyKey, oObject, oParts) {
        if (oParts && Array.isArray(oParts)) {
            if (propertyKey === "elements") {
                oObject.elements = oParts.map((oPart) => transformToXMLjs(oPart));
            } else if (propertyKey === "attributes") {
                oObject.attributes = {};
                oParts.forEach((oAtt) => {
                    oObject.attributes[oAtt.identifier.name] = oAtt.value.value
                })
            }
        } else if (oParts && typeof oParts === "object") {
            if (oParts.type === "declaration") {
                oObject.declaration = transformToXMLjs(oParts);
            } else {
            }
        } else if (oParts) {
        }
    }

    var aVKeys = visitorKeys[oAST.type];
    aVKeys.forEach(sKey => {
        if (oAST[sKey]) {
            if (typeof oAST[sKey] !== "undefined") {
                createSubParts(sKey, oReturnObject, oAST[sKey]);
            }
        }
    });
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