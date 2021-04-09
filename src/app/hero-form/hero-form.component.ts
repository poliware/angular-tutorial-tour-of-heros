import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Hero, HeroUniverse } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-form',
  templateUrl: './hero-form.component.html',
  styleUrls: ['./hero-form.component.css']
})
export class HeroFormComponent {

  @Input() hero!: Hero;

  //O output heroSaved ira ser emitido depois que o heroi for atualizado

  @Output() heroSaved: EventEmitter<void> = new EventEmitter<void>();

  //O output goBack ira ser emitido se o usuario decidir voltar para a pagina ou criado

  @Output() goBack: EventEmitter<void> = new EventEmitter<void>();

  heroUniverses: Array<HeroUniverse> = [HeroUniverse.DC, HeroUniverse.MARVEL];

  constructor(
    private heroService: HeroService
  ) { }

  onGoBack(): void {
    this.goBack.emit();
  }

  save(): void {
    if (this.hero.id) {
      this.heroService.updateHero(this.hero)
      .subscribe(() => this.heroSaved.emit());
    }
    else{
      this.heroService.addHero(this.hero)
      .subscribe(() => this.heroSaved.emit());
    }
      
  }

}
