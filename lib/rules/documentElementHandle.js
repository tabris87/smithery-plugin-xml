"use strict";

const util = require('../utils/subElementHandling');

const rule = {
    resolve: function (baseFST, featureFST, oContext) {
        let aResultChildren = util.mergeSubElements(baseFST.elements, featureFST.elements, oContext);
        aResultChildren.forEach((oResChild) => oResChild.parent = featureFST);
        featureFST.elements = aResultChildren;

        if (baseFST.declaration && featureFST.declaration) {
            featureFST.declaration = oContext.impose(baseFST.declaration, featureFST.declaration, oContext.getParser().getVisitorKeys('xml'));
        }
        return featureFST;
    },
    target: ['xml'],
    selector: 'document[elements]'
};

module.exports = rule;