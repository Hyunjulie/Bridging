"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var seedrandom = require("seedrandom");
var growing_ring_buffer_1 = require("../util/growing_ring_buffer");
var ring_buffer_1 = require("../util/ring_buffer");
function streamFromItems(items) {
    return new ArrayStream(items);
}
exports.streamFromItems = streamFromItems;
function streamFromIncrementing(start) {
    var i = start;
    return streamFromFunction(function () { return i++; });
}
exports.streamFromIncrementing = streamFromIncrementing;
function streamFromFunction(func) {
    return new FunctionCallStream(func);
}
exports.streamFromFunction = streamFromFunction;
function streamFromConcatenated(baseStreams) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, ChainedStream.create(baseStreams)];
        });
    });
}
exports.streamFromConcatenated = streamFromConcatenated;
function streamFromConcatenatedFunction(streamFunc, count) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, streamFromConcatenated(streamFromFunction(streamFunc).take(count))];
        });
    });
}
exports.streamFromConcatenatedFunction = streamFromConcatenatedFunction;
var DataStream = (function () {
    function DataStream() {
    }
    DataStream.prototype.collectRemaining = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, x;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = [];
                        return [4, this.next()];
                    case 1:
                        x = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(x != null)) return [3, 4];
                        result.push(x);
                        return [4, this.next()];
                    case 3:
                        x = _a.sent();
                        return [3, 2];
                    case 4: return [2, result];
                }
            });
        });
    };
    DataStream.prototype.resolveFully = function () {
        return __awaiter(this, void 0, void 0, function () {
            var x;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.next()];
                    case 1:
                        x = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(x != null)) return [3, 4];
                        return [4, this.next()];
                    case 3:
                        x = _a.sent();
                        return [3, 2];
                    case 4: return [2];
                }
            });
        });
    };
    DataStream.prototype.filter = function (predicate) {
        return new FilterStream(this, predicate);
    };
    DataStream.prototype.map = function (transform) {
        return new MapStream(this, transform);
    };
    DataStream.prototype.forEach = function (f) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.map(f).resolveFully()];
            });
        });
    };
    DataStream.prototype.batch = function (batchSize, smallLastBatch) {
        if (smallLastBatch === void 0) { smallLastBatch = true; }
        return new BatchStream(this, batchSize, smallLastBatch);
    };
    DataStream.prototype.concatenate = function (stream) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, ChainedStream.create(new ArrayStream([this, stream]))];
            });
        });
    };
    DataStream.prototype.take = function (count) {
        if (count < 0 || count == null)
            return this;
        return new TakeStream(this, count);
    };
    DataStream.prototype.skip = function (count) {
        if (count < 0 || count == null)
            return this;
        return new SkipStream(this, count);
    };
    DataStream.prototype.prefetch = function (bufferSize) {
        return new PrefetchStream(this, bufferSize);
    };
    DataStream.prototype.shuffle = function (windowSize, seed) {
        return new ShuffleStream(this, windowSize, seed);
    };
    return DataStream;
}());
exports.DataStream = DataStream;
var ArrayStream = (function (_super) {
    __extends(ArrayStream, _super);
    function ArrayStream(items) {
        var _this = _super.call(this) || this;
        _this.items = items;
        _this.trav = 0;
        return _this;
    }
    ArrayStream.prototype.next = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                if (this.trav >= this.items.length) {
                    return [2, undefined];
                }
                result = this.items[this.trav];
                this.trav++;
                return [2, result];
            });
        });
    };
    return ArrayStream;
}(DataStream));
var FunctionCallStream = (function (_super) {
    __extends(FunctionCallStream, _super);
    function FunctionCallStream(nextFn) {
        var _this = _super.call(this) || this;
        _this.nextFn = nextFn;
        return _this;
    }
    FunctionCallStream.prototype.next = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.nextFn()];
            });
        });
    };
    return FunctionCallStream;
}(DataStream));
var SkipStream = (function (_super) {
    __extends(SkipStream, _super);
    function SkipStream(upstream, maxCount) {
        var _this = _super.call(this) || this;
        _this.upstream = upstream;
        _this.maxCount = maxCount;
        _this.count = 0;
        return _this;
    }
    SkipStream.prototype.next = function () {
        return __awaiter(this, void 0, void 0, function () {
            var skipped;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.count++ < this.maxCount)) return [3, 2];
                        return [4, this.upstream.next()];
                    case 1:
                        skipped = _a.sent();
                        if (skipped == null) {
                            return [2, undefined];
                        }
                        return [3, 0];
                    case 2: return [2, this.upstream.next()];
                }
            });
        });
    };
    return SkipStream;
}(DataStream));
var TakeStream = (function (_super) {
    __extends(TakeStream, _super);
    function TakeStream(upstream, maxCount) {
        var _this = _super.call(this) || this;
        _this.upstream = upstream;
        _this.maxCount = maxCount;
        _this.count = 0;
        return _this;
    }
    TakeStream.prototype.next = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.count++ >= this.maxCount) {
                    return [2, undefined];
                }
                return [2, this.upstream.next()];
            });
        });
    };
    return TakeStream;
}(DataStream));
var QueueStream = (function (_super) {
    __extends(QueueStream, _super);
    function QueueStream() {
        var _this = _super.call(this) || this;
        _this.outputQueue = new growing_ring_buffer_1.GrowingRingBuffer();
        return _this;
    }
    QueueStream.prototype.next = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.outputQueue.length() === 0)) return [3, 2];
                        return [4, this.pump()];
                    case 1:
                        if (!(_a.sent())) {
                            return [2, undefined];
                        }
                        return [3, 0];
                    case 2: return [2, this.outputQueue.shift()];
                }
            });
        });
    };
    return QueueStream;
}(DataStream));
exports.QueueStream = QueueStream;
var BatchStream = (function (_super) {
    __extends(BatchStream, _super);
    function BatchStream(upstream, batchSize, enableSmallLastBatch) {
        if (enableSmallLastBatch === void 0) { enableSmallLastBatch = true; }
        var _this = _super.call(this) || this;
        _this.upstream = upstream;
        _this.batchSize = batchSize;
        _this.enableSmallLastBatch = enableSmallLastBatch;
        _this.currentBatch = [];
        return _this;
    }
    BatchStream.prototype.pump = function () {
        return __awaiter(this, void 0, void 0, function () {
            var item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.upstream.next()];
                    case 1:
                        item = _a.sent();
                        if (item == null) {
                            if (this.enableSmallLastBatch && this.currentBatch.length > 0) {
                                this.outputQueue.push(this.currentBatch);
                                this.currentBatch = [];
                                return [2, true];
                            }
                            return [2, false];
                        }
                        this.currentBatch.push(item);
                        if (this.currentBatch.length === this.batchSize) {
                            this.outputQueue.push(this.currentBatch);
                            this.currentBatch = [];
                        }
                        return [2, true];
                }
            });
        });
    };
    return BatchStream;
}(QueueStream));
var FilterStream = (function (_super) {
    __extends(FilterStream, _super);
    function FilterStream(upstream, predicate) {
        var _this = _super.call(this) || this;
        _this.upstream = upstream;
        _this.predicate = predicate;
        return _this;
    }
    FilterStream.prototype.pump = function () {
        return __awaiter(this, void 0, void 0, function () {
            var item, accept;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.upstream.next()];
                    case 1:
                        item = _a.sent();
                        if (item == null) {
                            return [2, false];
                        }
                        accept = this.predicate(item);
                        if (!(accept instanceof Promise)) return [3, 3];
                        return [4, accept];
                    case 2:
                        accept = _a.sent();
                        _a.label = 3;
                    case 3:
                        if (accept) {
                            this.outputQueue.push(item);
                        }
                        return [2, true];
                }
            });
        });
    };
    return FilterStream;
}(QueueStream));
var MapStream = (function (_super) {
    __extends(MapStream, _super);
    function MapStream(upstream, transform) {
        var _this = _super.call(this) || this;
        _this.upstream = upstream;
        _this.transform = transform;
        return _this;
    }
    MapStream.prototype.pump = function () {
        return __awaiter(this, void 0, void 0, function () {
            var item, mapped;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.upstream.next()];
                    case 1:
                        item = _a.sent();
                        if (item == null) {
                            return [2, false];
                        }
                        mapped = this.transform(item);
                        if (!(mapped instanceof Promise)) return [3, 3];
                        return [4, mapped];
                    case 2:
                        mapped = _a.sent();
                        _a.label = 3;
                    case 3:
                        this.outputQueue.push(mapped);
                        return [2, true];
                }
            });
        });
    };
    return MapStream;
}(QueueStream));
var ChainState = (function () {
    function ChainState(item, currentStream, moreStreams) {
        this.item = item;
        this.currentStream = currentStream;
        this.moreStreams = moreStreams;
    }
    return ChainState;
}());
function nextChainState(afterState) {
    return __awaiter(this, void 0, void 0, function () {
        var state, stream, item;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, afterState];
                case 1:
                    state = _a.sent();
                    stream = state.currentStream;
                    if (stream == null) {
                        return [2, new ChainState(undefined, undefined, state.moreStreams)];
                    }
                    return [4, stream.next()];
                case 2:
                    item = _a.sent();
                    if (!(item == null)) return [3, 4];
                    return [4, state.moreStreams.next()];
                case 3:
                    stream = _a.sent();
                    return [2, nextChainState(Promise.resolve(new ChainState(undefined, stream, state.moreStreams)))];
                case 4: return [2, new ChainState(item, stream, state.moreStreams)];
            }
        });
    });
}
var ChainedStream = (function (_super) {
    __extends(ChainedStream, _super);
    function ChainedStream() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChainedStream.create = function (baseStreams) {
        return __awaiter(this, void 0, void 0, function () {
            var c, currentStream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        c = new ChainedStream();
                        return [4, baseStreams.next()];
                    case 1:
                        currentStream = _a.sent();
                        c.currentPromise =
                            Promise.resolve(new ChainState(undefined, currentStream, baseStreams));
                        return [2, c];
                }
            });
        });
    };
    ChainedStream.prototype.next = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.currentPromise = nextChainState(this.currentPromise);
                        return [4, this.currentPromise];
                    case 1: return [2, (_a.sent()).item];
                }
            });
        });
    };
    return ChainedStream;
}(DataStream));
exports.ChainedStream = ChainedStream;
var PrefetchStream = (function (_super) {
    __extends(PrefetchStream, _super);
    function PrefetchStream(upstream, bufferSize) {
        var _this = _super.call(this) || this;
        _this.upstream = upstream;
        _this.bufferSize = bufferSize;
        _this.total = 0;
        _this.buffer = new ring_buffer_1.RingBuffer(bufferSize);
        return _this;
    }
    PrefetchStream.prototype.refill = function () {
        while (!this.buffer.isFull()) {
            var v = this.upstream.next();
            if (v == null) {
                return;
            }
            this.buffer.push(v);
        }
    };
    PrefetchStream.prototype.next = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.refill();
                        if (this.buffer.isEmpty())
                            return [2, undefined];
                        return [4, this.buffer.shift()];
                    case 1:
                        result = _a.sent();
                        this.refill();
                        return [2, result];
                }
            });
        });
    };
    return PrefetchStream;
}(DataStream));
exports.PrefetchStream = PrefetchStream;
var ShuffleStream = (function (_super) {
    __extends(ShuffleStream, _super);
    function ShuffleStream(upstream, windowSize, seed) {
        var _this = _super.call(this, upstream, windowSize) || this;
        _this.upstream = upstream;
        _this.windowSize = windowSize;
        _this.upstreamExhausted = false;
        _this.random = seedrandom(seed);
        return _this;
    }
    ShuffleStream.prototype.randomInt = function (max) {
        return Math.floor(this.random() * max);
    };
    ShuffleStream.prototype.chooseIndex = function () {
        return this.randomInt(this.buffer.length());
    };
    ShuffleStream.prototype.next = function () {
        return __awaiter(this, void 0, void 0, function () {
            var chosenIndex, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.upstreamExhausted) {
                            this.refill();
                        }
                        _a.label = 1;
                    case 1:
                        if (!!this.buffer.isEmpty()) return [3, 3];
                        chosenIndex = this.chooseIndex();
                        return [4, this.buffer.shuffleExcise(chosenIndex)];
                    case 2:
                        result = _a.sent();
                        if (result == null) {
                            this.upstreamExhausted = true;
                        }
                        else {
                            this.refill();
                            return [2, result];
                        }
                        return [3, 1];
                    case 3: return [2, undefined];
                }
            });
        });
    };
    return ShuffleStream;
}(PrefetchStream));
exports.ShuffleStream = ShuffleStream;
