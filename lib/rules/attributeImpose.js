"use strict";

const rule = {
    resolve: function (baseFST, featureFST, oContext) {
        featureFST.parent = baseFST.parent;
        debugger;
        return featureFST;
    },
    target: ['xml'],
    selector: 'declaration>attribute, element>attribute'
};

module.exports = rule;