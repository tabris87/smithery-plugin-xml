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
        //#region First step merge the subelements together
        var aBChildren = baseFST.elements;
        var aFChildren = featureFST.elements;
        var aResultChildren = [];
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
                    index: ++Index
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
    selector: 'document[elements]'
};

module.exports = rule;