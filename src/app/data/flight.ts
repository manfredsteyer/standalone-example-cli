
export interface Flight {
  id: number;   
  from: string;
  to: string;
  date: string; 
  delayed: boolean;
  counter: number;
}

export const initFlight: Flight = {
  id: 0,
  from: '',
  to: '',
  date: '',
  delayed: false,
  counter: 0,
};
