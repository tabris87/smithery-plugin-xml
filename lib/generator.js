"use strict";
const xmlJS = require('xml-js');

function transformToJSObject(oAST) {
    switch (oAST.type) {
        case "declaration":
            return _declaration(oAST);
        case "element":
            return _element(oAST);
        case "text":
            return _text(oAST);
        default:
            return {};
    }
}

function _text(oAST) {
    var oXMLObj = {};
    oXMLObj.type = oAST.type;
    oXMLObj.text = oAST.value;
    return oXMLObj;
}

function _element(oAST) {
    var oXMLObj = {}
    oXMLObj.type = oAST.type;
    oXMLObj.name = oAST.name;
    if (oXMLObj.name.indexOf('_') > -1) {
        oXMLObj.name = oXMLObj.name.split('_')[0];
    }
    if (oAST.attributes) {
        oXMLObj.attributes = {};
        oAST.attributes.forEach(oAtt => oXMLObj.attributes[oAtt.name] = oAtt.value);
    }
    if (oAST.elements) {
        oXMLObj.elements = oAST.elements.map(oEl => transformToJSObject(oEl));
    }
    return oXMLObj;
}

function _declaration(oAST) {
    var oXMLObj = {
        declaration: {}
    };
    if (oAST.attributes) {
        oXMLObj.declaration.attributes = {};
        oAST.attributes.forEach((oAtt) => {
            oXMLObj.declaration.attributes[oAtt.name] = oAtt.value
        });
    }
    if (oAST.elements) {
        oXMLObj.elements = oAST.elements.map(oEl => transformToJSObject(oEl));
    }
    return oXMLObj;
}

function generate(oAST) {
    let oPrepared = transformToJSObject(oAST);
    let sXMLString = xmlJS.js2xml(oPrepared);
    return sXMLString;
}

module.exports = {
    generate: generate
}