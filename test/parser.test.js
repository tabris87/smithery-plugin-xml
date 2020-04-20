const parser = require('../lib/parser');
const Node = require('featurecli-commons').types.Node;

const aTests = [{
    title: 'Declaration to Tree',
    xml: '<?xml version="1.0" encoding="utf-8"?>',
    result: function () {
        let node = new Node();
        node.type = "declaration";
        node.path = "declaration";
        node.name = "root";
        node.attributes = [
            (function () {
                let attribute = new Node();
                attribute.type = "attributes";
                attribute.path = "declaration.attributes";
                attribute.name = "version";
                attribute.value = "1.0";
                attribute.parent = node;
                return attribute;
            })(),
            (function () {
                let attribute = new Node();
                attribute.type = "attributes";
                attribute.path = "declaration.attributes";
                attribute.name = "encoding";
                attribute.value = "utf-8";
                attribute.parent = node;
                return attribute;
            })()
        ]
        node.parent = undefined;
        return node;
    }
}, {
    title: 'Single Node to Tree',
    xml: '<?xml version="1.0" encoding="utf-8"?><note/>',
    result: function () {
        let node = new Node();
        node.type = "declaration";
        node.path = "declaration";
        node.name = "root";
        node.parent = undefined;
        node.attributes = [
            (function () {
                let attribute = new Node();
                attribute.type = "attributes";
                attribute.path = "declaration.attributes";
                attribute.name = "version";
                attribute.value = "1.0";
                attribute.parent = node;
                return attribute;
            })(),
            (function () {
                let attribute = new Node();
                attribute.type = "attributes";
                attribute.path = "declaration.attributes";
                attribute.name = "encoding";
                attribute.value = "utf-8";
                attribute.parent = node;
                return attribute;
            })()
        ]

        node.elements = [
            (function () {
                let child = new Node();
                child.type = "element";
                child.path = "declaration.element";
                child.name = "note";
                child.parent = node;
                return child;
            })()
        ];
        return node;
    }
}]

aTests.forEach(function (oTest) {
    test(oTest.title, () => {
        expect(parser.parse(oTest.xml)).toStrictEqual(oTest.result());
    });
});