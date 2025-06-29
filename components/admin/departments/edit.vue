<template>
  <div class="p-6 max-w-7xl mx-auto text-black">
  

    <!-- جدول -->
    <div class="overflow-x-auto w-full">
      <table class="min-w-full bg-violet-300  border rounded-lg overflow-hidden text-sm shadow">
        <thead class="bg-violet-400">
          <tr>
            <th class="px-4 py-2 text-start">{{$t('Image')}}</th>
            <th class="px-4 py-2 text-start">{{$t('Name (arabic)')}}</th>
            <th class="px-4 py-2 text-start">{{$t('Name (english)')}}</th>
            <th class="px-4 py-2 text-start">{{$t('Edit/Delete')}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="category.id" class="border-t">
            <td class="px-4 py-2">
              <img :src="category.imageUrl" class="w-16 h-16 object-cover rounded" />
            </td>
            <td class="px-4 py-2">{{ category.nameAr }}</td>
            <td class="px-4 py-2">{{ category.nameEn }}</td>
            <td class="px-4 py-6 flex flex-col gap-2 mx-auto w-full md:flex-row ">
              <Button :label="$t('Edit')" icon="pi pi-pencil" class="bg-blue" size="small" @click="editCategory(category)" />
              <Button :label="$t('Delete')" icon="pi pi-trash" severity="danger" size="small" @click="deleteCategory(category.id)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center items-center gap-4 mt-6">
      <button
        class="px-4 py-2 bg-violet-500 dark:bg-violet-400 text-white rounded disabled:opacity-50"
        :disabled="page === 1"
        @click="page--"
      >
        {{$t('Previous')}}
      </button>

      <span class="text-lg dark:text-white">{{ page }} / {{ totalPages }}</span>

      <button
        class="px-4 py-2 bg-violet-500 dark:bg-violet-400 text-white rounded disabled:opacity-50"
        :disabled="page === totalPages"
        @click="page++"
      >
        {{$t('Next')}}
      </button>
    </div>

    <!-- ديالوج التعديل -->
    <Dialog v-model:visible="showEdit" :header="$t('Edit department')" :modal="true" class="w-[30rem]" :pt="{ root: { dir: isArabic ? 'rtl' : 'ltr' } }">
      <form @submit.prevent="submitEdit" class="space-y-4">
        <InputText v-model="form.nameAr" :placeholder="$t('Name (arabic)')" class="w-full" />
        <InputText v-model="form.nameEn" :placeholder="$t('Name (english)')" class="w-full" />

        <!-- عرض الصورة الحالية -->
        <div class="flex flex-col gap-2">
          <label class="font-semibold">{{$t('Current image')}}</label>
          <img :src="form.imageUrl" alt="صورة القسم" class="w-32 h-32 object-cover rounded border" />
        </div>

        <!-- تغيير الصورة -->
        <div>
          <label class="font-semibold">{{$t('Change image')}}</label>
          <input type="file" accept="image/*" @change="handleImageUpload" class="mt-1 block w-full" />
          <div v-if="uploading" class="text-sm text-gray-500 mt-1">{{$t('Image is being uploaded')}}</div>
        </div>

        <div class="text-end">
          <Button :label="$t('Save changes')" icon="pi pi-save" class="bg-purple-darken-3" type="submit" :disabled="uploading" />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRuntimeConfig } from '#imports'

const config = useRuntimeConfig()
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const isArabic = computed(() => locale.value === 'ar')

const categories = ref([])

const showEdit = ref(false)
const uploading = ref(false)

const form = ref({
  id: 0,
  nameAr: '',
  nameEn: '',
  imageUrl: ''
})

// pagination
const page = ref(1)
const pageSize = 6
const totalPages = ref(1)

const fetchCategories = async () => {
  try {
    const query = new URLSearchParams({
      PageNumber: page.value.toString(),
      PageSize: pageSize.toString()
    })

    const res = await fetch(`${config.public.API_BASE_URL}/storeCategories?${query}`)
    const data = await res.json()

    categories.value = data.items || data
    totalPages.value = data.totalPages || Math.ceil((data.totalCount || 1) / pageSize)
  } catch (error) {
    console.error('فشل في جلب الأقسام:', error)
  }
}

const editCategory = (category: any) => {
  form.value = { ...category }
  showEdit.value = true
}

const handleImageUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  uploading.value = true
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', config.public.CLOUDINARY_UPLOAD_PRESET)

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${config.public.CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    })

    const data = await res.json()
    form.value.imageUrl = data.secure_url
  } catch (error) {
    alert('فشل رفع الصورة')
    console.error(error)
  } finally {
    uploading.value = false
  }
}

const submitEdit = async () => {
  try {
    const payload = {
      id: form.value.id,
      nameAr: form.value.nameAr,
      nameEn: form.value.nameEn,
      description: form.value.description,
      imageUrl: form.value.imageUrl
    }

    const res = await fetch(`${config.public.API_BASE_URL}/storeCategories`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      const errData = await res.json()
      throw new Error(errData.message || 'فشل التعديل')
    }

    showEdit.value = false
    await fetchCategories()
    alert('تم تعديل القسم بنجاح')
  } catch (error: any) {
    alert(error.message || 'فشل في التعديل')
    console.error(error)
  }
}

const deleteCategory = async (id: number) => {
  if (!confirm('هل أنت متأكد من حذف هذا القسم؟')) return

  try {
    const res = await fetch(`${config.public.API_BASE_URL}/storeCategories/${id}`, {
      method: 'DELETE'
    })

    if (!res.ok) throw new Error('فشل الحذف')

    await fetchCategories()
    alert('تم الحذف بنجاح')
  } catch (error) {
    alert('فشل في الحذف')
    console.error(error)
  }
}

onMounted(fetchCategories)
watch(page, fetchCategories)
</script>
