const parser = require('../../lib/parser');
const Node = require('featurecli-commons').types.Node;

const aTests = [{
        title: 'Empty XML',
        xml: '',
        result: function () {
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
    },
    {
        title: 'Single Node to Tree',
        xml: '<note/>',
        result: function () {
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
                return ele;
            })()];
            return node;
        }
    }, {
        title: 'Simple Declaration to Tree',
        xml: '<?xml?>',
        result: function () {
            let node = new Node();
            node.type = "document";
            node.xmlType = "";
            node.path = "document";
            node.name = "root";
            node.parent = undefined;
            node.declaration = (() => {
                var oDecl = new Node();
                oDecl.type = "declaration";
                oDecl.xmlType = "";
                oDecl.name = "root";
                oDecl.parent = node;
                oDecl.path = "document.declaration";
                oDecl.attributes = [];
                return oDecl;
            })();
            node.elements = [];
            return node;
        }
    }, {
        title: 'Declaration with attributes to Tree',
        xml: '<?xml version="1.0" encoding="utf-8"?>',
        result: function () {
            let node = new Node();
            node.type = "document";
            node.xmlType = "";
            node.path = "document";
            node.name = "root";
            node.parent = undefined;
            node.declaration = (
                () => {
                    var oDecl = new Node();
                    oDecl.type = "declaration";
                    oDecl.xmlType = "";
                    oDecl.name = "root";
                    oDecl.parent = node;
                    oDecl.path = "document.declaration";
                    oDecl.attributes = [
                        (() => {
                            var oAtt1 = new Node();
                            oAtt1.type = "attribute";
                            oAtt1.xmlType = "";
                            oAtt1.name = "version";
                            oAtt1.parent = oDecl;
                            oAtt1.path = "document.declaration.attribute";
                            oAtt1.identifier = (() => {
                                var oId1 = new Node();
                                oId1.type = "identifier";
                                oId1.xmlType = "";
                                oId1.name = "version";
                                oId1.parent = oAtt1;
                                oId1.path = "document.declaration.attribute.identifier";
                                return oId1;
                            })();
                            oAtt1.value = (() => {
                                var oValue1 = new Node();
                                oValue1.type = "value";
                                oValue1.xmlType = "";
                                oValue1.name = "version";
                                oValue1.parent = oAtt1;
                                oValue1.path = "document.declaration.attribute.value";
                                oValue1.value = "1.0";
                                return oValue1;
                            })()
                            return oAtt1;
                        })(),
                        (() => {
                            var oAtt2 = new Node();
                            oAtt2.type = "attribute";
                            oAtt2.xmlType = "";
                            oAtt2.name = "encoding";
                            oAtt2.parent = oDecl;
                            oAtt2.path = "document.declaration.attribute";
                            oAtt2.identifier = (() => {
                                var oId = new Node();
                                oId.type = "identifier";
                                oId.xmlType = "";
                                oId.name = "encoding";
                                oId.parent = oAtt2;
                                oId.path = "document.declaration.attribute.identifier";
                                return oId;
                            })();
                            oAtt2.value = (() => {
                                var oValue2 = new Node();
                                oValue2.type = "value";
                                oValue2.xmlType = "";
                                oValue2.name = "encoding";
                                oValue2.parent = oAtt2;
                                oValue2.path = "document.declaration.attribute.value";
                                oValue2.value = "utf-8";
                                return oValue2;
                            })()
                            return oAtt2;
                        })()
                    ]
                    return oDecl;
                })();
            node.elements = [];
            return node;
        }
    }
]

aTests.forEach(function (oTest) {
    test(oTest.title, () => {
        expect(parser.parse(oTest.xml)).toStrictEqual(oTest.result());
    });
});