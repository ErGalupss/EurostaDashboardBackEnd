import React from 'react';
import { useForm } from 'react-hook-form';
import * as Label from '@radix-ui/react-label';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'select' | 'number' | 'date';
  required?: boolean;
  options?: string[];
  validation?: any;
}

interface DynamicFormProps {
  config: {
    fields: FormField[];
  };
  onSubmit: (data: any) => void;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({ config, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {config.fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label.Root className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor={field.name}>
            {field.label} {field.required && <span className="text-rose-500">*</span>}
          </Label.Root>
          
          {field.type === 'select' ? (
            <select
              {...register(field.name, { required: field.required })}
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">Select...</option>
              {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          ) : (
            <input
              type={field.type}
              {...register(field.name, { required: field.required })}
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          )}
          
          {errors[field.name] && (
            <p className="text-xs text-rose-500">This field is required</p>
          )}
        </div>
      ))}
      
      <button 
        type="submit"
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
      >
        Submit
      </button>
    </form>
  );
};
