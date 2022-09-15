import { filter } from "lodash";
import initialState from "../initialState";
import { filterConstants } from "../_constants/filter.constants";

export function filterReducer(state = initialState.filters,
    action:{type: string; payload: any}) {
        const payload = action.payload;
        switch (action.type){
            case  filterConstants.FILTER_ACTION :
                return {
                    ...state,
                    [payload.label] : payload.value,
                }
                case  filterConstants.RESET_FILTER_ACTION :
                    return initialState.filters
                default:
                    return state;
        }
        
    }