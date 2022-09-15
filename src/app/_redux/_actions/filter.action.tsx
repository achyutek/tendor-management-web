import { filterConstants } from "../_constants";

export const filterAction = (filterAction: string)=>{
    return {
        type : filterConstants.FILTER_ACTION,
        payload : filterAction
    }
    
};

export const resetFilterAction = ()=>{
    return {
        type : filterConstants.RESET_FILTER_ACTION,
    }
    
};

