import React from 'react';
import { Pill, Clock, Activity, User, ChevronRight, Printer } from 'lucide-react';
import { Prescripcion } from '../../types';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface PrescriptionItemProps {
  prescription: Prescripcion;
  showPatient?: boolean;
  onViewDetails?: (id: string) => void;
}

const PrescriptionItem: React.FC<PrescriptionItemProps> = ({ prescription, showPatient = false, onViewDetails }) => {
  const medico = typeof prescription.medicoId === 'object' && prescription.medicoId ? prescription.medicoId : null;
  const paciente = typeof prescription.pacienteId === 'object' && prescription.pacienteId ? prescription.pacienteId : null;

  return (
    <Card variant="outline" className="p-4 hover:border-primary-200 group transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary-50 rounded-2xl group-hover:bg-primary-100 transition-colors">
            <Pill className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-gray-900">{prescription.medicamento}</h4>
              <Badge variant={prescription.activa ? 'medical' : 'default'}>
                {prescription.activa ? 'Activo' : 'Finalizado'}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <Activity className="w-3.5 h-3.5 text-medical-500" />
                <span>{prescription.dosis} • {prescription.viaAdministracion}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Cada {prescription.horario}h • {prescription.tiempoTratamiento} días</span>
              </div>
              {medico && (
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <User className="w-3.5 h-3.5 text-primary-400" />
                  <span>Dr. {medico.nombre}</span>
                </div>
              )}
              {showPatient && paciente && (
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <User className="w-3.5 h-3.5 text-medical-400" />
                  <span>Paciente: {paciente.nombre}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 self-end sm:self-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open(`/prescripciones/imprimir/${prescription._id}`, '_blank')}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Imprimir
          </Button>
          {onViewDetails && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onViewDetails(prescription._id)}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Ver Detalles
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default PrescriptionItem;
