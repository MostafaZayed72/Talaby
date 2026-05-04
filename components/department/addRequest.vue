<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useRuntimeConfig } from '#imports'
import { useLocalStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

const config = useRuntimeConfig()
const token = useCookie('token')
const route = useRoute()
const { t } = useI18n()

const emit = defineEmits(['requestAdded'])

const storeCategoryId = route.params.department

const showDialog = ref(false)
const showAgreementDialog = ref(false)
const agreementChecked = ref(false)
const loading = ref(false)
const success = ref(false)
const isUploadingImage = ref(false)
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

  isUploadingImage.value = true
  error.value = ''

  const formData = new FormData()
  formData.append('file', file)

  try {
    const res = await fetch(`${config.public.API_BASE_URL}/uploads/images`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: formData
    })
    const response = await res.json()
    if (response.isSuccess) {
      const baseUrl = config.public.API_BASE_URL.replace('/api', '')
      requestData.value.imageUrl = `${baseUrl}${response.data.url}`
    }
  } catch (err) {
    error.value = t('Image upload failed.')
  } finally {
    isUploadingImage.value = false
  }
}

const openAgreement = () => {
  if (!requestData.value.title || !requestData.value.description) {
    error.value = t('Please fill in all required fields.')
    return
  }
  showAgreementDialog.value = true
}

