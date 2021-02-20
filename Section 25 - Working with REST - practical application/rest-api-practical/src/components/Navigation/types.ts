export interface NavigationProps {
	mobile: boolean;
	isAuth: boolean;
	open?: boolean;
	onLogout: () => void;
	onChooseItem?: (isOpen: boolean) => void;
	onOpenMobileNav?: (isOpen: boolean) => void;
}

export interface NavItem {
	id: string;
	text: string;
	link: string;
	auth: boolean;
}
