const { useState } = React;

function SidebarMenu({
    stories = [],
    masterCharacters = [],
    onSelectGlobalOptions,
    onSelectCharacterMasters,
    onSelectStory,
    onSelectChapter,
    onSelectScene,
    onNewStory,
    onNewChapter,
    onNewScene,
    onNewCharacter,
    onSelectMasterCharacter,
    selected = {}
}) {
    // Character Masters always collapsed by default
    const [showCharacterMasters, setShowCharacterMasters] = useState(false);
    // All other sections expanded by default
    const [expandedStories, setExpandedStories] = useState(() => Object.fromEntries(stories.map(s => [s.id, true])));
    const [expandedChapters, setExpandedChapters] = useState(() => {
        const chapters = {};
        stories.forEach(story => story.chapters.forEach(chap => { chapters[chap.id] = true; }));
        return chapters;
    });

    const toggleStory = (storyId) => {
        setExpandedStories((prev) => ({ ...prev, [storyId]: !prev[storyId] }));
    };
    const toggleChapter = (chapterId) => {
        setExpandedChapters((prev) => ({ ...prev, [chapterId]: !prev[chapterId] }));
    };
    const toggleCharacterMasters = () => setShowCharacterMasters((prev) => !prev);

    return (
        <div style={{ width: 280, background: '#f7f7fa', height: '100vh', overflowY: 'auto', borderRight: '1px solid #ddd', padding: 0 }}>
            <div style={{ padding: '16px 12px', borderBottom: '1px solid #eee', fontWeight: 600, cursor: 'pointer', background: selected.global ? '#e0e7ff' : 'transparent', display: 'flex', alignItems: 'center' }}
                onClick={onSelectGlobalOptions}>
                <span style={{ marginRight: 8 }}>⚙️</span> Global Options
            </div>
            <div style={{ padding: '12px', borderBottom: '1px solid #eee', fontWeight: 600, cursor: 'pointer', background: selected.characterMasters ? '#e0e7ff' : 'transparent', display: 'flex', alignItems: 'center' }}
                onClick={onSelectCharacterMasters}>
                <span onClick={e => { e.stopPropagation(); toggleCharacterMasters(); }} style={{ marginRight: 8, fontSize: 16, cursor: 'pointer' }}>{showCharacterMasters ? '▼' : '▶'}</span>
                <span style={{ marginRight: 8 }}>👤</span> Character Masters
            </div>
            {showCharacterMasters && (
                <div style={{ marginLeft: 32 }}>
                    {masterCharacters.map(char => (
                        <div
                            key={char.id}
                            style={{
                                padding: '6px',
                                cursor: 'pointer',
                                background: selected.masterCharacterId === char.id ? '#f1f5f9' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                borderRadius: '4px',
                                transition: 'background-color 0.2s'
                            }}
                            onClick={() => onSelectMasterCharacter(char)}
                            draggable={true}
                            onDragStart={(e) => {
                                e.dataTransfer.setData('text/plain', JSON.stringify(char));
                                e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onDragEnd={(e) => {
                                e.target.style.opacity = '1';
                            }}
                            title="Drag to add to scene"
                        >
                            <span style={{ marginRight: 8 }}>👤</span> {char.name}
                        </div>
                    ))}
                    <div
                        style={{ padding: '6px', color: '#2563eb', cursor: 'pointer', fontStyle: 'italic', display: 'flex', alignItems: 'center' }}
                        onClick={onNewCharacter}
                    >
                        <span style={{ marginRight: 8 }}>➕</span> New Character
                    </div>
                </div>
            )}
            {stories.map(story => (
                <div key={story.id}>
                    <div
                        style={{
                            padding: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            background: selected.storyId === story.id ? '#dbeafe' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            borderBottom: '1px solid #f0f0f0'
                        }}
                        onClick={() => onSelectStory(story)}
                    >
                        <span onClick={e => { e.stopPropagation(); toggleStory(story.id); }} style={{ marginRight: 8, fontSize: 16, cursor: 'pointer' }}>
                            {expandedStories[story.id] ? '▼' : '▶'}
                        </span>
                        <span style={{ marginRight: 8 }}>📖</span> {story.name}
                    </div>
                    {expandedStories[story.id] && (
                        <div style={{ marginLeft: 24 }}>
                            {story.chapters.map(chapter => (
                                <div key={chapter.id}>
                                    <div
                                        style={{
                                            padding: '8px',
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                            background: selected.chapterId === chapter.id ? '#f0f9ff' : 'transparent',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                        onClick={() => onSelectChapter(story, chapter)}
                                    >
                                        <span onClick={e => { e.stopPropagation(); toggleChapter(chapter.id); }} style={{ marginRight: 8, fontSize: 14, cursor: 'pointer' }}>
                                            {expandedChapters[chapter.id] ? '▼' : '▶'}
                                        </span>
                                        <span style={{ marginRight: 8 }}>📄</span> {chapter.name}
                                    </div>
                                    {expandedChapters[chapter.id] && (
                                        <div style={{ marginLeft: 24 }}>
                                            {chapter.scenes.map(scene => (
                                                <div
                                                    key={scene.id}
                                                    style={{
                                                        padding: '6px',
                                                        cursor: 'pointer',
                                                        background: selected.sceneId === scene.id ? '#f1f5f9' : 'transparent',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    }}
                                                    onClick={() => onSelectScene(story, chapter, scene)}
                                                >
                                                    <span style={{ marginRight: 8 }}>🎬</span> {scene.name}
                                                </div>
                                            ))}
                                            <div
                                                style={{ padding: '6px', color: '#2563eb', cursor: 'pointer', fontStyle: 'italic', display: 'flex', alignItems: 'center' }}
                                                onClick={() => onNewScene(story, chapter)}
                                            >
                                                <span style={{ marginRight: 8 }}>➕</span> New Scene
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div
                                style={{ padding: '8px', color: '#2563eb', cursor: 'pointer', fontStyle: 'italic', display: 'flex', alignItems: 'center' }}
                                onClick={() => onNewChapter(story)}
                            >
                                <span style={{ marginRight: 8 }}>➕</span> New Chapter
                            </div>
                        </div>
                    )}
                </div>
            ))}
            <div
                style={{ padding: '12px', color: '#2563eb', cursor: 'pointer', fontStyle: 'italic', fontWeight: 600, display: 'flex', alignItems: 'center' }}
                onClick={onNewStory}
            >
                <span style={{ marginRight: 8 }}>➕</span> New Story
            </div>
        </div>
    );
}

export default SidebarMenu;