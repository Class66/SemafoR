import React, { useState } from 'react';

import { Semaphore } from './components/Semaphore/Semaphore';
import { ConnectedSemaphore } from './components/ConnectedSemaphore/ConnectedSemaphore';
import { signals } from './enums/signals.enum';
import { semaphoreTypes } from './enums/semaphoreTypes.enum';

import './App.scss';

const semaphoreSteeringNodeApp = 'http://localhost:4000';

const semaphoreRouteName = (semaphoreType, semaphoreNumber) => (
	`${semaphoreType}${semaphoreNumber}`
);

const semaphoresConfig = [
	{
		type: semaphoreTypes.Sm,
		number: 1,
		signal: signals.S1,
	}, {
		type: semaphoreTypes.Sm,
		number: 2,
		signal: signals.S1,
	}, {
		type: semaphoreTypes.Sm,
		number: 3,
		signal: signals.S1,
	}, {
		type: semaphoreTypes.Sp,
		number: 1,
		signal: signals.SP1,
	}, {
		type: semaphoreTypes.Tm,
		number: 1,
		signal: signals.MS1,
	}, {
		type: semaphoreTypes.Tm,
		number: 2,
		signal: signals.MS1,
	}, {
		type: semaphoreTypes.Tm,
		number: 3,
		signal: signals.MS1,
	}
];

function App() {
	const [semaphoresSignal, setSemaphoresSignal] = useState(semaphoresConfig);
	const [selectedSemaphore, setSelectedSemaphore] = useState(semaphoresConfig[0]);

	const setSignalHandler = (signal) => {
		const semaphoreRoute = semaphoreRouteName(
			selectedSemaphore.type,
			selectedSemaphore.number
		);
		const semaphoreSteeringRoute =
			`${semaphoreSteeringNodeApp}/${semaphoreRoute}/${signal}`;

		fetch(semaphoreSteeringRoute)
			.then(resp => resp.text())
			.then(resp => {
				console.log(resp);
			});

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
