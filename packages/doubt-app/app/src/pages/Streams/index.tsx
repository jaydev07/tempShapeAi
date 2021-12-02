import React, {FC, useContext, useEffect, useState} from 'react';
import {
	IonButtons,
	IonContent,
	IonHeader, IonInput,
	IonItem,
	IonLabel,
	IonMenuButton,
	IonPage,
	IonTitle,
	IonToolbar,
	IonDatetime,
	IonItemDivider,
	IonTextarea,
	IonList,
	IonButton,
	IonSelect,
	IonSelectOption,
	useIonModal, useIonRouter,
} from "@ionic/react";
import {radio, radioOutline} from 'ionicons/icons';
import {createStream, getBootcamps, getMentors, getUpcomingStreams, updateStream, getBatches, getSessionsByBatch, scheduleSession} from "../../api/stream";
import {useParams} from "react-router";
import UpcomingStream from "../../components/UpcomingStream";
import {UserContext} from "../../context/user-context";

import "./index-styles.css";

const Streams: FC = () => {
	const [userInputs, setUserInput] = useState({ name: '', description: '', bootcamp: '', coHosts: [], startsAt: '' });
	const [bootcamps, setBootcamps] = useState<[{ _id: string; name: string }]>([{ _id: '', name: '' }]);
	const [mentors, setMentors] = useState([{ uid: '', displayName: '' }]);
	const [upcomingStreams, setUpcomingStreams] = useState<[{ _id:string, name: string, description: string, startsAt: string }] | undefined>();
	const [selectedStream, setSelectedStream] = useState('');
	const user = useContext(UserContext);
	const [batches, setBatches] = useState<any []>();
	const [selectedBatch, setSelectedBatch] = useState('');
	const [sessions, setSessions] = useState<any>({  });
	
	const handleInputChange = (e:any) => {
		const temp = { ...userInputs };
		// @ts-ignore
		temp[e.target.name] = e.target.value
		setUserInput(temp);
	};
	useEffect(() => {
		if (user?.uid) {
		
		}
	}, [user])
	const submitHandler = async (e: any) => {
		e.preventDefault();
		console.log({ userInputs })
		await createStream(userInputs);
		// @ts-ignore
		setUpcomingStreams(prev => ([ ...prev, userInputs ]));
		closePopupFormHandler();
	}
	
	useEffect(() => {
		getBootcamps().then(res => setBootcamps(res.data));
		getMentors().then(res => setMentors(res.data));
		getUpcomingStreams().then(res => setUpcomingStreams(res.data));
		getBatches().then(res => {
			setBatches(res.data)
			setSelectedBatch(res.data[0]?._id)
		})
	}, []);
	
	useEffect(() => {
		getSessionsByBatch(selectedBatch).then(res  => setSessions(res.data))
		// @ts-ignore
		console.log(sessions.nonScheduledSessions)
	}, [selectedBatch]);
	const router = useIonRouter();
	
	const StartStreamingModal: React.FC<{ onDismiss: () => void; streamId: string; router: any }> = ({ onDismiss, streamId, router }) => {
		const [eventId, setEventId] = useState('');
		// @ts-ignore
		return <>
			<IonContent>
				<div style={{ padding: '10px' }} >
					<form onSubmit={async (e) => {
						e.preventDefault();
						await scheduleSession(streamId, selectedBatch, new Date(userInputs.startsAt).toUTCString());
						const tempSessions = { ...sessions };
						const scheduledSession = {
							...tempSessions
							.nonScheduledSessions.find((s: { _id: string; }) => s._id === streamId),
							startsAt: userInputs.startsAt,
						};
						tempSessions.nonScheduledSessions = tempSessions.nonScheduledSessions.filter((s: { _id: string; }) => s._id !== streamId);
						tempSessions.scheduledSessions ? tempSessions.scheduledSessions.push(scheduledSession) : tempSessions.scheduledSessions = [scheduledSession]
						setSessions(tempSessions)
						onDismiss();
						// router.push('/class/live/' + streamId);
					}
					}>
						
						<div className="my-item">
							<IonLabel>Set Start DateTIme</IonLabel>
							<IonDatetime
								className="input-box"
								displayFormat={"MMM DD, YYYY h:mm a"}
								placeholder={'click to set'}
								value={userInputs.startsAt}
								// @ts-ignore
								onIonChange={e => setUserInput(prev => ({ ...prev, startsAt: e.detail.value }))} />
						</div>
						
						<IonButton type={'submit'} color={'success'} >Set Time</IonButton>
						<IonButton onClick={onDismiss} >Close</IonButton>
					</form>
				</div>
			</IonContent>
		</>
	}
	
	const modalDismiss = () => dismiss();
	
	const [present, dismiss] = useIonModal(StartStreamingModal, {
		onDismiss: modalDismiss,
		streamId: selectedStream,
		router,
	});
	
	const promptStartStreaming = (_id: string) => {
		setSelectedStream(_id)
		present()
	}

	const showPopupFormHandler = () => {
		let blure=document.getElementById('blure');
		blure!.style.filter="blur(10px)";
		let popup=document.getElementById('popup');
		popup!.style.visibility="visible";
		popup!.style.opacity="1";
		popup!.style.transition="0.5s";
		popup!.style.top="55%";
	}

	const closePopupFormHandler = () => {
		let blure=document.getElementById('blure');
		blure!.style.filter="blur(0px)";
		let popup=document.getElementById('popup');
		popup!.style.visibility="hidden";
		popup!.style.opacity="0";
		popup!.style.transition="0.5s";
		popup!.style.top="50%";
	}

	// @ts-ignore
	// @ts-ignore
	// @ts-ignore
	return <>
		<IonPage id="my-model">
			<IonHeader className="header">
				<IonToolbar className="header-container">
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle className="heading">Scheduling and Upcoming Streams</IonTitle>
					<IonButton id="myBtn" className="create-stream-btn" onClick={showPopupFormHandler}>Create New Stream</IonButton>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<div style={{ padding: '10px' }}>
					{
						!user?.zoomConnected && <>
							<div className={'ion-text-center'} >
								<h1 style={{ color: 'red' }} >PLEASE CONNECT YOUR ZOOM ACCOUNT TO CONTINUE</h1>
								<a
									href={'https://zoom.us/oauth/authorize?response_type=code&client_id=QEWmEGHhTwKUm6WXfGHhQ&redirect_uri=http://localhost:3000/auth/zoom'}>
							<IonButton
							size={'large'}
							expand={'full'}
							>Connect</IonButton>
								</a>
							</div>
						</>
					}
					<div className="my-item">
						<IonLabel position="stacked">Batches</IonLabel>
						<select
							className="input-box"
							onChange={e => setSelectedBatch(e.target.value) }
						>
							{
								batches && batches.length > 0 &&
								batches.map(bc =>
									<option key={bc._id} value={bc._id}>{bc.bootcamp.name} - [{ new Date(bc.from).toDateString() }]</option>
								)
							}
						</select>
					</div>
					<div id="blure" className="my-container">
						{
							// @ts-ignore
							(sessions && sessions.nonScheduledSessions && sessions.nonScheduledSessions.length > 0) ? (
								<React.Fragment>
									<h5>Unscheduled Classes</h5>
									<IonList>
									{
										// @ts-ignore
										sessions.nonScheduledSessions.map(stream =>
											<UpcomingStream
												key={stream._id}
												_id={stream._id}
												name={stream.name}
												description={`${stream.day.week.name} - ${stream.day.name}`}
												startsAt={stream.startsAt}
												promptStartStreaming={() => promptStartStreaming(stream._id)}
											/>
										)
									}
									</IonList>
								</React.Fragment>
							):(
								<h5>No Live Streams Available</h5>
							)
						}
						{
							// @ts-ignore
							(sessions && sessions.scheduledSessions && sessions.scheduledSessions.length > 0) ? (
								<React.Fragment>
									<h5>Scheduled Classes</h5>
									<IonList>
										{
											// @ts-ignore
											sessions.scheduledSessions.map(stream =>
												<UpcomingStream
													key={stream._id}
													_id={stream._id}
													name={stream.name}
													description={`${stream.day.week.name} - ${stream.day.name}`}
													startsAt={stream.startsAt}
													promptStartStreaming={() => promptStartStreaming(stream._id)}
												/>
											)
										}
									</IonList>
								</React.Fragment>
							):(
								<h5>No Live Streams Available</h5>
							)
						}
					</div>


					{/* Popup form */}
					<div id="popup">
						<h5 className="new-stream-heading">Create New Stream</h5>
						<button className="close-btn" onClick={closePopupFormHandler}>&times;</button>
						<hr />

						<form onSubmit={submitHandler} className="popup-form">

							<div className="my-item">
								<IonLabel position="stacked">Name</IonLabel>
								<IonInput className="input-box" required onIonChange={handleInputChange} value={userInputs.name}  name={'name'}> </IonInput>
							</div>

							<div className="my-item">
								<IonLabel position="stacked">Description</IonLabel>
								<IonTextarea className="input-box" required onIonChange={handleInputChange} value={userInputs.description} name={'description'} rows={3}> </IonTextarea>
							</div>

							<div className="my-item">
								<IonLabel position="stacked">Bootcamp</IonLabel>
								<IonSelect
									className="input-box"
									value={userInputs.bootcamp}
									okText="Select Bootcamp"
									cancelText="Go back"
									onIonChange={e => setUserInput(prev => ({ ...prev, bootcamp: e.detail.value }))}
								>
									{
										bootcamps && bootcamps.length > 0 &&
										bootcamps.map(bc =>
											<IonSelectOption key={bc._id} value={bc._id}>{bc.name}</IonSelectOption>
										)
									}
								</IonSelect>
							</div>

							<div className="my-item">
								<IonLabel position="stacked">Co-hosts</IonLabel>
								<IonSelect
									className="input-box"
									multiple
									value={userInputs.coHosts}
									okText="Add Co-hosts"
									cancelText="Dismiss"
									onIonChange={e => setUserInput(prev => ({ ...prev, coHosts: e.detail.value }))}
								>
									{
										user && 'uid' in user && mentors && mentors.length > 0 &&
										mentors.filter(m => m.uid !== user.uid).map(bc =>
											<IonSelectOption key={bc.uid} value={bc.uid}>{bc.displayName}</IonSelectOption>
										)
									}
								</IonSelect>
							</div>

							<div className="my-item">
								<IonLabel>Set Start DateTIme</IonLabel>
								<IonDatetime
									className="input-box"
									displayFormat={"MMM DD, YYYY h:mm a"}
									// @ts-ignore
								onIonChange={e => setUserInput(prev => ({ ...prev, startsAt: e.detail.value }))} />
							</div>
							
							<IonButton type={'submit'} className="create-btn">Create Stream</IonButton>
							
						</form>
					</div>
				</div>
			</IonContent>
		</IonPage>
		</>
}

export default Streams;