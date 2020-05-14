"use strict";
const xmlJS = require('xml-js');
const {
    visitorKeys
} = require('./parser');

function transformToXMLjs(oAST) {
    let oReturnObject = {};
    /* DEBUGGING */
    if(oAST.type && oAST.type === "attribute") debugger;
    /* DEBUGGING */
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
            } else if(propertyKey === "attributes") {
                oObject.attributes = {};
                oParts.forEach((oAtt)=>{ oObject.attributes[oAtt.identifier.name] = oAtt.value.value})
            }
        } else if (oParts && typeof oParts === "object") {
            if(oParts.type === "declaration") {
                oObject.declaration = transformToXMLjs(oParts);
            } else {
                debugger;
            }
        } else if (oParts) {
            debugger;
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