import React, {FC, useContext, useEffect, useRef, useState} from 'react';
import {
	IonButton,
	IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol,
	IonContent,
	IonItem,
	IonLabel,IonLoading,
	IonPage, IonRow, IonSelect, IonSelectOption,
	useIonAlert,
} from "@ionic/react";
import './Live.css'
import StreamChat from "../../components/StreamChat";
import { UserContext } from "../../context/user-context";
import { useParams } from 'react-router';
import {auth, db} from "../../services/firebase";
import { hash } from "../../utils";
import { importJitsiApi } from '../../utils';
const Live: FC = () => {
	interface IPoll {
		question: string; options: [{ number: number; value: string }]; key?: string;
	}
	const user = useContext(UserContext)
	const { id } = useParams<{ id: string; }>();
	const [eventId, setEventId] = useState('');
	const [alertMessage, setAlertMessage] = useState('');
	const [streamStatus, setStreamStatus] = useState('loading');
	const [presentAlert] = useIonAlert();
	const [polls, setPolls] = useState([]);
	const pollRef = useRef(null);
	const popPollRef = useRef(null);
	const [activePoll, setActivePoll] = useState<IPoll | null>()
	// { [label] : { "userId1": 1, ..., "userIdN" : 1 } } eg: { "1" : { "sss": 1, "nnn": 1 } }
	const [pollVotes, setPollVotes] = useState<any>({});
	const [pollVoteCount, setPollVoteCount] = useState(0);
	const [mentors, setMentors] = useState<string[]>(['']);
	const [assignedChatMentor, setChatMentor] = useState('');
	const [btnText, setBtnText] = useState('Mute');
	const [toolbarButtons, setToolbarButtons] = useState<[] | string[]>([]);

	const incrementPollVoteByLabel = (label: any, userId?: string | null) => setPollVotes((prev: any) => {
		let temp = { ...prev };
		if (!temp[label]) temp[label] = { };
		temp[label][userId || "s"] = 1;
		console.log({ temp })
		return temp;
	});
		useEffect(() => {
			const script = document.createElement("script");
			script.src = "https://meet.jit.si/external_api.js";
			script.async = true;
			// script.onload = () => loadJitsiInterface();
			
			document.body.appendChild(script);
		}, []);
		useEffect(() => {
		db.ref(`streams/${id}/status`).on('value', snap => {
			if (!snap.exists()) {
				setStreamStatus('invalid')
				return presentAlert({
					message: 'The class you tried to join doesn\'t exist.'
				});
			}
			console.log(snap.val())

			const streamEventStatus = snap.val();
			setStreamStatus(streamEventStatus.text)
			if (streamEventStatus.text === 'started') {
				setEventId(streamEventStatus.eventId);
				let mentors = [streamEventStatus.host];
				if (streamEventStatus.coHosts && streamEventStatus.coHosts.length > 0)
					mentors.push(...streamEventStatus.coHosts);
				setMentors(mentors);
				const getElById = (id:string) => document.getElementById(id);

				// @ts-ignore
				// const JitsiMeetExternalAPI = new importJitsiApi('localhost:8443', options);
			}
			if (streamEventStatus.text === 'scheduled') {
				presentAlert({
					message: 'This class has not started yet.'
				});
			}
			if (streamEventStatus.text === 'ended') {
				presentAlert({
					message: 'This live class has ended.'
				});
			}
		})
	}, []);
		
		const loadJitsiInterface = (options:any) => {
			
			const api = new window.JitsiMeetExternalAPI('localhost:8443', options);
			// @ts-ignore
			api.addEventListeners({
				// readyToClose: function () {
				// 	//alert('going to close');
				// 	$('#jitsi-meet-conf-container').empty();
				// 	$('#toolbox').hide();
				// 	$('#container').hide();
				// 	$('#joinMsg').show().text('Meeting Ended');
				// },
				audioMuteStatusChanged: function (data: any) {
					if(data.muted) 					// @ts-ignore
						setBtnText('Unmute')
					// getElById("btnCustomMic")?.innerText('Unmute');
					else					// @ts-ignore
						setBtnText('Mute')
				},
				// videoMuteStatusChanged: function (data: any) {
				// 	if(data.muted)					// @ts-ignore
				// 		getElById("btnCustomCamera")?.innerText('Start Cam');
				// 	else // @ts-ignore
				// 		getElById("btnCustomCamera")?.innerText('Start Cam');
				// },
				// tileViewChanged: function (data:any) {
				// 	console.log({ data })
				// },
				// screenSharingStatusChanged: function (data:any) {
				// 	if(data.on) // @ts-ignore
				// 		getElById("btnScreenShareCustom")?.innerText('Stop SS');
				// 	else // @ts-ignore
				// 		getElById("btnScreenShareCustom")?.innerText('Start SS');
				// },
				participantJoined: function(data:any){
					console.log('participantJoined', data);
				},
				participantLeft: function(data:any){
					console.log('participantLeft', data);
				}
			});
		}
		
		useEffect(() => {
			console.log({user})
			const options = {
				roomName: id,
				width: '100%',
				height: '100%',
				parentNode: document.querySelector('#meet-iframe'),
				DEFAULT_REMOTE_DISPLAY_NAME: 'New User',
				userInfo: {
					displayName: user?.displayName,
				},
				configOverwrite:{
					doNotStoreRoom: true,
					startVideoMuted: 0,
					startWithVideoMuted: true,
					startWithAudioMuted: true,
					enableWelcomePage: false,
					prejoinPageEnabled: false,
					disableRemoteMute: true,
					remoteVideoMenu: {
						disableKick: true
					},
				},
				interfaceConfigOverwrite: {
					filmStripOnly: false,
					SHOW_JITSI_WATERMARK: false,
					SHOW_WATERMARK_FOR_GUESTS: false,
					DEFAULT_REMOTE_DISPLAY_NAME: 'New User',
					TOOLBAR_BUTTONS: toolbarButtons,
					logoClickUrl: 'https://shapeai.tech'
				},
				onload: function () {
					// $('#joinMsg').hide();
					// $('#container').show();
					// $('#toolbox').show();
				}
			};
			
			if (window.JitsiMeetExternalAPI) {
				if (user && "isMentor" in user) {
					if (user.isMentor)
					options['interfaceConfigOverwrite']['TOOLBAR_BUTTONS'] = ['microphone', 'camera', 'stats', 'desktop'];
				else
					options['interfaceConfigOverwrite']['TOOLBAR_BUTTONS'] = ['fullscreen']
					loadJitsiInterface(options);
				}
			}
		}, [user?.isMentor, window.JitsiMeetExternalAPI])

		useEffect(() => {
			if (user && !user.isMentor && mentors.length > 0) {
				// @ts-ignore
				const assignNumber = hash(user.uid) % mentors.length - 1;
				if (user.uid === 'T3nWbiAKRLR30Ce9AM39rv7FLSS2') setChatMentor('DEEEJNWNqlPGMdM2WGqYyiBilCy1')
				else setChatMentor(mentors[assignNumber]);
			}
		}, [user?.isMentor, mentors])
	
	
	useEffect(() => {
		db.ref(`polls/streams/${id}`).on('value', snap => {
			if (snap.exists()) {
				const pollsStore = snap.val();
				let pollsTemp: any[] | ((prevState: never[]) => never[]) = [];
				// @ts-ignore
				Object.keys(pollsStore).forEach(key => pollsTemp.push({...pollsStore[key], key}))
				// @ts-ignore
				setPolls(pollsTemp)
			}
		});
		db.ref(`streams/${id}/active-poll`).on('value', snap => {
			if (snap.exists()) {
				db.ref(`polls/streams/${id}/${snap.val().pollKey}`).on('value', snap => {
					console.log(snap.val())
					setActivePoll({...snap.val(), key: snap.key})
					console.log(user)
					//
					if (user &&  "uid" in user && !user.isMentor) {
						console.log('before click');
						db.ref(`polls/streams/${id}/${snap.val().pollKey}/votes/${user.uid}`).on('value', vote => {
							if (!vote.exists()) {
								console.log('no')
								// @ts-ignore
								popPollRef?.current?.click();
							}
						})
					}
				})
			} else {
				console.log('poll closed')
				// @ts-ignore
				setActivePoll({ question: '' });
			}
		});
	}, [user?.isMentor]);
	
	useEffect(() => {
		if (activePoll?.key && user && user.isMentor) {
			console.log('hmmm')
			db.ref(`polls/streams/${id}/${activePoll.key}/votes`).on('child_added', snap => {
				const vote = snap.val();
				console.log({vote}, snap.key)
				incrementPollVoteByLabel(vote.option, snap.key);
			});
		}
	}, [activePoll])
	
	const startPoll = async (pollKey: string) => {
		await db.ref(`streams/${id}/active-poll`).set({pollKey});
	};
	const endPoll = async () => {
		await db.ref(`streams/${id}/active-poll`).remove();
		setPollVotes({});
	};
	
	// @ts-ignore
	return <>

	<IonPage>
		<IonLoading
			isOpen={streamStatus === 'loading'}
			message={'Please Wait'}
		
		/>
		{ user?.isMentor && <IonCard>
			{ activePoll?.question && <>
				<IonCardHeader>
					<IonCardSubtitle>Pole Analytics</IonCardSubtitle>
					<IonCardTitle>[{activePoll?.question}]: Total Votes: {Object.keys(pollVotes).length}</IonCardTitle>
				</IonCardHeader>
				<IonCardContent>
					<IonRow>
						{
							Object.keys(pollVotes).length > 0 && Object.keys(pollVotes).map(pv =>
								<IonCol sizeMd={'2'}>
									Option {pv}: {Object.keys(pollVotes[pv]).length}
							</IonCol>
							)
						}
						
					</IonRow>
				</IonCardContent>
			</>}
			{ activePoll?.question ?
				<IonButton
					// @ts-ignore
					onClick={() => endPoll()}
					color={'warning'}>
					{`End Poll`}
				</IonButton> :
				<IonButton
					// @ts-ignore
					onClick={() => pollRef?.current?.click()}
					color={'secondary'}>Start a poll</IonButton>
			}
					<IonButton color={'danger'} >End Stream</IonButton>
		</IonCard>}
		<IonContent>
			{streamStatus === 'started' && <IonRow style={{height: '100%'}}>
				
				<IonCol
					id={'iframe-container'}
					sizeSm={'12'}
					sizeMd={'9'}
					sizeXs='12'
				>
					<div id="meet-iframe"
					        style={{position: 'relative', height: '100%', width: '100%', padding: 0, margin: 0}}
					>
					</div>
					<div id="toolbox" className="toolbox" style={{ display: 'block' }}>
						<button id='btnHangup'>Hangup</button>
						<button id='btnCustomMic'>Mic</button>
						<button id='btnCustomCamera'>Camera</button>
						<button id='btnCustomTileView'>Toggle Tileview</button>
						<button id='btnScreenShareCustom'>SS</button>
					</div>
				
				</IonCol>
				<IonCol id={'chat-container'} sizeMd={'3'}
				        sizeSm={'12'}
				        sizeXs='12'
				>
					
					<StreamChat
						streamId={id}
						canSendMessage={true}
						chatType={'gc'}
						showHeader={false}
						assignedMentorForChat={assignedChatMentor}
					/>
					
				</IonCol>
			
			</IonRow>}
		</IonContent>
		<h6>{'Mentor: ' + user?.isMentor + ' ' + user?.displayName } -
			//@ts-ignore
			{ user?.uid } assigned: {assignedChatMentor}</h6>
	
	</IonPage>
		<IonItem>
			<IonLabel>
				Poll
			</IonLabel>
		<IonSelect
			// style={{ visibility: 'hidden' }}
			ref={pollRef}
			okText="Start the selected poll"
			cancelText="Cancel"
			name={'Poll'}
			placeholder={'Poll'}
			
			onIonChange={e => startPoll(e.detail.value)}
		>
			{
				polls && polls.length > 0 &&
				polls.map((poll, i) =>
					// @ts-ignore
					<IonSelectOption defaultChecked={i === 0} key={poll.key} value={poll.key}>{poll.question}</IonSelectOption>
				)
			}
		</IonSelect>
		</IonItem>
		
		<IonItem>
			<IonLabel>
			[Poll]:	{activePoll?.question}
			</IonLabel>
			<IonSelect
				style={{ visibility: 'hidden' }}
				ref={popPollRef}
				// value={userInputs.bootcamp}
				okText="Vote"
				name={'Poll'}
				placeholder={'Poll'}
				// @ts-ignore
				onIonChange={e => db.ref(`polls/streams/${id}/${activePoll?.key}/votes/${user?.uid}`).set({ option: e.detail.value })}
			>
				{
					activePoll && activePoll.options?.length > 0 &&
					activePoll.options.map(option =>
						// @ts-ignore
						<IonSelectOption key={option.number} defaultChecked={false} value={option.number}>{option.value}</IonSelectOption>
					)
				}
			</IonSelect>
		</IonItem>
	</>
}

export default Live;