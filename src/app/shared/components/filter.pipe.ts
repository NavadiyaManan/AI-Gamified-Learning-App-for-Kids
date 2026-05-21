import { Pipe, PipeTransform } from '@angular/core';
import { Achievement } from '@core/models';

@Pipe({
    name: 'filter',
    standalone: true
})
export class FilterPipe implements PipeTransform {
    transform(items: Achievement[], isLocked: boolean): Achievement[] {
        if (!items) return [];
        return items.filter(item => item.isLocked === isLocked);
    }
}
