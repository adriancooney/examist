import { handleActions } from "redux-actions";

export default handleActions({
    USER_LOGIN: {
        next(state, action) {
            let response = action.payload;

            if(response.key) {
                return {
                    id: 1,
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

        error(state) {
            return state;
        }
    }
}, null);