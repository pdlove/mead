import { render } from 'preact'
import './index.css'
import App from './app'
import { registerLicense } from '@syncfusion/ej2-base';
// Registering Syncfusion license key
registerLicense('ORg4AjUWIQA/Gnt3VVhhQlJDfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hTH5UdkJiUX5ccXRTRWFYWkd2')

render(<App />, document.getElementById('app'))
