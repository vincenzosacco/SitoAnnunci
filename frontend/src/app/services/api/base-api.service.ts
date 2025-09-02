// `src/app/services/base-api.service.ts`
import {HttpClient, HttpContext, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from "../../../environments/environment";
import {inject, Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root'
})

// Base URL for the API, all endpoints services must extend this class
export abstract class BaseApiService<T> {

  private readonly baseUrl = `${environment.api.serverUrl}`

  protected readonly endpointUrl = `${environment.api.serverUrl}`
  protected readonly http = inject(HttpClient)

  protected constructor(endpointName: string) {
    this.endpointUrl = `${this.baseUrl}/${endpointName}`;
  }

  protected getBy(key: any){
    console.debug("[Angular] Http request to: ", `${this.endpointUrl}/${key}`);
    return this.http.get<T>(`${this.endpointUrl}/${key}`);
  }

  getAll(): Observable<T[]> {
    console.debug("[Angular] Http request to: ", `${this.endpointUrl}`);
    return this.http.get<T[]>(this.endpointUrl);
  }

  // CRUD operations
  create(item: T): Observable<T> {
    console.debug("[Angular] Http POST to: ", `${this.endpointUrl}`);
    return this.http.post<T>(this.endpointUrl, item);
  }

  read(id: number | string, options?: {
    // copied from HttpClient.get<T>
    headers?: HttpHeaders | Record<string, string | string[]>;
    context?: HttpContext;
    observe?: 'body';
    params?: HttpParams | Record<string, string | number | boolean | ReadonlyArray<string | number | boolean>>;
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
    transferCache?: {
      includeHeaders?: string[];
    } | boolean;
  }): Observable<T> {

    console.debug("[Angular] Http GET to: ", `${this.endpointUrl}/${id}`);
    return this.http.get<T>(`${this.endpointUrl}/${id}`, options);
  }

  update(id: number, item: T): Observable<T> {
    console.debug("[Angular] Http PUT to: ", `${this.endpointUrl}`);
    return this.http.put<T>(`${this.endpointUrl}/${id}`, item);
  }

  delete(id: number): Observable<void> {
    console.debug("[Angular] Http DELETE to: ", `${this.endpointUrl}`);
    return this.http.delete<void>(`${this.endpointUrl}/${id}`);
  }
}
