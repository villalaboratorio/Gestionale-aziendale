import React from 'react';
import {
  Container,
  Temperature,
  Unit
} from './TemperatureDisplay.styles';

interface TemperatureDisplayProps {
  temperature: number;
  minTemp?: number;
  maxTemp?: number;
  size?: 'small' | 'medium' | 'large';
}

export const TemperatureDisplay: React.FC<TemperatureDisplayProps> = ({
  temperature,
  minTemp = -30,  // Modificato per supportare abbattimento negativo
  maxTemp = 300,  // Modificato per supportare alte temperature di cottura
  size = 'medium'
}) => {
  return (
    <Container size={size}>
      <Temperature temp={temperature} min={minTemp} max={maxTemp}>
        {temperature.toFixed(1)}
      </Temperature>
      <Unit>°C</Unit>
    </Container>
  );
};
