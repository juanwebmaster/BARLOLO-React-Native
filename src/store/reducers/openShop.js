import { produce } from 'immer';
import { actions } from '../actions/openShop';

const initialState = {
    EDIT_S: [],
    realname: 0,
}

export default function openShop(state = initialState, { type, payload, error, meta }) {
    switch (type) {
        case actions.sellerreg:
            return produce(state, draft => {
                draft.EDIT_S = payload.data;
            });
        case actions.storename:
            return produce(state, draft => {
                draft.realname = payload.data;
            });
        default:
            return state;
    }
}