const submitRequest = async () => {
  if (!agreementChecked.value) return
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
    showAgreementDialog.value = false
    agreementChecked.value = false
    emit('requestAdded')

    requestData.value = {
      title: '',
      description: '',
      imageUrl: '',
      minBudget: 0,
      maxBudget: 0
    }

  } catch (err: any) {
    const msg = err?.response?.data?.message || 'An error occurred while submitting the request.'
    error.value = t(msg.trim())
    showAgreementDialog.value = false
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
          <div class="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-white/10 p-5 md:p-12 animate-modal-in overflow-hidden max-h-[90vh] flex flex-col mx-4 dark:text-white">
            <!-- Decorative Light -->
            <div class="absolute top-0 right-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-[80px]"></div>
            
            <div class="relative z-10 flex flex-col h-full min-h-0">
              <!-- Header -->
              <div class="flex justify-between items-center mb-6 md:mb-8 shrink-0">
                <div>
                  <h2 class="text-xl md:text-3xl font-black text-slate-900 dark:text-white italic tracking-tight mb-1 md:mb-2">{{ t('Add New Request') }}</h2>
                  <div class="flex items-center gap-2">
                    <span class="h-1 w-8 md:h-1.5 md:w-12 bg-yellow-400 rounded-full"></span>
                    <p class="text-[9px] md:text-xs font-black uppercase tracking-widest text-green-600 dark:text-green-400 leading-tight">{{ $t('Dear customer') }}: {{ $t('Remember: Clear demand = clear supply') }}</p>
                  </div>
                </div>
                <button @click="showDialog = false" class="p-2 md:p-3 rounded-xl md:rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                  <Icon name="ph:x-bold" class="text-lg md:text-xl dark:text-white" />
                </button>
              </div>

              <!-- Body (Scrollable) -->
              <div class="flex-1 overflow-y-auto px-1 md:px-2 space-y-6 md:space-y-8 custom-scrollbar min-h-0">
                <div v-if="error" class="p-3 md:p-4 rounded-xl md:rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold flex items-center gap-3 text-xs md:text-sm">
                  <Icon name="ph:warning-circle-bold" />
                  {{ error }}
                </div>
                <div class="space-y-4 md:space-y-6">
                  <!-- Title -->
                  <div class="space-y-1 md:space-y-2 text-right">
                    <label class="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2">{{ t('Request Title') }}</label>
                    <input 
                      v-model="requestData.title" 
                      :placeholder="t('What do you need?')"
                      class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all font-bold text-sm md:text-base" 
                    />
                  </div>

                  <!-- Description -->
                  <div class="space-y-1 md:space-y-2 text-right">
                    <label class="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2">{{ t('Description') }}</label>
                    <textarea 
                      v-model="requestData.description" 
                      :placeholder="t('Provide details about your request...')"
                      class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white min-h-[100px] md:min-h-[150px] resize-none transition-all font-medium text-sm md:text-base" 
                    ></textarea>
                  </div>

                  <!-- Image Upload -->
                  <div class="space-y-1 md:space-y-2 text-right">
                    <label class="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 px-2">{{ t('You can add a photo to illustrate the request') }}</label>
                    <div class="relative group">
                      <input 
                        type="file" 
                        class="absolute inset-0 opacity-0 cursor-pointer z-20" 
                        @change="handleFileChange" 
                        accept="image/*" 
                      />
                      <div class="w-full border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[1.5rem] md:rounded-[2rem] p-4 flex flex-col items-center justify-center gap-2 md:gap-4 group-hover:border-indigo-500 transition-all bg-slate-50/50 dark:bg-white/5 relative overflow-hidden">
                        <!-- Loading Overlay -->
                        <div v-if="isUploadingImage" class="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center">
                          <Icon name="ph:circle-notch-bold" class="text-4xl text-indigo-600 animate-spin mb-2" />
                          <p class="text-xs font-black text-indigo-600 animate-pulse">{{ t('Uploading...') }}</p>
                        </div>

                        <div v-if="!requestData.imageUrl && !isUploadingImage" class="text-center py-4">
                          <Icon name="ph:image-square-bold" class="text-3xl md:text-4xl text-slate-400 mb-1 md:mb-2" />
                          <p class="text-xs md:text-sm font-bold text-slate-500">{{ t('Click to upload image') }}</p>
                        </div>
                        <div v-if="requestData.imageUrl" class="relative w-full h-32 md:h-40 rounded-xl md:rounded-2xl overflow-hidden bg-slate-100 dark:bg-white/5">
                          <img :src="requestData.imageUrl" class="w-full h-full object-contain" />
                          <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Icon name="ph:arrows-clockwise-bold" class="text-2xl md:text-3xl text-white animate-spin-slow" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="mt-6 md:mt-10 flex flex-col sm:flex-row gap-3 md:gap-4 pt-5 md:pt-6 border-t border-slate-100 dark:border-white/5 shrink-0">
                <button 
                  class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 md:py-5 rounded-xl md:rounded-2xl transition-all transform hover:scale-[1.02] shadow-xl active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 text-sm md:text-base order-1 sm:order-2"
                  :disabled="loading" 
                  @click="openAgreement"
                >
                  <Icon v-if="loading" name="ph:circle-notch-bold" class="animate-spin" />
                  <Icon v-else name="ph:check-circle-bold" />
                  {{ t('Submit Request') }}
                </button>
                <button 
                  class="px-8 md:px-10 py-4 md:py-5 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white font-black rounded-xl md:rounded-2xl hover:bg-slate-200 dark:hover:bg-white/20 transition-all active:scale-95 text-sm md:text-base order-2 sm:order-1"
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

    <!-- Agreement Dialog -->
    <Teleport to="body">
      <transition name="modal">
        <div v-if="showAgreementDialog" class="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-md" @click="showAgreementDialog = false"></div>
          
          <div class="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-white/20 p-8 md:p-10 animate-modal-in text-center space-y-6">
            <button @click="showAgreementDialog = false" class="absolute top-6 right-6 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
              <Icon name="ph:x-bold" class="text-xl dark:text-white" />
            </button>

            <h3 class="text-2xl font-black text-slate-900 dark:text-white italic">{{ t('Commission Pledge') }}</h3>
            
            <div class="bg-slate-50 dark:bg-white/5 p-6 rounded-2xl text-right space-y-4">
              <p class="text-[10px] md:text-xs text-slate-400 leading-relaxed font-bold italic">
                بسم الله الرحمن الرحيم قال الله تعالى: " وَأَوْفُواْ بِعَهْدِ اللهِ إِذَا عَاهَدتُّمْ وَلاَ تَنقُضُواْ الأَيْمَانَ بَعْدَ تَوْكِيدِهَا وَقَدْ جَعَلْتُمُ اللهَ عَلَيْكُمْ كَفِيلاً " صدق الله العظيم.
              </p>
              <div class="space-y-3 text-sm font-bold text-slate-700 dark:text-slate-300 leading-loose">
                <p>- أتعهد وأقسم بالله أنا المعلن أن أدفع رسوم الموقع وهي 2.5% من قيمة البيع سواء تم البيع عن طريق الموقع أو بسببه.</p>
                <p>- كما أتعهد بدفع الرسوم خلال 5 أيام من استلام مبلغ المبايعة.</p>
              </div>
            </div>

            <div class="flex items-center justify-center gap-3 py-2">
              <input 
                type="checkbox" 
                id="agreement" 
                v-model="agreementChecked"
                class="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <label for="agreement" class="text-sm font-black text-slate-700 dark:text-white cursor-pointer">
                {{ t('I pledge that') }}
              </label>
            </div>

            <button 
              @click="submitRequest"
              :disabled="!agreementChecked || loading"
              class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-white/10 text-white font-black py-4 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <Icon v-if="loading" name="ph:circle-notch-bold" class="animate-spin" />
              <Icon v-else name="ph:paper-plane-tilt-bold" />
              {{ t('Submit Request') }}
            </button>
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
