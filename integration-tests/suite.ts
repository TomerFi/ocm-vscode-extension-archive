import * as Mocha from 'mocha';
import * as glob from 'glob';
import * as path from 'path';

export function run(): Promise<void> {
	// Create the mocha test
	const mocha = new Mocha({
		ui: 'tdd',
		color: true,
		slow: 1100
	});

	const testsRoot: string = path.join(__dirname, 'test-files');

	return new Promise((c, e) => {
		glob('**/**.test.js', { cwd: testsRoot }, (err: Error | null, files: string[]) => {
			if (err) {
				return e(err);
			}

			// Add files to the test suite
			files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

			try {
				// Run the mocha test
				mocha.run(failures => {
					if (failures > 0) {
						e(new Error(`${failures} tests failed.`));
					} else {
						c();
					}
				});
			} catch (mocherr) {
				console.error(mocherr);
				e(mocherr);
			}
		});
	});
}
