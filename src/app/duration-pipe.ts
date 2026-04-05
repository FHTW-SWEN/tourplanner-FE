import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
  standalone: true
})
export class DurationPipe implements PipeTransform {

  transform(minutes: number): string {
    if (!minutes) return '';

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}min`;
    }

    if (hours > 0) {
      return `${hours}h`;
    }

    return `${mins}min`;
  }

}
