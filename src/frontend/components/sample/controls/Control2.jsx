import ControlWrapper from './ControlWrapper.jsx';

const Control2 = ({ handleToggle, isToggled }) => (
    <ControlWrapper title="Control 2 with Toggle">
        <p className="mb-2">Click the button to toggle the third control.</p>
        <button
            onClick={handleToggle}
            className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-full shadow-lg hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105"
        >
            {isToggled ? 'Show Control 3' : 'Show Control 4'}
        </button>
    </ControlWrapper>
);

export default Control2;

