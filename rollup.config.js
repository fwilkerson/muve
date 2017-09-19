import commonjs from 'rollup-plugin-commonjs';

export default {
	input: 'src/index.js',
	name: 'deuce',
	output: [
		{file: 'dist/deuce.cjs.js', format: 'cjs'},
		{file: 'dist/deuce.js', format: 'es'},
		{file: 'dist/deuce.umd.js', format: 'umd'}
	],
	plugins: [commonjs({})]
};
