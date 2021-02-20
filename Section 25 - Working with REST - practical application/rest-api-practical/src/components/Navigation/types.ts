export interface NavigationProps {
	mobile: boolean;
	isAuth: boolean;
	open?: boolean;
	onLogout: () => void;
	onChooseItem?: () => void;
	onOpenMobileNav?: () => void;
}

export interface NavItem {
	id: string;
	text: string;
	link: string;
	auth: boolean;
}
