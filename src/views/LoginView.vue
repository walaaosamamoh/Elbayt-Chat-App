<template>
  <div class="flex items-center justify-center h-screen w-full px-5">
    <div class="bg-white p-8 w-full md:w-150 rounded-2xl shadow-md">
      <h1 class="text-2xl font-semibold mb-4 pb-4 border-b border-b-gray-200">El-Bayt Chat App</h1>
      <form @submit.prevent="submitForm" novalidate>
        <p v-if="error" class="text-center py-3 mb-2 bg-red-200 rounded-lg">{{ error }}</p>
        <FormComp
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          :required="true"
          v-model="email"
        />
        <FormComp
          label="Password"
          type="password"
          placeholder="Enter your password"
          :minlength="8"
          :required="true"
          v-model="password"
        />
        <Button class="w-full mb-4 p-2 my-2 bg-teal-600 cursor-pointer text-white rounded"
          >Continue to Chat</Button
        >
      </form>
      <p class="text-center w-full mb-4">
        Not yet signed up?
        <router-link :to="{ name: 'signup' }" class="text-gray-600">Signup now</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import FormComp from '../components/FormComp.vue'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
export default {
  name: 'LoginView',
  components: {
    FormComp,
  },
  data() {
    return {
      email: '',
      password: '',
      error: '',
    }
  },

  methods: {
    async submitForm() {
      this.error = ''
      if (!this.email || !this.password) {
        const emptyField = document.querySelectorAll('input:invalid')
        if (emptyField.length > 0) {
          emptyField[0].focus()
          emptyField[0].reportValidity()
        }
        this.error = 'All input fields are required!'
        return
      }

      try {
        await signInWithEmailAndPassword(auth, this.email, this.password)

        // Get users array from localStorage
        let users = JSON.parse(localStorage.getItem('users')) || []
        // Find the user by email
        let user = users.find((u) => u.email === this.email)
        if (user) {
          user.status = 'online'
          // Save as currentUser
          localStorage.setItem('currentUser', JSON.stringify(user))
        }

        this.$router.push({ name: 'chat' })
      } catch (err) {
        if (err.code === 'auth/user-not-found') {
          this.error = 'User not found. Please sign up first.'
        } else if (err.code === 'auth/wrong-password') {
          this.error = 'Incorrect password. Please try again.'
        } else if (err.code === 'auth/invalid-credential') {
          this.error = 'Invalid email or password.'
        } else {
          this.error = 'Login failed. Please try again.'
        }
        console.log(err)
      }
    },
  },
}
</script>
