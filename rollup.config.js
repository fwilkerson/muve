import commonjs from 'rollup-plugin-commonjs';

export default {
	input: 'src/index.js',
	name: 'muve',
	output: [
		{file: 'dist/muve.cjs.js', format: 'cjs'},
		{file: 'dist/muve.js', format: 'es'},
		{file: 'dist/muve.umd.js', format: 'umd'}
	],
	plugins: [commonjs({})]
};
