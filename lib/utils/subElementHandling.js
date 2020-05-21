function hasId(oElement) {
    return oElement && oElement.attributes && oElement.attributes.some((oAtt) => oAtt.name === "id");
}

function matchingIDs(oBaseElement, aCounterElements) {
    const oIDAttribute = oBaseElement.attributes.filter((oAtt) => oAtt.name === "id")[0];
    //if there is no attribute with name id, return because the function makes no sense without this reference attribute
    if (!oIDAttribute) {
        return -1;
    }

    let aMatching = aCounterElements.map((oEl, iIndex) => {
        return {
            index: iIndex,
            element: oEl
        };
    }).filter((oCEl) => oCEl.element.attributes.some((oCAtt) => {
        return oCAtt.name === "id" && oCAtt.value.value === oIDAttribute.value.value;
    }));

    if (aMatching.length == 1) {
        return aMatching[0].index;
    } else {
        //maybe throwing an error
        return -1;
    }
}

function mergeSubElements(baseChilds, featureChilds, oContext) {
    var aBChildren = baseChilds;
    var aFChildren = featureChilds;
    var aResultChildren = [];
    debugger;
    //because we are at document level there can be only subelements for our merging.
    aBChildren.forEach((oChild) => {
        if (hasId(oChild)) {
            let iIndexMatch = matchingIDs(oChild, aFChildren);
            if (iIndexMatch !== -1) {
                //first step impose the elements by using the frameworks imposing
                //second step add result to the new child elements
                aResultChildren.push(oContext.impose(oChild, aFChildren[iIndexMatch], oContext.getParser().getVisitorKeys('xml')));
                aFChildren.splice(iIndexMatch, 1);
            } else {
                //current solution ....
                aResultChildren.push(oChild);
            }
        } else {
            aResultChildren.push(oChild);
        }
    })

    //aResultChildren.forEach((oResChild) => oResChild.parent = featureFST);
    //add all remaining feature children
    aResultChildren = aResultChildren.concat(aFChildren);
    return aResultChildren;
}

module.exports = {
    hasId: hasId,
    matchingIDs: matchingIDs,
    mergeSubElements: mergeSubElements
}