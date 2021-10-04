"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.actionize = exports.createDeRxJSReducer = void 0;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
// export function createDeRxJSReducer<K, T>: DeRxJSViewModel<K, T>;
function createDeRxJSReducer(_a) {
    var _this = this;
    var reducer = _a.reducer, effects = _a.effects, sideEffects = _a.sideEffects, incomingObservables = _a.incomingObservables, teardownFn = _a.teardownFn, initialState = _a.initialState;
    var actionsSubject = new rxjs_1.Subject();
    var actions$ = rxjs_1.merge.apply(void 0, Object.values(incomingObservables)).pipe((0, operators_1.share)({ connector: function () { return actionsSubject; } }));
    var state$ = actions$.pipe((0, operators_1.scan)(reducer, initialState), (0, operators_1.startWith)(initialState), (0, operators_1.distinctUntilChanged)());
    var subscriptions = new rxjs_1.Subscription();
    if (teardownFn) {
        var teardown = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, teardownFn()];
                    case 1:
                        _a.sent();
                        subscriptions.unsubscribe();
                        return [2 /*return*/];
                }
            });
        }); };
        teardown();
    }
    for (var _i = 0, effects_1 = effects; _i < effects_1.length; _i++) {
        var effect = effects_1[_i];
        subscriptions.add(effect(state$, actionsSubject)
            .pipe((0, operators_1.share)({ connector: function () { return actionsSubject; } }))
            .subscribe());
    }
    for (var _b = 0, sideEffects_1 = sideEffects; _b < sideEffects_1.length; _b++) {
        var sideEffect = sideEffects_1[_b];
        subscriptions.add(sideEffect(state$, actionsSubject).subscribe());
    }
    return state$;
}
exports.createDeRxJSReducer = createDeRxJSReducer;
// export type ActionCreator<K extends string, T extends any> = (
//   data?: T
// ) => Action<K, T>;
// export function createAction<T extends any, K extends string>(
//   type: K
// ): ActionCreator<K, T> {
//   const actionCreatorComposer = (x: K) => (data?: T) => ({
//     type: x,
//     ...(data || {}),
//   });
//   const actionCreator = actionCreatorComposer(type);
//   return actionCreator;
// }
function actionize(actionName) {
    return function (inc$) {
        return inc$.pipe((0, operators_1.map)(function (x) { return (__assign({ type: actionName }, x)); }));
    };
}
exports.actionize = actionize;
