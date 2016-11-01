import { EventEmitter } from 'events';

import debug = require('debug');
const log = debug('fortune-session');
const get = debug('fortune-session:get');
const set = debug('fortune-session:set');
const del = debug('fortune-session:destroy');

export = function fortuneSession (session : any, store : any, table? : string) {
    log('initialization started');

    class FortuneSession {
        constructor (public store : any, public table = 'session') {
            log('create store');
            Object.assign(this, EventEmitter.prototype, session.Store.prototype);
        }

        async destroy (sid : string, callback : { (error : any) }) {
            del(`${sid}`);

            try {
                let found : any = await this.store.find(this.table, null, { match : { sid } });

                if (found && found.payload && found.payload.records && found.payload.records[ 0 ] && found.payload.records[ 0 ].id) {
                    del(`${sid} found`);
                    found = found.payload.records[ 0 ].id;

                    try {
                        await this.store.delete(this.table, [ found ]);
                        del(`${sid} destroyed`);
                        callback(null);
                    } catch (_) {
                        callback(_);
                    }
                } else {
                    del(`${sid} not found`);
                    callback(null);
                }
            } catch (_) {
                callback(_);
            }
        }

        async set (sid : string, data : any, callback : { (error : any) }) {
            set(`${sid}`);

            try {
                let found : any = await this.store.find(this.table, null, { match : { sid } });

                if (found && found.payload && found.payload.records && found.payload.records[ 0 ] && found.payload.records[ 0 ].id) {
                    set(`${sid} found`);
                    found = found.payload.records[ 0 ].id;

                    try {
                        await this.store.update(this.table, [ { id : found, replace : { data } } ]);
                        set(`${sid} updated`);
                        callback(null);
                    } catch (_) {
                        callback(_);
                    }
                } else {
                    set(`${sid} not found`);
                    try {
                        let created = await this.store.create(this.table, [ { sid, data } ]);
                        set(`${sid} created`);
                        callback(null);
                    } catch (_) {
                        callback(_);
                    }
                }
            } catch (_) {
                callback(_);
            }
        }

        async get (sid : string, callback : { (error : any, data : any) }) {
            get(`${sid}`);

            try {
                let found : any = await this.store.find(this.table, null, { match : { sid } });

                if (found && found.payload && found.payload.records && found.payload.records[ 0 ] && found.payload.records[ 0 ].data) {
                    found = found.payload.records[ 0 ].data;

                    get(`${sid} found`);
                    callback(null, found);
                } else {
                    get(`${sid} not found`);
                    callback(null, null)
                }
            } catch (_) {
                callback(_, null);
            }
        }
    }

    log('initialization finished');

    return new FortuneSession(store, table);
}
