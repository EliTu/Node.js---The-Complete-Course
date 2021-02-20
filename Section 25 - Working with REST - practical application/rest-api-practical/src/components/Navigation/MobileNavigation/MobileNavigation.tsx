import NavigationItems from '../NavigationItems/NavigationItems';
import { NavigationProps } from '../types';
import './MobileNavigation.css';

const MobileNavigation: React.FC<NavigationProps> = ({
	mobile,
	open,
	isAuth,
	onChooseItem,
	onLogout,
}) => (
	<nav className={['mobile-nav', open ? 'open' : ''].join(' ')}>
		<ul className={['mobile-nav__items', mobile ? 'mobile' : ''].join(' ')}>
			<NavigationItems
				mobile
				onChooseItem={onChooseItem}
				isAuth={isAuth}
				onLogout={onLogout}
			/>
		</ul>
	</nav>
);

export default MobileNavigation;
