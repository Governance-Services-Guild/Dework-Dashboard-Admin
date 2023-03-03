<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'
import { RouterLink } from 'vue-router'

const loading = ref(true)
const full_name = ref('')
const website = ref('')
const avatar_url = ref('')
const src = ref('')

async function getProfile() {
    try {
      loading.value = true
      const { user } = session.value
        full_name.value = user.user_metadata.full_name
        avatar_url.value = user.user_metadata.avatar_url
    } catch (error) {
      alert(error.message)
    } finally {
      loading.value = false
    }
  }


const session = ref()

  onMounted(() => {
    supabase.auth.getSession().then(({ data }) => {
      session.value = data.session
      if (session.value) {
        getProfile()
        //downloadImage()
        console.log(data.session.user.user_metadata.full_name)
      }
    })

    supabase.auth.onAuthStateChange((_, _session) => {
      session.value = _session
    })
  })
</script>

<template>
  <div>
  <nav>
    <div>
    <RouterLink class="button" to="/" tag="button"><button>Home</button></RouterLink>
    <RouterLink class="button" to="/about" v-if="session" :session="session"><button>About</button></RouterLink>
    </div>
    <div class="navcont">
    <p v-if="session"> {{ full_name }}</p>
    <p v-else >Please sign in</p>
    <RouterLink to="/profile">
      <img
          v-if="session"
          :src="session.user.user_metadata.avatar_url"
          alt="Avatar"
          class="Avatar"
          :style="{ height: 2 + 'em', width: 2 + 'em' }"
        />
        <img
          v-else
          src='https://live.staticflickr.com/5204/5281085864_614284bbd0.jpg'
          alt="Avatar"
          class="Avatar"
          :style="{ height: 2 + 'em', width: 2 + 'em' }"
        />
    </RouterLink>
    </div>
  </nav>
  </div>
</template>

<style>

.Avatar {
  border-radius: 50%;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  margin: 0.7em;
}

.Avatar:hover {
  filter: brightness(1.2);
  transform: scale(1.2);
  border: 2px solid #65b5f6;
}

nav {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
button {
  margin: 0.5em;
}
.navcont {
  display: flex;
  justify-content: flex-end;
}

p {
  margin: 1em;
}
</style>