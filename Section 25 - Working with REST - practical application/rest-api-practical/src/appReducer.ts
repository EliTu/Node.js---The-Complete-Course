const SET_LOADING = 'SET_LOADING';
const AUTHENTICATE_EXISTING_USER = 'AUTHENTICATE_EXISTING_USER';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILED = 'LOGIN_FAILED';
const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
const SIGNUP_FAILED = 'SIGNUP_FAILED';
const SET_MOBILE_NAV = 'SET_MOBILE_NAV';
const SET_BACKDROP_CLICK = 'SET_BACKDROP_CLICK';
const SET_LOGOUT = 'SET_LOGOUT';
const NULL_ERROR = 'NULL_ERROR';

interface AppState {
	showBackdrop: boolean;
	showMobileNav: boolean;
	isAuth: boolean;
	token: string;
	userId: string;
	authLoading: boolean;
	error: any;
}

type Action =
	| { type: typeof SET_LOADING }
	| {
			type: typeof AUTHENTICATE_EXISTING_USER;
			payload: { token: AppState['token']; userId: AppState['userId'] };
	  }
	| {
			type: typeof SET_MOBILE_NAV;
			payload: {
				showMobileNav: AppState['showMobileNav'];
				showBackdrop: AppState['showBackdrop'];
			};
	  }
	| {
			type: typeof SET_BACKDROP_CLICK;
	  }
	| { type: typeof SET_LOGOUT }
	| {
			type: typeof LOGIN_SUCCESS;
			payload: { token: AppState['token']; userId: AppState['userId'] };
	  }
	| { type: typeof SIGNUP_SUCCESS }
	| { type: typeof LOGIN_FAILED; payload: { error: AppState['error'] } }
	| { type: typeof SIGNUP_FAILED; payload: { error: AppState['error'] } }
	| { type: typeof NULL_ERROR };

export const initialAppState: AppState = {
	showBackdrop: false,
	showMobileNav: false,
	isAuth: true,
	token: '',
	userId: '',
	authLoading: false,
	error: null,
};

export function appReducer(state: AppState, action: Action): AppState {
	switch (action.type) {
		case SET_LOADING: {
			return { ...state, authLoading: true };
		}

		case AUTHENTICATE_EXISTING_USER: {
			const { token, userId } = action.payload;
			return { ...state, isAuth: true, token, userId };
		}

		case SET_MOBILE_NAV: {
			const { showMobileNav, showBackdrop } = action.payload;
			return { ...state, showMobileNav, showBackdrop };
		}

		case SET_BACKDROP_CLICK: {
			return {
				...state,
				showBackdrop: false,
				showMobileNav: false,
				error: null,
			};
		}

		case SET_LOGOUT: {
			return { ...state, isAuth: false, token: '' };
		}

		case LOGIN_SUCCESS: {
			const { token, userId } = action.payload;
			return {
				...state,
				isAuth: true,
				authLoading: false,
				token,
				userId,
			};
		}

		case SIGNUP_SUCCESS: {
			return { ...state, isAuth: false, authLoading: false };
		}

		case LOGIN_FAILED:
		case SIGNUP_FAILED: {
			const { error } = action.payload;
			return { ...state, isAuth: false, authLoading: false, error };
		}

		case NULL_ERROR: {
			return { ...state, error: null };
		}

		default: {
			return state;
		}
	}
}
