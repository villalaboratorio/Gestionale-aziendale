// src/tools/complete-analysis.js
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

// Configurazione analisi
const CONFIG = {
    srcDir: path.join(__dirname, '../'),
    outputDir: path.join(__dirname, '../analysis-reports'),
    fileTypes: ['.js', '.jsx']
};

// Struttura dati per l'analisi
const projectAnalysis = {
    components: new Map(),
    routes: new Map(),
    dependencies: new Set(),
    hooks: new Map(),
    contexts: new Map(),
    performance: {
        heavyComponents: [],
        reRenders: [],
        stateUpdates: []
    },
    recommendations: []
};

// Analisi dei componenti
function analyzeComponents(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const ast = parser.parse(content, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript']
    });

    const componentInfo = {
        imports: [],
        exports: [],
        hooks: [],
        props: new Set(),
        stateUsage: [],
        contextUsage: []
    };

    traverse(ast, {
        ImportDeclaration(path) {
            componentInfo.imports.push({
                source: path.node.source.value,
                specifiers: path.node.specifiers.map(spec => spec.local.name)
            });
        },
        CallExpression(path) {
            if (path.node.callee.name?.startsWith('use')) {
                componentInfo.hooks.push(path.node.callee.name);
            }
        },
        JSXAttribute(path) {
            componentInfo.props.add(path.node.name.name);
        }
    });

    return componentInfo;
}

// Analisi delle route
function analyzeRoutes() {
    const routeFile = path.join(CONFIG.srcDir, 'App.js');
    const content = fs.readFileSync(routeFile, 'utf8');
    const ast = parser.parse(content, {
        sourceType: 'module',
        plugins: ['jsx']
    });

    const routes = [];

    traverse(ast, {
        JSXElement(path) {
            if (path.node.openingElement.name.name === 'Route') {
                const props = path.node.openingElement.attributes;
                routes.push({
                    path: props.find(p => p.name.name === 'path')?.value.value,
                    component: props.find(p => p.name.name === 'element')?.value
                });
            }
        }
    });

    return routes;
}

function calculateComponentSizes() {
    const componentSizes = [];
    
    projectAnalysis.components.forEach((info, filePath) => {
        const content = fs.readFileSync(filePath, 'utf8');
        componentSizes.push({
            path: filePath,
            size: content.length,
            imports: info.imports.length,
            hooks: info.hooks.length,
            props: info.props.size
        });
    });

    return componentSizes.sort((a, b) => b.size - a.size);
}

function analyzeStateComplexity() {
    const stateAnalysis = [];
    
    projectAnalysis.components.forEach((info, filePath) => {
        const stateHooks = info.hooks.filter(h => 
            h === 'useState' || h === 'useReducer'
        );
        
        if (stateHooks.length > 0) {
            stateAnalysis.push({
                component: path.basename(filePath),
                stateCount: stateHooks.length,
                complexity: calculateComplexity(info)
            });
        }
    });

    return stateAnalysis;
}

function analyzeRenderComplexity() {
    const renderAnalysis = [];
    
    projectAnalysis.components.forEach((info, filePath) => {
        renderAnalysis.push({
            component: path.basename(filePath),
            propsCount: info.props.size,
            hooksCount: info.hooks.length,
            complexity: calculateRenderScore(info)
        });
    });

    return renderAnalysis;
}

function calculateComplexity(componentInfo) {
    return {
        stateCount: componentInfo.hooks.filter(h => h === 'useState').length,
        effectCount: componentInfo.hooks.filter(h => h === 'useEffect').length,
        propsCount: componentInfo.props.size
    };
}

function calculateRenderScore(componentInfo) {
    const baseScore = componentInfo.props.size * 1.5;
    const hookScore = componentInfo.hooks.length * 2;
    return Math.round(baseScore + hookScore);
}

// Analisi delle performance
function analyzePerformance() {
    return {
        componentSizes: calculateComponentSizes(),
        stateComplexity: analyzeStateComplexity(),
        renderComplexity: analyzeRenderComplexity()
    };
}

