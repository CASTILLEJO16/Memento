import React from 'react';
import { Activity, ChevronDown } from 'lucide-react';
import { UNIDADES_DOSIS } from '../../constants/medicalData';

interface DoseInputProps {
  amount: string;
  unit: string;
  onAmountChange: (amount: string) => void;
  onUnitChange: (unit: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

const DoseInput: React.FC<DoseInputProps> = ({
  amount,
  unit,
  onAmountChange,
  onUnitChange,
  label = 'Dosis',
  placeholder = 'Ej: 500',
  required = false,
}) => {
  return (
    <div className="space-y-1.5 flex-grow">
      {label && <label className="block text-sm font-semibold text-gray-700 ml-1">{label}</label>}
      
      <div className="flex gap-0 group">
        <div className="relative flex-grow">
          <Activity className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors pointer-events-none" />
          <input
            type="text"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            className="input-field pl-11 rounded-r-none border-r-0"
            placeholder={placeholder}
            required={required}
          />
        </div>
        
        <div className="relative min-w-[100px]">
          <select
            value={unit}
            onChange={(e) => onUnitChange(e.target.value)}
            className="input-field rounded-l-none appearance-none pr-10 bg-gray-50/50 hover:bg-gray-100/50 cursor-pointer text-sm font-bold text-gray-600 border-l border-gray-200"
            required={required}
          >
            {UNIDADES_DOSIS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default DoseInput;
