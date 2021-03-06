import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Hero, HeroGetReponse } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

import { HttpClient, HttpHeaders } from '@angular/common/http'
import { catchError, map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class HeroService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  // constructor(private messageService:  MessageService) { }

  constructor(
    private http: HttpClient, 
    private messageService: MessageService,
    ) { }

  // private log(message: string) {
  //   this.messageService.add(`HeroService: ${message}`);
  // }

  //Essa é a URL da API
  private heroesUrl = 'https://api-default-309921.rj.r.appspot.com/';

  // getHeroes(): Observable<Hero[]> {
  //   const heroes = of(HEROES);
  //   // this.messageService.add('HeroService: fetched heroes');
  //   return heroes;
  // }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };    
  }

  getHeroes(): Observable<HeroGetReponse> {
    return this.http.get<HeroGetReponse>(`${this.heroesUrl}/heroes`)
    .pipe(
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<HeroGetReponse>('getHeroes', {heroes: [], cursor: ""}))
    );
  }
  getHeroNo404<Data>(id:string) : Observable<Hero>{
    const url = `${this.heroesUrl}/hero/${id}`;
    return this.http.get<Hero[]>(url).pipe(
      map(heroes => heroes[0]),
      tap(h => {
        const outcome= h ? `fatched` : `did not find`;
        this.log(`${outcome} hero id=${id}`);
      }),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  // getHero(id: number): Observable<Hero> {
    
  //   const hero = HEROES.find(h => h.id === id) as Hero;
  //   this.messageService.add(`HeroService: fetched hero id=${id}`);
  //   return of(hero);
  // }

  getHero(id: string): Observable<Hero> {
    const url = `${this.heroesUrl}hero/${id}`;

    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  updateHero(hero: Hero): Observable<any> {
    const heroParams = {hero: hero};

    return this.http.post(`${this.heroesUrl}/hero/${hero.id}`, heroParams, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  addHero(hero: Hero): Observable<Hero> {
    const heroParams = {hero: hero};

    return this.http.post<Hero>(`${this.heroesUrl}/heroes`, heroParams, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  deleteHero(id: string): Observable<Hero> {
    const url = `${this.heroesUrl}/hero/${id}`;
  
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
         this.log(`found heroes matching "${term}"`) :
         this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  private log(message: string){
    this.messageService.add(`HeroService: ${message}`);
  }

}

