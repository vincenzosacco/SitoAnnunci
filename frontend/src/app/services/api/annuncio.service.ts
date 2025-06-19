// `src/app/services/annuncio.service.ts`
import {Injectable} from '@angular/core';
import {AnnuncioModel} from "../../components/api/annuncio/annuncio.model";
import {BaseApiService} from "./base-api.service";


@Injectable({
  providedIn: 'root'
})
export class AnnuncioService extends BaseApiService<AnnuncioModel> {

    constructor() {
        super('annunci')
    }

  getById(id: number) {
    return this.getBy(id)
  }
}
