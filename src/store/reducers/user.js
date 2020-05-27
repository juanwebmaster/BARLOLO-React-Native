import { produce } from 'immer';
import { actions } from '../actions/user';

const initialState = {
    user: {},
    lang: 'en' // lang
}

export default function auth(state = initialState, { type, payload, error, meta }) {
    switch (type) {
        case actions.SET_USER:
            return produce(state, draft => {
                draft.user = payload.data;
            });
        case actions.SET_LANG:
            return produce(state, draft => {
                draft.lang = payload.data;
            });
        case actions.SET_USER_UPDATE_ADDRESS:
            return produce(state, draft => {
                const user = getters.getUpdateUserByAddress(state.user, payload.data);
                draft.user = user;
            });
        case actions.SET_USER_DELETE_ADDRESS:
            return produce(state, draft => {
                const user = getters.getDeletedUserByAddress(state.user, payload.data);
                draft.user = user;
            });
        default:
            return state;
    }
}

export const getters = {
    getUpdateUserByAddress: (user, addressToUpdate) => {
        let modifiedAddresses = user.addresses.map(address => {
            if (address.id == addressToUpdate.id) {
                address = addressToUpdate
            }
            return address
        })

        return { ...user, addresses: modifiedAddresses }
    },

    getDeletedUserByAddress: (user, addressToRemove) => {
        let modifiedAddresses = user.addresses.filter(
            address => address.id != addressToRemove.id
        )
        return { ...user, addresses: modifiedAddresses }
    }
}
