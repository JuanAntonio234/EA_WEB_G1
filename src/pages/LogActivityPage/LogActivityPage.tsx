import React, { useState } from 'react';
import './LogActivityPage.css';
import Button from '../../components/Button/Button';
import AlertMessage from '../../components/AlertMessage/AlertMessage';

const LogActivityPage: React.FC = () => {
  const [activityType, setActivityType] = useState('Carrera');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); 
  const [time, setTime] = useState('12:00');
  const [durationHours, setDurationHours] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [durationSeconds, setDurationSeconds] = useState('');
  const [distance, setDistance] = useState('');
  const [distanceUnit, setDistanceUnit] = useState('km');
  const [notes, setNotes] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFeedbackMessage(null);

    // Validación simple
    if (!activityType || !date || !time || (!durationHours && !durationMinutes && !durationSeconds) || !distance) {
      setFeedbackMessage({ type: 'error', message: 'Por favor, completa todos los campos requeridos.' });
      return;
    }

    const activityData = {
      type: activityType,
      dateTime: `<span class="math-inline">\{date\}T</span>{time}`,
      duration: `${durationHours || 0}h ${durationMinutes || 0}m ${durationSeconds || 0}s`,
      distance: `${distance} ${distanceUnit}`,
      notes,
    };
    console.log('Actividad registrada (simulado):', activityData);
    setFeedbackMessage({ type: 'success', message: '¡Actividad registrada con éxito! (Simulado)' });
  };

  return (
    <div className="log-activity-page container">
      <h1>Registrar Nueva Actividad</h1>
      {feedbackMessage && (
        <AlertMessage
          message={feedbackMessage.message}
          type={feedbackMessage.type}
          onClose={() => setFeedbackMessage(null)}
        />
      )}
      <form onSubmit={handleSubmit} className="log-activity-form">
        <div className="form-group">
          <label htmlFor="activityType">Tipo de Actividad</label>
          <select id="activityType" value={activityType} onChange={(e) => setActivityType(e.target.value)} required>
            <option value="Carrera">Carrera</option>
            <option value="Bicicleta">Bicicleta</option>
            <option value="Natación">Natación</option>
            <option value="Senderismo">Senderismo</option>
            <option value="Gimnasio">Gimnasio</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Fecha</label>
            <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="time">Hora de Inicio</label>
            <input type="time" id="time" value={time} onChange={(e) => setTime(e.target.value)} required />
          </div>
        </div>

        <fieldset className="form-group">
          <legend>Duración</legend>
          <div className="duration-inputs">
            <input type="number" placeholder="Horas" value={durationHours} onChange={(e) => setDurationHours(e.target.value)} min="0" />
            <span>h</span>
            <input type="number" placeholder="Minutos" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} min="0" max="59" />
            <span>m</span>
            <input type="number" placeholder="Segundos" value={durationSeconds} onChange={(e) => setDurationSeconds(e.target.value)} min="0" max="59" />
            <span>s</span>
          </div>
        </fieldset>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="distance">Distancia</label>
            <input type="number" id="distance" placeholder="Ej: 5.5" value={distance} onChange={(e) => setDistance(e.target.value)} min="0" step="any" required />
          </div>
          <div className="form-group">
            <label htmlFor="distanceUnit">Unidad</label>
            <select id="distanceUnit" value={distanceUnit} onChange={(e) => setDistanceUnit(e.target.value)}>
              <option value="km">kilómetros (km)</option>
              <option value="mi">millas (mi)</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notas (opcional)</label>
          <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={4}></textarea>
        </div>

        <Button type="submit" variant="primary">Guardar Actividad</Button>
      </form>
    </div>
  );
};

export default LogActivityPage;