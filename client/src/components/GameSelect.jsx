import React from 'react';
import Select from 'react-select';

function GameSelect({ games, value, onChange, isDisabled }) {
  const options = games.map(game => ({ value: game.id, label: game.name }));
  const selected = options.find(opt => opt.value === value) || null;

  return (
    <Select
      options={options}
      value={selected}
      onChange={opt => onChange(opt ? opt.value : '')}
      isClearable
      isSearchable
      isDisabled={isDisabled}
      placeholder="Select a game..."
      classNamePrefix="react-select"
    />
  );
}

export default GameSelect;
