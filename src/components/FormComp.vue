<template>
  <div class="relative">
    <label class="block">
      {{ label }}
    </label>
    <input
      v-if="type === 'file'"
      class="w-full px-2 py-1.5"
      type="file"
      @change="$emit('update:modelValue', $event.target.files[0])"
      :required="required"
    />
    <input
      v-else-if="type === 'password'"
      class="relative w-full px-2 py-1.5 mb-2 border-gray-300 border focus:outline-none rounded-lg"
      :type="showPassword ? 'text' : 'password'"
      :placeholder="placeholder"
      :required="required"
      :minlength="minlength"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <input
      v-else
      class="relative w-full px-2 py-1.5 mb-2 border-gray-300 border focus:outline-none rounded-lg"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :minlength="minlength"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <span
      v-if="type === 'password'"
      class="absolute right-3 top-11 transform -translate-y-1/2 cursor-pointer text-gray-500"
      @click="togglePassword"
    >
      <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    placeholder: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
    minlength: {
      type: Number,
      default: 0,
    },
    modelValue: {
      type: [String, Number, File],
      default: '',
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      showPassword: false,
    }
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword
    },
  },
}
</script>
