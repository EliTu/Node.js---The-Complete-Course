import { Interface } from 'readline';
import NavigationItems from '../NavigationItems/NavigationItems';
import './MobileNavigation.css';

interface MobileNavigationProps {
	open: boolean;
	mobile: boolean;
	isAuth: boolean;
	onChooseItem: () => void;
	onLogout: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
	mobile,
	open,
}) => (
	<nav className={['mobile-nav', open ? 'open' : ''].join(' ')}>
		<ul className={['mobile-nav__items', mobile ? 'mobile' : ''].join(' ')}>
			<NavigationItems
				mobile
				onChoose={onChooseItem}
				isAuth={isAuth}
				onLogout={onLogout}
			/>
		</ul>
	</nav>
);

export default MobileNavigation;
