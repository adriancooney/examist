import { handleActions } from "redux-actions";

export default handleActions({
    USER_LOGIN: (state, action) => {
        let response = action.payload;

        if(response.key) {
            return {
                usename: "adrian",
                name: "Adrian Cooney",
                email: "cooney.adrian@gmail.com",
                key: response.key,
                loading: false
            };
        } else {
            return state;
        }
    },

    USER_LOADING: (state) => {
        return { ...state, loading: true };
    }
}, null);