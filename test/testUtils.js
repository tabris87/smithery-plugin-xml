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

module.exports = {
    imposing: imposing,
    formatResult: formatResult
}