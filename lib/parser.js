"use strict";

const xmlJs = require('xml-js');
const Node = require('smithery-equipment').types.Node;
const mVisitorKeys = {
    document: ["declaration", "elements"],
    element: ["attributes", "elements"],
    declaration: ["attributes"],
    attribute: ["identifier", "value"],
    identifier: [],
    value: [],
    comment: []
}

function parse(sCodeString, oOptions) {
    var returnNode = undefined;

    var xmlObj = xmlJs.xml2js(sCodeString, {
        compacts: false
    });

    returnNode = enrichTree(xmlObj);
    setupName(returnNode);
    return returnNode;
}

function enrichTree(xmlTree, oOptions) {
    let returnNode = new Node();
    if (!xmlTree.type) {
        if (oOptions && oOptions.expectedType) {
            returnNode.type = oOptions.expectedType;
            returnNode.xmlType = "";
        } else {
            returnNode.type = "document";
            returnNode.xmlType = "";
        }
    } else {
        returnNode.type = xmlTree.type;
        if (xmlTree.type === "element") {
            returnNode.xmlType = xmlTree.name;
        } else {
            returnNode.xmlType = xmlTree.type;
        }
    }

    if (oOptions && oOptions.parent) {
        returnNode.parent = oOptions.parent;
        returnNode.path = oOptions.parent.path + '.' + returnNode.type;
    } else {
        returnNode.parent = undefined;
        returnNode.path = returnNode.type;
    }

    //currently just for identifier
    if (xmlTree.name && oOptions && oOptions.expectedType === "identifier") {
        returnNode.name = xmlTree.name
    }

    //currently just for value
    if (xmlTree.value && oOptions && oOptions.expectedType === "value") {
        returnNode.value = xmlTree.value
    }

    if (returnNode.type === "comment") {
        returnNode.value = xmlTree.comment;
    }

    function createSubParts(sVisKey) {
        switch (sVisKey) {
            case "declaration":
                if (xmlTree.declaration) {
                    returnNode[sVisKey] = enrichTree(xmlTree.declaration, {
                        parent: returnNode,
                        expectedType: "declaration"
                    });
                } else {
                    returnNode[sVisKey] = undefined;
                }
                break;
            case "elements":
                if (xmlTree.elements) {
                    returnNode[sVisKey] = xmlTree.elements.map((oEl) => {
                        return enrichTree(oEl, {
                            parent: returnNode
                        });
                    });
                } else {
                    returnNode[sVisKey] = [];
                }
                break;
            case "attributes":
                if (xmlTree.attributes) {
                    returnNode[sVisKey] = Object.keys(xmlTree.attributes).map((sKey) => {
                        return enrichTree({ //TODO
                            identifier: {
                                name: sKey
                            },
                            value: {
                                value: xmlTree.attributes[sKey]
                            }
                        }, {
                            parent: returnNode,
                            expectedType: "attribute"
                        });
                    });
                } else {
                    returnNode[sVisKey] = [];
                }
                break;
            case "identifier":
                returnNode[sVisKey] = enrichTree(xmlTree.identifier, {
                    parent: returnNode,
                    expectedType: "identifier"
                })
                break;
            case "value":
                returnNode[sVisKey] = enrichTree(xmlTree.value, {
                    parent: returnNode,
                    expectedType: "value"
                });
                break;
            default:
                returnNode[sVisKey] = [];
        }
    }

    if (returnNode.type === "comment") {
    }

    mVisitorKeys[returnNode.type].forEach(createSubParts);
    return returnNode;
}

function setupName(xmlNode) {
    if (!xmlNode.parent) {
        xmlNode.name = "root";
    } else {
        switch (xmlNode.type) {
            case "element":
                var aIdNodes = xmlNode.attributes.filter((att) => {
                    return att.identifier.name === "id";
                });
                if (xmlNode.attributes && aIdNodes.length > 0) {
                    xmlNode.name = aIdNodes[0].value.value;
                } else {
                    xmlNode.name = xmlNode.xmlType;
                }
                break;
            case "identifier":
                break;
            case "attribute":
                xmlNode.name = xmlNode.identifier.name;
                break;
            case "value":
                xmlNode.name = xmlNode.parent.identifier.name;
                break;
            default:
                //at this point we can assume there is a parent.
                xmlNode.name = xmlNode.parent.name;
        }
    }

    mVisitorKeys[xmlNode.type].forEach((sVisKey) => {
        //we can assume we have either an array or object to iterate
        if (Array.isArray(xmlNode[sVisKey])) {
            xmlNode[sVisKey].forEach((oEl) => {
                setupName(oEl);
            });
        } else {
            if (xmlNode[sVisKey]) {
                setupName(xmlNode[sVisKey]);
            }
        }
    })
}

module.exports = {
    parse: parse,
    visitorKeys: mVisitorKeys
}