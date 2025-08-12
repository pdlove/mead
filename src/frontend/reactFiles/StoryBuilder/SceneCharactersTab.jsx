const { useState, useEffect } = React;
import Modal from './Modal';

function SceneCharactersTab({ sceneId, masterCharacters = [], onSave }) {
    const [sceneCharacters, setSceneCharacters] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCharacter, setNewCharacter] = useState({
        name: '',
        description: '',
        personality: '',
        history: '',
        goals: '',
        scene_role: '',
        knowledge: '',
        masterCharacterId: ''
    });
    const [dragOver, setDragOver] = useState(false);

    // Load scene characters when scene changes
    useEffect(() => {
        if (sceneId) {
            loadSceneCharacters();
        }
    }, [sceneId]);

    const loadSceneCharacters = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:3001/api/scenes/${sceneId}/characters`);
            if (response.ok) {
                const characters = await response.json();
                setSceneCharacters(characters);
            }
        } catch (error) {
            console.error('Failed to load scene characters:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (character) => {
        setEditingId(character.id);
        setEditData({ ...character });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditData({});
    };

    const handleSaveEdit = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/scene-characters/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData)
            });
            if (response.ok) {
                setSceneCharacters(chars => chars.map(c => c.id === editingId ? { ...c, ...editData } : c));
                setEditingId(null);
                setEditData({});
                if (onSave) onSave();
            }
        } catch (error) {
            console.error('Failed to save character:', error);
        }
    };

    const handleDelete = async (characterId) => {
        if (window.confirm('Are you sure you want to remove this character from the scene?')) {
            try {
                const response = await fetch(`http://localhost:3001/api/scene-characters/${characterId}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    setSceneCharacters(chars => chars.filter(c => c.id !== characterId));
                    if (onSave) onSave();
                }
            } catch (error) {
                console.error('Failed to delete character:', error);
            }
        }
    };

    const handleAddCharacter = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/scenes/${sceneId}/characters`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCharacter)
            });
            if (response.ok) {
                const addedCharacter = await response.json();
                setSceneCharacters(chars => [...chars, addedCharacter]);
                setNewCharacter({
                    name: '',
                    description: '',
                    personality: '',
                    history: '',
                    goals: '',
                    scene_role: '',
                    knowledge: '',
                    masterCharacterId: ''
                });
                setShowAddModal(false);
                if (onSave) onSave();
            }
        } catch (error) {
            console.error('Failed to add character:', error);
        }
    };

    const copyFromMaster = (masterCharacterId) => {
        const masterChar = masterCharacters.find(c => c.id === parseInt(masterCharacterId));
        if (masterChar) {
            setNewCharacter({
                ...newCharacter,
                name: masterChar.name,
                description: masterChar.description,
                personality: masterChar.personality,
                history: masterChar.history,
                goals: masterChar.goals,
                scene_role: masterChar.scene_role,
                knowledge: masterChar.knowledge,
                masterCharacterId: masterCharacterId
            });
        }
    };

    const handleEditChange = (field, value) => {
        setEditData({ ...editData, [field]: value });
    };

    const handleNewCharChange = (field, value) => {
        setNewCharacter({ ...newCharacter, [field]: value });
    };

    // Drag and drop handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);

        try {
            const droppedChar = JSON.parse(e.dataTransfer.getData('text/plain'));
            // Auto-populate the form with the dropped character
            setNewCharacter({
                name: droppedChar.name,
                description: droppedChar.description,
                personality: droppedChar.personality,
                history: droppedChar.history,
                goals: droppedChar.goals,
                scene_role: droppedChar.scene_role,
                knowledge: droppedChar.knowledge,
                masterCharacterId: droppedChar.id.toString()
            });
            setShowAddModal(true);
        } catch (error) {
            console.error('Failed to parse dropped character:', error);
        }
    };

    if (isLoading) {
        return <div style={{ padding: 20, textAlign: 'center' }}>Loading characters...</div>;
    }

    return (
        <div
            style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: dragOver ? '2px dashed #2563eb' : '2px dashed transparent',
                borderRadius: '8px',
                transition: 'border-color 0.2s'
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0 }}>Scene Characters ({sceneCharacters.length})</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {dragOver && (
                        <span style={{ fontSize: 14, color: '#2563eb', fontStyle: 'italic' }}>
                            Drop character here to add to scene
                        </span>
                    )}
                    <button
                        onClick={() => setShowAddModal(true)}
                        style={{
                            padding: '8px 16px',
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        ➕ Add Character
                    </button>
                </div>
            </div>

            {/* Characters Table */}
            <div style={{ flex: 1, overflow: 'auto', border: '1px solid #e5e7eb', borderRadius: 6 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f9fafb', position: 'sticky', top: 0 }}>
                        <tr>
                            <th style={{ padding: 8, textAlign: 'left', borderBottom: '1px solid #e5e7eb', minWidth: 120 }}>Name</th>
                            <th style={{ padding: 8, textAlign: 'left', borderBottom: '1px solid #e5e7eb', minWidth: 80 }}>Role</th>
                            <th style={{ padding: 8, textAlign: 'left', borderBottom: '1px solid #e5e7eb', minWidth: 200 }}>Goals</th>
                            <th style={{ padding: 8, textAlign: 'left', borderBottom: '1px solid #e5e7eb', minWidth: 200 }}>Personality</th>
                            <th style={{ padding: 8, textAlign: 'left', borderBottom: '1px solid #e5e7eb', minWidth: 100 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sceneCharacters.map(character => (
                            <tr key={character.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: 8, verticalAlign: 'top' }}>
                                    {editingId === character.id ? (
                                        <input
                                            value={editData.name || ''}
                                            onChange={(e) => handleEditChange('name', e.target.value)}
                                            style={{ width: '100%', padding: 4 }}
                                        />
                                    ) : (
                                        <div>
                                            <strong>{character.name}</strong>
                                            {character.masterCharacterId && (
                                                <div style={{ fontSize: 12, color: '#6b7280' }}>
                                                    From: {masterCharacters.find(m => m.id === character.masterCharacterId)?.name}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </td>
                                <td style={{ padding: 8, verticalAlign: 'top' }}>
                                    {editingId === character.id ? (
                                        <select
                                            value={editData.scene_role || ''}
                                            onChange={(e) => handleEditChange('scene_role', e.target.value)}
                                            style={{ width: '100%', padding: 4 }}
                                        >
                                            <option value="protagonist">Protagonist</option>
                                            <option value="antagonist">Antagonist</option>
                                            <option value="background">Background</option>
                                            <option value="environment">Environment</option>
                                        </select>
                                    ) : (
                                        <span style={{
                                            padding: '2px 6px',
                                            borderRadius: 4,
                                            fontSize: 12,
                                            background: character.scene_role === 'protagonist' ? '#dbeafe' :
                                                character.scene_role === 'antagonist' ? '#fecaca' :
                                                    character.scene_role === 'environment' ? '#d1fae5' : '#f3f4f6',
                                            color: character.scene_role === 'protagonist' ? '#1e40af' :
                                                character.scene_role === 'antagonist' ? '#dc2626' :
                                                    character.scene_role === 'environment' ? '#059669' : '#374151'
                                        }}>
                                            {character.scene_role}
                                        </span>
                                    )}
                                </td>
                                <td style={{ padding: 8, verticalAlign: 'top' }}>
                                    {editingId === character.id ? (
                                        <textarea
                                            value={editData.goals || ''}
                                            onChange={(e) => handleEditChange('goals', e.target.value)}
                                            style={{ width: '100%', height: 60, padding: 4 }}
                                        />
                                    ) : (
                                        <div style={{ fontSize: 14, lineHeight: 1.4 }}>{character.goals}</div>
                                    )}
                                </td>
                                <td style={{ padding: 8, verticalAlign: 'top' }}>
                                    {editingId === character.id ? (
                                        <textarea
                                            value={editData.personality || ''}
                                            onChange={(e) => handleEditChange('personality', e.target.value)}
                                            style={{ width: '100%', height: 60, padding: 4 }}
                                        />
                                    ) : (
                                        <div style={{ fontSize: 14, lineHeight: 1.4 }}>{character.personality}</div>
                                    )}
                                </td>
                                <td style={{ padding: 8, verticalAlign: 'top' }}>
                                    {editingId === character.id ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                            <button onClick={handleSaveEdit} style={{ padding: '4px 8px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                                                Save
                                            </button>
                                            <button onClick={handleCancelEdit} style={{ padding: '4px 8px', background: '#6b7280', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                            <button onClick={() => handleEdit(character)} style={{ padding: '4px 8px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                                                ✏️ Edit
                                            </button>
                                            <button onClick={() => handleDelete(character.id)} style={{ padding: '4px 8px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                                                🗑️ Remove
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {sceneCharacters.length === 0 && (
                    <div style={{ padding: 32, textAlign: 'center', color: '#6b7280' }}>
                        {dragOver ? (
                            <div>
                                <div style={{ fontSize: 24, marginBottom: 8 }}>👤⬇️</div>
                                <div>Drop a character here to add to the scene</div>
                            </div>
                        ) : (
                            <div>
                                <div>No characters assigned to this scene yet.</div>
                                <div style={{ marginTop: 8 }}>
                                    Click "Add Character" or drag a character from Character Masters.
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Add Character Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Add New Scene Character"
            >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: 4, fontWeight: '500' }}>Copy from Master Character:</label>
                        <select
                            value={newCharacter.masterCharacterId}
                            onChange={(e) => {
                                handleNewCharChange('masterCharacterId', e.target.value);
                                if (e.target.value) copyFromMaster(e.target.value);
                            }}
                            style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 4 }}
                        >
                            <option value="">-- Select Master Character --</option>
                            {masterCharacters.map(char => (
                                <option key={char.id} value={char.id}>{char.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: 4, fontWeight: '500' }}>Scene Role:</label>
                        <select
                            value={newCharacter.scene_role}
                            onChange={(e) => handleNewCharChange('scene_role', e.target.value)}
                            style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 4 }}
                        >
                            <option value="">-- Select Role --</option>
                            <option value="protagonist">Protagonist</option>
                            <option value="antagonist">Antagonist</option>
                            <option value="background">Background</option>
                            <option value="environment">Environment</option>
                        </select>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: 4, fontWeight: '500' }}>Name:</label>
                        <input
                            placeholder="Character name"
                            value={newCharacter.name}
                            onChange={(e) => handleNewCharChange('name', e.target.value)}
                            style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 4 }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: 4, fontWeight: '500' }}>Description:</label>
                        <input
                            placeholder="Brief description"
                            value={newCharacter.description}
                            onChange={(e) => handleNewCharChange('description', e.target.value)}
                            style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 4 }}
                        />
                    </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: '500' }}>Personality:</label>
                    <textarea
                        placeholder="Character personality traits..."
                        value={newCharacter.personality}
                        onChange={(e) => handleNewCharChange('personality', e.target.value)}
                        style={{ width: '100%', height: 80, padding: 8, border: '1px solid #d1d5db', borderRadius: 4 }}
                    />
                </div>
                <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: '500' }}>Goals:</label>
                    <textarea
                        placeholder="Character goals and motivations..."
                        value={newCharacter.goals}
                        onChange={(e) => handleNewCharChange('goals', e.target.value)}
                        style={{ width: '100%', height: 80, padding: 8, border: '1px solid #d1d5db', borderRadius: 4 }}
                    />
                </div>
                <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: '500' }}>Knowledge:</label>
                    <textarea
                        placeholder="What this character knows about the scene/situation..."
                        value={newCharacter.knowledge}
                        onChange={(e) => handleNewCharChange('knowledge', e.target.value)}
                        style={{ width: '100%', height: 60, padding: 8, border: '1px solid #d1d5db', borderRadius: 4 }}
                    />
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                    <button
                        onClick={() => setShowAddModal(false)}
                        style={{
                            padding: '10px 20px',
                            background: '#6b7280',
                            color: 'white',
                            border: 'none',
                            borderRadius: 6,
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAddCharacter}
                        style={{
                            padding: '10px 20px',
                            background: '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: 6,
                            cursor: 'pointer'
                        }}
                    >
                        Add Character
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default SceneCharactersTab;