"use strict";

function checkIDChild(oFST) {
    return oFST.elements && oFST.elements.filter(oChild => oChild.attributes && oChild.attributes.some(oAtt => oAtt.name === "id")).length > 0;
}

const rule = {
    resolve: function (baseFST, featureFST, oContext) {
        var aMergeChilds = [];
        var aPairs = [];
        if (checkIDChild(baseFST) && checkIDChild(featureFST)) {
            aPairs = featureFST.elements.map((oChild) => {
                var matches = baseFST.elements.filter((oBaseChild) => {
                    return oBaseChild.path === oChild.path && oBaseChild.name === oChild.name;
                });
                return matches.length === 1 ? {
                    base: matches[0],
                    feature: oChild
                } : undefined;
            }).filter(oPair => oPair);
        }

        //further impose each pair, because they can be correctly identified
        aPairs.forEach((oPair) => {
            aMergeChilds.push(oContext.impose(oPair.base, oPair.feature, oContext.getParser().getVisitorKeys('xml')));
        });

        aMergeChilds = aMergeChilds.concat(baseFST.elements.filter((oChild) => {
            return !aPairs.some((oPair) => {
                return oPair.base.name === oChild.name && oPair.base.path === oChild.path;
            });
        }));

        aMergeChilds = aMergeChilds.concat(featureFST.elements.filter((oChild) => {
            return !aPairs.some((oPair) => {
                return oPair.feature.name === oChild.name && oPair.feature.path === oChild.path;
            });
        }));

        featureFST.elements = aMergeChilds;
        featureFST.elements.forEach(el => el.parent = featureFST);
        featureFST.parent = baseFST.parent
        return featureFST;
    },
    target: ['xml'],
    selector: 'declaration[elements], element[elements]'
};

module.exports = rule;