// Generazione raccomandazioni
function generateRecommendations() {
    const recommendations = [];
    const THRESHOLDS = {
        componentSize: 500,  // lines of code
        stateComplexity: 5,  // number of state variables
        renderComplexity: 10 // complexity score
    };

    // Performance Recommendations
    const componentSizes = projectAnalysis.performance.componentSizes || [];
    const heavyComponents = componentSizes.filter(c => c.size > THRESHOLDS.componentSize);
    
    if (heavyComponents.length > 0) {
        recommendations.push({
            type: 'performance',
            severity: 'high',
            message: 'Large components detected',
            details: heavyComponents.map(c => ({
                component: path.basename(c.path),
                size: c.size,
                recommendation: 'Consider splitting into smaller components'
            }))
        });
    }

    // State Management Recommendations
    const stateAnalysis = projectAnalysis.performance.stateComplexity || [];
    const complexStateComponents = stateAnalysis.filter(c => 
        c.complexity.stateCount > THRESHOLDS.stateComplexity
    );

    if (complexStateComponents.length > 0) {
        recommendations.push({
            type: 'stateManagement',
            severity: 'medium',
            message: 'Complex state management detected',
            details: complexStateComponents.map(c => ({
                component: c.component,
                stateCount: c.complexity.stateCount,
                recommendation: 'Consider using useReducer or context'
            }))
        });
    }

    // Dependency Analysis
    const dependencies = Array.from(projectAnalysis.dependencies || new Set());
    if (dependencies.length > 20) {  // arbitrary threshold
        recommendations.push({
            type: 'dependencies',
            severity: 'low',
            message: 'High number of dependencies',
            recommendation: 'Review and consolidate dependencies where possible'
        });
    }

    return recommendations;
}

// Generazione report finale
function generateReport() {
    const report = {
        timestamp: new Date().toISOString(),
        summary: {
            totalComponents: projectAnalysis.components.size,
            totalRoutes: projectAnalysis.routes.size,
            totalHooks: projectAnalysis.hooks.size,
            totalContexts: projectAnalysis.contexts.size
        },
        details: {
            components: Array.from(projectAnalysis.components.entries()),
            routes: Array.from(projectAnalysis.routes.entries()),
            dependencies: Array.from(projectAnalysis.dependencies),
            performance: projectAnalysis.performance,
            recommendations: projectAnalysis.recommendations
        }
    };

    // Creazione directory se non esiste
    if (!fs.existsSync(CONFIG.outputDir)) {
        fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    }

    // Salvataggio report
    const reportPath = path.join(CONFIG.outputDir, `analysis-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log('\nAnalysis Complete!');
    console.log(`Report saved to: ${reportPath}`);
    
    return report;
}

// Funzione principale di esecuzione
async function runCompleteAnalysis() {
    console.log('Starting Complete Project Analysis...');

    try {
        // Analisi componenti e struttura
        console.log('\n1. Analyzing Components...');
        await analyzeProjectStructure();

        // Analisi route
        console.log('\n2. Analyzing Routes...');
        projectAnalysis.routes = analyzeRoutes();

        // Analisi performance
        console.log('\n3. Analyzing Performance...');
        projectAnalysis.performance = analyzePerformance();

        // Generazione raccomandazioni
        console.log('\n4. Generating Recommendations...');
        projectAnalysis.recommendations = generateRecommendations();

        // Generazione report finale
        return generateReport();
    } catch (error) {
        console.error('Analysis failed:', error);
        throw error;
    }
}

// Esportazione per uso da CLI o programmatico
module.exports = runCompleteAnalysis;

// Esecuzione diretta se chiamato da CLI
if (require.main === module) {
    runCompleteAnalysis()
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}

// Add this function before runCompleteAnalysis
async function analyzeProjectStructure() {
    const processDirectory = (dirPath) => {
        const files = fs.readdirSync(dirPath);
        
        files.forEach(file => {
            const fullPath = path.join(dirPath, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory() && !file.includes('node_modules')) {
                processDirectory(fullPath);
            } else if (CONFIG.fileTypes.some(type => file.endsWith(type))) {
                const componentInfo = analyzeComponents(fullPath);
                projectAnalysis.components.set(fullPath, componentInfo);
                
                // Collect dependencies
                componentInfo.imports.forEach(imp => {
                    projectAnalysis.dependencies.add(imp.source);
                });
                
                // Collect hooks usage
                componentInfo.hooks.forEach(hook => {
                    const count = projectAnalysis.hooks.get(hook) || 0;
                    projectAnalysis.hooks.set(hook, count + 1);
                });
            }
        });
    };

    processDirectory(CONFIG.srcDir);
    return projectAnalysis.components;
}
