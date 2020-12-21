import React, { useEffect } from 'react';

import './App.css';

function App() {
  const uri = 'http://localhost:4000';

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

    document.getElementById('sem1man-ms1')
      .addEventListener('click', function () {
        fetch(`${uri}/sem1man/ms1`)
          .then(resp => resp.text())
          .then(resp => {
            console.log(resp);
          })
      });

    document.getElementById('sem1man-ms2')
      .addEventListener('click', function () {
        fetch(`${uri}/sem1man/ms2`)
          .then(resp => resp.text())
          .then(resp => {
            console.log(resp);
          })
      });

    document.getElementById('sem1man-off')
      .addEventListener('click', function () {
        fetch(`${uri}/sem1man/off`)
          .then(resp => resp.text())
          .then(resp => {
            console.log(resp);
          })
      });

    // SYGNAL POWTARZAJACY

    document.getElementById('sem1pow-sp1')
      .addEventListener('click', function () {
        fetch(`${uri}/sem1pow/sp1`)
          .then(resp => resp.text())
          .then(resp => {
            console.log(resp);
          })
      });

    document.getElementById('sem1pow-sp2')
      .addEventListener('click', function () {
        fetch(`${uri}/sem1pow/sp2`)
          .then(resp => resp.text())
          .then(resp => {
            console.log(resp);
          })
      });

    document.getElementById('sem1pow-sp3')
      .addEventListener('click', function () {
        fetch(`${uri}/sem1pow/sp3`)
          .then(resp => resp.text())
          .then(resp => {
            console.log(resp);
          })
      });

    document.getElementById('sem1pow-sp4')
      .addEventListener('click', function () {
        fetch(`${uri}/sem1pow/sp4`)
          .then(resp => resp.text())
          .then(resp => {
            console.log(resp);
          })
      });

    document.getElementById('sem1pow-off')
      .addEventListener('click', function () {
        fetch(`${uri}/sem1pow/off`)
          .then(resp => resp.text())
          .then(resp => {
            console.log(resp);
          })
      });

  });

  return (
    <div className="App">
      <br /><br />
      <button id="sem1-s1" class="driver">S1</button>
      <button id="sem1-s2" class="driver">S2</button>
      <button id="sem1-s3" class="driver">S3</button>
      <button id="sem1-s4" class="driver">S4</button>
      <button id="sem1-s5" class="driver">S5</button>
      <button id="sem1-s10" class="driver">S10</button>
      <button id="sem1-s11" class="driver">S11</button>
      <button id="sem1-s12" class="driver">S12</button>
      <button id="sem1-s13" class="driver">S13</button>
      <button id="sem1-sz" class="driver">SZ</button>
      <button id="sem1-ms2" class="driver">MS2</button>
      <button id="sem1-off" class="driver">OFF</button>
      <br /><br />
      <button id="sem1man-ms1" class="driver">MS1</button>
      <button id="sem1man-ms2" class="driver">MS2</button>
      <button id="sem1man-off" class="driver">OFF</button>
      <br /><br />
      <button id="sem1pow-sp1" class="driver">SP1</button>
      <button id="sem1pow-sp2" class="driver">SP2</button>
      <button id="sem1pow-sp3" class="driver">SP3</button>
      <button id="sem1pow-sp4" class="driver">SP4</button>
      <button id="sem1pow-off" class="driver">OFF</button>
    </div>
  )
}

export default App;
