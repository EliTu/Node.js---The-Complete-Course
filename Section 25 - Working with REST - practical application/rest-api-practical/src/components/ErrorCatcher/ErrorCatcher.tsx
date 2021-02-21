import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorProps {
	children: ReactNode;
}

interface ErrorState {
	hasError: boolean;
}

class ErrorCatcher extends Component<ErrorProps, ErrorState> {
	public state: ErrorState = {
		hasError: false,
	};

	public static getDerivedStateFromError(error: Error): ErrorState {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// You can also log the error to an error reporting service
		console.error('Error caught:', error, errorInfo);
	}

	public render() {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return <h1>Oopsie!</h1>;
		}

		return this.props.children;
	}
}

export default ErrorCatcher;
