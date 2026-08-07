/**
 * The instrument's entry point.
 *
 * `drift-meter.html` carries the mount node and nothing else. This is the only
 * page on the site that loads JavaScript; the three prose pages are finished
 * documents and the build emits no chunk for them.
 */

import { render } from 'preact';
import { App } from './app.js';
import './styles/app.css';

const root = document.getElementById('app');
if (root === null) throw new Error('drift-meter.html is missing its #app mount node');

render(<App />, root);
