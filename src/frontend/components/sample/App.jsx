import Control1 from './controls/Control1.jsx';
import Control2 from './controls/Control2.jsx';
import Control3 from './controls/Control3.jsx';
// Lazy load Control4 (only when needed)
const Control4 = React.lazy(() => import('./controls/Control4.jsx'));

function App() {
    const [isToggled, setIsToggled] = React.useState(false);

    const handleToggle = async () => {
        setIsToggled(!isToggled);
    };

    return (
            <div className="space-y-6">
                <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
                    React Lazy Loading Example
                </h1>

                <Control1 />
                <Control2 handleToggle={handleToggle} isToggled={isToggled} />
                {isToggled ? (<React.Suspense fallback={<div>Loading...</div>}><Control4 /></React.Suspense>) : <Control3 />}
            </div>
    );
}

const rootElement = document.getElementById('root');
ReactDOM.createRoot(rootElement).render(<App />);
