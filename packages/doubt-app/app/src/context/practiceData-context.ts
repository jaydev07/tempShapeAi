import {createContext} from 'react';

interface finalDataInterface{
    week:string;
    weekId:string;
    days:Array<any>;
}

interface dataInterface{
    data:Array<finalDataInterface>
}

export const PracticeDataContext = createContext<dataInterface>({
    data:[]
});