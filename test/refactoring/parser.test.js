const parser = require('../../lib/parser');
const Node = require('featurecli-commons').types.Node;

const aTests = [{
        title: 'Empty XML',
        xml: '',
        result: function () {
            let node = new Node();
            node.name = "root";
            node.type = "declaration";
            node.path = "declaration";
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
            node.type = "element";
            node.path = "element";
            node.parent = undefined;
            return node;
        }
    }
]

aTests.forEach(function (oTest) {
    test(oTest.title, () => {
        expect(parser.parse(oTest.xml)).toStrictEqual(oTest.result());
    });
});