import {Injectable} from '@angular/core';
import {ReviewModel} from "../../components/api/annuncio/review/review.model";
import {BaseApiService} from "./base-api.service";
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ReviewService extends BaseApiService<ReviewModel>{

  constructor() {
    super('recensioni')
  }

    getByAnnuncioId(annuncioId: number): Observable<ReviewModel[]> {
        return this.http.get<ReviewModel[]>(`${this.endpointUrl}/annuncio/${annuncioId}`);
    }

    addReview(review: ReviewModel): Observable<ReviewModel> {
        return this.http.post<ReviewModel>(`${this.endpointUrl}`, review);
    }
}
