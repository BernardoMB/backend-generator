import { init } from './main';
(async function main() {
	console.log('Starting application:', process.env.APPLICATION_NAME);
	console.log('Logging level:', process.env.LOGGING_LEVEL);
	console.log('Log folder:', process.env.LOG_FOLDER);
  await init();
})();
