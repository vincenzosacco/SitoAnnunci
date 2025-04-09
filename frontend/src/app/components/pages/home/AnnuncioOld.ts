export class AnnuncioOld {
  private _id: number;
  private _nome: string;
  private _descrizione: string;
  private _foto: string;
  private _prezzoVecchio: number;
  private _prezzoNuovo: number;
  private _m2: number;
  private _placeId: string;
  private _changed: boolean;
  private _owner: string;

  constructor(
    id: number,
    nome: string,
    descrizione: string,
    foto: string,
    prezzoVecchio: number,
    prezzoNuovo: number,
    m2: number,
    placeId: string,
    changed: boolean,
    owner: string
  ) {
    this._id = id;
    this._nome = nome;
    this._descrizione = descrizione;
    this._foto = foto;
    this._prezzoVecchio = prezzoVecchio;
    this._prezzoNuovo = prezzoNuovo;
    this._m2 = m2;
    this._placeId = placeId;
    this._changed = changed;
    this._owner = owner;
  }

  // Getter e Setter per id
  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  // Getter e Setter per nome
  get nome(): string {
    return this._nome;
  }

  set nome(value: string) {
    this._nome = value;
  }

  // Getter e Setter per descrizione
  get descrizione(): string {
    return this._descrizione;
  }

  set descrizione(value: string) {
    this._descrizione = value;
  }

  // Getter e Setter per foto
  get foto(): string {
    return this._foto;
  }

  set foto(value: string) {
    this._foto = value;
  }

  // Getter e Setter per prezzoVecchio
  get prezzoVecchio(): number {
    return this._prezzoVecchio;
  }

  set prezzoVecchio(value: number) {
    this._prezzoVecchio = value;
  }

  // Getter e Setter per prezzoNuovo
  get prezzoNuovo(): number {
    return this._prezzoNuovo;
  }

  set prezzoNuovo(value: number) {
    this._prezzoNuovo = value;
  }

  // Getter e Setter per m2
  get m2(): number {
    return this._m2;
  }

  set m2(value: number) {
    this._m2 = value;
  }

  // Getter e Setter per placeId
  get placeId(): string {
    return this._placeId;
  }

  set placeId(value: string) {
    this._placeId = value;
  }

  // Getter e Setter per changed
  get changed(): boolean {
    return this._changed;
  }

  set changed(value: boolean) {
    this._changed = value;
  }

  // Getter e Setter per owner
  get owner(): string {
    return this._owner;
  }

  set owner(value: string) {
    this._owner = value;
  }

  // Metodo statico per creare un'istanza da un oggetto JSON
  static fromJSON(data: any): AnnuncioOld {
    return new AnnuncioOld(
      data.id,
      data.nome,
      data.descrizione,
      data.foto,
      data.prezzoVecchio,
      data.prezzoNuovo,
      data.m2,
      data.placeId,
      data.changed,
      data.owner
    );
  }
}
