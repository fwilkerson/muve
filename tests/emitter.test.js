import test from 'tape';
import jsdom from 'jsdom-global';

import emitter from '../src/emitter';

test('emitter', t => {
	try {
		emitter.emit('test', {message: 'test'});
	} catch (e) {
		t.notOk(e, 'emitter failed to emit when no handlers were assigned');
	}
	t.end();
});
