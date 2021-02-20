import { NavLink } from 'react-router-dom';
import { NavigationProps, NavItem } from '../types';

import './NavigationItems.css';

const navItems: NavItem[] = [
	{ id: 'feed', text: 'Feed', link: '/', auth: true },
	{ id: 'login', text: 'Login', link: '/', auth: false },
	{ id: 'signup', text: 'Signup', link: '/signup', auth: false },
];

const NavigationItems: React.FC<NavigationProps> = ({
	isAuth,
	onLogout,
	onChooseItem,
	mobile,
}) => {
	return (
		<>
			{[
				...navItems
					.filter(({ auth }) => auth === isAuth)
					.map(({ id, link, text }) => (
						<li
							key={id}
							className={['navigation-item', mobile ? 'mobile' : ''].join(' ')}
						>
							<NavLink to={link} exact onClick={onChooseItem}>
								{text}
							</NavLink>
						</li>
					)),
				isAuth && (
					<li className='navigation-item' key='logout'>
						<button onClick={onLogout}>Logout</button>
					</li>
				),
			]}
		</>
	);
};
export default NavigationItems;
