# Gestionale Style Guide

## Indice
1. Sistema di Stile
2. Struttura Cartelle
3. Theme System
4. Componenti Comuni
5. Layout Patterns
6. Esempi Pratici

## 1. Sistema di Stile
Il sistema di stile del Gestionale è basato su:
- Styled Components per gli stili componente-specifici
- Theme provider per variabili globali
- Componenti comuni riutilizzabili

### Come Importare
```javascript
// Theme e Stili Globali
import theme from './styles/theme';
import GlobalStyles from './styles/globalStyles';

// Componenti Comuni
import Button from './components/common/Button/Button';
import Input from './components/common/Input/Input';
import { Card, CardHeader, CardBody } from './components/common/Card/Card';

Copy

Apply

2. Struttura Cartelle
frontend/
  ├── src/
  │   ├── components/
  │   │   ├── common/         # Componenti riutilizzabili
  │   │   │   ├── Alert/
  │   │   │   ├── Badge/
  │   │   │   ├── Button/
  │   │   │   ├── Card/
  │   │   │   ├── Input/
  │   │   │   ├── Modal/
  │   │   │   ├── Select/
  │   │   │   ├── Table/
  │   │   │   └── TabNav/
  │   ├── styles/
  │   │   ├── theme/
  │   │   │   ├── colors.js
  │   │   │   ├── typography.js
  │   │   │   ├── spacing.js
  │   │   │   └── shadows.js
  │   │   └── globalStyles.js

Copy

Apply

3. Theme System
Colors
colors: {
    primary: '#2563eb',
    secondary: '#64748b',
    success: '#16a34a',
    warning: '#eab308',
    danger: '#dc2626',
    text: {
        primary: '#1e293b',
        secondary: '#475569'
    },
    background: '#f8fafc',
    border: '#e2e8f0'
}

Copy

Apply

Typography
typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: {
        xs: '0.75rem',    // 12px
        sm: '0.875rem',   // 14px
        md: '1rem',       // 16px
        lg: '1.125rem',   // 18px
        xl: '1.25rem'     // 20px
    },
    fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700
    }
}

Copy

Apply

Spacing
spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem'        // 32px
}

Copy

Apply

4. Componenti Comuni
Button
<Button variant="primary">Primario</Button>
<Button variant="secondary">Secondario</Button>
<Button variant="outline">Outline</Button>
<Button variant="icon"><FaPlus /></Button>

Copy

Apply

Input
<Input 
    type="text"
    placeholder="Inserisci testo"
    value={value}
    onChange={handleChange}
/>

Copy

Apply

Select
<Select
    value={value}
    onChange={handleChange}
    options={[
        { value: '1', label: 'Opzione 1' },
        { value: '2', label: 'Opzione 2' }
    ]}
/>

Copy

Apply

Card
<Card>
    <CardHeader>Titolo Card</CardHeader>
    <CardBody>Contenuto Card</CardBody>
</Card>

Copy

Apply

5. Layout Patterns
Grid Layout
const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: ${({ theme }) => theme.spacing.md};
`;

Copy

Apply

Flex Layout
const Flex = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
`;

Copy

Apply

6. Esempi Pratici
StyleGuide.js
Il componente StyleGuide.js mostra tutti gli elementi UI disponibili:

Colori del brand
Tipografia
Componenti di navigazione
Form elements
Data display
Interactive components
StyleGuide.css
Definisce gli stili base e le classi utility:

.style-guide {
    background-color: #f8fafc;
    min-height: 100vh;
}

.section-title {
    color: #1e293b;
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
}

/* Altri stili di riferimento... */

Copy

Apply

Best Practices
Utilizzo dei Componenti
Usa sempre i componenti comuni quando disponibili
Mantieni la consistenza usando il theme system
Evita stili inline
Styled Components
// Corretto
const StyledComponent = styled.div`
    color: ${({ theme }) => theme.colors.primary};
    padding: ${({ theme }) => theme.spacing.md};
`;

// Da evitare
const BadComponent = styled.div`
    color: #2563eb;
    padding: 16px;
`;

Copy

Apply

Responsive Design
const ResponsiveComponent = styled.div`
    @media (max-width: 768px) {
        padding: ${({ theme }) => theme.spacing.sm};
    }
`;

Copy

Apply

Organizzazione del Codice
Mantieni i componenti styled in file separati
Usa nomi descrittivi per i componenti
Raggruppa gli stili correlati
Conclusione
Questa guida serve come riferimento per mantenere la consistenza nel design system del Gestionale. Per domande o chiarimenti, consultare il team di sviluppo.


Questo documento fornisce una guida completa e pratica pe