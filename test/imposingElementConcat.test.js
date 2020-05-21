const {
    imposing,
    formatResult
} = require('./testUtils');

test('Element concatenate documentLevel different type', () => {
    const sBaseXML =
        '<note/>';

    const sFeatureXML =
        '<newnote/>';

    const sResultXML = formatResult(
        '<note/>' +
        '<newnote/>'
    );

    expect(imposing(sBaseXML, sFeatureXML)).toBe(sResultXML);
});

test('Element concatenate documentLevel same type', () => {
    const sBaseXML =
        '<note/>';

    const sFeatureXML =
        '<note/>';

    const sResultXML = formatResult(
        '<note/>' +
        '<note/>'
    );

    expect(imposing(sBaseXML, sFeatureXML)).toBe(sResultXML);
});

test('Element concatenate different type', () => {
    const sBaseXML =
        '<note id="1">' +
        '   <subnote>' +
        '   </subnote>' +
        '</note>';
    const sFeatureXML =
        '<note id="1">' +
        '   <additionalnote>' +
        '   </additionalnote>' +
        '</note>';
    const sResultXML = formatResult(
        '<note id="1">' +
        '   <subnote>' +
        '   </subnote>' +
        '   <additionalnote>' +
        '   </additionalnote>' +
        '</note>');;
    expect(imposing(sBaseXML, sFeatureXML)).toBe(sResultXML);
});

test('Element concatenate same type', () => {
    const sBaseXML =
        '<note id="1">' +
        '   <subnote>' +
        '   </subnote>' +
        '</note>';
    const sFeatureXML =
        '<note id="1">' +
        '   <subnote>' +
        '   </subnote>' +
        '</note>';
    const sResultXML = formatResult(
        '<note id="1">' +
        '   <subnote>' +
        '   </subnote>' +
        '   <subnote>' +
        '   </subnote>' +
        '</note>');;
    expect(imposing(sBaseXML, sFeatureXML)).toBe(sResultXML);
});

test('duo root elements, different type', () => {
    const sBaseXML =
        '<note>' +
        '   <subnote>' +
        '   </subnote>' +
        '</note>' +
        '<what>' +
        '</what>';
    const sFeatureXML =
        '<note>' +
        '   <subnote>' +
        '   </subnote>' +
        '</note>' +
        '<ever>' +
        '</ever>';
    const sResultXML = formatResult(
        '<note>' +
        '   <subnote>' +
        '   </subnote>' +
        '</note>' +
        '<what>' +
        '</what>' +
        '<note>' +
        '   <subnote>' +
        '   </subnote>' +
        '</note>' +
        '<ever>' +
        '</ever>');

    expect(imposing(sBaseXML, sFeatureXML)).toBe(sResultXML);
});

test('duo root elements, same type', () => {
    const sBaseXML =
        '<note>' +
        '   <subnote>' +
        '   </subnote>' +
        '</note>' +
        '<what>' +
        '</what>';
    const sFeatureXML =
        '<note>' +
        '   <subnote>' +
        '   </subnote>' +
        '</note>' +
        '<what>' +
        '</what>';
    const sResultXML = formatResult(
        '<note>' +
        '   <subnote>' +
        '   </subnote>' +
        '</note>' +
        '<what>' +
        '</what>' +
        '<note>' +
        '   <subnote>' +
        '   </subnote>' +
        '</note>' +
        '<what>' +
        '</what>');
    expect(imposing(sBaseXML, sFeatureXML)).toBe(sResultXML);
});