import React, {useEffect, useState} from 'react';
import {
	IonButton,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardSubtitle,
	IonCardTitle,
	IonCol, IonContent, IonInput, IonItem, IonLabel,
	IonRow, useIonAlert, useIonModal
} from "@ionic/react";
import { radio } from "ionicons/icons";
import {updateStream} from "../api/stream";
import { db } from '../services/firebase';
import "./UpcomingStream.css";

const UpcomingStream: React.FC<{
	_id: string;
	name: string;
	description: string;
	startsAt?: string;
	promptStartStreaming: () => void;
}> = ({ _id, name, description, startsAt, promptStartStreaming }) => {
	interface IPoll {
		question: string; options: [{ number: number; value: string }]; key?: string;
	}
	
	const [polls, setPolls] = useState<[IPoll] | []>([]);
	const [ionAlert] = useIonAlert();
	const [pollEditMode, setPollEditMode] = useState({ updateMode: false, key: {} });
	
	const AddPollModal: React.FC<{ dismiss: () => void; updateMode?: boolean; pollKey?: IPoll | undefined}> = ({ dismiss, updateMode, pollKey }) => {
		const [poll, setPoll] = useState<IPoll | {}>({});
		const [options, setOptions] = useState<any>({});
			useEffect(() => {
				if (updateMode && pollKey) {
						setPoll(pollKey);
						let optionsStore = {};
						// @ts-ignore
					pollKey.options.forEach(op => optionsStore[op.number] = op.value)
					setOptions(optionsStore)
				}
			}, [pollKey])
		return <>
			<IonContent className="popup">
				<div style={{ marginLeft: '50px', marginRight: '50px', paddingBottom:'1%' }} >
					<h5 className="new-stream-heading">{ updateMode ? 'Update Poll' : 'Add Poll'}</h5>
					<form onSubmit={async (e) => {
						e.preventDefault();
						if (Object.keys(options).length < 2) {
							return ionAlert('Poll should have at least 2 options', [{ text: 'Ok' }])
						}
						let optionsArray: { number: string; value: any; }[] = [];
						Object.keys(options).forEach(key => {
							optionsArray.push({ number: key, value: options[key] });
						});
						let tempPoll = { ...poll, options: optionsArray }
						// @ts-ignore
						setPoll(tempPoll);
						// @ts-ignore
						if (updateMode && pollKey.key) {
							// @ts-ignore
							db.ref(`polls/streams/${_id}/${pollKey.key}`).set(tempPoll).then(() => setPolls(prev => {
								let temp = [...prev];
								// @ts-ignore
								const i = temp.findIndex(p => p.key === pollKey.key);
								// @ts-ignore
								temp[i] = tempPoll;
								return temp;
							}));
							dismiss()
						} else
						db.ref(`polls/streams/${_id}`).push(tempPoll).then((snap) => {
							// @ts-ignore
							dismiss();
						});
					}
					}>
						<div className="question-item">
							<IonLabel position="stacked">Question</IonLabel>
							<IonInput
								className="input-box"
								required
								// @ts-ignore
								value={poll.question}
								// @ts-ignore
								onIonChange={(e) => setPoll(prev => ({ ...prev, question: e.target.value }))}
								name={'name'} >
							</IonInput>
						</div>
							
							{Array.from({ length: 4 }, (x, i ) =>
								<>
								<div className="option-item">
									<IonLabel position="stacked">Option {i + 1}</IonLabel>
									<IonInput
										className="input-box"
										value={options[i+1]}
										required={false}
										// @ts-ignore
										onIonChange={(e) => setOptions(prev => {
											// @ts-ignore
											const { value } = e.target;
											const temp = { ...prev };

											if (!value) delete temp[i+1];
											else
											// @ts-ignore
											temp[i+1] = value;
											return temp;
										} )}
										placeholder={`${i+1}`}
										name={'name'} >
									</IonInput>
								</div>
								</>
							)}
						
						<IonButton className="my-btn" type={'submit'} color={'success'} >{ updateMode ? 'Update' : 'Add'}</IonButton>
						{
							updateMode && <IonButton className="delete-btn" onClick={() => {
								// @ts-ignore
								db.ref(`polls/streams/${_id}/${pollKey.key}`).remove().then(() => {
									// @ts-ignore
									setPolls(prev => ([...prev].filter(p => p.key !== pollKey.key)));
									dismiss();
								})
							}} color={'danger'}>Delete Poll</IonButton>}
						<IonButton className="my-btn" onClick={dismiss} >Cancel</IonButton>
					</form>
				</div>
			</IonContent>
		</>
	}
	
	const dismiss = () => closePollModal();
	
	const [presentPollModal, closePollModal] = useIonModal(AddPollModal, {
		dismiss,
		updateMode: pollEditMode.updateMode,
		pollKey: pollEditMode.key,
	});
	
	useEffect(() => {
		db.ref(`polls/streams/${_id}`).on('value', snap => {
			if (snap.exists()) {
				const pollsStore = snap.val();
				let pollsTemp: IPoll[] = [];
				Object.keys(pollsStore).forEach(key => pollsTemp.push({...pollsStore[key], key}))
				// @ts-ignore
				setPolls(pollsTemp)
			}
			})
	}, []);
	
	return <>
		<IonCard>
			<IonCardHeader>
				<IonRow>
					<IonCol size="9">
						<IonCardTitle className="stream-name">{name}</IonCardTitle>
						<p className="description">{description}</p>
						{startsAt && <IonCardSubtitle className="date">Scheduled on {new Date(startsAt).toLocaleString()}</IonCardSubtitle>}
					</IonCol>
					<IonCol size={'3'}>
						<IonButton className="btn" size={'small'} color={'success'} onClick={() => {
							promptStartStreaming()
						//	setSelectedStream(_id)
						//	present()
						}} > Schedule </IonButton>
 
						{/*<IonButton className="btn" onClick={() => {*/}
						{/*		setPollEditMode({*/}
						{/*			updateMode: false,*/}
						{/*			key: '',*/}
						{/*		})*/}
						{/*	presentPollModal()*/}
						{/*}} >Add Poll+</IonButton>*/}
					</IonCol>
				</IonRow>
			</IonCardHeader>
			{/*<IonCardContent className="content">*/}
			{/*	<h1>Polls</h1>*/}
			{/*	{*/}
			{/*		polls.length > 0 && polls.map(poll =>*/}
			{/*			<IonCard*/}
			{/*				key={poll.key}*/}
			{/*				style={{ cursor: 'pointer' }}*/}
			{/*				onClick={() => {*/}
			{/*					const ref = db.ref(`polls/streams/${_id}/${poll.key}`).once('value', snap => {*/}
			{/*						setPollEditMode({*/}
			{/*							updateMode: true,*/}
			{/*							// @ts-ignore*/}
			{/*							key: {...snap.val(), key: snap.key},*/}
			{/*						});*/}
			{/*					})*/}
			{/*					presentPollModal()*/}
			{/*				}}*/}
			{/*				*/}
			{/*			>*/}
			{/*			<IonCardHeader>*/}
			{/*				<IonCardTitle>{poll.question}</IonCardTitle>*/}
			{/*			</IonCardHeader>*/}
			{/*		</IonCard>)*/}
			{/*	}*/}
			{/*</IonCardContent>*/}
		</IonCard>

	</>
}

export default UpcomingStream;