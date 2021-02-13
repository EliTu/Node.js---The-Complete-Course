import React, { useReducer, useEffect, useCallback } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import { appReducer, initialState, State, actionTypes } from './appReducer';
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
import './App.css';

function App(props): React.FC<{}> {
	const [state, dispatch] = useReducer(appReducer, initialState);
	const {
		authLoading,
		error,
		isAuth,
		showBackdrop,
		showMobileNav,
		token,
		userId,
	} = state;

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

	const loginHandler = async (event: React.SyntheticEvent, authData) => {
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

			const { token, userId } = res.json();

			dispatch({
				type: 'LOGIN_SUCCESS',
				payload: {
					token,
					userId,
				},
			});

			localStorage.setItem('token', token);
			localStorage.setItem('userId', userId);

			const remainingMilliseconds = 60 * 60 * 1000;
			const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);
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
	};

	const signupHandler = async (event: React.SyntheticEvent, authData) => {
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
			const data = res.json();

			console.log(data);
			dispatch({ type: 'SIGNUP_SUCCESS' });
			props.history.replace('/');
		} catch (error) {
			console.log(error);
			dispatch({
				type: 'LOGIN_FAILED',
				payload: {
					error,
				},
			});
		}
	};

	const setAutoLogout = useCallback((milliseconds: number) => {
		setTimeout(() => {
			logoutHandler();
		}, milliseconds);
	}, []);

	const errorHandler = () => {
		dispatch({ type: 'NULL_ERROR' });
	};

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

	let routes = (
		<Switch>
			<Route
				path='/'
				exact
				render={(props) => (
					<LoginPage
						{...props}
						onLogin={this.loginHandler}
						loading={this.state.authLoading}
					/>
				)}
			/>
			<Route
				path='/signup'
				exact
				render={(props) => (
					<SignupPage
						{...props}
						onSignup={this.signupHandler}
						loading={this.state.authLoading}
					/>
				)}
			/>
			<Redirect to='/' />
		</Switch>
	);
	if (this.state.isAuth) {
		routes = (
			<Switch>
				<Route
					path='/'
					exact
					render={(props) => (
						<FeedPage userId={this.state.userId} token={this.state.token} />
					)}
				/>
				<Route
					path='/:postId'
					render={(props) => (
						<SinglePostPage
							{...props}
							userId={this.state.userId}
							token={this.state.token}
						/>
					)}
				/>
				<Redirect to='/' />
			</Switch>
		);
	}
	return (
		<>
			{this.state.showBackdrop && (
				<Backdrop onClick={this.backdropClickHandler} />
			)}
			<ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
			<Layout
				header={
					<Toolbar>
						<MainNavigation
							onOpenMobileNav={this.mobileNavHandler.bind(this, true)}
							onLogout={this.logoutHandler}
							isAuth={this.state.isAuth}
						/>
					</Toolbar>
				}
				mobileNav={
					<MobileNavigation
						open={this.state.showMobileNav}
						mobile
						onChooseItem={this.mobileNavHandler.bind(this, false)}
						onLogout={this.logoutHandler}
						isAuth={this.state.isAuth}
					/>
				}
			/>
			{routes}
		</>
	);
}

export default withRouter(App);
