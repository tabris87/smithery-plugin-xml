const generator = require('../lib/generator');
const parser = require('../lib/parser');
const aRules = require('../lib/rules');
//setup the heavy dependency chain
const ImposerCL = require('featureJS/lib/Imposer');
const ParserCL = require('featureJS/lib/Parser');
const GeneratorCL = require('featureJS/lib/Generator');
const RuleSetCL = require('featureJS/lib/RuleSet');

const oImposer = new ImposerCL({
    parser: new ParserCL(),
    generator: new GeneratorCL(),
    rules: new RuleSetCL()
})

oImposer.getParser().addParser(parser, 'xml');
oImposer.getGenerator().addGenerator(generator, 'xml');
oImposer.getRuleSet().addMultipleRules(aRules);

function imposing(sBaseXML, sFeatureXML) {
    const oASTBase = parser.parse(sBaseXML);
    const oASTFeature = parser.parse(sFeatureXML);
    const resultAST = oImposer.impose(oASTBase, oASTFeature, oImposer.getParser().getVisitorKeys('xml'));
    return oImposer.getGenerator().generate(resultAST, 'xml');
}

function formatResult(sResultString) {
    return generator.generate(parser.parse(sResultString));
}

test('Attribute overwrite declaration', () => {
    const sBaseXML = '<?xml version="1.0" encoding="utf-8"?>';
    const sFeatureXML = '<?xml version="2.0"?>';
    const sResultXML = formatResult('<?xml version="2.0" encoding="utf-8"?>');

    expect(imposing(sBaseXML, sFeatureXML)).toBe(sResultXML);
});

test('Attribute overwrite element', () => {
    const sBaseXML =
        '<note id="1" test="WAT" blub="temp">' +
        '</note>';
    const sFeatureXML =
        '<note id="1" blub="absauf">' +
        '</note>';
    const sResultXML = formatResult(
        '<note id="1" test="WAT" blub="absauf">' +
        '</note>');

    expect(imposing(sBaseXML, sFeatureXML)).toBe(sResultXML);
});

test('Attribute overwrite element nested', () => {
    const sBaseXML =
        '<note id="1">' +
        '   <test id="2" temp="blub"/>' +
        '</note>';
    const sFeatureXML =
        '<note id="1">' +
        '   <test id="2" temp="blub blub"/>' +
        '</note>';
    const sResultXML = formatResult(sFeatureXML);

    expect(imposing(sBaseXML, sFeatureXML)).toBe(sResultXML);
});