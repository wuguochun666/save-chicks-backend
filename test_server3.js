process.chdir('C:/Users/32512/.qclaw/workspace-agent-28cec817/save-chicks-backend');
console.log('Step 1: requiring express...');
const express = require('express');
console.log('Step 2: requiring sql.js...');
const initSqlJs = require('sql.js');
console.log('Step 3: calling initSqlJs()...');
const SQL = initSqlJs; // sync fallback for node
console.log('Step 4: initted, creating db...');
const db = new SQL.Database();
console.log('Step 5: db created OK');
db.run('CREATE TABLE t(id INT)');
console.log('Step 6: done');
process.exit(0);
