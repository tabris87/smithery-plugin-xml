const generator = require('../lib/generator');
const Node = require('featurecli-commons').types.Node;

const aTests = [{
    title: 'Tree to Declaration',
    xml: '<?xml version="1.0" encoding="utf-8"?>',
    ast: function () {
        let node = new Node();
        node.type = "declaration";
        node.path = "declaration";
        node.name = "root";
        node.elements = [];
        node.parent = undefined;
        node.attributes = [
            (function () {
                let attribute = new Node();
                attribute.type = "attributes";
                attribute.path = "declaration.attributes";
                attribute.name = "version";
                attribute.value = "1.0";
                return attribute;
            })(),
            (function () {
                let attribute = new Node();
                attribute.type = "attributes";
                attribute.path = "declaration.attributes";
                attribute.name = "encoding";
                attribute.value = "utf-8";
                return attribute;
            })()
        ]
        return node;
    }
}, {
    title: 'Tree to Single Node',
    xml: '<?xml version="1.0" encoding="utf-8"?><note/>',
    ast: function () {
        let node = new Node();
        node.type = "declaration";
        node.path = "declaration";
        node.name = "root";
        node.parent = undefined;
        node.attributes = [
            (function () {
                let attribute = new Node();
                attribute.type = "attribute";
                attribute.path = "declaration.attribute";
                attribute.name = "version";
                attribute.value = "1.0";
                return attribute;
            })(),
            (function () {
                let attribute = new Node();
                attribute.type = "attribute";
                attribute.path = "declaration.attribute";
                attribute.name = "encoding";
                attribute.value = "utf-8";
                return attribute;
            })()
        ]
        node.elements = [
            (function () {
                let child = new Node();
                child.type = "element";
                child.path = "declaration.element";
                child.name = "note";
                child.elements = []
                child.parent = node;
                return child;
            })()
        ];
        return node;
    }
}]

aTests.forEach(function (oTest) {
    test(oTest.title, () => {
        expect(generator.generate(oTest.ast())).toMatch(oTest.xml);
    });
});