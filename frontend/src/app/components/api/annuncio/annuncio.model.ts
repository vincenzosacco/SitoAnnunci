export interface AnnuncioModel {
  id: number;
  titolo: string;
  in_vendita: boolean;
  indirizzo: string;
  prezzo: number;
  descrizione: string;
  foto: string;
  categoria_id: number;
  superficie: number;
  data: number;
  venditore_id: number;
}

