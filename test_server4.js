process.chdir('C:/Users/32512/.qclaw/workspace-agent-28cec817/save-chicks-backend');
console.log('1: express...');
const express = require('express');
console.log('2: express loaded OK');
const app = express();
console.log('3: app created');
app.get('/', function(req, res) { res.json({ok: true}); });
console.log('4: route registered');
const PORT = 3001;
app.listen(PORT, '0.0.0.0', function() {
    console.log('5: listening on', PORT);
    process.exit(0);
});
console.log('6: listen() called');
