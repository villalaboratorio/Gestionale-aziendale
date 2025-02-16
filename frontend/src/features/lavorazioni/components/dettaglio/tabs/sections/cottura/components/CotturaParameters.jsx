import React, { useState, useEffect } from 'react';
import { Input, Select } from '../../../../../atoms';
import styled from 'styled-components';

const ParametriGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  padding: 16px;
`;

const ParametroField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const OriginalValue = styled.span`
  font-size: 0.8em;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-style: italic;
`;

const CotturaParameters = ({ 
  cottura, 
  ricetta, 
  isEditing, 
  tipiCottura, 
  onUpdate 
}) => {
  const [parametri, setParametri] = useState({
    tipoCottura: cottura?.tipoCottura || ricetta?.cotture?.[0]?.tipoCottura || '',
    temperaturaTarget: cottura?.temperaturaTarget || ricetta?.cotture?.[0]?.temperatura || '',
    tempoCottura: cottura?.tempoCottura || ricetta?.cotture?.[0]?.tempoCottura || '',
    addetto: cottura?.addetto || ''
  });

  useEffect(() => {
    setParametri({
      tipoCottura: cottura?.tipoCottura || ricetta?.cotture?.[0]?.tipoCottura || '',
      temperaturaTarget: cottura?.temperaturaTarget || ricetta?.cotture?.[0]?.temperatura || '',
      tempoCottura: cottura?.tempoCottura || ricetta?.cotture?.[0]?.tempoCottura || '',
      addetto: cottura?.addetto || ''
    });
  }, [cottura, ricetta]);

  const handleChange = (field, value) => {
    setParametri(prev => ({...prev, [field]: value}));
    onUpdate?.(field, value);
  };

  return (
    <ParametriGrid>
      <ParametroField>
        <Select
          label="Tipo Cottura"
          value={parametri.tipoCottura}
          onChange={(e) => handleChange('tipoCottura', e.target.value)}
          options={tipiCottura}
          disabled={!isEditing}
        />
        {parametri.tipoCottura !== ricetta?.cotture?.[0]?.tipoCottura && (
          <OriginalValue>
            Originale: {ricetta?.cotture?.[0]?.tipoCottura}
          </OriginalValue>
        )}
      </ParametroField>

      <ParametroField>
        <Input
          type="number"
          label="Temperatura Target (°C)"
          value={parametri.temperaturaTarget}
          onChange={(e) => handleChange('temperaturaTarget', e.target.value)}
          disabled={!isEditing}
          min={0}
          max={500}
        />
        {parametri.temperaturaTarget !== ricetta?.cotture?.[0]?.temperatura && (
          <OriginalValue>
            Originale: {ricetta?.cotture?.[0]?.temperatura}°C
          </OriginalValue>
        )}
      </ParametroField>

      <ParametroField>
        <Input
          type="number"
          label="Tempo Cottura (minuti)"
          value={parametri.tempoCottura}
          onChange={(e) => handleChange('tempoCottura', e.target.value)}
          disabled={!isEditing}
          min={0}
        />
        {parametri.tempoCottura !== ricetta?.cotture?.[0]?.tempoCottura && (
          <OriginalValue>
            Originale: {ricetta?.cotture?.[0]?.tempoCottura} min
          </OriginalValue>
        )}
      </ParametroField>

      <ParametroField>
        <Input
          type="text"
          label="Operatore"
          value={parametri.addetto}
          onChange={(e) => handleChange('addetto', e.target.value)}
          disabled={!isEditing}
        />
      </ParametroField>
    </ParametriGrid>
  );
};

export default React.memo(CotturaParameters);
