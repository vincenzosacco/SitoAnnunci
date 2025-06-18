export interface AnnuncioModel {
  id: number;
  title: string;
  forSale: boolean;
  citta: string;
  price: number;
  description: string;
  image: string;
  categoria: string;
  superficie: number;
  data: number;
  utenteId: number;
}

