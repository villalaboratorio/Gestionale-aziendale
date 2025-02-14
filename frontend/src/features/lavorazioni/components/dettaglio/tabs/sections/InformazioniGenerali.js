import React from 'react';
import { useStore } from '../../../../store/lavorazioneStore';
import useInformazioniGeneraliForm from '../../../../hooks/informazioniGenerali/useInformazioniGeneraliForm';
import * as S from '../../../../hooks/informazioniGenerali/useInformazioniGeneraliStyles';

const InformazioniGenerali = () => {
    const {
        lavorazione,
        collections = {
            clienti: [],
            ricette: [],
            tipiLavorazione: [],
            statiLavorazione: []
        },
        loading,
        handleFormChange
    } = useStore();

    const { formFields } = useInformazioniGeneraliForm({
        handleFormChange,
        localData: lavorazione || {},
        collections,
        loading
    });

    if (loading) {
        return <div>Caricamento in corso...</div>;
    }

    const renderField = (field) => {
        switch (field.type) {
            case 'select':
                return (
                    <S.Select
                        key={field.id}
                        value={lavorazione?.[field.id]?._id || ''}
                        onChange={(e) => handleFormChange(field.id, field.options.find(item => item._id === e.target.value))}
                    >
                        <option value="">Seleziona un'opzione</option>
                        {field.options?.map(option => (
                            <option key={option._id} value={option._id}>

                                {option.nome || option.name}
                            </option>
                        ))}
                    </S.Select>
                );
            case 'date':
                return (
                    <S.Input
                        type="date"
                        value={lavorazione?.[field.id]?.split('T')[0] || ''}
                        onChange={(e) => handleFormChange(field.id, e.target.value)}
                    />
                );
            case 'textarea':
                return (
                    <S.TextArea
                        value={lavorazione?.[field.id] || ''}
                        onChange={(e) => handleFormChange(field.id, e.target.value)}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <S.Container>
            <S.Form>
                {formFields.map(field => (
                    <S.FormGroup key={field.id} span={field.gridSpan}>
                        <S.Label required={field.required}>{field.label}</S.Label>
                        {renderField(field)}
                    </S.FormGroup>
                ))}
            </S.Form>
        </S.Container>
    );
};

export default InformazioniGenerali;