import puppeteer from 'puppeteer';
export const getBrowser = async () => {
	if (!global.browser) {
		global.browser = await puppeteer.launch({
			args: [
				"--no-sandbox",
				"--disable-setuid-sandbox",
				"--disable-dev-shm-usage",
			],
			headless: true,
		});
	}
	return global.browser;
};
