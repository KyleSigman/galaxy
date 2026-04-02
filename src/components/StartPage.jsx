import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import StarField from './StarField';
import CommandTerminal from './CommandTerminal';

import "../pages/startpage.scss";

const StartPage = () => {
  const [isActive2, setIsActive2] = useState(false);
  const [totalPerformers, setTotalPerformers] = useState(998);

  const addActiveClass2 = () => {
    setIsActive2(prevState => !prevState);
  };

  return (
    <div className='start-page'>
      <StarField />

      <div className="content">
        <div className="title-section">
          <h1 className="glitch-title">
            <span className="star">STAR</span>
            <span className="pentagram">★</span>
            <span className="page">FIELD</span>
          </h1>
          <p className="subtitle">галактическая платформа</p>
          <p className="vers">V1.0</p>
        </div>

        <div className="terminal-section">
          <CommandTerminal />
        </div>

        <div className="stats">
          <span className="stat-number">{totalPerformers}</span>
          <span className="stat-label">total performers</span>
        </div>

        <button 
          className={`instructor-btn ${isActive2 ? 'active' : ''}`}
          onClick={addActiveClass2}
        >
          <span>?</span>
        </button>

        <div className={`instructor-panel ${isActive2 ? 'visible' : ''}`}>
          <div className="instructor-content">
            <h3>⚡ КОМАНДЫ ТЕРМИНАЛА ⚡</h3>
            <div className="command-list">
              <div className="command-item">
                <span className="command"> @@login</span>
                <span className="desc">войти</span>
              </div>
              <div className="command-item">
                <span className="command"> @@origins</span>
                <span className="desc">каналы</span>
              </div>
              <div className="command-item">
                <span className="command"> @@st</span>
                <span className="desc">главная</span>
              </div>
              <div className="command-item">
                <span className="command"> @@pf</span>
                <span className="desc">твой профиль</span>
              </div>

              <div className="command-item">
                <span className="command"> @@send </span>
                <span className="desc">письмо</span>
              </div>

              <div className="command-item">
                <span className="command"> @@cyber</span>
                <span className="desc">чат</span>
              </div>
              <div className="command-item">
                <span className="command"> @@mkp</span>
                <span className="desc">маркет</span>
              </div>
              <div className="command-item">
                <span className="command"> @@help</span>
                <span className="desc">справка</span>
              </div>
            </div>
            <p className="instructor-note">я верю, ты справишься...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartPage;
