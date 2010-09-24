var Hash = require('traverse/hash');
var optimist = require('optimist');

exports.usageFail = function (assert) {
    var r = checkUsage(function () {
        return optimist('-x 10 -z 20'.split(' '))
            .usage('Usage: $0 -x NUM -y NUM')
            .demand(['x','y'])
            .argv;
    });
    assert.deepEqual(r, {
        result : { _ : [], x : 10, z : 20 },
        errors : [ 'Usage: ./usage -x NUM -y NUM', 'Missing arguments: y' ],
        logs : [],
        exit: true,
    });
};

exports.usagePass = function (assert) {
    var r = checkUsage(function () {
        return optimist('-x 10 -y 20'.split(' '))
            .usage('Usage: $0 -x NUM -y NUM')
            .demand(['x','y'])
            .argv;
    });
    assert.deepEqual(r, {
        result : { _ : [], x : 10, y : 20 },
        errors : [],
        logs : [],
        exit : false,
    });
}

function checkUsage (f) {
    var _process = process;
    process = Hash.copy(process);
    var exit = false;
    process.exit = function () { exit = true };
    process.env = Hash.merge(process.env, { _ : 'node' });
    process.argv = [ './usage' ];
    
    var _console = console;
    console = Hash.copy(console);
    var errors = [];
    var logs = [];
    console.error = function (msg) { errors.push(msg) };
    console.log = function (msg) { logs.push(msg) };
    
    var result = f();
    
    process = _process;
    console = _console;
    
    return {
        errors : errors,
        logs : logs,
        exit : exit,
        result : result,
    };
};