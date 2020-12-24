import React, { useState, useEffect } from 'react';

import { Semaphore } from './components/Semaphore/Semaphore';
import { signals } from './enums/signals.enum';
import { semaphoreTypes } from './enums/semaphoreTypes.enum';

import './App.scss';

function App() {
  const uri = 'http://localhost:4000';

  const [semaphore, setSemaphore] = useState();

  useEffect(() => {
    // Zaktualizuj tytuł dokumentu korzystając z interfejsu API przeglądarki
    document.getElementById('sem1-s1')
      .addEventListener('click', function () {
        fetch(`${uri}/sem1/s1`)
          .then(resp => resp.text())
          .then(resp => {
            console.log(resp);
          })
      });

    document.getElementById('sem1-s2')
      .addEventListener('click', function () {
        fetch(`${uri}/sem1/s2`)
          .then(resp => resp.text())
          .then(resp => {
            console.log(resp);
          })
      });

    document.getElementById('sem1-s3')
      .addEventListener('click', function () {
        fetch(`${uri}/sem1/s3`)
          .then(resp => resp.text())
          .then(resp => {
            console.log(resp);
          })
      });

    document.getElementById('sem1-s4')
      .addEventListener('click', function () {
        fetch(`${uri}/sem1/s4`)
          .then(resp => resp.text())
          .then(resp => {
            console.log(resp);
          })
      });

    document.getElementById('sem1-s5')
      .addEventListener('click', function () {
        fetch(`${uri}/sem1/s5`)
          .then(resp => resp.text())
          .then(resp => {
            console.log(resp);
          })
      });

    document.getElementById('sem1-s10')
      .addEventListener('click', function () {
        fetch(`${uri}/sem1/s10`)
          .then(resp => resp.text())
          .then(resp => {
            console.log(resp);
          })
      });

    document.getElementById('sem1-s11')
      .addEventListener('click', function () {
        fetch(`${uri}/sem1/s11`)
          .then(resp => resp.text())
          .then(resp => {
            console.log(resp);
          })
      });

    document.getElementById('sem1-s12')
      .addEventListener('click', function () {
        fetch(`${uri}/sem1/s12`)
          .then(resp => resp.text())
          .then(resp => {
            console.log(resp);
          })
      });

    document.getElementById('sem1-s13')
      .addEventListener('click', function () {
        fetch(`${uri}/sem1/s13`)
          .then(resp => resp.text())
          .then(resp => {
            console.log(resp);
          })
      });

    document.getElementById('sem1-sz')
      .addEventListener('click', function () {
        fetch(`${uri}/sem1/sz`)
          .then(resp => resp.text())
          .then(resp => {
            console.log(resp);
          })
      });

    document.getElementById('sem1-ms2')
      .addEventListener('click', function () {
        fetch(`${uri}/sem1/ms2`)
          .then(resp => resp.text())
          .then(resp => {
            console.log(resp);
          })
      });

    document.getElementById('sem1-off')
      .addEventListener('click', function () {
        fetch(`${uri}/sem1/off`)
          .then(resp => resp.text())
          .then(resp => {
            console.log(resp);
          })
      });

    // TARCZE MANEWROWE

    document.getElementById('sem1tm-ms1')
      .addEventListener('click', function () {
        fetch(`${uri}/sem1tm/ms1`)
          .then(resp => resp.text())
          .then(resp => {
            console.log(resp);
          })
      });

    document.getElementById('sem1tm-ms2')
      .addEventListener('click', function () {
        fetch(`${uri}/sem1tm/ms2`)
          .then(resp => resp.text())
          .then(resp => {
            console.log(resp);
          })
      });

    document.getElementById('sem1tm-off')
      .addEventListener('click', function () {
        fetch(`${uri}/sem1tm/off`)
          .then(resp => resp.text())
          .then(resp => {
            console.log(resp);
          })
      });

    // SYGNAL POWTARZAJACY

    document.getElementById('sem1sp-sp1')
      .addEventListener('click', function () {
        fetch(`${uri}/sem1sp/sp1`)
          .then(resp => resp.text())
          .then(resp => {
            console.log(resp);
          })
      });

    document.getElementById('sem1sp-sp2')
      .addEventListener('click', function () {
        fetch(`${uri}/sem1sp/sp2`)
          .then(resp => resp.text())
          .then(resp => {
            console.log(resp);
          })
      });

    document.getElementById('sem1sp-sp3')
      .addEventListener('click', function () {
        fetch(`${uri}/sem1sp/sp3`)
          .then(resp => resp.text())
          .then(resp => {
            console.log(resp);
          })
      });

    document.getElementById('sem1sp-sp4')
      .addEventListener('click', function () {
        fetch(`${uri}/sem1sp/sp4`)
          .then(resp => resp.text())
          .then(resp => {
            console.log(resp);
          })
      });

    document.getElementById('sem1sp-off')
      .addEventListener('click', function () {
        fetch(`${uri}/sem1sp/off`)
          .then(resp => resp.text())
          .then(resp => {
            console.log(resp);
          })
      });

  });

  const setSignalHandler = (signalType) => {
    console.log(signalType);
  };

  return (
    <>
      <div className="App">
        <div className="semaphore-group">
          <Semaphore setSignalHandler={setSignalHandler} signalType={signals.S1} semaphoreType={semaphoreTypes.Sm} />
          <button id="sm1" className="driver">Sm 1</button>
        </div>
        <div className="semaphore-group">
          <Semaphore setSignalHandler={setSignalHandler} signalType={signals.S4} semaphoreType={semaphoreTypes.Sm} />
          <button id="sm2" className="driver">Sm 11</button>
        </div>
        <div className="semaphores-group">
          <Semaphore setSignalHandler={setSignalHandler} signalType={signals.S1} semaphoreType={semaphoreTypes.Sm} />
          <Semaphore setSignalHandler={setSignalHandler} signalType={signals.S2} semaphoreType={semaphoreTypes.Sm} />
          <Semaphore setSignalHandler={setSignalHandler} signalType={signals.S3} semaphoreType={semaphoreTypes.Sm} />
          <Semaphore setSignalHandler={setSignalHandler} signalType={signals.S4} semaphoreType={semaphoreTypes.Sm} />
          <Semaphore setSignalHandler={setSignalHandler} signalType={signals.S5} semaphoreType={semaphoreTypes.Sm} />
          <Semaphore setSignalHandler={setSignalHandler} signalType={signals.S10} semaphoreType={semaphoreTypes.Sm} />
          <Semaphore setSignalHandler={setSignalHandler} signalType={signals.S11} semaphoreType={semaphoreTypes.Sm} />
          <Semaphore setSignalHandler={setSignalHandler} signalType={signals.S12} semaphoreType={semaphoreTypes.Sm} />
          <Semaphore setSignalHandler={setSignalHandler} signalType={signals.S13} semaphoreType={semaphoreTypes.Sm} />
          <Semaphore setSignalHandler={setSignalHandler} signalType={signals.SZ} semaphoreType={semaphoreTypes.Sm} />
          <Semaphore setSignalHandler={setSignalHandler} signalType={signals.OFF} semaphoreType={semaphoreTypes.Sm} />
        </div>
        <div className="semaphores-group">
          <Semaphore setSignalHandler={setSignalHandler} signalType={signals.SP1} semaphoreType={semaphoreTypes.Sp} />
          <Semaphore setSignalHandler={setSignalHandler} signalType={signals.SP2} semaphoreType={semaphoreTypes.Sp} />
          <Semaphore setSignalHandler={setSignalHandler} signalType={signals.SP3} semaphoreType={semaphoreTypes.Sp} />
          <Semaphore setSignalHandler={setSignalHandler} signalType={signals.SP4} semaphoreType={semaphoreTypes.Sp} />
          <Semaphore setSignalHandler={setSignalHandler} signalType={signals.OFF} semaphoreType={semaphoreTypes.Sp} />
        </div>
        <div className="semaphores-group">
          <Semaphore setSignalHandler={setSignalHandler} signalType={signals.OS1} semaphoreType={semaphoreTypes.To} />
          <Semaphore setSignalHandler={setSignalHandler} signalType={signals.OS2} semaphoreType={semaphoreTypes.To} />
          <Semaphore setSignalHandler={setSignalHandler} signalType={signals.OS3} semaphoreType={semaphoreTypes.To} />
          <Semaphore setSignalHandler={setSignalHandler} signalType={signals.OS4} semaphoreType={semaphoreTypes.To} />
          <Semaphore setSignalHandler={setSignalHandler} signalType={signals.OFF} semaphoreType={semaphoreTypes.To} />
        </div>
        <div className="semaphores-group">
          <Semaphore setSignalHandler={setSignalHandler} signalType={signals.MS1} semaphoreType={semaphoreTypes.Tm} />
          <Semaphore setSignalHandler={setSignalHandler} signalType={signals.MS2} semaphoreType={semaphoreTypes.Tm} />
          <Semaphore setSignalHandler={setSignalHandler} signalType={signals.OFF} semaphoreType={semaphoreTypes.Tm} />
        </div>

        <div>
          <br /><br />
          <button id="sem1-s1" className="driver">S1</button>
          <button id="sem1-s2" className="driver">S2</button>
          <button id="sem1-s3" className="driver">S3</button>
          <button id="sem1-s4" className="driver">S4</button>
          <button id="sem1-s5" className="driver">S5</button>
          <button id="sem1-s10" className="driver">S10</button>
          <button id="sem1-s11" className="driver">S11</button>
          <button id="sem1-s12" className="driver">S12</button>
          <button id="sem1-s13" className="driver">S13</button>
          <button id="sem1-sz" className="driver">SZ</button>
          <button id="sem1-ms2" className="driver">MS2</button>
          <button id="sem1-off" className="driver">OFF</button>
          <br /><br />
          <button id="sem1tm-ms1" className="driver">MS1</button>
          <button id="sem1tm-ms2" className="driver">MS2</button>
          <button id="sem1tm-off" className="driver">OFF</button>
          <br /><br />
          <button id="sem1sp-sp1" className="driver">SP1</button>
          <button id="sem1sp-sp2" className="driver">SP2</button>
          <button id="sem1sp-sp3" className="driver">SP3</button>
          <button id="sem1sp-sp4" className="driver">SP4</button>
          <button id="sem1sp-off" className="driver">OFF</button>
        </div>
      </div>
    </>
  )
}

export default App;
