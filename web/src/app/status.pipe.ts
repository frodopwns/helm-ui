
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'status'})
export class StatusStringPipe implements PipeTransform {
  transform(value: number, args: string[]): any {
    let statuses = [
      "UNKNOWN",
      "DEPLOYED",
      "DELETED",
      "SUPERSEDED",
      "FAILED",
      "DELETING"
    ];
    
    if (!value) return value;
    if (value > statuses.length) return "UNKNOWN";
    
    return statuses[value];
  }
}