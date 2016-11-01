"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const events_1 = require('events');
const debug = require('debug');
const log = debug('fortune-session');
const get = debug('fortune-session:get');
const set = debug('fortune-session:set');
const del = debug('fortune-session:destroy');
module.exports = function fortuneSession(session, store, table) {
    log('initialization started');
    class FortuneSession {
        constructor(store, table = 'session') {
            this.store = store;
            this.table = table;
            log('create store');
            Object.assign(this, events_1.EventEmitter.prototype, session.Store.prototype);
        }
        destroy(sid, callback) {
            return __awaiter(this, void 0, void 0, function* () {
                del(`${sid}`);
                try {
                    let found = yield this.store.find(this.table, null, { match: { sid: sid } });
                    if (found && found.payload && found.payload.records && found.payload.records[0] && found.payload.records[0].id) {
                        del(`${sid} found`);
                        found = found.payload.records[0].id;
                        try {
                            yield this.store.delete(this.table, [found]);
                            del(`${sid} destroyed`);
                            callback(null);
                        }
                        catch (_) {
                            callback(_);
                        }
                    }
                    else {
                        del(`${sid} not found`);
                        callback(null);
                    }
                }
                catch (_) {
                    callback(_);
                }
            });
        }
        set(sid, data, callback) {
            return __awaiter(this, void 0, void 0, function* () {
                set(`${sid}`);
                try {
                    let found = yield this.store.find(this.table, null, { match: { sid: sid } });
                    if (found && found.payload && found.payload.records && found.payload.records[0] && found.payload.records[0].id) {
                        set(`${sid} found`);
                        found = found.payload.records[0].id;
                        try {
                            yield this.store.update(this.table, [{ id: found, replace: { data: data } }]);
                            set(`${sid} updated`);
                            callback(null);
                        }
                        catch (_) {
                            callback(_);
                        }
                    }
                    else {
                        set(`${sid} not found`);
                        try {
                            let created = yield this.store.create(this.table, [{ sid: sid, data: data }]);
                            set(`${sid} created`);
                            callback(null);
                        }
                        catch (_) {
                            callback(_);
                        }
                    }
                }
                catch (_) {
                    callback(_);
                }
            });
        }
        get(sid, callback) {
            return __awaiter(this, void 0, void 0, function* () {
                get(`${sid}`);
                try {
                    let found = yield this.store.find(this.table, null, { match: { sid: sid } });
                    if (found && found.payload && found.payload.records && found.payload.records[0] && found.payload.records[0].data) {
                        found = found.payload.records[0].data;
                        get(`${sid} found`);
                        callback(null, found);
                    }
                    else {
                        get(`${sid} not found`);
                        callback(null, null);
                    }
                }
                catch (_) {
                    callback(_, null);
                }
            });
        }
    }
    log('initialization finished');
    return new FortuneSession(store, table);
};
