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
            node.elements = [(function () {
                let ele = new Node();
                ele.name = "note";
                ele.parent = node;
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
                oDecl.xmlType = "declaration";
                oDecl.name = "declaration";
                oDecl.parent = node;
                oDecl.path = "document.declaration";
            })()
            return node;
        }
    }
]

aTests.forEach(function (oTest) {
    test(oTest.title, () => {
        expect(parser.parse(oTest.xml)).toStrictEqual(oTest.result());
    });
});