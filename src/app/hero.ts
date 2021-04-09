export enum HeroUniverse {
    DC = 'dc',
    MARVEL = 'marvel'
}
  
export interface Hero {
    id: number;
    name: string;
    imageUrl: string;
    universe: HeroUniverse;
    description: string;
}

export interface HeroGetReponse {
    cursor: string;
    heroes: Array<Hero>;
}