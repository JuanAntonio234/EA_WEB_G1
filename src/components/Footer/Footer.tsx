import React from 'react';
import { useTranslation } from 'react-i18next';
import './Footer.css';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-content">
      <p>
        © {currentYear} TRAZER. {t('footer.allRightsReserved')}
      </p>
    </footer>
  );
};

export default Footer;