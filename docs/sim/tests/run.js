/* Copyright 2026 Nytel. MIT License. Runs every *.test.js in this folder: node testing/sim/tests/run.js [filter] */
'use strict';
const fs = require('fs'), path = require('path'), H = require('./harness.js');
const filter = process.argv[2];
fs.readdirSync(__dirname).filter(f => /\.test\.js$/.test(f) && (!filter || f.indexOf(filter) >= 0)).sort().forEach(f => require(path.join(__dirname, f)));
H.run().then(fail => process.exit(fail ? 1 : 0));
