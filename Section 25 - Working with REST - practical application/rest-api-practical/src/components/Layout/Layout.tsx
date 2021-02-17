import './Layout.css';

interface LayoutProps {
	header: JSX.Element;
	mobileNav: JSX.Element;
}

const Layout: React.FC<LayoutProps> = ({ header, mobileNav, children }) => (
	<>
		<header className='main-header'>{header}</header>
		{mobileNav}
		<main className='content'>{children}</main>
	</>
);

export default Layout;
