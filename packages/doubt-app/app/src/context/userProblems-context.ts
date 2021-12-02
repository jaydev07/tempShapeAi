import {createContext} from 'react';

interface dataInterface{
    problemIds:Array<string>
}

export const UserProblemsContext = createContext<dataInterface>({
    problemIds:[]
});