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

test('impose FreeStyle with table', () => {
    const sBaseXML =
        '<mvc:View' +
        '    id="firstPage"' +
        '    xmlns:mvc="sap.ui.core.mvc"' +
        '    controllerName="fop.template.ui5.controller.FirstPage"' +
        '    displayBlock="true">' +
        '</mvc:View>';
    const sFeatureXML =
        '<mvc:View' +
        '    id="firstPage"' +
        '    xmlns="sap.m">' +
        '    <Table>' +
        '        <columns>' +
        '            <Column>' +
        '                <Text text="Column"/>' +
        '            </Column>' +
        '        </columns>' +
        '        <items>' +
        '            <ColumnListItem>' +
        '                <cells>' +
        '                    <Text text="Text"/>' +
        '                </cells>' +
        '            </ColumnListItem>' +
        '        </items>' +
        '    </Table>' +
        '</mvc:View>';
    const sResultXML = formatResult(
        '<mvc:View' +
        '    id="firstPage"' +
        '    xmlns:mvc="sap.ui.core.mvc"' +
        '    controllerName="fop.template.ui5.controller.FirstPage"' +
        '    displayBlock="true"' +
        '    xmlns="sap.m">' +
        '    <Table>' +
        '        <columns>' +
        '            <Column>' +
        '                <Text text="Column"/>' +
        '            </Column>' +
        '        </columns>' +
        '        <items>' +
        '            <ColumnListItem>' +
        '                <cells>' +
        '                    <Text text="Text"/>' +
        '                </cells>' +
        '            </ColumnListItem>' +
        '        </items>' +
        '    </Table>' +
        '</mvc:View>');
    expect(imposing(sBaseXML, sFeatureXML)).toBe(sResultXML);
});