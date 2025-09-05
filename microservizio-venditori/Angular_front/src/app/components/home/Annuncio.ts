export class Annuncio {
  private _id: number;
  private _titolo: string;
  private _descrizione: string;
  private _superficie: number;
  private _indirizzo: string;
  private _categoriaId: number | null;
  private _venditoreId: number | null;
  private _dataCreazione: string; // string perché JSON restituisce ISO
  private _longitudine: number | null;
  private _latitudine: number | null;
  private _prezzoNuovo: number | null;
  private _prezzoVecchio: number | null;
  private _immagine?: string | null;

  constructor(
    id: number,
    titolo: string,
    descrizione: string,
    superficie: number,
    indirizzo: string,
    categoriaId: number | null,
    venditoreId: number | null,
    dataCreazione: string,
    longitudine: number | null,
    latitudine: number | null,
    prezzoNuovo: number | null,
    prezzoVecchio: number | null,
    immagine?: string | null
  ) {
    this._id = id;
    this._titolo = titolo;
    this._descrizione = descrizione;
    this._superficie = superficie;
    this._indirizzo = indirizzo;
    this._categoriaId = categoriaId;
    this._venditoreId = venditoreId;
    this._dataCreazione = dataCreazione;
    this._longitudine = longitudine;
    this._latitudine = latitudine;
    this._prezzoNuovo = prezzoNuovo;
    this._prezzoVecchio = prezzoVecchio;
    this._immagine = immagine ?? null;
  }

  // Getter e Setter
  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get titolo(): string { return this._titolo; }
  set titolo(value: string) { this._titolo = value; }

  get descrizione(): string { return this._descrizione; }
  set descrizione(value: string) { this._descrizione = value; }

  get superficie(): number { return this._superficie; }
  set superficie(value: number) { this._superficie = value; }

  get indirizzo(): string { return this._indirizzo; }
  set indirizzo(value: string) { this._indirizzo = value; }

  get categoriaId(): number | null { return this._categoriaId; }
  set categoriaId(value: number | null) { this._categoriaId = value; }

  get venditoreId(): number | null { return this._venditoreId; }
  set venditoreId(value: number | null) { this._venditoreId = value; }

  get dataCreazione(): string { return this._dataCreazione; }
  set dataCreazione(value: string) { this._dataCreazione = value; }

  get longitudine(): number | null { return this._longitudine; }
  set longitudine(value: number | null) { this._longitudine = value; }

  get latitudine(): number | null { return this._latitudine; }
  set latitudine(value: number | null) { this._latitudine = value; }

  get prezzoNuovo(): number | null { return this._prezzoNuovo; }
  set prezzoNuovo(value: number | null) { this._prezzoNuovo = value; }

  get prezzoVecchio(): number | null { return this._prezzoVecchio; }
  set prezzoVecchio(value: number | null) { this._prezzoVecchio = value; }

  get immagine(): string | null { return this._immagine ?? null; }
  set immagine(value: string | null) { this._immagine = value; }

  // Metodo statico per creare da JSON
  static fromJSON(json: any): Annuncio {
    return new Annuncio(
      json.id,
      json.titolo,
      json.descrizione,
      json.superficie,
      json.indirizzo,
      json.categoriaId ?? null,
      json.venditoreId ?? null,
      json.dataCreazione,
      json.longitudine ?? null,
      json.latitudine ?? null,
      json.prezzoNuovo ?? null,
      json.prezzoVecchio ?? null,
      json.immagine ?? null
    );
  }
}
