const ControlWrapper = ({ title, children }) => (
    <div className="bg-blue-50 p-4 rounded-lg shadow-md mb-4 border-l-4 border-blue-400">
        <h3 className="font-bold text-lg text-blue-800 mb-2">{title}</h3>
        {children}
    </div>
);

export default ControlWrapper;
