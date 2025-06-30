export interface ReviewModel {

  id?: number;
  annuncio_id: number;
  autore_id: number;
  nome_autore: string;
  testo: string;
  voto: number;
  data?: number;
}
