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

export const actionTypes = {
	SET_LOADING,
	AUTHENTICATE_EXISTING_USER,
	LOGIN_SUCCESS,
	LOGIN_FAILED,
	SIGNUP_SUCCESS,
	SIGNUP_FAILED,
	SET_MOBILE_NAV,
	SET_BACKDROP_CLICK,
	SET_LOGOUT,
	NULL_ERROR,
};

export interface State {
	showBackdrop: boolean;
	showMobileNav: boolean;
	isAuth: boolean;
	token: string;
	userId: string;
	authLoading: boolean;
	error: any;
}

type Action =
	| { type: 'SET_LOADING' }
	| {
			type: 'AUTHENTICATE_EXISTING_USER';
			payload: { token: State['token']; userId: State['userId'] };
	  }
	| {
			type: 'SET_MOBILE_NAV';
			payload: {
				showMobileNav: State['showMobileNav'];
				showBackdrop: State['showBackdrop'];
			};
	  }
	| { type: 'SET_BACKDROP_CLICK' }
	| { type: 'SET_LOGOUT' }
	| {
			type: 'LOGIN_SUCCESS';
			payload: { token: State['token']; userId: State['userId'] };
	  }
	| { type: 'SIGNUP_SUCCESS' }
	| { type: 'LOGIN_FAILED'; payload: { error: State['error'] } }
	| { type: 'SIGNUP_FAILED'; payload: { error: State['error'] } }
	| { type: 'NULL_ERROR' };

export const initialState: State = {
	showBackdrop: false,
	showMobileNav: false,
	isAuth: true,
	token: '',
	userId: '',
	authLoading: false,
	error: null,
};

export function appReducer(state: State, action: Action): State {
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
