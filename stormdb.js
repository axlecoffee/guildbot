const StormDB = require('stormdb')
const engine = new StormDB.localFileEngine("./db.json", {
    async:true
});
const db = new StormDB(engine);

module.exports = db;