import React, { useState, useEffect } from 'react';

import { Semaphore } from './components/Semaphore/Semaphore';
import { ConnectedSemaphore } from './components/ConnectedSemaphore/ConnectedSemaphore';
import { signals } from './enums/signals.enum';
import { semaphoreTypes } from './enums/semaphoreTypes.enum';
import { semaphoreSteeringUri, semaphoresGeneralConfiguration } from './common/semaphoresConfig';

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

		newSemaphoresSignal[selectedSemaphoreIndex] = {
			type: selectedSemaphore.type,
			number: selectedSemaphore.number,
			signal: signal,
		};

		console.table(newSemaphoresSignal[selectedSemaphoreIndex]);
		setSemaphoresSignal(newSemaphoresSignal);
	};

	const setSemaphoreHandler = (semaphore) => {
		setSelectedSemaphore(semaphore);
	};

	const connectedSemaphores = semaphoresSignal.map(sem => (
		<ConnectedSemaphore
			key={`${sem.type}${sem.number}`}
			setSemaphoreHandler={() => setSemaphoreHandler(sem)}
			semaphore={sem}
			selectedSemaphore={selectedSemaphore}
		/>
	));

	const semaphoresSmGroup = (
		<div className="semaphores-group">
			{[signals.S1, signals.S2, signals.S3, signals.S4, signals.S5,
			signals.S10, signals.S11, signals.S12, signals.S13, signals.SZ, signals.OFF].map(s => (
				<Semaphore
					key={`semaphoreTypes.Sm${s}`}
					setSignalHandler={setSignalHandler}
					signalType={s}
					semaphoreType={semaphoreTypes.Sm}
				/>
			))}
		</div>
	);

	const semaphoresSpGroup = (
		<div className="semaphores-group">
			{[signals.SP1, signals.SP2, signals.SP3, signals.SP4, signals.OFF].map(s => (
				<Semaphore
					key={`semaphoreTypes.Sp${s}`}
					setSignalHandler={setSignalHandler}
					signalType={s}
					semaphoreType={semaphoreTypes.Sp}
				/>
			))}
		</div>
	);

	const semaphoresToGroup = (
		<div className="semaphores-group">
			{[signals.OS1, signals.OS2, signals.OS3, signals.OS4, signals.OFF].map(s => (
				<Semaphore
					key={`semaphoreTypes.To${s}`}
					setSignalHandler={setSignalHandler}
					signalType={s}
					semaphoreType={semaphoreTypes.To}
				/>
			))}
		</div>
	);

	const semaphoresTmGroup = (
		<div className="semaphores-group">
			{[signals.MS1, signals.MS2, signals.OFF].map(s => (
				<Semaphore
					key={`semaphoreTypes.Tm${s}`}
					setSignalHandler={setSignalHandler}
					signalType={s}
					semaphoreType={semaphoreTypes.Tm}
				/>
			))}
		</div>
	);

	return (
		<>
			<div className="App">
				{connectedSemaphores}
				{selectedSemaphore.type === semaphoreTypes.Sm && semaphoresSmGroup}
				{selectedSemaphore.type === semaphoreTypes.Sp && semaphoresSpGroup}
				{selectedSemaphore.type === semaphoreTypes.To && semaphoresToGroup}
				{selectedSemaphore.type === semaphoreTypes.Tm && semaphoresTmGroup}
			</div>
		</>
	);
};

export default App;
