<script setup lang="ts">
const { status, data, signIn, signOut } = useAuth();

const userStatus = computed(() => {
  return status.value;
});
</script>

<template>
  <div>
    <nav>
      <ul>
        <li>
          <NuxtLink to="/">Home</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/private">Private</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/guest">Guest</NuxtLink>
        </li>
        <li>
          {{ userStatus }}
        </li>
      </ul>
    </nav>
  </div>
</template>
