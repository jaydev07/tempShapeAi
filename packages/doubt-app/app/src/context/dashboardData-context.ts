import {createContext} from 'react';

interface finalDataInterface{
    week:string;
    days:Array<any>;
}

interface dataInterface{
    data:Array<finalDataInterface>
}

export const DashboardDataContext = createContext<dataInterface>({
    data:[]
});