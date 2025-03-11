import React, { useState } from 'react';
import * as S from './Panel.styles';

interface PanelProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

const Panel: React.FC<PanelProps> = ({
  title,
  children,
  defaultExpanded = false,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };
  
  return (
    <S.PanelContainer className={className} $isExpanded={isExpanded}>
      <S.PanelHeader $isExpanded={isExpanded} onClick={toggleExpanded}>
        <S.PanelTitle>{title}</S.PanelTitle>
        <S.PanelIcon $isExpanded={isExpanded}>▼</S.PanelIcon>
      </S.PanelHeader>
      
      <S.PanelBody $isExpanded={isExpanded}>
        {children}
      </S.PanelBody>
    </S.PanelContainer>
  );
};

export default Panel;
