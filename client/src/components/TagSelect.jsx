import React, { useState, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';

function TagSelect({ selectedTags, setSelectedTags }) {
  const [tags, setTags] = useState([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch('/api/tags')
      .then(res => res.json())
      .then(data => setTags(data))
      .catch(() => setTags([]));
  }, [creating]);

  // Convert tags to react-select format
  const options = tags.map(tag => ({ value: tag.id, label: tag.tag }));
  const value = selectedTags.map(tag => ({ value: tag.id, label: tag.tag }));

  const handleChange = (selectedOptions) => {
    setSelectedTags(selectedOptions ? selectedOptions.map(opt => ({ id: opt.value, tag: opt.label })) : []);
  };

  const handleCreate = async (inputValue) => {
    setCreating(true);
    const res = await fetch('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag: inputValue.trim() })
    });
    if (res.ok) {
      const tag = await res.json();
      setSelectedTags([...selectedTags, { id: tag.id, tag: tag.tag }]);
    }
    setCreating(false);
  };

  return (
    <div className="mb-3">
      <label className="form-label">Tags</label>
      <CreatableSelect
        isMulti
        isClearable
        isDisabled={creating}
        options={options}
        value={value}
        onChange={handleChange}
        onCreateOption={handleCreate}
        placeholder="Search or create tag..."
        classNamePrefix="react-select"
      />
    </div>
  );
}

export default TagSelect;
