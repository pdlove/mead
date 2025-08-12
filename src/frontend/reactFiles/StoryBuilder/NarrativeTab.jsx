const { useState, useEffect } = React;
import ReactMarkdown from 'react-markdown';

function NarrativeTab({ sceneId, onSave, onLoad }) {
    const [narrative, setNarrative] = useState('');
    const [isPreview, setIsPreview] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);

    // Load narrative when scene changes
    useEffect(() => {
        if (sceneId) {
            loadNarrative();
        }
    }, [sceneId]);

    const loadNarrative = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:3001/api/scenes/${sceneId}`);
            if (response.ok) {
                const scene = await response.json();
                setNarrative(scene.narrative || getDefaultNarrative());
            } else if (response.status === 404) {
                // Scene not found, use default
                setNarrative(getDefaultNarrative());
            } else {
                throw new Error('Failed to load narrative');
            }
        } catch (error) {
            console.error('Failed to load narrative:', error);
            setNarrative(getDefaultNarrative());
        } finally {
            setIsLoading(false);
        }
    };

    const getDefaultNarrative = () => {
        return `# Scene Narrative

Start writing your narrative here...

## Chapter Summary

*Add your chapter summary here*

## Key Events

- Event 1
- Event 2  
- Event 3

## Character Actions

- Character thoughts and actions
- Dialogue and interactions
- Environmental descriptions

## Notes

*Any additional notes or ideas for this scene*`;
    };

    const saveNarrative = async () => {
        setIsSaving(true);
        try {
            // First get the current scene data
            const getResponse = await fetch(`http://localhost:3001/api/scenes/${sceneId}`);
            if (!getResponse.ok) {
                throw new Error('Failed to get current scene data');
            }
            const currentScene = await getResponse.json();

            // Then update with the new narrative
            const response = await fetch(`http://localhost:3001/api/scenes/${sceneId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...currentScene,
                    narrative: narrative
                })
            });
            if (response.ok) {
                setLastSaved(new Date());
                if (onSave) onSave(narrative);
            } else {
                throw new Error('Failed to save narrative');
            }
        } catch (error) {
            console.error('Failed to save narrative:', error);
            alert('Failed to save narrative. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleKeyDown = (e) => {
        // Ctrl+S to save
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveNarrative();
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Toolbar */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid #eee',
                marginBottom: '16px'
            }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => setIsPreview(false)}
                        style={{
                            padding: '8px 16px',
                            background: !isPreview ? '#2563eb' : '#e5e7eb',
                            color: !isPreview ? 'white' : '#374151',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        ✏️ Edit
                    </button>
                    <button
                        onClick={() => setIsPreview(true)}
                        style={{
                            padding: '8px 16px',
                            background: isPreview ? '#2563eb' : '#e5e7eb',
                            color: isPreview ? 'white' : '#374151',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        👁️ Preview
                    </button>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {lastSaved && (
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>
                            Last saved: {lastSaved.toLocaleTimeString()}
                        </span>
                    )}
                    <button
                        onClick={loadNarrative}
                        disabled={isLoading}
                        style={{
                            padding: '8px 16px',
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            opacity: isLoading ? 0.6 : 1
                        }}
                    >
                        {isLoading ? '🔄' : '📥'} Load
                    </button>
                    <button
                        onClick={saveNarrative}
                        disabled={isSaving}
                        style={{
                            padding: '8px 16px',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: isSaving ? 'not-allowed' : 'pointer',
                            opacity: isSaving ? 0.6 : 1
                        }}
                    >
                        {isSaving ? '⏳' : '💾'} Save
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
                {isPreview ? (
                    <div style={{
                        height: '100%',
                        overflow: 'auto',
                        padding: '16px',
                        background: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px'
                    }}>
                        <ReactMarkdown>{narrative}</ReactMarkdown>
                    </div>
                ) : (
                    <textarea
                        value={narrative}
                        onChange={(e) => setNarrative(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Write your narrative in Markdown format..."
                        style={{
                            width: '100%',
                            height: '100%',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            padding: '16px',
                            fontSize: '14px',
                            fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                            resize: 'none',
                            outline: 'none'
                        }}
                    />
                )}
            </div>

            {/* Help Text */}
            <div style={{
                marginTop: '8px',
                padding: '8px',
                background: '#f3f4f6',
                borderRadius: '4px',
                fontSize: '12px',
                color: '#6b7280'
            }}>
                💡 Tip: Use Markdown syntax (# headers, **bold**, *italic*, - lists). Press Ctrl+S to save.
            </div>
        </div>
    );
}

export default NarrativeTab;