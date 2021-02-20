import { NavLink } from 'react-router-dom';
import { NavigationProps } from '../types';

import MobileToggle from '../MobileToggle/MobileToggle';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';

import './MainNavigation.css';

const MainNavigation: React.FC<NavigationProps> = ({
	isAuth,
	onLogout,
	onOpenMobileNav,
}) => (
	<nav className='main-nav'>
		<MobileToggle onOpenMobileNav={onOpenMobileNav} />
		<div className='main-nav__logo'>
			<NavLink to='/'>
				<Logo />
			</NavLink>
		</div>
		<div className='spacer' />
		<ul className='main-nav__items'>
			<NavigationItems isAuth={isAuth} onLogout={onLogout} mobile={false} />
		</ul>
	</nav>
);

export default MainNavigation;
