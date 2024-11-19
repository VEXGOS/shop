import type { Ref } from 'vue';
import type { IProduct } from './app.vue'; 

export const sortMethod = (a: IProduct, b: IProduct, sort: Ref<{ column: string, direction: string }>) => {
    if (!sort.value || !sort.value.column) {
        console.warn('Sort is undefined or column is missing');
        return 0;
    }

    console.log(`Sorting by: ${sort.value.column} in ${sort.value.direction} order`);
    if (sort.value.column === 'rating')
        return sort.value.direction === 'desc' ? b.rating - a.rating : a.rating - b.rating;
    if (sort.value.column === 'price')
        return sort.value.direction === 'desc' ? b.price - a.price : a.price - b.price;

    return 0;
}

export const handleSortChange = (column: string, sort: Ref<{ column: string, direction: string }>) => {
    if (!sort.value) {
        console.warn('Sort is undefined');
        return;
    }

    console.log(`Sort change requested for column: ${column}`);
    if (sort.value.column === column) {
        sort.value.direction = sort.value.direction === 'asc' ? 'desc' : 'asc';
    } else {
        sort.value.column = column;
        sort.value.direction = 'asc';
    }
    console.log(`Current sort: ${JSON.stringify(sort.value)}`);
}
