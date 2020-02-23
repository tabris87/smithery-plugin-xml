"use strict";

const rule = {
    resolve: function (baseFST, featureFST, oContext) {
        featureFST.parent = baseFST.parent;
        featureFST.elements = baseFST.elements.concat(featureFST.elements);
        featureFST.elements.forEach(oNode => oNode.parent = featureFST)

        return featureFST;
    },
    target: ['xml'],
    selector: 'element[elements]'
};

module.exports = rule;