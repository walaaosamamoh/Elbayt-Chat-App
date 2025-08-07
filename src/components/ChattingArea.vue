<template>
  <div class="flex flex-col flex-1 h-full">
    <div v-if="selectedUser" class="flex items-center px-2 py-2 md:px-4">
      <img :src="selectedUser.img" alt="User Image" class="w-10 h-10 rounded-full mr-2" />
      <div>
        <h1 class="font-semibold text-base md:text-lg">{{ selectedUser.name }}</h1>
        <span class="text-sm">{{ selectedUser.status }}</span>
      </div>
    </div>
    <div class="flex-2 bg-gray-100 rounded-lg p-2 md:p-4 h-[40vh] md:h-[60vh] overflow-y-auto">
      <div
        v-for="(msg, idx) in messages"
        :key="idx"
        :class="['flex items-end mb-2', msg.fromMe ? 'justify-end' : 'justify-start']"
      >
        <!-- Receiver message (left) -->
        <template v-if="!msg.fromMe">
          <img :src="selectedUser.img" alt="User Image" class="w-8 h-8 rounded-full mr-2" />
          <span
            class="bg-white text-gray-800 px-3 py-2 rounded-2xl shadow max-w-[70vw] md:max-w-[60%] break-words"
          >
            {{ msg.text }}
          </span>
        </template>
        <!-- Sent message (right) -->
        <template v-else>
          <span
            class="bg-teal-600 text-white px-3 py-2 rounded-2xl shadow max-w-[70vw] md:max-w-[60%] break-words"
          >
            {{ msg.text }}
          </span>
        </template>
      </div>
      <p v-if="messages.length === 0" class="h-full flex justify-center items-center text-gray-400">
        No messages are available. Once you send message they will appear here.
      </p>
    </div>
    <div class="flex items-center gap-1 px-2 py-2 md:px-4">
      <input
        v-model="message"
        @keyup.enter="sendMessage"
        type="text"
        placeholder="Type your message here..."
        class="w-full p-2 border border-gray-300 rounded-lg rounded-r-none focus:outline-none text-sm md:text-base"
      />
      <button
        @click="sendMessage"
        class="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg rounded-l-none transition"
      >
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectedUser: {
      type: Object,
      required: false,
      default: null,
    },
    currentUser: {
      type: Object,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      ws: null,
      message: '',
      messages: [],
    }
  },
  watch: {
    selectedUser(newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        // Load messages between currentUser and selectedUser from localStorage
        const allMessages = JSON.parse(localStorage.getItem('messages')) || []
        this.messages = allMessages
          .filter(
            (m) =>
              (m.from === this.currentUser.email && m.to === newVal.email) ||
              (m.from === newVal.email && m.to === this.currentUser.email),
          )
          .map((m) => ({
            text: m.text,
            fromMe: m.from === this.currentUser.email,
          }))
      } else {
        this.messages = []
      }
    },
  },
  mounted() {
    this.ws = new WebSocket('ws://localhost:3000')
    this.ws.onmessage = async (event) => {
      let data = event.data
      // If data is a Blob, convert to string
      if (data instanceof Blob) {
        data = await data.text()
      }
      try {
        const msg = JSON.parse(data)
        if (
          this.selectedUser &&
          ((msg.from === this.selectedUser.email && msg.to === this.currentUser.email) ||
            (msg.from === this.currentUser.email && msg.to === this.selectedUser.email))
        ) {
          this.messages.push({
            text: msg.text,
            fromMe: msg.from === this.currentUser.email,
          })
          // Save all messages for this chat in localStorage
          const allMessages = JSON.parse(localStorage.getItem('messages')) || []
          allMessages.push({
            text: msg.text,
            from: msg.from,
            to: msg.to,
            timestamp: msg.timestamp,
          })
          localStorage.setItem('messages', JSON.stringify(allMessages))
        }
      } catch (e) {
        console.error('Invalid message format:', e)
      }
    }
  },
  beforeUnmount() {
    if (this.ws) {
      this.ws.close()
    }
  },
  methods: {
    sendMessage() {
      if (this.message.trim() && this.ws && this.ws.readyState === 1) {
        const msgObj = {
          text: this.message,
          from: this.currentUser.email,
          to: this.selectedUser.email,
          timestamp: Date.now(),
        }
        this.ws.send(JSON.stringify(msgObj))
        this.message = ''
      }
    },
  },
}
</script>
