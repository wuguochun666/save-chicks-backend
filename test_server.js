console.log('Starting...');
process.chdir('C:/Users/32512/.qclaw/workspace-agent-28cec817/save-chicks-backend');
const initSqlJs = require('sql.js');
initSqlJs().then(function(SQL) {
    console.log('sql.js loaded OK');
    const db = new SQL.Database();
    db.run('CREATE TABLE test(id INT)');
    console.log('DB OK');
    process.exit(0);
}).catch(function(e) {
    console.log('sql.js FAIL:', e.message);
    process.exit(1);
});
