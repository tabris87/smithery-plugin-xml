const {
    imposing,
    formatResult
} = require('./testUtils');

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