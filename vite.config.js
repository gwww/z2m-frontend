import { sveltekit } from '@sveltejs/kit/vite';
import UnoCSS from 'unocss/vite';
import presetIcons from '@unocss/preset-icons';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		UnoCSS({
			presets: [
				presetIcons({
					extraProperties: {
						'display': 'inline-block',
						'vertical-align': 'middle',
					},
				}),
			],
		}),
		sveltekit(),
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	resolve: {
		alias: {
			mqtt: 'mqtt/dist/mqtt.min.js',
		}
	}
};

export default config;
