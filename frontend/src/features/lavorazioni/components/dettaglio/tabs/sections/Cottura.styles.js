import styled from 'styled-components';
import { Card, Button } from '../../../atoms';

export const StyledComponents = {
    Container: styled.div`
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 20px;
    `,

    Card: styled(Card)`
        padding: 20px;
        position: relative;
    `,

    DeleteButton: styled(Button)`
        position: absolute;
        top: 10px;
        right: 10px;
        background: ${({ theme }) => theme.colors.error};
        padding: 8px;
    `,

    ParametriGrid: styled.div`
        display: grid;
        grid-template-columns: 1.5fr 1fr 1.5fr 0.8fr 1.5fr 0.8fr 1.2fr;
        gap: 16px;
        align-items: flex-end;
        margin-top: 20px;
    `,

    ActionButton: styled(Button)`
        height: 40px;
        margin-top: 22px;
    `,

    AddButton: styled(Button)`
        margin-top: 20px;
        align-self: flex-start;
    `
};