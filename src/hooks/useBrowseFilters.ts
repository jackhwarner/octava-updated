
import { useState } from 'react';

export const useBrowseFilters = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedInstrument, setSelectedInstrument] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [location, setLocation] = useState('');
  
  const resetFilters = () => {
    setSelectedRole('');
    setSelectedGenre('');
    setSelectedInstrument('');
    setSelectedExperience('');
    setLocation('');
  };

  return {
    selectedRole,
    setSelectedRole,
    selectedGenre,
    setSelectedGenre,
    selectedInstrument,
    setSelectedInstrument,
    selectedExperience,
    setSelectedExperience,
    location,
    setLocation,
    resetFilters,
  };
};
