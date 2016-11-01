# fortune-session

**This module is alpha quality.**

Fortune.js-based session store for Express.

````bash
npm install --save fortune-session
````

````javascript
const fortune = require('fortune');
const store = fortune({
    session : {
        sid  : String,
        data : Object
    }
} /* Here you can pass your preferred adapter. */ );

const session        = require('express-session');
const fortuneSession = require('fortune-session');

app.use(session({
    store : fortuneSession(session, store)
}));
````

## `fortuneSession(session, store, [collection])`

 *  `session` — `express-session` module.
 *  `store` — Fortune.js store.
 *  `collection` — optional,
    refers to collection/table with compatible schema,
    defaults to `'session'`.

## Schema

Specified collection/table must have the following schema:

 *  `sid` — `String`, session id.
 *  `data` — `Object`, session data.

## TODO

 *  [ ] Write tests.

# License

MIT
