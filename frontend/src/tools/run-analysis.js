// src/tools/run-analysis.js
const runAnalysis = require('./analyze-project');
const path = require('path');

const srcDir = path.join(__dirname, '../');
console.log('Starting analysis from directory:', srcDir);

const report = runAnalysis(srcDir);

// Log dei risultati principali
console.log('\nAnalysis Results:');
console.log('Total Components:', report.componentCount);
console.log('Dependencies:', Array.from(report.dependencies));
if (report.circularDependencies) {
    console.log('Circular Dependencies:', report.circularDependencies);
}
