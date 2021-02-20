import { NavLink } from 'react-router-dom';

import './NavigationItems.css';

interface NavigationItemsProps {
	isAuth: boolean;
	mobile: boolean;
	onLogout: () => void;
	onChoose: () => void;
}

interface NavItem {
	id: string;
	text: string;
	link: string;
	auth: boolean;
}

const navItems: NavItem[] = [
	{ id: 'feed', text: 'Feed', link: '/', auth: true },
	{ id: 'login', text: 'Login', link: '/', auth: false },
	{ id: 'signup', text: 'Signup', link: '/signup', auth: false },
];

const NavigationItems: React.FC<NavigationItemsProps> = ({
	isAuth,
	mobile,
	onLogout,
	onChoose,
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
							<NavLink to={link} exact onClick={onChoose}>
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
