<script lang="ts" setup>
import { ref } from 'vue';
import type { IProductResponse, IProduct } from '../list-of-products/index.vue';

export interface ISortable {
  column: string,
  direction: string
}

const sort = ref<ISortable>()

const columns = [{
  key: 'price',
  label: 'Ціна',
  sortable: true
}, {
  key: 'title',
  label: 'Назва',
}, {
  key: 'description',
  label: 'Опис',
}, {
  key: 'rating',
  label: 'Оцінка',
  sortable: true
}, {
  key: 'brand',
  label: 'Бренд',
}, {
  key: 'category',
  label: 'Категорія',
}, {
  key: 'thumbnail',
  label: 'Фото',
}];

const { data, pending } = await useLazyAsyncData<IProductResponse>('products', () => $fetch(`https://dummyjson.com/products?limit=${100}`));

const products = ref<IProduct[]>(data.value ? data.value.products : []);
const total = ref(data.value ? data.value.total : 0);

watch(pending, () => {
  if (data.value) {
    products.value = data.value.products;
    total.value = data.value.total;
  }
});

const q = ref('');

const filteredRows = ref(() => {
  if (!q.value)
    return [...products.value];

  page.value = 1;

  return [...products.value].filter((p: IProduct) =>
      Object.values(p).some((value: any) =>
          String(value).toLowerCase().includes(q.value.toLowerCase())));
});

const page = ref(1);
const pageCount = 10;

const sortMethod = (a: IProduct, b: IProduct) => {
  if (sort.value && sort.value.column) {
    if (sort.value.column === 'rating')
      return sort.value.direction === 'desc' ? a.rating - b.rating : b.rating - a.rating;
    if (sort.value.column === 'price')
      return sort.value.direction === 'desc' ? a.price - b.price : b.price - a.price;
  }

  return 0;
}

const rows = computed(() => {
  return filteredRows.value().sort(sortMethod).slice((page.value - 1) * pageCount, page.value * pageCount);
});

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
      <UInput v-model="q" placeholder="Filter people..." />
    </div>

    <UTable v-model:sort="sort" :rows="rows" :columns="columns" :loading="pending"
            sort-asc-icon="i-heroicons-arrow-up" sort-mode="manual" sort-desc-icon="i-heroicons-arrow-down"
            class="w-full" :ui="{ td: { base: 'max-w-[0] truncate' } }">
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