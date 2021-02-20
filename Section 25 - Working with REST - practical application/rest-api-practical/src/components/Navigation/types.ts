export interface NavigationProps {
	mobile: boolean;
	isAuth: boolean;
	open?: boolean;
	onChooseItem?: () => void;
	onLogout: () => void;
	onOpenMobileNav?: () => void;
}

export interface NavItem {
	id: string;
	text: string;
	link: string;
	auth: boolean;
}
