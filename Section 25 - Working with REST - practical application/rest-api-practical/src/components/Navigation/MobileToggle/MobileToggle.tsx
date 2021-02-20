import { NavigationProps } from '../types';
import './MobileToggle.css';

const MobileToggle: React.FC<Pick<NavigationProps, 'onOpenMobileNav'>> = ({
	onOpenMobileNav,
}) => (
	<button className='mobile-toggle' onClick={onOpenMobileNav}>
		<span className='mobile-toggle__bar' />
		<span className='mobile-toggle__bar' />
		<span className='mobile-toggle__bar' />
	</button>
);

export default MobileToggle;
