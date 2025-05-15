import { atom } from "jotai";

export const recentMeetingsAtom = atom([
  { id: 1, name: "Weekly Team Sync", date: "Today, 9:30 AM", participants: 8 },
  {
    id: 2,
    name: "Product Review",
    date: "Yesterday, 2:00 PM",
    participants: 5,
  },
  {
    id: 3,
    name: "Client Presentation",
    date: "Jul 12, 10:00 AM",
    participants: 12,
  },
]);
