<template>
  <div class="flex justify-center h-screen w-full px-2 md:px-5 py-4 md:py-10">
    <div class="bg-white p-2 md:p-8 w-full rounded-2xl shadow-md flex gap-4">
      <UsersArea
        :current-user="currentUser"
        :all-users="allUsers"
        :last-messages="lastMessages"
        @select-user="handleSelection"
      />
      <ChattingArea :current-user="currentUser" :selected-user="selectedUser" />
    </div>
  </div>
</template>

<script>
import UsersArea from '../components/UsersArea.vue'
import ChattingArea from '../components/ChattingArea.vue'
export default {
  components: {
    UsersArea,
    ChattingArea,
  },

  data() {
    return {
      currentUser: JSON.parse(localStorage.getItem('currentUser')) || {},
      allUsers: [],
      selectedUser: null,
      allMessages: JSON.parse(localStorage.getItem('messages')) || [],
    }
  },
  created() {
    this.loadUsers()
  },
  methods: {
    loadUsers() {
      const users = JSON.parse(localStorage.getItem('users')) || []
      this.allUsers = users
    },
    handleSelection(user) {
      this.selectedUser = user
    },
  },
  computed: {
    lastMessages() {
      const lastMsgMap = {};
      (this.allUsers || []).forEach((user) => {
        const msgs = (this.allMessages || []).filter(
          (m) =>
            (m.from === this.currentUser.email && m.to === user.email) ||
            (m.from === user.email && m.to === this.currentUser.email),
        )
        if (msgs.length > 0) {
          lastMsgMap[user.email] = msgs[msgs.length - 1].text
        }
      })
      return lastMsgMap
    },
  },
}
</script>
