import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generate, observe } from 'fast-json-patch';

@Injectable({
  providedIn: 'root'
})
export class JsonService {

  constructor(
    private http: HttpClient
  ) { }

  testJsonPatch() {

    const character = {
      characterName: 'Klappman',
      level: '1'
    };

    const observer = observe(character);

    character.level = '99';

    const operations = generate(observer);
    const patch = { operations };

    character.level = '1';

    this.http.patch('https://localhost:44301/api/player', patch).subscribe();
  }
}
