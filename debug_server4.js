console.log('cwd:', process.cwd());
const initSqlJs = require('sql.js');
initSqlJs().then(function(SQL) {
    console.log('sql.js OK');
    const db = new SQL.Database();
    db.run('CREATE TABLE t(id INT)');
    console.log('DB OK');
    process.exit(0);
}).catch(function(e) {
    console.log('FAIL:', e.message);
    process.exit(1);
});
