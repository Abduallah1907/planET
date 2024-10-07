import React from 'react';
import { useTranslation } from 'react-i18next';

interface CustomInputProps {
    value: string;
    onClick: () => void;
}

const CustomInput: React.FC<CustomInputProps> = ({ value, onClick }) => {
    const { t } = useTranslation();

    return (
        <div className="custom-input" onClick={onClick}>
            <i className="fas fa-calendar-alt"></i>
            <input
                type="text"
                className="form-control"
                value={value}
                readOnly
                placeholder={t("check_in_-_check_out")}
            />
        </div>
    );
};

export default CustomInput;