<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useRuntimeConfig } from '#imports'
import { useLocalStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

const config = useRuntimeConfig()
const token = useLocalStorage('token', '')
const route = useRoute()
const { t } = useI18n()

const emit = defineEmits(['request-added'])

const storeCategoryId = route.params.department

const showDialog = ref(false)
const loading = ref(false)
const success = ref(false)
const error = ref('')

const requestData = ref({
  title: '',
  description: '',
  imageUrl: '',
  minBudget: 0,
  maxBudget: 0
})

const handleFileChange = async (event: Event) => {
  const file = (event.target as HTMLInputElement)?.files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', config.public.CLOUDINARY_UPLOAD_PRESET)

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${config.public.CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    )
    requestData.value.imageUrl = response.data.secure_url
  } catch (err) {
    error.value = t('Image upload failed.')
  }
}

const submitRequest = async () => {
  if (!storeCategoryId) {
    error.value = 'Category ID not found.'
    return
  }

  loading.value = true
  error.value = ''
  success.value = false

  try {
    await axios.post(`${config.public.API_BASE_URL}/project-requests`, {
      ...requestData.value,
      minBudget: 0,
      maxBudget: 0,
      storeCategoryId: storeCategoryId
    }, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    success.value = true
    showDialog.value = false
    emit('request-added')

    requestData.value = {
      title: '',
      description: '',
      imageUrl: '',
      minBudget: 0,
      maxBudget: 0
    }

  } catch (err: any) {
    error.value = err?.response?.data?.message || t('An error occurred while submitting the request.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <button 
      @click="showDialog = true" 
      class="px-10 py-4 bg-yellow-400 hover:bg-yellow-500 text-violet-950 font-black rounded-2xl transition-all transform hover:scale-[1.05] shadow-xl active:scale-95 flex items-center gap-3"
    >
      <Icon name="ph:plus-circle-bold" class="text-xl" />
      {{ t('Add New Request') }}
    </button>

    <Teleport to="body">
      <transition name="modal">
        <div v-if="showDialog" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-md" @click="showDialog = false"></div>
          
          <!-- Dialog Content -->
          <div class="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-white/20 p-8 md:p-12 animate-modal-in overflow-hidden max-h-[90vh] flex flex-col">
            <!-- Decorative Light -->
            <div class="absolute top-0 right-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-[80px]"></div>
            
            <div class="relative z-10 flex flex-col h-full">
              <!-- Header -->
              <div class="flex justify-between items-center mb-8">
                <div>
                  <h2 class="text-3xl font-black text-slate-900 dark:text-white italic tracking-tight mb-2">{{ t('Add New Request') }}</h2>
                  <div class="flex items-center gap-2">
                    <span class="h-1.5 w-12 bg-yellow-400 rounded-full"></span>
                    <p class="text-xs font-black uppercase tracking-widest text-green-600 dark:text-green-400">{{ $t('Dear customer') }}: {{ $t('Remember: Clear demand = clear supply') }}</p>
                  </div>
                </div>
                <button @click="showDialog = false" class="p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                  <Icon name="ph:x-bold" class="text-xl dark:text-white" />
                </button>
              </div>

              <!-- Body (Scrollable) -->
              <div class="flex-1 overflow-y-auto pr-2 space-y-8 custom-scrollbar">
                <div v-if="error" class="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold flex items-center gap-3">
                  <Icon name="ph:warning-circle-bold" />
                  {{ error }}
                </div>

                <div class="space-y-6">
                  <!-- Title -->
                  <div class="space-y-2">
                    <label class="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2">{{ t('Request Title') }}</label>
                    <input 
                      v-model="requestData.title" 
                      :placeholder="t('What do you need?')"
                      class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all font-bold" 
                    />
                  </div>

                  <!-- Description -->
                  <div class="space-y-2">
                    <label class="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2">{{ t('Description') }}</label>
                    <textarea 
                      v-model="requestData.description" 
                      :placeholder="t('Provide details about your request...')"
                      class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white min-h-[150px] resize-none transition-all font-medium" 
                    ></textarea>
                  </div>

                  <!-- Image Upload -->
                  <div class="space-y-2">
                    <label class="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2">{{ t('You can add a photo to illustrate the request') }}</label>
                    <div class="relative group">
                      <input 
                        type="file" 
                        class="absolute inset-0 opacity-0 cursor-pointer z-20" 
                        @change="handleFileChange" 
                        accept="image/*" 
                      />
                      <div class="w-full border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 group-hover:border-indigo-500 transition-all bg-slate-50/50 dark:bg-white/5">
                        <div v-if="!requestData.imageUrl" class="text-center">
                          <Icon name="ph:image-square-bold" class="text-4xl text-slate-400 mb-2" />
                          <p class="text-sm font-bold text-slate-500">{{ t('Click to upload image') }}</p>
                        </div>
                        <div v-else class="relative w-full aspect-video rounded-2xl overflow-hidden">
                          <img :src="requestData.imageUrl" class="w-full h-full object-cover" />
                          <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Icon name="ph:arrows-clockwise-bold" class="text-3xl text-white animate-spin-slow" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="mt-10 flex gap-4 pt-6 border-t border-slate-100 dark:border-white/5">
                <button 
                  class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl transition-all transform hover:scale-[1.02] shadow-xl active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                  :disabled="loading" 
                  @click="submitRequest"
                >
                  <Icon v-if="loading" name="ph:circle-notch-bold" class="animate-spin" />
                  <Icon v-else name="ph:check-circle-bold" />
                  {{ t('Submit Request') }}
                </button>
                <button 
                  class="px-10 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white font-black rounded-2xl hover:bg-slate-200 dark:hover:bg-white/20 transition-all active:scale-95"
                  @click="showDialog = false"
                >
                  {{ t('Cancel') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.4s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

@keyframes modal-in {
  from { transform: scale(0.9) translateY(40px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}
.animate-modal-in {
  animation: modal-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(79, 70, 229, 0.2);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(79, 70, 229, 0.4);
}
</style>
