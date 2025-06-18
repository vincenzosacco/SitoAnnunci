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

  addReview(review: Omit<ReviewModel, 'id' | 'dataCreazione'>): Observable<ReviewModel> {
    const reviewToSave = {
      ...review,
      dataCreazione: new Date().toISOString()
    };
    return this.create(reviewToSave as ReviewModel);
  }



}
