import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { FaPlay } from 'react-icons/fa';
import './hero.css';
import Traveller from '../../assets/Traveller.png';
import Plane from '../../assets/Plane.svg';
import { useTranslation } from 'react-i18next';
import { IoMdPlay } from 'react-icons/io';
import { IoPlaySharp } from 'react-icons/io5';

const Hero: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>

      <div className="hero-section">
        <div>
          <img src={Traveller} alt="Traveller" className="traveller" />
          <img src={Plane} alt="Plane" className="plane" />
        </div>
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <div className="hero-text">
                <h5 className="hero-subtitle">{t("best_destinations_around_the_world")}</h5>
                <h1>
                  {t("travel,")} <span className="highlight">{t("enjoy")}</span> {t("and_live_a_new_and_full_life")}
                </h1>
                <p>
                  {t("built_wicket_longer_admire_do_barton_vanity_itself_do_in_it_._preferred_to_sportsmen_it_engrossed_listening")}.
                </p>
                <div className="hero-buttons d-flex flex-row align-items-center">
                  <Button variant="warning" className="me-3 text-white shadow">{t("find_out_more")}</Button>
                  <Button variant="play-demo" className='rounded-circle shadow'>
                    <IoPlaySharp />
                  </Button>
                  <p className='m-0'>{t("play_demo")}</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Hero;