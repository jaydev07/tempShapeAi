
// @ts-ignore
import {MainContainer, ChatContainer, MessageList, Message, MessageInput, ConversationHeader, Avatar, } from "@chatscope/chat-ui-kit-react";

import { db, auth, storage } from '../services/firebase';
import { useEffect, FC, useState, useRef } from "react";
import { text } from "ionicons/icons";
import { useIonRouter, IonLoading } from "@ionic/react";

type chatTypes = 'gc' | 'dm';
interface IProps {
  chatPath: string;
  canSendMessage: boolean; chatType: chatTypes;
  setView?: any;
  name?: string;
  showHeader: boolean;
  attachButton?: false;
}

interface IMessage {
  content: string;
  timestamp: string;
  user: string;
  sentBy: string;
  type: string;
}

const Chat: FC<IProps> = ({ chatPath, canSendMessage ,chatType,setView, name, showHeader, attachButton}) => {
  // fetch user batch
  // fetch batch info
  // fetch messages by batchId
  
  const router = useIonRouter();
  const [messages, setMessages] = useState<IMessage[] | []>([]);
  const [user, setUser] = useState({
    uid: undefined,
    displayName: undefined
  });
  const [isQa, setIsQA] = useState(false);
  const [chatRoomId] = useState(chatPath.replace('messages/', ''));
  const [blocking, setBlocking] = useState(false);
  
  const getUser = async () => {
    // @ts-ignore
    setUser(auth().currentUser);
  }
  
  useEffect(() => {
    // storage.ref('images/1623330300641.jpg').
    if (auth().currentUser) getUser()
  }, [auth().currentUser]);
  
  useEffect(() => {
    console.log({chatPath});
    if (chatPath) db.ref(chatPath).on("value", snapshot => {
      let messages: any[] = [];
      snapshot.forEach((snap) => {
        messages.push(snap.val());
      });
      // @ts-ignore
      setMessages(messages);
    });
  }, [chatRoomId]);
  const fileInput = useRef(null);
  
  const sendMessage = async (type: string, innerHtml: string, textContent: string, imgPath: string = 'null') => {
    const timestamp = Date.now();
    console.log({ user })
    await db.ref(chatPath).push({
      content: textContent,
      imgPath,
      timestamp,
      type,
      user: user?.uid,
      sentBy: user?.displayName,
    });
    
    // since the set() overwrites the existing data at a given node, this will be only used
    // for qa chats as it doesn't have any other important information
    console.log(chatPath, chatPath.replace('messages', 'chatrooms'))
   if (chatPath.includes('/qa/')) await db.ref(chatPath.replace('messages', 'chatrooms')).set({
      lastSent: {
        timestamp,
        message: textContent,
        user: auth().currentUser?.uid,
        sentBy: auth().currentUser?.displayName,
      }
    });
  }
  // @ts-ignore
  // @ts-ignore
  return (
    <MainContainer>
      <IonLoading
        isOpen={blocking}
        message={'sending...'}
        
      />
      <ChatContainer>
        {showHeader && <ConversationHeader>
          {setView && <ConversationHeader.Back onClick={() => setView('messages')}/>}
          <Avatar src={`https://d3e54v103j8qbb.cloudfront.net/img/background-image.svg`} name="DoubtSpot"/>
          <ConversationHeader.Content userName={name || 'Chat'}/>
        </ConversationHeader>}
        <MessageList>
          {
            messages.length > 0 ? messages.map(message =>
              <Message
                model={{
                  message: message.content,
                  direction: message.user === auth().currentUser?.uid ? 'outgoing': '',
                  position: 'normal',
                  sentTime: message.timestamp,
                }}
              >
                { message.type === 'image' && <Message.ImageContent
                  src={message.content}
                />
                }
                <Message.Footer sender={message?.sentBy}
                sentTime={new Date(Number(message.timestamp)).toString().substr(0, 21)} />
              </Message>
            ): <p>No messages</p>
          }
          
        </MessageList>

        <MessageInput
          // @ts-ignore
          onSend={(innerHtml, textContent) => sendMessage('text', innerHtml, textContent)}
          attachButton={Boolean(attachButton)}
          disabled={!canSendMessage}
          sendDisabled={!canSendMessage}
          sendButton={canSendMessage}
          placeholder={canSendMessage ? 'Type your message here': 'Only admins can send messages to this channel'}
          // @ts-ignore
          onAttachClick={() => fileInput?.current?.click()}
          className={'af-class-div-block-6'}
        />

      </ChatContainer>
      <input
        ref={fileInput}
        style={{ display: 'none' }}
        multiple
        type="file"
        accept="image/*"
        onChange={async function (this: any, e: any) {
          // @ts-ignore
          for (const file of fileInput?.current.files) {
            const ref = await storage.child(`images/${new Date().getTime()}.jpg`).put(file);
            await sendMessage('image', '', await storage.child(ref.ref.fullPath).getDownloadURL() ,ref.ref.fullPath)
          }
          setBlocking(false);
  
        }}
        id={'input-image'}
        onClick={() => {
          console.log('onClick');
        }}
      />
    </MainContainer>
  )
}
export default Chat;