const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

// Configurazione completa del modulo
const MODULE_CONFIG = {
    paths: {
        dashboard: {
            root: 'pages/LavorazioniDashboard.js',
            components: [
                'components/DettagliScheda/components/tabs/LavorazioneTabs.js',
                'components/DettagliScheda/components/LavorazioneForm.js',
                'components/DettagliScheda/components/LavorazioneActions.js'
            ],
            hooks: [
                'components/DettagliScheda/hooks/useLavorazione.js',
                'components/DettagliScheda/hooks/useInformazioniGenerali.js'
            ]
        },
        dettaglio: {
            root: 'pages/DettaglioLavorazione.js',
            components: [
                'components/DettagliScheda/components/LavorazioneForm.js',
                'components/DettagliScheda/components/LavorazioneTabs.js'
            ],
            sections: {
                haccp: [
                    'components/DettagliScheda/components/sections/InformazioniGeneraliHACCP.js',
                    'components/DettagliScheda/components/sections/CotturaHACCP.js',
                    'components/DettagliScheda/components/sections/ConservazioneHACCP.js'
                ]
            },
            hooks: [
                'components/DettagliScheda/hooks/useLavorazione.js'
            ],
            context: [
                'components/DettagliScheda/context/TabContext.js'
            ]
        }
    },
    apiEndpoints: {
        base: '/api/dettaglio-lavorazioni',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        endpoints: [
            '/api/dettaglio-lavorazioni',
            '/api/dettaglio-lavorazioni/:id',
            '/api/dettaglio-lavorazioni/informazioni-generali',
            '/api/dettaglio-lavorazioni/:id/cottura',
            '/api/dettaglio-lavorazioni/:id/assemblaggio',
            '/api/dettaglio-lavorazioni/:id/abbattimento'
        ]
    }
};

// Aggiungiamo la funzione mancante
async function analyzeHooks(hookPaths) {
    console.log('\nAnalisi Hooks...');
    for (const hookPath of hookPaths) {
        const fullPath = path.join(process.cwd(), 'src', hookPath);
        
        if (!fs.existsSync(fullPath)) {
            console.log(`Hook non trovato: ${hookPath}`);
            continue;
        }

        console.log(`Analisi hook: ${hookPath}`);
        const content = fs.readFileSync(fullPath, 'utf8');
        const ast = parser.parse(content, {
            sourceType: 'module',
            plugins: ['jsx', 'typescript']
        });

        const analysis = {
            dependencies: analyzeDependencies(ast),
            stateUsage: analyzeStateManagement(ast),
            complexity: analyzeComplexity(ast)
        };

        moduleAnalysis.hooks.set(hookPath, analysis);
    }
}
// Struttura analisi completa
const moduleAnalysis = {
    components: new Map(),
    hooks: new Map(),
    context: new Map(),
    dataFlow: {
        apiCalls: new Set(),
        stateUpdates: new Map(),
        contextUsage: new Map()
    },
    dependencies: {
        internal: new Map(),
        external: new Set()
    },
    haccp: {
        sections: new Map(),
        validations: new Map()
    },
    metrics: {
        complexity: new Map(),
        stateUsage: new Map(),
        apiUsage: new Map()
    }
};

// Funzioni di analisi avanzate
function analyzeStateManagement(ast) {
    const stateUsage = {
        useState: [],
        useReducer: [],
        useContext: [],
        customHooks: []
    };

    traverse(ast, {
        CallExpression(path) {
            const callee = path.node.callee;
            if (callee.type === 'Identifier' && callee.name.startsWith('use')) {
                switch(callee.name) {
                    case 'useState':
                        stateUsage.useState.push(extractStateInfo(path));
                        break;
                    case 'useReducer':
                        stateUsage.useReducer.push(extractReducerInfo(path));
                        break;
                    case 'useContext':
                        stateUsage.useContext.push(extractContextInfo(path));
                        break;
                    default:
                        if (callee.name !== 'useEffect') {
                            stateUsage.customHooks.push(callee.name);
                        }
                }
            }
        }
    });

    return stateUsage;
}

function analyzeApiUsage(ast) {
    const apiCalls = [];

    traverse(ast, {
        CallExpression(path) {
            if (isAxiosCall(path.node)) {
                apiCalls.push(extractApiInfo(path.node));
            }
        }
    });

    return apiCalls;
}

