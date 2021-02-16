module.exports = {
    rules: require('./lib/rules'),
    parser: {
        fileEnding: "xml",
        parser: require('./lib/parser')
    },
    generator: {
        fileEnding: "xml",
        generator: require('./lib/generator')
    }
}