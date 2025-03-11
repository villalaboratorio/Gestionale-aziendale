import * as React from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  children: React.ReactNode;
  required?: boolean;
  error?: string;
  helpText?: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  children,
  required = false,
  error,
  helpText
}) => {
  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      
      {children}
      
      {error && (
        <div className="invalid-feedback">
          {error}
        </div>
      )}
      
      {helpText && (
        <div className="form-text mt-1">
          {helpText}
        </div>
      )}
    </div>
  );
};
