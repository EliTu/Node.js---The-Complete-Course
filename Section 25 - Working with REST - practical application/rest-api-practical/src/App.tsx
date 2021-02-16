import { useReducer, useEffect, useCallback, useMemo } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import Backdrop from './components/Backdrop/Backdrop';
import Toolbar from './components/Toolbar/Toolbar';
import MainNavigation from './components/Navigation/MainNavigation/MainNavigation';
import MobileNavigation from './components/Navigation/MobileNavigation/MobileNavigation';
import ErrorHandler from './components/ErrorHandler/ErrorHandler';
import FeedPage from './pages/Feed/Feed';
import SinglePostPage from './pages/Feed/SinglePost/SinglePost';
import LoginPage from './pages/Auth/Login';
import SignupPage from './pages/Auth/Signup';

import { appReducer, initialAppState } from './appReducer';
import './App.css';

function App(): React.ReactNode {
	const [state, dispatch] = useReducer(appReducer, initialAppState);
	const {
		authLoading,
		error,
		isAuth,
		showBackdrop,
		showMobileNav,
		token,
		userId,
	} = state;
	const history = useHistory();

	const mobileNavHandler = (isOpen: boolean) => {
		dispatch({
			type: 'SET_MOBILE_NAV',
			payload: { showMobileNav: isOpen, showBackdrop: isOpen },
		});
	};

	const backdropClickHandler = () => {
		dispatch({
			type: 'SET_BACKDROP_CLICK',
		});
	};

	const logoutHandler = () => {
		dispatch({ type: 'SET_LOGOUT' });
		localStorage.removeItem('token');
		localStorage.removeItem('expiryDate');
		localStorage.removeItem('userId');
	};

	const setAutoLogout = useCallback((milliseconds: number) => {
		setTimeout(() => {
			logoutHandler();
		}, milliseconds);
	}, []);

	const errorHandler = () => {
		dispatch({ type: 'NULL_ERROR' });
	};

	const loginHandler = useCallback(
		async (event: React.SyntheticEvent, authData: any) => {
			event.preventDefault();
			dispatch({ type: 'SET_LOADING' });

			try {
				const res = await fetch('URL');
				if (res.status === 422) {
					throw new Error('Validation failed.');
				}
				if (res.status !== 200 && res.status !== 201) {
					console.log('Error!');
					throw new Error('Could not authenticate you!');
				}

				type jsonResponse = {
					token?: string;
					userId?: string;
				};

				const { token, userId }: jsonResponse = await res.json();

				if (token && userId) {
					dispatch({
						type: 'LOGIN_SUCCESS',
						payload: {
							token,
							userId,
						},
					});

					localStorage.setItem('userId', userId);
					localStorage.setItem('token', token);
				}

				const remainingMilliseconds = 60 * 60 * 1000;
				const expiryDate = new Date(
					new Date().getTime() + remainingMilliseconds
				);
				localStorage.setItem('expiryDate', expiryDate.toISOString());

				setAutoLogout(remainingMilliseconds);
			} catch (error) {
				console.log(error);

				dispatch({
					type: 'LOGIN_FAILED',
					payload: {
						error,
					},
				});
			}
		},
		[setAutoLogout]
	);

	const signupHandler = useCallback(
		async (event: React.SyntheticEvent, authData: any) => {
			event.preventDefault();
			dispatch({ type: 'SET_LOADING' });

			try {
				const res = await fetch('URL');

				if (res.status === 422) {
					throw new Error(
						"Validation failed. Make sure the email address isn't used yet!"
					);
				}
				if (res.status !== 200 && res.status !== 201) {
					console.log('Error!');
					throw new Error('Creating a user failed!');
				}
				const data = await res.json();

				console.log(data);

				dispatch({ type: 'SIGNUP_SUCCESS' });
				history.replace('/');
			} catch (error) {
				console.log(error);

				dispatch({
					type: 'LOGIN_FAILED',
					payload: {
						error,
					},
				});
			}
		},
		[history]
	);

	useEffect(() => {
		const token = localStorage.getItem('token');
		const expiryDate = localStorage.getItem('expiryDate');
		if (!token || !expiryDate) {
			return;
		}
		if (new Date(expiryDate) <= new Date()) {
			logoutHandler();
			return;
		}

		const userId = localStorage.getItem('userId');
		const remainingMilliseconds =
			new Date(expiryDate).getTime() - new Date().getTime();

		if (userId && token) {
			dispatch({
				type: 'LOGIN_SUCCESS',
				payload: { token, userId },
			});
		}

		setAutoLogout(remainingMilliseconds);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	let routes = useMemo(() => {
		!isAuth ? (
			<Switch>
				<Route
					path='/'
					exact
					render={(props) => (
						<LoginPage
							{...props}
							onLogin={loginHandler}
							loading={authLoading}
						/>
					)}
				/>
				<Route
					path='/signup'
					exact
					render={(props) => (
						<SignupPage
							{...props}
							onSignup={signupHandler}
							loading={authLoading}
						/>
					)}
				/>
				<Redirect to='/' />
			</Switch>
		) : (
			<Switch>
				<Route
					path='/'
					exact
					render={(props) => <FeedPage userId={userId} token={token} />}
				/>
				<Route
					path='/:postId'
					render={(props) => (
						<SinglePostPage {...props} userId={userId} token={token} />
					)}
				/>
				<Redirect to='/' />
			</Switch>
		);
	}, [authLoading, isAuth, loginHandler, signupHandler, token, userId]);

	return (
		<>
			{showBackdrop && (
				<Backdrop open={showBackdrop} onClick={backdropClickHandler} />
			)}
			<ErrorHandler error={error} onHandle={errorHandler} />
			<Layout
				header={
					<Toolbar>
						<MainNavigation
							onOpenMobileNav={mobileNavHandler(true)}
							onLogout={logoutHandler}
							isAuth={state.isAuth}
						/>
					</Toolbar>
				}
				mobileNav={
					<MobileNavigation
						open={showMobileNav}
						mobile
						onChooseItem={mobileNavHandler(false)}
						onLogout={logoutHandler}
						isAuth={isAuth}
					/>
				}
			/>
			{routes}
		</>
	);
}

export default App;
