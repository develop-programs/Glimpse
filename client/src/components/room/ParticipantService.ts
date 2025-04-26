import { Participant } from './types';

// Generate a larger set of mock participants for demonstration
export const generateMockParticipants = (count: number): Participant[] => {
  const baseParticipants = [
    { id: 1, name: 'You', isCurrentUser: true },
    { id: 2, name: 'John Doe' },
    { id: 3, name: 'Jane Smith' },
    { id: 4, name: 'Alex Johnson' },
    { id: 5, name: 'Emily Wilson' },
    { id: 6, name: 'Michael Brown' },
    { id: 7, name: 'Sarah Davis' },
    { id: 8, name: 'Robert Miller' }
  ];

  const extendedParticipants = [...baseParticipants];

  // Add more participants to reach the desired count
  for (let i = baseParticipants.length + 1; i <= count; i++) {
    extendedParticipants.push({
      id: i,
      name: `Participant ${i}`,
    });
  }

  return extendedParticipants;
};

export const getPresenter = (participants: Participant[]): Participant => {
  return participants.find(p => p.id === 2) || participants[0];
};

export const getSpeaker = (participants: Participant[]): Participant => {
  return participants.find(p => p.id === 3) || participants[0];
};

// Get important participants (first few participants) for speaker view
export const getImportantParticipants = (participants: Participant[], count: number): Participant[] => {
  // Ensure current user is always included
  const currentUser = participants.find(p => p.isCurrentUser);
  const otherParticipants = participants.filter(p => !p.isCurrentUser);

  // If asking for speaker, prioritize them
  const speaker = getSpeaker(participants);
  const remainingParticipants = otherParticipants.filter(p => p.id !== speaker.id);

  const important = [speaker];
  if (currentUser && !speaker.isCurrentUser) important.push(currentUser);

  // Fill the rest with other participants
  while (important.length < count && remainingParticipants.length > 0) {
    important.push(remainingParticipants.shift()!);
  }

  return important;
};
