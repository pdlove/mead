const { useState, useEffect } = React;
import SidebarMenu from './SidebarMenu.jsx';
import NarrativeTab from './NarrativeTab.jsx';
import SceneCharactersTab from './SceneCharactersTab.jsx';

function App() {
    const [selected, setSelected] = useState({});
    const [activeSceneTab, setActiveSceneTab] = useState('Characters');
    const [masterCharacters, setMasterCharacters] = useState([]);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingScene, setEditingScene] = useState(false);
    const [editSceneData, setEditSceneData] = useState({});
    const [editingStory, setEditingStory] = useState(false);
    const [editStoryData, setEditStoryData] = useState({});
    const [editingChapter, setEditingChapter] = useState(false);
    const [editChapterData, setEditChapterData] = useState({});
    const [editingCharacter, setEditingCharacter] = useState(false);
    const [editCharacterData, setEditCharacterData] = useState({});

    // Load data on mount
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // Load stories with nested chapters and scenes
            const storiesResponse = await fetch('http://localhost:3001/api/stories');
            if (storiesResponse.ok) {
                const storiesData = await storiesResponse.json();
                setStories(storiesData);
            }

            // Load master characters
            const charactersResponse = await fetch('http://localhost:3001/api/characters');
            if (charactersResponse.ok) {
                const charactersData = await charactersResponse.json();
                setMasterCharacters(charactersData);
            }
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handlers for sidebar selection
    const handleSelectGlobalOptions = () => setSelected({ global: true });
    const handleSelectCharacterMasters = () => setSelected({ characterMasters: true });
    const handleSelectStory = (story) => setSelected({ storyId: story.id, story });
    const handleSelectChapter = (story, chapter) => setSelected({ storyId: story.id, story, chapterId: chapter.id, chapter });
    const handleSelectScene = (story, chapter, scene) => {
        setSelected({ storyId: story.id, story, chapterId: chapter.id, chapter, sceneId: scene.id, scene });
        setEditSceneData({ name: scene.name, description: scene.description });
        setEditingScene(false);
    };
    const handleSelectMasterCharacter = (character) => setSelected({ masterCharacterId: character.id, masterCharacter: character });
    const handleNewStory = () => alert('New Story');
    const handleNewChapter = (story) => alert(`New Chapter in ${story.name}`);
    const handleNewScene = (story, chapter) => alert(`New Scene in ${chapter.name}`);
    const handleNewCharacter = () => alert('New Character');

    // Scene editing handlers
    const handleEditScene = () => setEditingScene(true);
    const handleCancelEditScene = () => {
        setEditingScene(false);
        setEditSceneData({ name: selected.scene.name, description: selected.scene.description });
    };
    const handleSaveEditScene = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/scenes/${selected.scene.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: editSceneData.name,
                    description: editSceneData.description,
                    ChapterId: selected.scene.ChapterId,
                    scene_order: selected.scene.scene_order,
                    starting_prompt: selected.scene.starting_prompt,
                    status: selected.scene.status,
                    ending_state_summary: selected.scene.ending_state_summary,
                    narrative: selected.scene.narrative
                })
            });

            if (response.ok) {
                setEditingScene(false);
                // Update the scene data in the selected state
                const updatedScene = { ...selected.scene, name: editSceneData.name, description: editSceneData.description };
                setSelected({ ...selected, scene: updatedScene });

                // Update the scene in the stories data as well (for sidebar consistency)
                setStories(prevStories => prevStories.map(story => ({
                    ...story,
                    Chapters: story.Chapters.map(chapter => ({
                        ...chapter,
                        Scenes: chapter.Scenes.map(scene =>
                            scene.id === selected.scene.id
                                ? { ...scene, name: editSceneData.name, description: editSceneData.description }
                                : scene
                        )
                    }))
                })));
                console.log('Scene updated successfully');
            } else {
                console.error('Failed to save scene');
                alert('Failed to save scene. Please try again.');
            }
        } catch (error) {
            console.error('Error saving scene:', error);
            alert('Error saving scene. Please check your connection and try again.');
        }
    };
    const handleEditSceneChange = (field, value) => {
        setEditSceneData({ ...editSceneData, [field]: value });
    };

    // Story editing handlers
    const handleEditStory = () => {
        setEditingStory(true);
        setEditStoryData({ name: selected.story.name, description: selected.story.description });
    };
    const handleCancelEditStory = () => {
        setEditingStory(false);
        setEditStoryData({});
    };
    const handleSaveEditStory = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/stories/${selected.story.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: editStoryData.name,
                    description: editStoryData.description,
                    story_order: selected.story.story_order
                })
            });

            if (response.ok) {
                setEditingStory(false);
                const updatedStory = { ...selected.story, name: editStoryData.name, description: editStoryData.description };
                setSelected({ ...selected, story: updatedStory });
                // Update in stories list
                setStories(prevStories => prevStories.map(s =>
                    s.id === selected.story.id ? updatedStory : s
                ));
                console.log('Story updated successfully');
            } else {
                alert('Failed to save story. Please try again.');
            }
        } catch (error) {
            console.error('Error saving story:', error);
            alert('Error saving story. Please check your connection and try again.');
        }
    };
    const handleEditStoryChange = (field, value) => {
        setEditStoryData({ ...editStoryData, [field]: value });
    };

    // Chapter editing handlers
    const handleEditChapter = () => {
        setEditingChapter(true);
        setEditChapterData({ name: selected.chapter.name, description: selected.chapter.description });
    };
    const handleCancelEditChapter = () => {
        setEditingChapter(false);
        setEditChapterData({});
    };
    const handleSaveEditChapter = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/chapters/${selected.chapter.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    StoryId: selected.chapter.StoryId,
                    name: editChapterData.name,
                    description: editChapterData.description,
                    chapter_order: selected.chapter.chapter_order
                })
            });

            if (response.ok) {
                setEditingChapter(false);
                const updatedChapter = { ...selected.chapter, name: editChapterData.name, description: editChapterData.description };
                setSelected({ ...selected, chapter: updatedChapter });
                // Update in stories list
                setStories(prevStories => prevStories.map(story => ({
                    ...story,
                    Chapters: story.Chapters.map(ch =>
                        ch.id === selected.chapter.id ? updatedChapter : ch
                    )
                })));
                console.log('Chapter updated successfully');
            } else {
                alert('Failed to save chapter. Please try again.');
            }
        } catch (error) {
            console.error('Error saving chapter:', error);
            alert('Error saving chapter. Please check your connection and try again.');
        }
    };
    const handleEditChapterChange = (field, value) => {
        setEditChapterData({ ...editChapterData, [field]: value });
    };

    // Master Character editing handlers
    const handleEditCharacter = () => {
        setEditingCharacter(true);
        setEditCharacterData({ ...selected.masterCharacter });
    };
    const handleCancelEditCharacter = () => {
        setEditingCharacter(false);
        setEditCharacterData({});
    };
    const handleSaveEditCharacter = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/characters/${selected.masterCharacter.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editCharacterData)
            });

            if (response.ok) {
                setEditingCharacter(false);
                const updatedCharacter = { ...selected.masterCharacter, ...editCharacterData };
                setSelected({ ...selected, masterCharacter: updatedCharacter });
                // Update the character in the masterCharacters list
                setMasterCharacters(chars => chars.map(c =>
                    c.id === selected.masterCharacter.id ? updatedCharacter : c
                ));
                console.log('Character updated successfully');
            } else {
                alert('Failed to save character. Please try again.');
            }
        } catch (error) {
            console.error('Error saving character:', error);
            alert('Error saving character. Please check your connection and try again.');
        }
    };
    const handleEditCharacterChange = (field, value) => {
        setEditCharacterData({ ...editCharacterData, [field]: value });
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', marginBottom: '16px' }}>🔄</div>
                    <div>Loading AIWriter...</div>
                </div>
            </div>
        );
    }

    // Transform stories data to match expected format
    const transformedStories = stories.map(story => ({
        ...story,
        chapters: story.Chapters?.map(chapter => ({
            ...chapter,
            scenes: chapter.Scenes || []
        })) || []
    }));

    // Right-side content
    let rightContent = <div style={{ padding: 32 }}>Select an item from the menu.</div>;
    if (selected.global) {
        rightContent = <div style={{ padding: 32 }}><h2>Global Options</h2></div>;
    } else if (selected.characterMasters) {
        rightContent = <div style={{ padding: 32 }}><h2>Character Masters</h2></div>;
    } else if (selected.masterCharacter) {
        rightContent = (
            <div style={{ padding: 32 }}>
                {editingCharacter ? (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                            <input
                                value={editCharacterData.name || ''}
                                onChange={(e) => handleEditCharacterChange('name', e.target.value)}
                                style={{ fontSize: '24px', fontWeight: 'bold', border: '1px solid #ddd', padding: '8px', marginRight: '8px', flex: 1 }}
                            />
                            <button onClick={handleSaveEditCharacter} style={{ marginRight: '8px', padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                            <button onClick={handleCancelEditCharacter} style={{ padding: '8px 16px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                        </div>
                        <textarea
                            value={editCharacterData.description || ''}
                            onChange={(e) => handleEditCharacterChange('description', e.target.value)}
                            style={{ width: '100%', minHeight: '60px', border: '1px solid #ddd', padding: '8px', marginBottom: '16px' }}
                            placeholder="Character description..."
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div>
                                <h4>Personality</h4>
                                <textarea
                                    value={editCharacterData.personality || ''}
                                    onChange={(e) => handleEditCharacterChange('personality', e.target.value)}
                                    style={{ width: '100%', height: 100, border: '1px solid #ddd', padding: '8px' }}
                                />
                            </div>
                            <div>
                                <h4>Goals</h4>
                                <textarea
                                    value={editCharacterData.goals || ''}
                                    onChange={(e) => handleEditCharacterChange('goals', e.target.value)}
                                    style={{ width: '100%', height: 100, border: '1px solid #ddd', padding: '8px' }}
                                />
                            </div>
                        </div>
                        <div style={{ marginTop: 16 }}>
                            <h4>History</h4>
                            <textarea
                                value={editCharacterData.history || ''}
                                onChange={(e) => handleEditCharacterChange('history', e.target.value)}
                                style={{ width: '100%', height: 80, border: '1px solid #ddd', padding: '8px' }}
                            />
                        </div>
                        <div style={{ marginTop: 16 }}>
                            <h4>Knowledge</h4>
                            <textarea
                                value={editCharacterData.knowledge || ''}
                                onChange={(e) => handleEditCharacterChange('knowledge', e.target.value)}
                                style={{ width: '100%', height: 80, border: '1px solid #ddd', padding: '8px' }}
                            />
                        </div>
                        <div style={{ marginTop: 16 }}>
                            <label>Scene Role: </label>
                            <select
                                value={editCharacterData.scene_role || ''}
                                onChange={(e) => handleEditCharacterChange('scene_role', e.target.value)}
                                style={{ padding: '4px 8px', marginLeft: '8px' }}
                            >
                                <option value="protagonist">Protagonist</option>
                                <option value="antagonist">Antagonist</option>
                                <option value="background">Background</option>
                                <option value="environment">Environment</option>
                            </select>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                            <h2 style={{ margin: 0, marginRight: 8 }}>{selected.masterCharacter.name}</h2>
                            <span
                                style={{ cursor: 'pointer', opacity: 0.7, fontSize: '18px' }}
                                onClick={handleEditCharacter}
                                title="Edit Character"
                            >
                                ✏️
                            </span>
                        </div>
                        <div style={{ color: '#555', marginBottom: 16 }}>{selected.masterCharacter.description}</div>
                        <div style={{ marginTop: 16 }}>
                            <h3>Personality</h3>
                            <p>{selected.masterCharacter.personality}</p>
                            <h3>History</h3>
                            <p>{selected.masterCharacter.history}</p>
                            <h3>Goals</h3>
                            <p>{selected.masterCharacter.goals}</p>
                            <h3>Role</h3>
                            <p>{selected.masterCharacter.scene_role}</p>
                            <h3>Knowledge</h3>
                            <p>{selected.masterCharacter.knowledge}</p>
                        </div>
                    </div>
                )}
            </div>
        );
    } else if (selected.scene) {
        rightContent = (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ padding: '32px 32px 16px 32px' }}>
                    {editingScene ? (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                                <input
                                    value={editSceneData.name}
                                    onChange={(e) => handleEditSceneChange('name', e.target.value)}
                                    style={{ fontSize: '24px', fontWeight: 'bold', border: '1px solid #ddd', padding: '8px', marginRight: '8px', flex: 1 }}
                                />
                                <button onClick={handleSaveEditScene} style={{ marginRight: '8px', padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                                <button onClick={handleCancelEditScene} style={{ padding: '8px 16px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                            </div>
                            <textarea
                                value={editSceneData.description}
                                onChange={(e) => handleEditSceneChange('description', e.target.value)}
                                style={{ width: '100%', minHeight: '80px', border: '1px solid #ddd', padding: '8px', marginBottom: '8px' }}
                                placeholder="Scene description..."
                            />
                        </div>
                    ) : (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                <h2 style={{ margin: 0, marginRight: 8 }}>{selected.scene.name}</h2>
                                <span
                                    style={{ cursor: 'pointer', opacity: 0.7, fontSize: '18px' }}
                                    onClick={handleEditScene}
                                    title="Edit Scene"
                                >
                                    ✏️
                                </span>
                            </div>
                            <div style={{ color: '#555', display: 'flex', alignItems: 'flex-start' }}>
                                <span style={{ marginRight: 8 }}>📝</span>
                                <span>{selected.scene.description}</span>
                            </div>
                        </div>
                    )}
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <div style={{ borderBottom: '1px solid #eee', display: 'flex', gap: 24, paddingLeft: 32 }}>
                        {['Characters', 'AI Mode', 'Narrative'].map(tab => (
                            <div
                                key={tab}
                                style={{
                                    padding: '12px 0',
                                    cursor: 'pointer',
                                    borderBottom: activeSceneTab === tab ? '2px solid #2563eb' : 'none',
                                    color: activeSceneTab === tab ? '#2563eb' : '#222',
                                    fontWeight: activeSceneTab === tab ? 600 : 400,
                                    marginRight: 24,
                                }}
                                onClick={() => setActiveSceneTab(tab)}
                            >
                                {tab}
                            </div>
                        ))}
                    </div>
                    <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
                        {activeSceneTab === 'Characters' && (
                            <SceneCharactersTab
                                sceneId={selected.scene.id}
                                masterCharacters={masterCharacters}
                                onSave={() => {
                                    // Optional callback when characters are saved
                                }}
                            />
                        )}
                        {activeSceneTab === 'AI Mode' && <div>AI Mode (placeholder)</div>}
                        {activeSceneTab === 'Narrative' && (
                            <NarrativeTab
                                sceneId={selected.scene.id}
                                onSave={(narrative) => {
                                    // Update the scene narrative in local state
                                    const updatedScene = { ...selected.scene, narrative };
                                    setSelected({ ...selected, scene: updatedScene });
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    } else if (selected.chapter) {
        rightContent = (
            <div style={{ padding: 32 }}>
                {editingChapter ? (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                            <input
                                value={editChapterData.name || ''}
                                onChange={(e) => handleEditChapterChange('name', e.target.value)}
                                style={{ fontSize: '24px', fontWeight: 'bold', border: '1px solid #ddd', padding: '8px', marginRight: '8px', flex: 1 }}
                            />
                            <button onClick={handleSaveEditChapter} style={{ marginRight: '8px', padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                            <button onClick={handleCancelEditChapter} style={{ padding: '8px 16px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                        </div>
                        <textarea
                            value={editChapterData.description || ''}
                            onChange={(e) => handleEditChapterChange('description', e.target.value)}
                            style={{ width: '100%', minHeight: '80px', border: '1px solid #ddd', padding: '8px', marginBottom: '8px' }}
                            placeholder="Chapter description..."
                        />
                    </div>
                ) : (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                            <h2 style={{ margin: 0, marginRight: 8 }}>{selected.chapter.name}</h2>
                            <span
                                style={{ cursor: 'pointer', opacity: 0.7, fontSize: '18px' }}
                                onClick={handleEditChapter}
                                title="Edit Chapter"
                            >
                                ✏️
                            </span>
                        </div>
                        <div style={{ color: '#555' }}>{selected.chapter.description}</div>
                    </div>
                )}
            </div>
        );
    } else if (selected.story) {
        rightContent = (
            <div style={{ padding: 32 }}>
                {editingStory ? (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                            <input
                                value={editStoryData.name || ''}
                                onChange={(e) => handleEditStoryChange('name', e.target.value)}
                                style={{ fontSize: '24px', fontWeight: 'bold', border: '1px solid #ddd', padding: '8px', marginRight: '8px', flex: 1 }}
                            />
                            <button onClick={handleSaveEditStory} style={{ marginRight: '8px', padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                            <button onClick={handleCancelEditStory} style={{ padding: '8px 16px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                        </div>
                        <textarea
                            value={editStoryData.description || ''}
                            onChange={(e) => handleEditStoryChange('description', e.target.value)}
                            style={{ width: '100%', minHeight: '80px', border: '1px solid #ddd', padding: '8px', marginBottom: '8px' }}
                            placeholder="Story description..."
                        />
                    </div>
                ) : (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                            <h2 style={{ margin: 0, marginRight: 8 }}>{selected.story.name}</h2>
                            <span
                                style={{ cursor: 'pointer', opacity: 0.7, fontSize: '18px' }}
                                onClick={handleEditStory}
                                title="Edit Story"
                            >
                                ✏️
                            </span>
                        </div>
                        <div style={{ color: '#555' }}>{selected.story.description}</div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#f3f4f6' }}>
            <SidebarMenu
                stories={transformedStories}
                masterCharacters={masterCharacters}
                onSelectGlobalOptions={handleSelectGlobalOptions}
                onSelectCharacterMasters={handleSelectCharacterMasters}
                onSelectStory={handleSelectStory}
                onSelectChapter={handleSelectChapter}
                onSelectScene={handleSelectScene}
                onSelectMasterCharacter={handleSelectMasterCharacter}
                onNewStory={handleNewStory}
                onNewChapter={handleNewChapter}
                onNewScene={handleNewScene}
                onNewCharacter={handleNewCharacter}
                selected={selected}
            />
            <div style={{ flex: 1, minWidth: 0, height: '100vh', background: '#fff', overflow: 'auto' }}>
                {rightContent}
            </div>
        </div>
    );
}

export default App;