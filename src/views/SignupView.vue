<template>
  <div class="flex items-center justify-center h-screen w-full px-5">
    <div class="bg-white p-8 w-full md:w-150 rounded-2xl shadow-md">
      <h1 class="text-2xl font-semibold mb-4 pb-4 border-b border-b-gray-200">El-Bayt Chat App</h1>
      <form @submit.prevent="submitForm" novalidate>
        <p v-if="error" class="text-center py-3 mb-2 bg-red-200 rounded-lg">{{ error }}</p>
        <FormComp
          label="First Name"
          type="text"
          placeholder="First name"
          :required="true"
          v-model="fname"
        />
        <FormComp
          label="Last Name"
          type="text"
          placeholder="Last name"
          :required="true"
          v-model="lname"
        />
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
          :min-length="8"
          :required="true"
          v-model="password"
        />
        <FormComp
          label="Select Image"
          type="file"
          placeholder="Select Image"
          :required="true"
          v-model="img"
        />
        <Button
          class="w-full mb-4 p-2 my-2 bg-teal-600 cursor-pointer text-white rounded"
          :disabled="isLoading"
        >
          <span v-if="isLoading">
            <i class="fas fa-spinner fa-spin"></i>
          </span>
          <span v-else>Continue to Chat</span>
        </Button>
      </form>
      <p class="text-center w-full mb-4">
        Already signed up?
        <router-link :to="{ name: 'login' }" class="text-gray-600">Login now</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import FormComp from '../components/FormComp.vue'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
export default {
  components: {
    FormComp,
  },
  data() {
    return {
      email: '',
      password: '',
      fname: '',
      lname: '',
      img: null,
      error: '',
      isLoading: false,
    }
  },
  methods: {
    async submitForm() {
      // Validate form fields
      if (!this.fname || !this.lname || !this.email || !this.password || !this.img) {
        const emptyField = document.querySelectorAll('input:invalid')
        if (emptyField.length > 0) {
          emptyField[0].focus()
          emptyField[0].reportValidity()
        }
        this.error = 'All input fields are required!'
        return
      }
      if (this.password.length < 8) {
        document.querySelector('input[type="password"]').focus()
        this.error = 'Password must be at least 8 characters.'
        return
      }
      this.isLoading = true
      this.error = ''
      // Handle form submission logic here
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password)

        // Convert image file to base64
        const toBase64 = (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result)
            reader.onerror = (error) => reject(error)
          })

        const imgBase64 = await toBase64(this.img)

        const userData = {
          uid: userCredential.user.uid,
          email: this.email,
          name: this.fname +' '+ this.lname,
          img: imgBase64,
          status: 'online',
        }

        const users= JSON.parse(localStorage.getItem('users')) || []
        users.push(userData)
        localStorage.setItem('users', JSON.stringify(users))

        localStorage.setItem('currentUser', JSON.stringify(userData))

        this.isLoading = false

        this.$router.push({ name: 'chat' })
      } catch (err) {
        this.isLoading = false
        // Handle Firebase Auth errors
        if (err.code === 'auth/email-already-in-use') {
          this.error = 'This email is already in use. Please use a different email or login.'
        } else if (err.code === 'auth/invalid-email') {
          this.error = 'The email address is invalid. Please enter a valid email.'
        } else if (err.code === 'auth/operation-not-allowed') {
          this.error = 'Email/password accounts are not enabled. Please contact support.'
        } else if (err.code === 'auth/weak-password') {
          this.error = 'Password is too weak. Please use at least 8 characters.'
        } else if (err.code === 'auth/network-request-failed') {
          this.error = 'Network error. Please check your connection and try again.'
        } else {
          this.error = 'Signup failed. Please try again.'
        }
        console.log(err)
        return
      }
    },
  },
}
</script>
