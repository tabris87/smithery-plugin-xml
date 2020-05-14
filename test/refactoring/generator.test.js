const generator = require('../../lib/generator');
const Node = require('featurecli-commons').types.Node;

const aTests = [{
        title: 'Empty XML',
        xml: '',
        ast: function () {
            let node = new Node();
            node.name = "root";
            node.xmlType = "";
            node.type = "document";
            node.path = "document";
            node.parent = undefined;
            node.declaration = undefined;
            node.elements = [];
            return node;
        }
    }, {
        title: 'Single Node to Tree',
        xml: '<note/>',
        ast: function () {
            let node = new Node();
            node.name = "root";
            node.xmlType = "";
            node.type = "document";
            node.path = "document";
            node.parent = undefined;
            node.declaration = undefined;
            node.elements = [(function () {
                let ele = new Node();
                ele.name = "note";
                ele.parent = node;
                ele.xmlType = "note";
                ele.type = "element";
                ele.path = "document.element";
                ele.attributes = [];
                return ele;
            })()];
            return node;
        }
    },
    {
        title: 'Single Node with attributes to Tree',
        xml: '<note content="1" aria-hidden="true"/>',
        ast: function () {
            let node = new Node();
            node.name = "root";
            node.xmlType = "";
            node.type = "document";
            node.path = "document";
            node.parent = undefined;
            node.declaration = undefined;
            node.elements = [(function () {
                let ele = new Node();
                ele.name = "note";
                ele.parent = node;
                ele.xmlType = "note";
                ele.type = "element";
                ele.path = "document.element";
                ele.attributes = [
                    (() => {
                        var oAtt1 = new Node();
                        oAtt1.type = "attribute";
                        oAtt1.xmlType = "";
                        oAtt1.name = "content";
                        oAtt1.parent = ele;
                        oAtt1.path = "document.element.attribute";
                        oAtt1.identifier = (() => {
                            var oId1 = new Node();
                            oId1.type = "identifier";
                            oId1.xmlType = "";
                            oId1.name = "content";
                            oId1.parent = oAtt1;
                            oId1.path = "document.element.attribute.identifier";
                            return oId1;
                        })();
                        oAtt1.value = (() => {
                            var oValue1 = new Node();
                            oValue1.type = "value";
                            oValue1.xmlType = "";
                            oValue1.name = "content";
                            oValue1.parent = oAtt1;
                            oValue1.path = "document.element.attribute.value";
                            oValue1.value = "1";
                            return oValue1;
                        })()
                        return oAtt1;
                    })(),
                    (() => {
                        var oAtt2 = new Node();
                        oAtt2.type = "attribute";
                        oAtt2.xmlType = "";
                        oAtt2.name = "aria-hidden";
                        oAtt2.parent = ele;
                        oAtt2.path = "document.element.attribute";
                        oAtt2.identifier = (() => {
                            var oId = new Node();
                            oId.type = "identifier";
                            oId.xmlType = "";
                            oId.name = "aria-hidden";
                            oId.parent = oAtt2;
                            oId.path = "document.element.attribute.identifier";
                            return oId;
                        })();
                        oAtt2.value = (() => {
                            var oValue2 = new Node();
                            oValue2.type = "value";
                            oValue2.xmlType = "";
                            oValue2.name = "aria-hidden";
                            oValue2.parent = oAtt2;
                            oValue2.path = "document.element.attribute.value";
                            oValue2.value = "true";
                            return oValue2;
                        })()
                        return oAtt2;
                    })()
                ]
                return ele;
            })()];
            return node;
        }
    }
]

aTests.forEach(function (oTest) {
    test(oTest.title, () => {
        expect(generator.generate(oTest.ast())).toMatch(oTest.xml);
    });
});