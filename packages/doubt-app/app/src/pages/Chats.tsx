import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Page.css";
import React, { useEffect, useState, useContext } from "react";
import { auth, db } from "../services/firebase";
import { useIonRouter } from "@ionic/react";
import { UserContext } from "../context/user-context";
import {
  ConversationList,
  Conversation,
  Avatar,
}
// @ts-ignore
from "@chatscope/chat-ui-kit-react";
import Chat from "../components/Chat";

interface Mentor {
  name: string;
  uid: string;
}

interface Chat {
  name: string;
  mentors?: Mentor[];
  path?: string;
  metaPath?: string;
  canSendMessage?: boolean;
  type?: "gc" | "dm";
  cid?: string;
  lastMessage?: string;
  lastSenderName?: string;
}

const Chats: React.FC = () => {
  const router = useIonRouter();
  const user = useContext(UserContext);
  // const [user, setUser] = useState<{ chatRoomIds: string[], uid?: string } >({ chatRoomIds: [] });
  const [chats, setChats] = useState<Chat[] | []>([]);
  const [view, setView] = useState("messages");
  const [chat, setChat] = useState<Chat | null>();
  const [loading, setLoading] = useState(true);
  const [assignedChatRoom, setAssignedChatRoom] = useState<{ name: string; key: string; }>();
  const [assignedChatMentor, setAssignedChatMentor] = useState({
    user: "",
    name: "",
  });
  
  useEffect(() => {
    console.log(chats
      
      
      
      
      
    )
  }, [chats]);
  const ConversationItem: React.FC<{
    lastSenderName?: string;
    info?: string;
    className?: string;
    onClick?: () => void;
    name?: string;
  }> = ({ lastSenderName, info, className, onClick, name }) => {
    return (
      <>
        <div onClick={onClick} className="af-class-profile-card">
          <div className="af-class-profile_img" />
          <div className="af-class-name-des-wrapper">
            <h3 className="af-class-heading-2">{name}</h3>
            <div className="af-class-text-block-3">
              {lastSenderName ? lastSenderName + ": " : ""}
              {info}
            </div>
          </div>
        </div>
      </>
    );
  };

  // chatrooms is for storing metadata and information
  // messages is for storing actual messages

  const loadAnnouncementChannels = (loadQAs: boolean, uid: string) => {
    console.log('dvevev', user?.chatRoomIds)
    // @ts-ignore
    user.chatRoomIds.forEach((cid: string) => {
      // get all the announcements channels the user is part in
      db.ref(`chatrooms/${cid}`)
        .once("value")
        .then((r: { exists: () => any; val: () => any; }) => {
          if (r.exists()) {
            let chat = r.val();
            // @ts-ignore
            setChats((prev) => [
              ...prev,
              {
                name: chat.name,
                // mentors: Object.keys(chat.mentors).map((k) => chat.mentors[k]),
                path: `messages/${cid}/announcements`,
                cid,
              },
            ]);
          }
        });
    });
    // if user is a mentor load QA channels created with their respective botch/rooms
    if (loadQAs)
      { // @ts-ignore
        db.ref(`chatrooms/${user?.chatRoomIds[0]}/qa`).on("child_added", (data: { val: () => any; }) => {
                let chat = data.val();
                console.log({ chat });
                setChats((prev) => [
                  ...prev,
                  {
                    name: chat.lastSent.sentBy,
                    // @ts-ignore
                    path: `messages/${user?.chatRoomIds[0]}/qa/${chat.lastSent.user}`,
                    canSendMessage: true,
                    type: "dm",
                    lastMessage: chat.lastSent.message,
                    lastSenderName:
                      chat.lastSent.user === uid ? "You" : chat.lastSent.sentBy,
                  },
                ]);
              });
      }
    setLoading(false);
  };

  useEffect(() => {
    // @ts-ignore
    if (user !== null && "uid" in user && user.chatRoomIds?.length > 0) {
      console.log(user.isMentor, user.uid);
      loadAnnouncementChannels(user.isMentor, user.uid);
    }
    if (!user?.isMentor) {
      // @ts-ignore
      db.ref(`users/${user?.uid}/assignedChatRoom`).once(
        "value",
        (chatroom: { val: () => React.SetStateAction<{ user: string; name: string; }>; exists: () => any; }) => {
          if (chatroom.exists()) {
            // @ts-ignore
            db.ref(`chatrooms/${chatroom.val()}/name`).once('value', snap => {
              console.log('crrr', { name: snap.val(), key: chatroom.val() })
              // @ts-ignore
              setAssignedChatRoom({ name: snap.val(), key: chatroom.val() });
  
            })
          }
        }
      );
    }
  }, [user]);

  const renderMessagesView = () => {
    // console.log('l')
    return (
      <>
        <IonContent fullscreen>
          <span>
            <style
              dangerouslySetInnerHTML={{
                __html: `
          @import url(/css/normalize.css);
          @import url(/css/webflow.css);
          @import url(/css/shape-ai-chat-platform.webflow.css);
        `,
              }}
            />
            <span className="af-view">
              <div className="af-class-body-3">
                <div className="af-class-div-block-8">
                  <div>
                    <img
                      src="images/SHAPEAI-white.svg"
                      loading="lazy"
                      width={118}
                    />
                  </div>
                </div>
                <div className="af-class-div-block-9">
                  {
                    // loads all announcement and dm chats for the mentor and student
                    !loading &&
                      chats &&
                      chats.length > 0 &&
                      chats.map((chat) => (
                        <ConversationItem
                          lastSenderName={chat.lastSenderName}
                          info={'Course Channel'}
                          className={"conversation-item"}
                          onClick={() => {
                            setView("chat");
                            setChat({
                              name: chat.name,
                              type: chat.type,
                              path: chat.path,
                              canSendMessage: user?.isMentor,
                            });
                          }}
                          name={chat.name}
                        >
                          <Avatar
                            src={`https://shapeai-uploads.s3.ap-south-1.amazonaws.com/images/${
                              chat.type || "gc"
                            }.png`}
                          />
                        </ConversationItem>
                      ))
                  }

                  {
                    // renders 'Ask a Mentor' channel for each chatRoomId the user is in
                    !loading &&
                      !user?.isMentor &&
                      assignedChatRoom?.name &&
                      chats.map((chat) => (
                        <ConversationItem
                          lastSenderName={chat.lastSenderName}
                          info={"Instructor Channel"}
                          className={"conversation-item"}
                          name={assignedChatRoom.name}
                          onClick={() => {
                            setView("chat");
                            setChat({
                              name: chat.name,
                              type: "dm",
                              // @ts-ignore
                              path: `messages/${assignedChatRoom.key}/qa/${user.uid}`,
                              canSendMessage: true,
                            });
                          }}
                        />
                      ))
                  }
                </div>
              </div>
            </span>
          </span>
        </IonContent>
      </>
    );
  };

  return (
    <div>
      {view === "messages" ? (
        renderMessagesView()
      ) : (
        <Chat
          showHeader={true}
          name={chat?.name}
          canSendMessage={chat?.canSendMessage || false}
          chatType={chat?.type || "gc"}
          chatPath={chat?.path || "messages"}
          setView={setView}
        />
      )}
    </div>
  );
};

export default Chats;
