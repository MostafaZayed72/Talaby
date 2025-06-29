<template>
  <div class="p-6 max-w-4xl ">
    <Button :label="$t('Add new department')" icon="pi pi-plus" class="mb-6 bg-purple-darken-3" @click="visible = true" />

    <Dialog v-model:visible="visible" modal :header="$t('Add new department')" 
    :pt="{ root: { dir: isArabic ? 'rtl' : 'ltr' } }">
      <form @submit.prevent="submitCategory" class="space-y-4">
        <InputText v-model="form.nameAr" :placeholder="$t('Name in arabic')" class="w-full" />
        <InputText v-model="form.nameEn" :placeholder="$t('Name in english')" class="w-full" />

        <input type="file" @change="handleImageUpload" accept="image/*" />
        <div v-if="uploading">{{$t('Image is being uploaded')}}</div>

        <div v-if="form.imageUrl">
          <img :src="form.imageUrl" class="w-32 mt-2 rounded shadow" />
        </div>

        <Button :label="$t('Send')" icon="pi pi-check" type="submit" class="w-full bg-purple-darken-3" :disabled="uploading" />
      </form>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { useRuntimeConfig } from '#imports'

const config = useRuntimeConfig()
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const isArabic = computed(() => locale.value === 'ar')

const visible = ref(false)

const form = ref({
  nameAr: '',
  nameEn: '',
  imageUrl: ''
})

const uploading = ref(false)

const handleImageUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  uploading.value = true

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', config.public.CLOUDINARY_UPLOAD_PRESET)

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${config.public.CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    )

    const data = await res.json()
    form.value.imageUrl = data.secure_url
  } catch (err) {
    alert('فشل رفع الصورة')
    console.error(err)
  } finally {
    uploading.value = false
  }
}

const submitCategory = async () => {
  if (!form.value.imageUrl) {
    alert('يجب رفع صورة أولاً')
    return
  }

  const payload = {
    nameAr: form.value.nameAr,
    nameEn: form.value.nameEn,
    imageUrl: form.value.imageUrl
  }

  try {
    const apiUrl = `${config.public.API_BASE_URL}/storeCategories`

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      const errData = await res.json()
      throw new Error(errData.message || 'فشل الإرسال')
    }

    alert('تمت الإضافة بنجاح')
    visible.value = false
    form.value = { nameAr: '', nameEn: '', imageUrl: '' }
window.location.reload()

  } catch (err: any) {
    alert(err.message || 'حدث خطأ أثناء الإرسال')
    console.error(err)
  }
}
</script>
