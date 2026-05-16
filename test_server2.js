console.log('Starting server test...');
process.chdir('C:/Users/32512/.qclaw/workspace-agent-28cec817/save-chicks-backend');
try {
    require('./server.js');
    console.log('Server require OK - it should be running now');
} catch(e) {
    console.log('Error:', e.message);
    console.log('Stack:', e.stack);
}
