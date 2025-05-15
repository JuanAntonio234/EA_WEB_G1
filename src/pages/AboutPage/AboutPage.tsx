import React from 'react';
import './AboutPage.css';

const AboutPage: React.FC = () => {
  return (
    <div className="about-page container">
      <header className="about-header">
        <h1>Sobre Nosotros</h1>
        <p className="about-subtitle">
          Conoce más sobre MiClonStrava y nuestra pasión por el deporte y la tecnología.
        </p>
      </header>

      <section className="about-section">
        <h2>Nuestro Proyecto: MiClonStrava</h2>
        <p>
          MiClonStrava nació como un emocionante proyecto de programación con el objetivo de replicar
          y entender las funcionalidades clave de aplicaciones de seguimiento deportivo líderes como Strava.
          Nos enfocamos en crear una plataforma donde los usuarios puedan registrar, analizar y compartir
          sus actividades deportivas, fomentando una comunidad activa y saludable.
        </p>
        <p>
          Este proyecto nos permite explorar tecnologías modernas de desarrollo web y móvil,
          aplicando nuestros conocimientos en frontend, backend y bases de datos para construir
          una aplicación completa y funcional.
        </p>
      </section>

      <section className="about-section">
        <h2>Nuestra Misión</h2>
        <p>
          Nuestra misión con MiClonStrava es doble:
        </p>
        <ul>
          <li>
            <strong>Aprendizaje y Desarrollo:</strong> Profundizar en nuestras habilidades como desarrolladores,
            enfrentando los retos que supone construir una aplicación de esta envergadura.
          </li>
          <li>
            <strong>Fomentar el Deporte:</strong> Aunque sea un clon, esperamos inspirar a quienes lo usen
            (¡empezando por nosotros mismos!) a mantenerse activos y disfrutar del deporte.
          </li>
        </ul>
      </section>

      <section className="about-section team-section">
        <h2>El Equipo</h2>
        <p>
          Somos un grupo de [Número de miembros, ej: dos/tres] estudiantes apasionados por la programación y el deporte.
          [Opcional: Puedes añadir una breve descripción general del equipo o de cada miembro.
          Por ejemplo: "Trabajamos juntos en este proyecto para [Menciona la asignatura o motivo]."]
        </p>
        {}
      </section>

      <section className="about-section">
        <h2>Tecnologías Utilizadas</h2>
        <p>
          Para este proyecto, estamos utilizando un stack tecnológico moderno que incluye:
        </p>
        <ul>
          <li><strong>Frontend:</strong> React con TypeScript, Vite.</li>
          <li><strong>Backend:</strong> Node.js con Express y TypeScript.</li>
          <li><strong>Base de Datos:</strong> MongoDB.</li>
          <li><strong>Control de Versiones:</strong> Git y GitHub.</li>
          {}
        </ul>
      </section>

      <section className="about-section">
        <h2>¡Gracias por tu interés!</h2>
        <p>
          Agradecemos que te tomes el tiempo de conocer más sobre nuestro proyecto.
          Si tienes alguna pregunta o sugerencia, ¡no dudes en contactarnos! (Puedes añadir un enlace a un futuro formulario de contacto o email).
        </p>
      </section>
    </div>
  );
};

export default AboutPage;