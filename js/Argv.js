"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RG_ASSIGN = /=/;
var RG_PARAMETER = /^-{1,2}/;
var Argv = /** @class */ (function () {
    function Argv(parameters) {
        this.parameters = parameters;
        this.format = new ArgvFormatter(this);
    }
    Argv.prototype.get = function (parameter) {
        var index = this.parameters.indexOf(parameter);
        if (index < 0)
            return false;
        var io = this.parameters[index].split(RG_ASSIGN);
        if (io.length == 2)
            return io[1];
        var next_param = this.parameters[index + 1];
        if (typeof next_param == 'string' && !next_param.match(RG_PARAMETER)) {
            return next_param;
        }
        return true;
    };
    Argv.prototype.has = function (parameter) {
        return this.parameters.indexOf(parameter) > -1;
    };
    Argv.prototype.getIndex = function (parameter) {
        var regex = new RegExp(parameter);
        for (var i = 0; i < this.parameters.length; i++) {
            if (this.parameters[i].match(regex) != null) {
                return i;
            }
        }
        return -1;
    };
    Argv.prototype.at = function (index) {
        return this.parameters[index];
    };
    Argv.prototype.getValueAt = function (index) {
        var item = this.parameters[index];
        if (item == null)
            return null;
        if (!item.match(RG_PARAMETER))
            return item;
        return this.get(item);
    };
    Argv.register = function (id, parameters) {
        return this.ARGVs[id] = new Argv(parameters);
    };
    Argv.get = function (id) {
        return this.ARGVs[id];
    };
    Argv.ARGVs = {};
    return Argv;
}());
exports.Argv = Argv;
var ArgvFormatter = /** @class */ (function () {
    function ArgvFormatter(argv) {
        this.argv = argv;
    }
    ArgvFormatter.prototype.getString = function (parameter, defaultValue) {
        if (defaultValue === void 0) { defaultValue = ''; }
        if (this.argv.has(parameter)) {
            return this.argv.get(parameter);
        }
        return defaultValue;
    };
    ArgvFormatter.prototype.getInt = function (parameter, defaultValue) {
        if (defaultValue === void 0) { defaultValue = 0; }
        if (this.argv.has(parameter)) {
            var value = this.argv.get(parameter);
            return parseInt(value);
        }
        return defaultValue;
    };
    ArgvFormatter.prototype.getFloat = function (parameter, defaultValue) {
        if (defaultValue === void 0) { defaultValue = 0.0; }
        if (this.argv.has(parameter)) {
            var value = this.argv.get(parameter);
            return parseFloat(value);
        }
        return defaultValue;
    };
    ArgvFormatter.prototype.getBoolean = function (parameter, defaultValue) {
        if (defaultValue === void 0) { defaultValue = false; }
        if (this.argv.has(parameter)) {
            return this.argv.get(parameter);
        }
        return defaultValue;
    };
    ArgvFormatter.prototype.getJSON = function (parameter, defaultValue) {
        if (defaultValue === void 0) { defaultValue = null; }
        if (this.argv.has(parameter)) {
            var value = this.argv.get(parameter);
            return JSON.parse(value);
        }
        return defaultValue;
    };
    return ArgvFormatter;
}());
exports.ArgvFormatter = ArgvFormatter;
// Register process argv by default
if (process && Array.isArray(process.argv)) {
    Argv.register('process', process.argv.slice(2));
}
