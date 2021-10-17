import React, { useState, useEffect } from 'react';

import { Semaphore } from './components/Semaphore/Semaphore';
import { ConnectedSemaphore } from './components/ConnectedSemaphore/ConnectedSemaphore';
import { signals } from './enums/signals.enum';
import { semaphoreTypes } from './enums/semaphoreTypes.enum';
import { semaphoreSteeringUri, semaphoresGeneralConfiguration } from './common/semaphoreConfig';

import './App.scss';

const semaphoreRouteName = (semaphoreType, semaphoreNumber) => (
    `${semaphoreType}${semaphoreNumber}`
);

const semaphoreSteeringRoute = (semaphore, signal) => (
    `${semaphoreSteeringUri}/${semaphoreRouteName(
        semaphore.type,
        semaphore.number
    )}/${signal}`
);

const callApiToSetSignal = (semaphoreSteeringRoute) => {
    fetch(semaphoreSteeringRoute)
        .then(resp => resp.text())
        .then(resp => {
            // eslint-disable-next-line no-console
            console.log(resp);
        });
};

const setDefaultSignals = () => {
    semaphoresGeneralConfiguration.forEach(sem => {
        callApiToSetSignal(semaphoreSteeringRoute(sem, sem.signal));
    });
};

function App() {
    const [semaphoresSignal, setSemaphoresSignal] = useState(semaphoresGeneralConfiguration);
    const [selectedSemaphore, setSelectedSemaphore] = useState(semaphoresGeneralConfiguration[0]);

    useEffect(() => {
        setDefaultSignals();
    }, []);

    const setSignalHandler = (signal) => {
        callApiToSetSignal(semaphoreSteeringRoute(selectedSemaphore, signal));

        const newSemaphoresSignal = [...semaphoresSignal];
        const selectedSemaphoreIndex = semaphoresSignal.findIndex(
            ({ type, number }) => type === selectedSemaphore.type
				&& number === selectedSemaphore.number
        );
        const selectedSemaphoreNewSignal = {
            type: selectedSemaphore.type,
            number: selectedSemaphore.number,
            signal: signal,
        };

        newSemaphoresSignal[selectedSemaphoreIndex] = selectedSemaphoreNewSignal;

        // eslint-disable-next-line no-console
        console.table(newSemaphoresSignal[selectedSemaphoreIndex]);
        setSemaphoresSignal(newSemaphoresSignal);
        setSelectedSemaphore(selectedSemaphoreNewSignal);
    };

    const connectedSemaphores = semaphoresSignal.map(sem => (
        <ConnectedSemaphore
            key={`${sem.type}${sem.number}`}
            setSemaphoreHandler={() => setSelectedSemaphore(sem)}
            semaphore={sem}
            selectedSemaphore={selectedSemaphore}
        />
    ));

    const semaphoresSmGroup = (
        <div className="semaphores-group">
            {
                [signals.S1, signals.S2, signals.S3, signals.S4, signals.S5,
                    signals.S10, signals.S11, signals.S12, signals.S13, signals.SZ,
                    signals.MS2, signals.OFF].map(s =>
                    (
                        <Semaphore
                            key={`semaphoreTypes.Sm${s}`}
                            setSignalHandler={setSignalHandler}
                            signalType={s}
                            semaphoreType={semaphoreTypes.Sm}
                            selectedSemaphore={selectedSemaphore}
                        />
                    ))
            }
        </div>
    );

    const semaphoresSmGOROGroup = (
        <div className="semaphores-group">
            {
                [signals.S1, signals.S2, signals.S3, signals.S4, signals.S5,
                    signals.S10, signals.S11, signals.S12, signals.S13, signals.OFF].map(s =>
                    (
                        <Semaphore
                            key={`semaphoreTypes.SmGORO${s}`}
                            setSignalHandler={setSignalHandler}
                            signalType={s}
                            semaphoreType={semaphoreTypes.SmGORO}
                            selectedSemaphore={selectedSemaphore}
                        />
                    ))
            }
        </div>
    );

    const semaphoresSmGROWGroup = (
        <div className="semaphores-group">
            {
                [signals.S1, signals.S2, signals.S3, signals.S4, signals.S5,
                    signals.S10, signals.S11, signals.SZ, signals.MS2, signals.OFF].map(s =>
                    (
                        <Semaphore
                            key={`semaphoreTypes.SmGROW${s}`}
                            setSignalHandler={setSignalHandler}
                            signalType={s}
                            semaphoreType={semaphoreTypes.SmGROW}
                            selectedSemaphore={selectedSemaphore}
                        />
                    ))
            }
        </div>
    );

    const semaphoresSmOROWGroup = (
        <div className="semaphores-group">
            {
                [signals.S1, signals.S4, signals.S5, signals.S12, signals.S13,
                    signals.SZ, signals.MS2, signals.OFF].map(s =>
                    (
                        <Semaphore
                            key={`semaphoreTypes.SmOROW${s}`}
                            setSignalHandler={setSignalHandler}
                            signalType={s}
                            semaphoreType={semaphoreTypes.SmOROW}
                            selectedSemaphore={selectedSemaphore}
                        />
                    ))
            }
        </div>
    );

    const semaphoresSmRGWGroup = (
        <div className="semaphores-group">
            {
                [signals.S1, signals.S2, signals.S3, signals.SZ, signals.MS2, signals.OFF]
                    .map(s => (
                        <Semaphore
                            key={`semaphoreTypes.SmRGW${s}`}
                            setSignalHandler={setSignalHandler}
                            signalType={s}
                            semaphoreType={semaphoreTypes.SmRGW}
                            selectedSemaphore={selectedSemaphore}
                        />
                    ))
            }
        </div>
    );

    const semaphoresSmGROGroup = (
        <div className="semaphores-group">
            {
                [signals.S1, signals.S2, signals.S3, signals.S4, signals.S5,
                    signals.S10, signals.S11, signals.OFF].map(s => 
                    (
                        <Semaphore
                            key={`semaphoreTypes.SmGRO${s}`}
                            setSignalHandler={setSignalHandler}
                            signalType={s}
                            semaphoreType={semaphoreTypes.SmGRO}
                            selectedSemaphore={selectedSemaphore}
                        />
                    ))
            }
        </div>
    );

    const semaphoresSmRGGroup = (
        <div className="semaphores-group">
            {
                [signals.S1, signals.S2, signals.S3, signals.OFF].map(s => (
                    <Semaphore
                        key={`semaphoreTypes.SmRG${s}`}
                        setSignalHandler={setSignalHandler}
                        signalType={s}
                        semaphoreType={semaphoreTypes.SmRG}
                        selectedSemaphore={selectedSemaphore}
                    />
                ))
            }
        </div>
    );

    const semaphoresSpGroup = (
        <div className="semaphores-group">
            {
                [signals.SP1, signals.SP2, signals.SP3, signals.SP4, signals.OFF].map(s => (
                    <Semaphore
                        key={`semaphoreTypes.Sp${s}`}
                        setSignalHandler={setSignalHandler}
                        signalType={s}
                        semaphoreType={semaphoreTypes.Sp}
                        selectedSemaphore={selectedSemaphore}
                    />
                ))
            }
        </div>
    );

    const semaphoresToGroup = (
        <div className="semaphores-group">
            {
                [signals.OS1, signals.OS2, signals.OS3, signals.OS4, signals.OFF].map(s => (
                    <Semaphore
                        key={`semaphoreTypes.To${s}`}
                        setSignalHandler={setSignalHandler}
                        signalType={s}
                        semaphoreType={semaphoreTypes.To}
                        selectedSemaphore={selectedSemaphore}
                    />
                ))
            }
        </div>
    );

    const semaphoresTmGroup = (
        <div className="semaphores-group">
            {
                [signals.MS1, signals.MS2, signals.OFF].map(s => (
                    <Semaphore
                        key={`semaphoreTypes.Tm${s}`}
                        setSignalHandler={setSignalHandler}
                        signalType={s}
                        semaphoreType={semaphoreTypes.Tm}
                        selectedSemaphore={selectedSemaphore}
                    />
                ))
            }
        </div>
    );

    const getCorrectSemaphoresGroup = () => {
    // eslint-disable-next-line default-case
        switch (selectedSemaphore.type) {

            case semaphoreTypes.Sm:
                return semaphoresSmGroup;
            case semaphoreTypes.SmGORO:
                return semaphoresSmGOROGroup;
            case semaphoreTypes.SmGROW:
                return semaphoresSmGROWGroup;
            case semaphoreTypes.SmOROW:
                return semaphoresSmOROWGroup;
            case semaphoreTypes.SmGRO:
                return semaphoresSmGROGroup;
            case semaphoreTypes.SmRGW:
                return semaphoresSmRGWGroup;
            case semaphoreTypes.SmRG:
                return semaphoresSmRGGroup;
            case semaphoreTypes.Sp:
                return semaphoresSpGroup;
            case semaphoreTypes.To:
                return semaphoresToGroup;
            case semaphoreTypes.Tm:
                return semaphoresTmGroup;
    
        }
    };

    return (
        <>
            <div className="App">
                {connectedSemaphores}
                {getCorrectSemaphoresGroup()}
            </div>
        </>
    );
}

;

export default App;
