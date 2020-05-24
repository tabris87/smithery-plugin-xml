"use strict";

const util = require('../utils/subElementHandling');

const rule = {
    resolve: function (baseFST, featureFST, oContext) {
        //#region First step merge the subelements together
        let aResultChildren = util.mergeSubElements(baseFST.elements, featureFST.elements, oContext);
        aResultChildren.forEach((oResChild) => oResChild.parent = featureFST);
        featureFST.elements = aResultChildren;
        //#endregion

        //#region Second step impose the attributes just to ensure the new element is fully merged by the rules;
        var oAttributesNew = {};
        var iIndex = -1;

        baseFST.attributes.forEach((oAtt) => {
            oAttributesNew[oAtt.name] = {
                attributeBase: oAtt,
                index: ++iIndex
            }
        });

        featureFST.attributes.forEach((oAtt) => {
            if (!oAttributesNew[oAtt.name]) {
                oAttributesNew[oAtt.name] = {
                    attributeFeature: oAtt,
                    index: ++iIndex
                };
            } else {
                oAttributesNew[oAtt.name].attributeFeature = oAtt
            }
        });

        //create the merged attribute versions
        let aNewAttributes = Object.values(oAttributesNew).map((oAttPairing) => {
            if (!oAttPairing.attributeFeature) {
                oAttPairing.result = oAttPairing.attributeBase;
            } else if (!oAttPairing.attributeBase) {
                oAttPairing.result = oAttPairing.attributeFeature;
            } else {
                oAttPairing.result = oContext.impose(oAttPairing.attributeBase, oAttPairing.attributeFeature, oContext.getParser().getVisitorKeys('xml'));
            }
            //directly setup the new parent
            oAttPairing.result.parent = featureFST;
            return oAttPairing;
        }).sort((oAttP1, oAttP2) => {
            return oAttP1.index - oAttP2.index;
        }).map((oAttPairing) => oAttPairing.result);
        //#endregion
        featureFST.attributes = aNewAttributes;
        return featureFST;
    },
    target: ['xml'],
    selector: 'element[elements]'
};

module.exports = rule;