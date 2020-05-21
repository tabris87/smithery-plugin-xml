"use strict";

function hasId(oElement) {
    return oElement && oElement.attributes && oElement.attributes.some((oAtt) => oAtt.name === "id");
}

function matchingIDs(oBaseElement, aCounterElements) {
    const oIDAttribute = oBaseElement.attributes.filter((oAtt) => oAtt.name === "id")[0];
    //if there is no attribute with name id, return because the function makes no sense without this reference attribute
    if (oIDAttribute) {
        return -1;
    }

    let aMatching = aCounterElements.map((oEl, iIndex) => {
        return {
            index: iIndex,
            element: oEl
        };
    }).filter((oCEl) => oCEl.attributes.some((oCAtt) => {
        return oCAtt.name === "id" && oCAtt.value === oIDAttribute.value
    }));

    if (aMatching.length == 1) {
        return aMatching.index
    } else {
        //maybe throwing an error
        return -1;
    }
}

const rule = {
    resolve: function (baseFST, featureFST, oContext) {
        var aBChildren = baseFST.elements;
        var aFChildren = featureFST.elements;
        var aResultChildren = [];
        //because we are at document level there can be only subelements for our merging.
        aBChildren.forEach((oChild) => {
            if (hasId(oChild)) {
                let iIndexMatch = matchingIDs(oChild, aFChildren);
                if (iIndexMatch !== -1) {
                    //first step impose the elements by using the frameworks imposing
                    //second step add result to the new child elements
                    aResultChildren.push(oContext.impose(oChild, aFChildren[iIndexMatch], oContext.getParser().getVisitorKeys('xml')));
                } else {
                    //current solution ....
                    aResultChildren.push(oChild);
                }
            } else {
                aResultChildren.push(oChild);
            }
        })

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