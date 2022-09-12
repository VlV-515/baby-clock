import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'hora',
})
export class HoraPipe implements PipeTransform {
  transform(value: string): string {
    const [hour, minute] = value.split(':');
    const dur = DateTime.fromObject({
      hour: hour as unknown as number,
      minute: minute as unknown as number,
    }).toFormat('h:mm a');
    return dur;
  }
}
