export interface ReviewModel {

  id: number,
  annuncioId: number,
  utenteId: number,
  nome: string,
  voto: number,
  commento: string,
  dataCreazione?: string
}
