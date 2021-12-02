import { createContext } from "react";
import { IUser } from "../services/firebase";
export interface User extends IUser {
	isMentor: boolean;
	chatRoomIds?: string[];
	zoomConnected: boolean;
	
}
interface defaultUser {
	displayName: string;
	isMentor: boolean;
	chatRoomIds?: string[];
	uid: string;
	zoomConnected: boolean;
}
export const UserContext = createContext<User | defaultUser | null>({ displayName: '', isMentor: false, chatRoomIds: [], uid: '', zoomConnected: false });
