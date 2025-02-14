// src/tools/analyze-project.js
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const projectAnalysis = {
    components: new Map(),
    imports: new Map(),
    exports: new Map(),
    unusedCode: new Set(),
    routes: new Map()
};

function analyzeFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const ast = parser.parse(content, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript']
    });

    const fileAnalysis = {
        imports: [],
        exports: [],
        components: [],
        hooks: [],
        props: new Set()
    };

    traverse(ast, {
        ImportDeclaration(path) {
            fileAnalysis.imports.push({
                source: path.node.source.value,
                specifiers: path.node.specifiers.map(spec => spec.local.name)
            });
        },
        ExportNamedDeclaration(path) {
            if (path.node.declaration) {
                // Gestisce diversi tipi di export
                if (path.node.declaration.id) {
                    // Per export di funzioni e classi
                    fileAnalysis.exports.push(path.node.declaration.id.name);
                } else if (path.node.declaration.declarations) {
                    // Per export di variabili
                    path.node.declaration.declarations.forEach(declaration => {
                        if (declaration.id) {
                            fileAnalysis.exports.push(declaration.id.name);
                        }
                    });
                }
            } else if (path.node.specifiers) {
                // Per export con specifiers
                path.node.specifiers.forEach(specifier => {
                    fileAnalysis.exports.push(specifier.exported.name);
                });
            }
        },
        FunctionDeclaration(path) {
            if (path.node.id && path.node.id.name.match(/^[A-Z]/)) {
                fileAnalysis.components.push(path.node.id.name);
            }
        },
        CallExpression(path) {
            if (path.node.callee.name && path.node.callee.name.startsWith('use')) {
                fileAnalysis.hooks.push(path.node.callee.name);
            }
        },
        ObjectPattern(path) {
            if (path.parent.type === 'FunctionDeclaration') {
                path.node.properties.forEach(prop => {
                    fileAnalysis.props.add(prop.key.name);
                });
            }
        }
    });

    return fileAnalysis;
}

function analyzeDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        
        if (fs.statSync(fullPath).isDirectory()) {
            if (!file.includes('node_modules')) {
                analyzeDirectory(fullPath);
            }
        } else if (file.match(/\.(js|jsx|tsx?)$/)) {
            const analysis = analyzeFile(fullPath);
            projectAnalysis.components.set(fullPath, analysis);
        }
    });
}

function generateReport() {
    const report = {
        componentCount: projectAnalysis.components.size,
        dependencies: new Set(),
        unusedComponents: [],
        routeStructure: {},
        componentHierarchy: {}
    };

    projectAnalysis.components.forEach((analysis, filePath) => {
        analysis.imports.forEach(imp => {
            report.dependencies.add(imp.source);
        });
    });

    // Analisi delle dipendenze circolari
    const circularDeps = findCircularDependencies();
    if (circularDeps.length > 0) {
        report.circularDependencies = circularDeps;
    }

    return report;
}

function findCircularDependencies() {
    const graph = new Map();
    const circular = [];

    projectAnalysis.components.forEach((analysis, file) => {
        graph.set(file, analysis.imports.map(imp => imp.source));
    });

    // Implementazione DFS per trovare cicli
    function detectCycle(node, visited, stack) {
        if (stack.includes(node)) {
            return stack.slice(stack.indexOf(node));
        }
        if (visited.has(node)) return null;

        visited.add(node);
        stack.push(node);

        const deps = graph.get(node) || [];
        for (const dep of deps) {
            const cycle = detectCycle(dep, visited, [...stack]);
            if (cycle) return cycle;
        }

        return null;
    }

    graph.forEach((_, node) => {
        const cycle = detectCycle(node, new Set(), []);
        if (cycle) circular.push(cycle);
    });

    return circular;
}

// Esecuzione dell'analisi
function runAnalysis(rootDir) {
    console.log('Starting project analysis...');
    analyzeDirectory(rootDir);
    
    const report = generateReport();
    
    // Output del report
    const reportPath = path.join(rootDir, 'project-analysis-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('Analysis complete. Report generated at:', reportPath);
    return report;
}

module.exports = runAnalysis;
