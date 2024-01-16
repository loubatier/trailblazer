export interface Player {
  name: string;
  class: string;
  spec: string;
  role: string;
}

export interface Roster {
  players: Player[];
}
