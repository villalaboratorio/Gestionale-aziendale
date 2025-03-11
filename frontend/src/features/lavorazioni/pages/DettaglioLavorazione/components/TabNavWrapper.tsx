import * as React from 'react';
import TabNavOriginal from '../../../../../components/common/TabNav/TabNav';

// Le proprietà che ci aspettiamo che TabNav accetti
interface TabNavProps {
  children: React.ReactNode;
  activeKey?: string;
  onSelect?: (key: string | null) => void;
  variant?: string;
  [key: string]: unknown; // Altre proprietà passate al componente (più sicuro di 'any')
}

// Definizione del tipo con proprietà statiche
interface TabNavComponent extends React.FC<TabNavProps> {
  Item: typeof TabNavOriginal.Item;
  Link: typeof TabNavOriginal.Link;
}

// Wrapper del componente con tipizzazione
const TabNav: React.FC<TabNavProps> = (props) => {
  return <TabNavOriginal {...props} />;
};

// Assegniamo le proprietà statiche e facciamo un cast esplicito
(TabNav as TabNavComponent).Item = TabNavOriginal.Item;
(TabNav as TabNavComponent).Link = TabNavOriginal.Link;

// Esportiamo con il tipo corretto
export default TabNav as TabNavComponent;