function analyzeDependencies(ast) {
    const dependencies = {
        internal: new Set(),
        external: new Set()
    };

    traverse(ast, {
        ImportDeclaration(path) {
            const source = path.node.source.value;
            if (source.startsWith('.')) {
                dependencies.internal.add(source);
            } else {
                dependencies.external.add(source);
            }
        }
    });

    return dependencies;
}

// Funzioni helper
function extractStateInfo(path) {
    return {
        type: 'useState',
        initialValue: path.node.arguments[0]?.value,
        location: path.node.loc
    };
}

function extractReducerInfo(path) {
    return {
        type: 'useReducer',
        reducerFunction: path.node.arguments[0]?.name,
        initialState: path.node.arguments[1]?.value,
        location: path.node.loc
    };
}

function extractContextInfo(path) {
    return {
        type: 'useContext',
        contextName: path.node.arguments[0]?.name,
        location: path.node.loc
    };
}

function isAxiosCall(node) {
    return (
        node.callee.type === 'MemberExpression' &&
        node.callee.object.name === 'axios'
    );
}

function extractApiInfo(node) {
    return {
        method: node.callee.property.name,
        url: node.arguments[0]?.value,
        hasConfig: node.arguments.length > 1
    };
}

// Funzione principale di analisi
async function analyzeLavorazioniModule() {
    console.log('Avvio Analisi Completa Modulo Lavorazioni...');

    try {
        // Analisi componenti Dashboard
        console.log('\nAnalisi Componenti Dashboard...');
        await analyzeComponents(MODULE_CONFIG.paths.dashboard.components);

        // Analisi componenti Dettaglio
        console.log('\nAnalisi Componenti Dettaglio...');
        await analyzeComponents(MODULE_CONFIG.paths.dettaglio.components);

        // Analisi sezioni HACCP
        console.log('\nAnalisi Sezioni HACCP...');
        await analyzeComponents(MODULE_CONFIG.paths.dettaglio.sections.haccp);

        // Analisi Hooks
        console.log('\nAnalisi Custom Hooks...');
        await analyzeHooks([
            ...MODULE_CONFIG.paths.dashboard.hooks,
            ...MODULE_CONFIG.paths.dettaglio.hooks
        ]);

        // Analisi Context
        console.log('\nAnalisi Context...');
        await analyzeContext(MODULE_CONFIG.paths.dettaglio.context);

        // Generazione Report
        const report = generateDetailedReport();
        
        // Salvataggio Report
        saveReport(report);

        console.log('\nAnalisi completata con successo!');
        return report;

    } catch (error) {
        console.error('Errore durante l\'analisi:', error);
        throw error;
    }
}

// ... [continua nella prossima parte]
// Funzioni di analisi componenti
async function analyzeComponents(componentPaths) {
    for (const componentPath of componentPaths) {
        const fullPath = path.join(process.cwd(), 'src', componentPath);
        
        if (!fs.existsSync(fullPath)) {
            console.log(`Componente non trovato: ${componentPath}`);
            continue;
        }

        console.log(`Analisi di: ${componentPath}`);
        const content = fs.readFileSync(fullPath, 'utf8');
        const ast = parser.parse(content, {
            sourceType: 'module',
            plugins: ['jsx', 'typescript']
        });

        const analysis = {
            stateManagement: analyzeStateManagement(ast),
            apiCalls: analyzeApiUsage(ast),
            dependencies: analyzeDependencies(ast),
            complexity: analyzeComplexity(ast)
        };

        moduleAnalysis.components.set(componentPath, analysis);
    }
}

// Funzioni di analisi metriche
function analyzeComplexity(ast) {
    let complexity = {
        cyclomaticComplexity: 0,
        dependencies: 0,
        stateVariables: 0,
        props: new Set()
    };

    traverse(ast, {
        IfStatement() { complexity.cyclomaticComplexity++; },
        SwitchCase() { complexity.cyclomaticComplexity++; },
        LogicalExpression() { complexity.cyclomaticComplexity++; },
        ConditionalExpression() { complexity.cyclomaticComplexity++; },
        JSXAttribute(path) {
            complexity.props.add(path.node.name.name);
        }
    });

    return complexity;
}

