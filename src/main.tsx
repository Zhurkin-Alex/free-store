import { ContainerNode, render } from 'preact';


import './styles.css';
import App from './App';

render(<App />, document.getElementById('root') as ContainerNode);
