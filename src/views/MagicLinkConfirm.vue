<script setup>
import { onMounted } from "vue";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "vue-router";
import { useAppStore } from "../stores/store";

const router = useRouter();
const appStore = useAppStore();

onMounted(async () => {
  const { error } = await supabase.auth.getSession();
  const { data, error: updateError } = await supabase.auth.getUser();

  if (error || updateError) {
    console.error(error || updateError);
  } else {
    appStore.setUser(data.user);
    router.replace("/"); // go to home or dashboard
  }
});
</script>