// Generazione report dettagliato
function generateDetailedReport() {
    return {
        timestamp: new Date().toISOString(),
        summary: {
            totalComponents: moduleAnalysis.components.size,
            totalHooks: moduleAnalysis.hooks.size,
            totalContexts: moduleAnalysis.context.size
        },
        components: {
            dashboard: Array.from(moduleAnalysis.components.entries())
                .filter(([path]) => path.includes('Dashboard')),
            dettaglio: Array.from(moduleAnalysis.components.entries())
                .filter(([path]) => path.includes('Dettaglio')),
            haccp: Array.from(moduleAnalysis.components.entries())
                .filter(([path]) => path.includes('HACCP'))
        },
        stateManagement: {
            hooks: Array.from(moduleAnalysis.hooks.entries()),
            context: Array.from(moduleAnalysis.context.entries())
        },
        apiUsage: {
            endpoints: Array.from(moduleAnalysis.dataFlow.apiCalls),
            patterns: analyzeApiPatterns()
        },
        metrics: {
            complexity: Array.from(moduleAnalysis.metrics.complexity.entries()),
            performance: analyzePerformanceMetrics()
        },
        recommendations: generateRecommendations()
    };
}

function analyzeApiPatterns() {
    const patterns = {
        get: 0,
        post: 0,
        put: 0,
        delete: 0
    };

    moduleAnalysis.dataFlow.apiCalls.forEach(call => {
        patterns[call.method.toLowerCase()]++;
    });

    return patterns;
}

function analyzePerformanceMetrics() {
    return Array.from(moduleAnalysis.components.entries()).map(([path, analysis]) => ({
        component: path,
        stateComplexity: analysis.stateManagement.useState.length + 
                        analysis.stateManagement.useReducer.length,
        apiCalls: analysis.apiCalls.length,
        dependencies: analysis.dependencies.internal.size + 
                     analysis.dependencies.external.size
    }));
}

function generateRecommendations() {
    const recommendations = [];

    // Analisi complessità componenti
    moduleAnalysis.components.forEach((analysis, component) => {
        if (analysis.complexity.cyclomaticComplexity > 10) {
            recommendations.push({
                type: 'complexity',
                component,
                severity: 'high',
                message: 'Componente troppo complesso, considerare la suddivisione'
            });
        }
    });

    // Analisi pattern di stato
    moduleAnalysis.components.forEach((analysis, component) => {
        if (analysis.stateManagement.useState.length > 5) {
            recommendations.push({
                type: 'state',
                component,
                severity: 'medium',
                message: 'Considerare l\'uso di useReducer per gestione stato complessa'
            });
        }
    });

    return recommendations;
}

// Salvataggio report
function saveReport(report) {
    const outputDir = path.join(process.cwd(), 'analysis-reports');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    const reportPath = path.join(
        outputDir, 
        `lavorazioni-analysis-${Date.now()}.json`
    );
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\nReport salvato in: ${reportPath}`);
}

// Esportazione e esecuzione
module.exports = analyzeLavorazioniModule;

if (require.main === module) {
    analyzeLavorazioniModule()
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}

async function analyzeContext(contextPaths) {
    console.log('\nAnalisi Context...');
    for (const contextPath of contextPaths) {
        const fullPath = path.join(process.cwd(), 'src', contextPath);
        
        if (!fs.existsSync(fullPath)) {
            console.log(`Context non trovato: ${contextPath}`);
            continue;
        }

        console.log(`Analisi context: ${contextPath}`);
        const content = fs.readFileSync(fullPath, 'utf8');
        const ast = parser.parse(content, {
            sourceType: 'module',
            plugins: ['jsx', 'typescript']
        });

        const analysis = {
            providers: analyzeContextProviders(ast),
            consumers: analyzeContextConsumers(ast),
            defaultValue: extractContextDefaultValue(ast),
            dependencies: analyzeDependencies(ast)
        };

        moduleAnalysis.context.set(contextPath, analysis);
    }
}

function analyzeContextProviders(ast) {
    const providers = [];
    traverse(ast, {
        JSXElement(path) {
            if (path.node.openingElement.name.name?.includes('Provider')) {
                providers.push({
                    name: path.node.openingElement.name.name,
                    location: path.node.loc
                });
            }
        }
    });
    return providers;
}

function analyzeContextConsumers(ast) {
    const consumers = [];
    traverse(ast, {
        CallExpression(path) {
            if (path.node.callee.name === 'useContext') {
                consumers.push({
                    contextName: path.node.arguments[0]?.name,
                    location: path.node.loc
                });
            }
        }
    });
    return consumers;
}

function extractContextDefaultValue(ast) {
    let defaultValue = null;
    traverse(ast, {
        VariableDeclarator(path) {
            if (path.node.id.name?.includes('Context')) {
                defaultValue = path.node.init?.arguments?.[0];
            }
        }
    });
    return defaultValue;
}
