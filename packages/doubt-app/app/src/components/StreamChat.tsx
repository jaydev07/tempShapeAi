
// @ts-ignore
import {MainContainer, ChatContainer, MessageList, Message, MessageInput, ConversationHeader, Avatar, } from "@chatscope/chat-ui-kit-react";

import { db, auth, storage } from '../services/firebase';
import {useEffect, FC, useState, useRef, useContext} from "react";
import { text } from "ionicons/icons";
import { useIonRouter, IonLoading } from "@ionic/react";
import {UserContext} from "../context/user-context";
import * as stream from "stream";

type chatTypes = 'gc' | 'dm';
interface IProps {
  streamId: string;
  canSendMessage: boolean; chatType: chatTypes;
  setView?: any;
  name?: string;
  showHeader: boolean;
  attachButton?: false;
  assignedMentorForChat?: string;
}

interface IMessage {
  content: string;
  timestamp: string;
  user: string;
  sentBy: string;
  type: string;
  mentor?: boolean;
}

const Chat: FC<IProps> = ({ streamId, canSendMessage ,chatType,setView, name, showHeader, attachButton, assignedMentorForChat}) => {
  // fetch user batch
  // fetch batch info
  // fetch messages by batchId
  const inputRef = useRef();
  
  const user = useContext(UserContext);
  const [messages, setMessages] = useState<IMessage[] | []>([]);
  const [isQa, setIsQA] = useState(false);
  const [chatRoomId] = useState(streamId.replace('messages/', ''));
  const [blocking, setBlocking] = useState(false);
  const [chats, setChats] = useState([]);
  const [loadedChats, setLoadedChats] = useState([]);
  const [replyingTo, setReplyingTo] = useState({ uid: '', displayName: '' });
  
  // load messages from announcements
  
  // load all qas if mentor
  useEffect(() => {
    if (user?.displayName && user.isMentor) {
      // every message sent by the user comes to this path
      // however when a host replies to a message it should go to
      // chatrooms/streamId/dm/userId
      // student should be listening to the above and announcements
      // but message should be sent to chatrooms/streamId/dm/userId and chatrooms/streamId/qa/messages
      // @ts-ignore
      db.ref(`messages/${streamId}/dm/${user.uid}`).on('child_added', data => {
        console.log('dm', data.val())
        console.log(data.key)
        let messages: any= [];
        // console.log(data.forEach((d:any) => messages.push(d.val())))
        // @ts-ignore
        // setMessages(prev => [...prev, messages]);
        db.ref(`messages/${streamId}/dm/${user.uid}/${data.key}`).on('child_added', message => {
          console.log('new message in dm', message.val())
          // @ts-ignore
          setMessages(prev => [...prev, message.val()]);
        })
      });
    }
  }, [user?.uid]);
  

  
  
  useEffect(() => {
    if (user && user.displayName) {
      db.ref(`messages/${streamId}/announcements`).on('child_added', snapshot => {
        // let messages: any[] = [];
        setMessages(prev => [...prev, snapshot.val()]);
  
      });
    }
  }, [user?.uid, assignedMentorForChat]);
  
  
  useEffect(() => {
    if (assignedMentorForChat && user && !user.isMentor) {
      console.log(`messages/${streamId}/dm/${assignedMentorForChat}/${user.uid}`)
      // @ts-ignore
      db.ref(`messages/${streamId}/dm/${assignedMentorForChat}/${user.uid}`).on('child_added', message => {
        console.log('student dm recieved', message.val())
        // @ts-ignore
        setMessages(prev => [...prev, message.val()]);
      });
    }
  }, [user?.uid, assignedMentorForChat]);
  
  const sendMessage = async (type: string, innerHtml: string, textContent: string, to?: string) => {
    const timestamp = Date.now();
    const paths = [];
    console.log('send Trig', user?.isMentor)
    if (user?.isMentor) {
      if (replyingTo.uid) {
        console.log('m')
          // @ts-ignore
        paths.push(`messages/${streamId}/dm/${user.uid}/${replyingTo.uid}`);
        // paths.push(`messages/${streamId}/qa`);
      } else {
        console.log('s')
        paths.push(`messages/${streamId}/announcements`);
      }
    } else {
      // @ts-ignore
      paths.push(`messages/${streamId}/dm/${assignedMentorForChat}/${user.uid}`);
      // paths.push(`messages/${streamId}/qa`);
    }
    for (const path of paths) {
      console.log(path)
      await db.ref(path).push({
        content: textContent,
        timestamp,
        type,
        user: auth().currentUser?.uid,
        sentBy: auth().currentUser?.displayName,
        mentor: user?.isMentor,
      });
    }
    
  }

  return (
    <MainContainer>
      <IonLoading
        isOpen={blocking}
        message={'sending...'}
        
      />
      
      <ChatContainer>
        { user?.isMentor &&  <ConversationHeader>
          <button>x</button>
          // @ts-ignore
          <ConversationHeader.Content
          userName={replyingTo.uid !== '' ? 'Replying to ' + replyingTo.displayName : 'Sending to everyone'}/>
        </ConversationHeader>}
        <MessageList>
          {
            messages.length > 0 ? messages.map(message =>
              <Message
                className={user?.isMentor ? 'mentor-message' : ''}
                onClick={() => {
                  if (user && user.isMentor) {
                    // @ts-ignore
                    if (replyingTo.uid === message.user || replyingTo.uid === user?.uid) {
                      setReplyingTo({displayName: '', uid: ''})
                    } else setReplyingTo({displayName: message.sentBy, uid: message.user})
                    // @ts-ignore
                    inputRef.current.focus();
                  }
                }
                }
                model={{
                  message: message.content,
                  direction: message.user === auth().currentUser?.uid || user && user.isMentor && message.mentor ? 'outgoing': '',
                  position: 'normal',
                  sentTime: message.timestamp,
                }}
              >
                <Message.Footer sender={message?.sentBy}
                sentTime={new Date(Number(message.timestamp)).toString().substr(0, 21)} />
              </Message>
            ): <p>No messages</p>
          }
          
        </MessageList>
        <MessageInput
          // @ts-ignore
          onSend={(innerHtml, textContent) => sendMessage('text', innerHtml, textContent )}
          ref={inputRef}
          attachButton={false}
          sendDisabled={false}
          sendButton={true}
          placeholder={'Type and press enter to send message'}
        />
      </ChatContainer>

    </MainContainer>
  )
}
export default Chat;