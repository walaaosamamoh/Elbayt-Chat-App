<template>
  <div
    class="flex flex-col w-[30vw] h-full bg-white"
  >
    <!-- head -->
    <div class="flex items-center justify-between pb-4 border-b border-b-gray-300">
      <div class="flex items-center gap-2">
        <img class="w-10 h-10 rounded-full" :src="currentUser?.img" alt="User Image" />
        <div>
          <h1 class="font-semibold text-base md:text-lg">{{ currentUser.name }}</h1>
          <span class="text-xs md:text-sm">{{ currentUser.status }}</span>
        </div>
      </div>
      <button
        class="bg-black text-white p-2 rounded-lg cursor-pointer text-xs md:text-base"
        @click="logout"
      >
        Logout
      </button>
    </div>
    <!-- search -->
    <div class="mt-4 flex items-center gap-1 w-full">
      <span class="flex-2 w-full">
        <span v-if="show" class="md:text-lg text-xs">Select a user to start chat</span>
        <input
          v-else
          class="border border-gray-300 w-full p-2 rounded-lg rounded-r-none focus:outline-none text-sm"
          type="text"
          v-model="search"
          placeholder="Enter name to search"
        />
      </span>
      <div :class="{ hide: !show }" class="py-2 px-4 rounded-lg rounded-l-none cursor-pointer">
        <i :class="show ? 'fas fa-search' : 'fas fa-times'" @click="showInput"></i>
      </div>
    </div>
    <!-- users list -->
    <div class="flex-1 overflow-y-auto max-h-[60vh] mt-2">
      <ul>
        <li
          v-for="user in filteredUsers.filter((u) =>
            u.name.toLowerCase().includes(search.toLowerCase()),
          )"
          :key="user.id"
          class="flex items-center md:gap-3 gap-1 py-2 px-2 hover:bg-gray-100 border-b border-b-gray-200 rounded-lg cursor-pointer transition"
          @click="$emit('select-user', user)"
        >
          <img class="w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0" :src="user.img" alt="User Image" />
          <div class="min-w-0 flex-1">
            <span class="block font-medium truncate">{{ user.name }}</span>
            <p class="text-xs text-gray-500 truncate">
              {{ lastMessages[user.email] ? lastMessages[user.email] : 'No message available' }}
            </p>
          </div>
          <span
            :class="user.status === 'online' ? 'text-green-500' : 'text-gray-500'"
            class="text-xs ml-auto"
          >
            <i class="fas fa-circle"></i>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentUser: {
      type: Object,
      required: true,
    },
    allUsers: {
      type: Array,
      default: () => [],
    },
    lastMessages: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      search: '',
      show: true,
    }
  },
  computed: {
    filteredUsers() {
      // Use uid if available, otherwise fallback to email
      return this.allUsers.filter(
        (u) =>
          (u.uid && u.uid !== this.currentUser.uid) ||
          (!u.uid && u.email !== this.currentUser.email),
      )
    },
  },
  methods: {
    showInput() {
      this.show = !this.show
      if (this.show) {
        this.search = ''
      }
    },
    logout() {
      // Clear current user from localStorage
      localStorage.removeItem('currentUser')
      // Update status of the user in localStorage
      let users = JSON.parse(localStorage.getItem('users')) || []
      users = users.map((user) => {
        if (user.email === this.currentUser.email) {
          return { ...user, status: 'offline' }
        }
        return user
      })
      localStorage.setItem('users', JSON.stringify(users))
      // Optionally, redirect to login page or home page
      this.$router.push({ name: 'login' })
    },
  },
}
</script>

<style scoped>
.hide {
  color: white;
  background-color: black;
}
</style>
