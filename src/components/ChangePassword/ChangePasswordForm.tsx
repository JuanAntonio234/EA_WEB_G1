import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { changePassword as changePasswordService } from '../../services/userService';

interface ChangePasswordProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface PasswordStrength {
  score: number;
  feedback: string;
}

const ChangePasswordForm: React.FC<ChangePasswordProps> = ({ onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const { user } = useAuth(); // Usar el contexto de autenticación
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');

  // Función para evaluar la fuerza de la contraseña
  const evaluatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    let feedback = '';

    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    switch (score) {
      case 0:
      case 1:
        feedback = t('changePassword.weakPassword') || 'Contraseña débil';
        break;
      case 2:
      case 3:
        feedback = t('changePassword.mediumPassword') || 'Contraseña media';
        break;
      case 4:
      case 5:
        feedback = t('changePassword.strongPassword') || 'Contraseña fuerte';
        break;
      default:
        feedback = '';
    }

    return { score, feedback };
  };

  const passwordStrength = evaluatePasswordStrength(formData.newPassword);

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores cuando el usuario comience a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    setApiError('');
    setSuccessMessage('');
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = t('changePassword.currentPasswordRequired') || 'La contraseña actual es requerida';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = t('changePassword.newPasswordRequired') || 'La nueva contraseña es requerida';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = t('changePassword.passwordTooShort') || 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('changePassword.confirmPasswordRequired') || 'Confirma tu nueva contraseña';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = t('changePassword.passwordsDoNotMatch') || 'Las contraseñas no coinciden';
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = t('changePassword.samePassword') || 'La nueva contraseña debe ser diferente a la actual';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError('');
    setSuccessMessage('');

    try {
      // Usar el servicio en lugar de fetch directo
      await changePasswordService(formData.currentPassword, formData.newPassword);
      
      setSuccessMessage(t('changePassword.passwordChangedSuccess') || 'Contraseña cambiada con éxito');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Llamar a onSuccess después de un breve delay para mostrar el mensaje
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
      
    } catch (error: any) {
      setApiError(error.message || t('changePassword.changePasswordError') || 'Error al cambiar la contraseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrengthColor = (score: number) => {
    if (score <= 2) return '#ef4444';
    if (score <= 3) return '#f97316';
    return '#22c55e';
  };

  const getPasswordStrengthWidth = (score: number) => {
    return `${(score / 5) * 100}%`;
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('changePassword.title') || 'Cambiar Contraseña'}
        </h2>
        <p className="text-gray-600">
          {t('changePassword.subtitle') || 'Introduce tu contraseña actual y elige una nueva'}
        </p>
      </div>

      {/* Mensajes de éxito y error */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
          <span className="text-green-700">{successMessage}</span>
        </div>
      )}

      {apiError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{apiError}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Contraseña actual */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('changePassword.currentPassword') || 'Contraseña Actual'}
          </label>
          <div className="relative">
            <input
              type={showPasswords.current ? 'text' : 'password'}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.currentPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder={t('changePassword.currentPasswordHint') || 'Introduce tu contraseña actual'}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
          )}
        </div>

        {/* Nueva contraseña */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('changePassword.newPassword') || 'Nueva Contraseña'}
          </label>
          <div className="relative">
            <input
              type={showPasswords.new ? 'text' : 'password'}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.newPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder={t('changePassword.newPasswordHint') || 'Introduce tu nueva contraseña'}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Indicador de fuerza de contraseña */}
          {formData.newPassword && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: getPasswordStrengthWidth(passwordStrength.score),
                    backgroundColor: getPasswordStrengthColor(passwordStrength.score)
                  }}
                />
              </div>
              <p className="text-xs mt-1" style={{ color: getPasswordStrengthColor(passwordStrength.score) }}>
                {passwordStrength.feedback}
              </p>
            </div>
          )}
          
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
          )}
        </div>

        {/* Confirmar contraseña */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('changePassword.confirmNewPassword') || 'Confirmar Nueva Contraseña'}
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder={t('changePassword.confirmNewPasswordHint') || 'Confirma tu nueva contraseña'}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Botones */}
        <div className="flex space-x-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('general.cancel') || 'Cancelar'}
            </button>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {t('changePassword.changing') || 'Cambiando...'}
              </>
            ) : (
              t('changePassword.changePasswordButton') || 'Cambiar Contraseña'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordForm;