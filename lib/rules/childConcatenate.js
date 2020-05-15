"use strict";

const rule = {
    resolve: function (baseFST, featureFST, oContext) {
        var aChildElements = baseFST.elements.concat(featureFST.elements);

        var oDublicateIds = {};

        aChildElements.forEach((oEl, iIndex, aArr) => {
            if (oEl.attributes.some(oAtt => oAtt.identifier.name === "id")) {
                if (!oDublicateIds[oEl.name]) {
                    oDublicateIds[oEl.name] = [iIndex];
                } else {
                    oDublicateIds[oEl.name].push(iIndex)
                }
            }
            oEl.parent = featureFST;
        });

        Object.keys(oDublicateIds).map((sKey) => {
            var Numbers = oDublicateIds[sKey];

            aChildElements[Numbers[0]] = oContext.impose(aChildElements[Numbers[0]], aChildElements[Numbers[1]], oContext.getParser().getVisitorKeys('xml'));

            aChildElements = aChildElements.splice(Number[1], 1);
        })
        /* DEBUGGING */
        if (Object.keys(oDublicateIds).length > 0) debugger;
        /* DEBUGGING */

        featureFST.elements = aChildElements;
        featureFST.parent = baseFST.parent;
        return featureFST;
    },
    target: ['xml'],
    selector: 'document[elements], element[elements]'
};

module.exports = rule;