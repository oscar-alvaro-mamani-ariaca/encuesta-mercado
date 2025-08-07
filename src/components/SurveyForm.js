import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Alert from './Alert';
import axios from 'axios';

// ✅ URL de producción (backend en Render)
const SERVER_URL = "https://tu-backend.onrender.com/api";

const SurveyForm = ({ onSurveySubmit }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    puesto: '',
    telefono: '',
    seguridad: '',
    problemas: [],
    sugerencia: '',
    calificacion: '',
  });
  const [alert, setAlert] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        problemas: checked
          ? [...prev.problemas, value]
          : prev.problemas.filter((p) => p !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAlert(null);

    const now = new Date();
    const surveyData = {
      ...formData,
      problemas: formData.problemas.join(', '), // Convert array to string for backend
      fecha: now.toLocaleDateString('es-ES'),
      hora: now.toLocaleTimeString('es-ES'),
    };

    try {
      const response = await axios.post(`${SERVER_URL}/respuestas`, surveyData);
      setAlert({ type: 'success', message: `✅ ${response.data.mensaje || 'Encuesta enviada al servidor exitosamente!'} <br/><small>Gracias por su participación, ${formData.nombre}</small>` });
      setFormData({
        nombre: '',
        puesto: '',
        telefono: '',
        seguridad: '',
        problemas: [],
        sugerencia: '',
        calificacion: '',
      });
      onSurveySubmit(surveyData); // Notify parent component
    } catch (error) {
      console.error('Error al enviar la encuesta:', error);
      setAlert({ type: 'danger', message: `❌ Error al enviar la encuesta. Inténtelo de nuevo. <br/><small>${error.response?.data?.error || error.message}</small>` });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="bg-white/95 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="nombre" className="block text-gray-700 font-semibold mb-2">👤 Nombre del Comerciante:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Ingrese su nombre completo"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="form-group">
            <label htmlFor="puesto" className="block text-gray-700 font-semibold mb-2">🏪 Número de Puesto:</label>
            <input
              type="text"
              id="puesto"
              name="puesto"
              value={formData.puesto}
              onChange={handleChange}
              required
              placeholder="Ej: A-15, B-23, C-07"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="form-group md:col-span-2">
            <label htmlFor="telefono" className="block text-gray-700 font-semibold mb-2">📱 Teléfono (opcional):</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Número de contacto"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="block text-gray-700 font-semibold mb-3">🛡️ ¿Se siente seguro en el mercado?</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['sí', 'no', 'regular'].map((option) => (
              <label key={option} className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors duration-200">
                <input
                  type="radio"
                  name="seguridad"
                  value={option}
                  checked={formData.seguridad === option}
                  onChange={handleChange}
                  required
                  className="form-radio h-5 w-5 text-blue-600"
                />
                <span className="ml-3 text-gray-700 font-medium capitalize">
                  {option === 'sí' && '✅ Sí, me siento completamente seguro'}
                  {option === 'no' && '❌ No, no me siento seguro'}
                  {option === 'regular' && '⚠️ Me siento regular'}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="block text-gray-700 font-semibold mb-3">🚨 ¿Qué problemas de seguridad ha observado? (Marque todos los que apliquen)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { value: 'robo', label: '🔓 Robos o hurtos frecuentes' },
              { value: 'iluminacion', label: '💡 Mala iluminación nocturna' },
              { value: 'vigilancia', label: '👮 Falta de vigilancia adecuada' },
              { value: 'acceso', label: '🚪 Control de acceso deficiente' },
              { value: 'emergencia', label: '🚨 Falta plan de emergencias' },
              { value: 'otros', label: '📝 Otros problemas de seguridad' },
            ].map((option) => (
              <label key={option.value} className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors duration-200">
                <input
                  type="checkbox"
                  name="problemas"
                  value={option.value}
                  checked={formData.problemas.includes(option.value)}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded"
                />
                <span className="ml-3 text-gray-700 font-medium">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="sugerencia" className="block text-gray-700 font-semibold mb-2">💡 ¿Qué medidas de seguridad le gustaría que se implementen o mejoren?</label>
          <textarea
            id="sugerencia"
            name="sugerencia"
            value={formData.sugerencia}
            onChange={handleChange}
            rows="4"
            placeholder="Describa detalladamente sus sugerencias para mejorar la seguridad del mercado..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          ></textarea>
        </div>

        <div className="form-group">
          <label className="block text-gray-700 font-semibold mb-3">⭐ Califique la seguridad actual del mercado (1-5):</label>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((rating) => (
              <label key={rating} className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors duration-200">
                <input
                  type="radio"
                  name="calificacion"
                  value={rating}
                  checked={formData.calificacion === String(rating)}
                  onChange={handleChange}
                  required
                  className="form-radio h-5 w-5 text-blue-600"
                />
                <span className="ml-3 text-gray-700 font-medium">{'⭐'.repeat(rating)} {rating}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <motion.button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center mx-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="mr-2">Enviando...</span>
                <div className="spinner border-white border-t-white"></div>
              </>
            ) : (
              <>
                <span className="mr-2">📤</span> Enviar Encuesta
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default SurveyForm;