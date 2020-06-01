import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WindowService {

  constructor() { }

  get nativeWindow(): any{
    return __window();
  }
}

function __window(): any{
  return window;
}
