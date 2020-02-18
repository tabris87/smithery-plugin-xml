"use strict";

/* const testNode = new Node();
    testNode.type = "ObjectExpression";
    testNode.start = 8;
    testNode.end = 10;
    testNode.properties = [];
    testNode.parent = undefined;
    testNode.path = "ObjectExpression";
    testNode.name = "root"; */

var temp = {
    declaration: {
        attributes: {
            version: "1.0",
            encoding: "utf-8"
        }
    },
    elements: [{
        type: "element",
        name: "note",
        attributes: {
            importance: "high",
            logged: "true"
        },
        elements: [{
            type: "element",
            name: "title",
            elements: [{
                type: "text",
                text: "Happy"
            }]
        }, {
            type: "element",
            name: "todo",
            elements: [{
                type: "text",
                text: "Work"
            }]
        }, {
            type: "element",
            name: "todo",
            elements: [{
                type: "text",
                text: "Play"
            }]
        }]
    }]
}

const xmlJs = require('xml-js');
const Node = require('featurecli-commons').types.Node;
const mVisitorKeys = {
    declaration: ['elements', 'attributes'],
    element: ['elements', 'attributes'],
    text: [],
    attribute: []
}

function parse(sCodeString, oOptions) {
    var returnNode = new Node();

    var xmlObj = xmlJs.xml2js(sCodeString, {
        compacts: false
    });
    returnNode = enrichTree(xmlObj);
    return returnNode;
}

function enrichTree(xmlTree, oOptions) {
    let returnNode = new Node();

    if (oOptions && oOptions.parent) {
        if (!xmlTree.type) {
            returnNode.type = oOptions.type ? oOptions.type : "declaration";
        } else {
            returnNode.type = xmlTree.type;
        }
        returnNode.parent = oOptions.parent;
        returnNode.path = oOptions.parent.path !== "" ? oOptions.parent.path + "." + returnNode.type : returnNode.type;
        returnNode.name = xmlTree.name;
    } else {
        if (!xmlTree.type) {
            returnNode.type = "declaration";
        } else {
            returnNode.type = xmlTree.type;
        }
        returnNode.parent = undefined;
        returnNode.path = returnNode.type;
        returnNode.name = "root";
        oOptions = {};
    }

    debugger;
    if (xmlTree.attributes || xmlTree.declaration && xmlTree.declaration.attributes) {
        if (xmlTree.declaration && xmlTree.declaration.attributes) {
            xmlTree.attributes = xmlTree.declaration.attributes;
        }

        returnNode.attributes = Object.keys(xmlTree.attributes).map((attName) => {
            let oAttObj = {
                name: attName,
                value: xmlTree.attributes[attName],
                type: 'attributes'
            };
            return enrichTree(oAttObj, {
                parent: returnNode
            })
        });
    }

    if (xmlTree.elements) {
        returnNode.elements = xmlTree.elements.map((ele) => {
            return enrichTree(ele, {
                parent: returnNode
            })
        });
    } else {
        if (returnNode.type === "declaration" || returnNode.type === "element") {
            returnNode.elements = [];
        }
    }

    if (xmlTree.value) {
        returnNode.value = xmlTree.value;
    }

    if (xmlTree.text) {
        returnNode.value = xmlTree.text;
    }

    if (!xmlTree.name && oOptions.parent) {
        returnNode.name = oOptions.parent.name;
    }

    if (xmlTree.attributes && xmlTree.attributes.id) {
        returnNode.name = returnNode.name + '_' + xmlTree.attributes.id;
    }

    return returnNode;
}

module.exports = {
    parse: parse,
    visitorKeys: mVisitorKeys
}