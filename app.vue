<script lang="ts" setup>
import { ref, computed, watch } from 'vue';

interface IProduct {
    title: string;
    price: number;
    description: string;
    rating: number;
    brand: string;
    category: string;
    thumbnail: string;
}

interface IProductResponse {
    products: IProduct[];
    total: number;
}

export interface ISortable {
    column: string | null; 
    direction: 'asc' | 'desc' | null; 
}

const sort = ref<ISortable>({
    column: null,
    direction: null,
});

const columns = [
    { key: 'price', label: 'Ціна', sortable: true },
    { key: 'title', label: 'Назва' },
    { key: 'description', label: 'Опис' },
    { key: 'rating', label: 'Оцінка', sortable: true },
    { key: 'brand', label: 'Бренд' },
    { key: 'category', label: 'Категорія' },
    { key: 'thumbnail', label: 'Фото' },
];

const { data, pending } = await useLazyAsyncData<IProductResponse>('products', () =>
    $fetch(`https://dummyjson.com/products?limit=100`)
);

const products = ref<IProduct[]>(data.value ? data.value.products : []);
const total = ref(data.value ? data.value.total : 0);

watch(pending, () => {
    if (data.value) {
        products.value = data.value.products;
        total.value = data.value.total;
    }
});

const q = ref('');
const page = ref(1);
const pageCount = 10;

const filteredRows = computed(() => {
    if (!q.value) return products.value;

    return products.value.filter((p) =>
        Object.values(p).some((value) =>
            String(value).toLowerCase().includes(q.value.toLowerCase())
        )
    );
});

const sortMethod = (a: IProduct, b: IProduct) => {
    if (!sort.value || !sort.value.column || !sort.value.direction) return 0;

    const { column, direction } = sort.value;
    const order = direction === 'desc' ? -1 : 1;

    if (column === 'rating') return order * (a.rating - b.rating);
    if (column === 'price') return order * (a.price - b.price);

    return 0;
};

const rows = computed(() =>
    filteredRows.value
        .slice() 
        .sort(sortMethod)
        .slice((page.value - 1) * pageCount, page.value * pageCount)
);
</script>

<template>
    <title>Магазин продуктів</title>

    <UCard class="w-full" :ui="{
        base: '',
        ring: '',
        divide: 'divide-y divide-gray-200 dark:divide-gray-700',
        header: { padding: 'px-4 py-5' },
        body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
        footer: { padding: 'p-4' }
    }">
        <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
            <UInput v-model="q" placeholder="Пошук продуктів..." />
        </div>

        <UTable
            v-model:sort="sort"
            :rows="rows"
            :columns="columns"
            :loading="pending"
            sort-asc-icon="i-heroicons-arrow-up"
            sort-desc-icon="i-heroicons-arrow-down"
            sort-mode="manual"
            class="w-full"
            :ui="{ td: { base: 'max-w-[0] truncate' } }"
        >
            <template #thumbnail-data="{ row }">
                <img class="w-[100px] h-[100px]" :src="row.thumbnail" alt="Thumbnail" />
            </template>
            <template #rating-data="{ row }">
                <span :class="row.rating < 4.5 ? 'text-red-700' : 'text-green-700'">{{ row.rating }}</span>
            </template>
        </UTable>

        <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
            <UPagination v-model="page" :page-count="pageCount" :total="total" />
        </div>
    </UCard>
</template>
