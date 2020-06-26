import svelte from 'rollup-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'

// are we in production mode?
const production = !process.env.ROLLUP_WATCH

export default {
	input: 'client/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		// compile the svelte
		svelte({
			// enable run-time checks when not in production
			dev: !production,

			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write('public/build/bundle.css')
			}
		}),

		// make sure that node modules are properly included
		resolve({
			browser: true,
			preferBuiltins: false,
			dedupe: ['svelte']
		}),

		// converts commonjs bundles to es6
		commonjs(),

		// in dev mode serve up the page
		!production && serve(),

		// reload the page whene the public dir changes
		// this includes the build folder
		!production && livereload('public'),

		// if in production mode, then minify
		production && terser()
	]
}

function serve() {
	let started = false

	return {
		writeBundle() {
			if (!started) {
				started = true

				require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				})
			}
		}
	}
}
