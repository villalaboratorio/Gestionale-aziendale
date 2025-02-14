import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as parser from '@babel/parser';
import _traverse from '@babel/traverse';
const traverse = _traverse.default;

/* global console */

const __filename = fileURLToPath(import.meta.url);

const DUPLICATED_COMPONENTS = {
    dashboard: {
        paths: [
            'components/DashboardLavorazioni',
            'features/lavorazioni/components/LavorazioniDashboard'
        ],
        name: 'Dashboard'
    },
    quickFilters: {
        paths: [
            'components/DashboardLavorazioni/components/QuickFilters',
            'features/lavorazioni/components/dashboard/QuickFilters'
        ],
        name: 'QuickFilters'
    },
    tabs: {
        paths: [
            'components/tabs/LavorazioneTabs',
            'components/DettagliScheda/components/tabs/LavorazioneTabs'
        ],
        name: 'Tabs'
    },
    hooks: {
        paths: [
            'components/DettagliScheda/hooks/useDashboardLavorazioni',
            'features/lavorazioni/hooks/useDashboardLavorazioni'
        ],
        name: 'Dashboard Hooks'
    }
};

function analyzeFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const imports = new Set();
    const usage = new Set();

    try {
        const ast = parser.parse(content, {
            sourceType: 'module',
            plugins: ['jsx', 'typescript']
        });

        traverse(ast, {
            ImportDeclaration(path) {
                imports.add(path.node.source.value);
            },
            JSXIdentifier(path) {
                usage.add(path.node.name);
            }
        });
    } catch (error) {
        console.log(`Errore nell'analisi di ${filePath}:`, error.message);
    }

    return { imports, usage };
}

function analyzeProject(projectRoot) {
    const results = new Map();
    
    function processDirectory(dir) {
        const files = fs.readdirSync(dir);
        
        files.forEach(file => {
            const fullPath = path.join(dir, file);
            
            if (fs.statSync(fullPath).isDirectory()) {
                processDirectory(fullPath);
            } else if (/\.(js|jsx|tsx)$/.test(file)) {
                const analysis = analyzeFile(fullPath);
                results.set(fullPath, analysis);
            }
        });
    }

    processDirectory(projectRoot);
    return results;
}

function generateReport(projectRoot, analysisResults) {
    Object.entries(DUPLICATED_COMPONENTS).forEach(([, component]) => {
        console.log(`\n=== Analisi ${component.name} ===`);
        
        component.paths.forEach(componentPath => {
            console.log(`\nComponente: ${componentPath}`);
            let usageCount = 0;
            
            analysisResults.forEach((analysis, file) => {
                const relativeFile = path.relative(projectRoot, file);
                if (analysis.imports.has(componentPath) || 
                    [...analysis.usage].some(u => componentPath.includes(u))) {
                    console.log(`- Utilizzato in: ${relativeFile}`);
                    usageCount++;
                }
            });
            
            console.log(`Totale utilizzi: ${usageCount}`);
        });
    });
}

export {
    analyzeProject,
    generateReport,
    analyzeFile,
    DUPLICATED_COMPONENTS
};

// Esecuzione diretta solo se il file viene eseguito direttamente
if (import.meta.url === `file://${__filename}`) {
    try {
        const projectRoot = path.resolve(path.dirname(__filename), '../frontend/src');
        const analysisResults = analyzeProject(projectRoot);
        generateReport(projectRoot, analysisResults);
    } catch (error) {
        console.error('Errore durante l\'analisi:', error);
    }
}
