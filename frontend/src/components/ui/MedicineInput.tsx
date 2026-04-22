import React, { useState, useRef, useEffect } from 'react';
import { Pill, Search, Check } from 'lucide-react';
import { MEDICAMENTOS_COMUNES, MedicineSugerencia } from '../../constants/medicalData';
import { motion, AnimatePresence } from 'framer-motion';

interface MedicineInputProps {
  value: string;
  onChange: (value: string) => void;
  onSuggestionSelect: (suggestion: MedicineSugerencia) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

const MedicineInput: React.FC<MedicineInputProps> = ({
  value,
  onChange,
  onSuggestionSelect,
  label = 'Medicamento',
  placeholder = 'Buscar o escribir medicamento...',
  required = false,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filtered, setFiltered] = useState<MedicineSugerencia[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length > 1) {
      const filteredList = MEDICAMENTOS_COMUNES.filter((m) =>
        m.nombre.toLowerCase().includes(value.toLowerCase())
      );
      setFiltered(filteredList);
      setShowSuggestions(filteredList.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-1.5 relative" ref={containerRef}>
      {label && <label className="block text-sm font-semibold text-gray-700 ml-1">{label}</label>}
      
      <div className="relative group">
        <Pill className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => value.length > 1 && setShowSuggestions(true)}
          className="input-field pl-11 pr-10"
          placeholder={placeholder}
          required={required}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
           <Search className="w-4 h-4 text-gray-300" />
        </div>
      </div>

      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-h-60 overflow-y-auto"
          >
            {filtered.map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onSuggestionSelect(suggestion);
                  setShowSuggestions(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-primary-50 flex items-center justify-between group transition-colors"
              >
                <div>
                  <p className="font-bold text-gray-900 group-hover:text-primary-700">{suggestion.nombre}</p>
                  <p className="text-xs text-gray-500">Dosis común: {suggestion.dosisTípica} {suggestion.unidad}</p>
                </div>
                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <Check className="w-3.5 h-3.5 text-primary-600" />
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MedicineInput;
