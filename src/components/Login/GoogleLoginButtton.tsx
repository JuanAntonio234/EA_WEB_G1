const GoogleLoginButton: React.FC = () => {
  const handleGoogleRedirect = () => {
    window.location.href = 'http://localhost:3000/api/auth/google'; // Ajusta el puerto si tu backend usa otro
  };

  return (
    <button onClick={handleGoogleRedirect}>
      Iniciar sesión con Google
    </button>
  );
};

export default GoogleLoginButton;
