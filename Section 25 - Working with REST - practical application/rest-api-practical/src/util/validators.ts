interface Config {
	min?: number;
	max?: number;
}

export const required = (value: string) => value.trim() !== '';

export const length = (config: Config) => (value: string) => {
	let isValid = true;
	if (config.min) {
		isValid = isValid && value.trim().length >= config.min;
	}
	if (config.max) {
		isValid = isValid && value.trim().length <= config.max;
	}
	return isValid;
};

export const email = (value: string) =>
	/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
		value
	);
