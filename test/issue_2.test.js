const {
    imposing,
    formatResult
} = require('./testUtils');

test('impose FreeStyle with table', () => {
    const sBaseXML =
        '<mvc:View xmlns:mvc="sap.ui.core.mvc" controllerName="fop.template.ui5.controller.SecondPage" displayBlock="true">' +
        '</mvc:View>';
    const sFeatureXML =
        '<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:f="sap.f" xmlns:uxap="sap.uxap" controllerName="fop.template.ui5.controller.SecondPage" displayBlock="true" height="100%">' +
        '<f:DynamicPage id="dynamicPageId" headerExpanded="true" toggleHeaderOnTitleClick="true">' +
        '    <!-- DynamicPage Title -->' +
        '    <f:title>' +
        '        <f:DynamicPageTitle>' +
        '            <f:heading>' +
        '                <Title text="Header Title"/>' +
        '            </f:heading>' +
        '            <f:expandedContent>' +
        '                <Label text="This is a subheading"/>' +
        '            </f:expandedContent>' +
        '            <f:snappedContent>' +
        '                <Label text="This is a subheading"/>' +
        '            </f:snappedContent>' +
        '            <f:snappedTitleOnMobile>' +
        '                <Title text="Header Title On Phone"/>' +
        '            </f:snappedTitleOnMobile>' +
        '            <f:content>' +
        '            </f:content>' +
        '            <f:actions>' +
        '            </f:actions>' +
        '            <f:navigationActions>' +
        '            </f:navigationActions>' +
        '        </f:DynamicPageTitle>' +
        '    </f:title>' +
        '    <!-- DynamicPage Header -->' +
        '    <f:header>' +
        '        <f:DynamicPageHeader pinnable="true">' +
        '            <layout:HorizontalLayout allowWrapping="true">' +
        '                <layout:VerticalLayout class="sapUiMediumMarginEnd">' +
        '                    <ObjectAttribute title="Temp1" text="Text1"/>' +
        '                    <ObjectAttribute title="Temp2" text="Text2"/>' +
        '                </layout:VerticalLayout>' +
        '                <layout:VerticalLayout>' +
        '                    <ObjectNumber number="3" unit="WAT"/>' +
        '                    <ObjectStatus text="Temp4" state="Success" />' +
        '                </layout:VerticalLayout>' +
        '            </layout:HorizontalLayout>' +
        '        </f:DynamicPageHeader>' +
        '    </f:header>' +
        '    <f:content>' +
        '        <uxap:ObjectPageLayout showHeaderContent="false">' +
        '            <uxap:ObjectPageSection title="Section">' +
        '                <uxap:ObjectPageSubSection>' +
        '                    <Text text="Content"/>' +
        '                </uxap:ObjectPageSubSection>' +
        '            </uxap:ObjectPageSection>' +
        '        </uxap:ObjectPageLayout>' +
        '    </f:content>' +
        '    <!-- DynamicPage Footer -->' +
        '    <f:footer>' +
        '    </f:footer>' +
        '</f:DynamicPage>' +
        '</mvc:View>';
    const sResultXML = formatResult(sFeatureXML);

    expect(imposing(sBaseXML, sFeatureXML)).toBe(sResultXML);
});