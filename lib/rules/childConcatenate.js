"use strict";

const rule = {
    resolve: function (baseFST, featureFST, oContext) {
        if (baseFST.attributes.some((oAtt) => oAtt.identifier.name === "id")) {
            return oContext.impose(baseFST, featureFST, oContext.getParser().getVisitorKeys('xml'));
        } else {
            return [baseFST, featureFST];
        }
    },
    target: ['xml'],
    selector: 'document>element, element>element'
};

module.exports = rule;