import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
  standalone: true
})
export class DurationPipe implements PipeTransform {

  transform(minutes: number): string {

    if (!minutes) {
      return '0 Minutes';
    }

    if (minutes >= 60) {

      const hours = minutes / 60;

      return `${hours} Hour`;
    }

    return `${minutes} Minutes`;
  }

}
