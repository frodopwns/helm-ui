import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'unepoch'})
export class UnEpochPipe implements PipeTransform {
  transform(value: number, args: string[]): any {
    if (!value) return value;
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(value);

    return t.toLocaleDateString("en-US");
  }
}