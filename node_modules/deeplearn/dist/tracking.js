"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("./doc");
var environment_1 = require("./environment");
var Tracking = (function () {
    function Tracking() {
    }
    Tracking.tidy = function (nameOrFn, fn, gradMode) {
        if (gradMode === void 0) { gradMode = false; }
        if (fn == null) {
            if (typeof nameOrFn !== 'function') {
                throw new Error('Please provide a function to dl.tidy()');
            }
            fn = nameOrFn;
            nameOrFn = '';
        }
        else {
            if (typeof nameOrFn !== 'string' && !(nameOrFn instanceof String)) {
                throw new Error('When calling with two arguments, the first argument ' +
                    'to dl.tidy() must be a string');
            }
            if (typeof fn !== 'function') {
                throw new Error('When calling with two arguments, the 2nd argument ' +
                    'to dl.tidy() must be a function');
            }
        }
        environment_1.ENV.engine.startScope(gradMode);
        var result = fn();
        if (result instanceof Promise) {
            result.then(function (r) { return environment_1.ENV.engine.endScope(r, gradMode); });
            return result;
        }
        else {
            environment_1.ENV.engine.endScope(result, gradMode);
            return result;
        }
    };
    Tracking.keep = function (result) {
        return environment_1.ENV.engine.keep(result);
    };
    Tracking.time = function (f) {
        return environment_1.ENV.engine.time(f);
    };
    __decorate([
        doc_1.doc({ heading: 'Performance', subheading: 'Memory' })
    ], Tracking, "tidy", null);
    __decorate([
        doc_1.doc({ heading: 'Performance', subheading: 'Memory' })
    ], Tracking, "keep", null);
    __decorate([
        doc_1.doc({ heading: 'Performance', subheading: 'Timing' })
    ], Tracking, "time", null);
    return Tracking;
}());
exports.Tracking = Tracking;
