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
    const sBaseXML = '<note id="1" test="WAT" blub="temp"></note>';
    const sFeatureXML = '<note id="1" blub="absauf"></note>';
    const sResultXML = formatResult('<note id="1" test="WAT" blub="absauf"></note>');

    expect(imposing(sBaseXML, sFeatureXML)).toBe(sResultXML);
});

test('Element concatenate different type', () => {
    const sBaseXML = '<note><subnote></subnote></note>';
    const sFeatureXML = '<note><additionalnote></additionalnote></note>';
    const sResultXML = formatResult('<note><subnote></subnote><additionalnote></additionalnote></note>');

    expect(imposing(sBaseXML, sFeatureXML)).toBe(sResultXML);
});

test('Element concatenate same type', () => {
    const sBaseXML = '<note><subnote></subnote></note>';
    const sFeatureXML = '<note><subnote></subnote></note>';
    const sResultXML = formatResult('<note><subnote></subnote><subnote></subnote></note>');

    expect(imposing(sBaseXML, sFeatureXML)).toBe(sResultXML);
});

test('duo root elements, different type', () => {
    const sBaseXML = '<note><subnote></subnote></note><what></what>';
    const sFeatureXML = '<note><subnote></subnote></note><ever></ever>';
    const sResultXML = formatResult('<note><subnote></subnote><subnote></subnote></note><what></what><ever></ever>');

    expect(imposing(sBaseXML, sFeatureXML)).toBe(sResultXML);
});

test('duo root elements, same type', () => {
    const sBaseXML = '<note><subnote></subnote></note><what></what>';
    const sFeatureXML = '<note><subnote></subnote></note><what></what>';
    const sResultXML = formatResult('<note><subnote></subnote><subnote></subnote></note><what></what>');

    expect(imposing(sBaseXML, sFeatureXML)).toBe(sResultXML);
});

test('2nd level nesting', () => {
    const sBaseXML = '<note><subnote></subnote></note><what></what>';
    const sFeatureXML = '<note><subnote></subnote></note><what></what>';
    const sResultXML = formatResult('<note><subnote></subnote><subnote></subnote></note><what></what>');

    expect(imposing(sBaseXML, sFeatureXML)).toBe(sResultXML);
});