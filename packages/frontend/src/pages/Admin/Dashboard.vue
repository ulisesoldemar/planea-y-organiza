<template>
    <AdminLayout>
        <v-card width="100%">
            <!-- <v-card-title>Bienvenido a P&O</v-card-title> -->
            <div class="text-center pa-15">
                <v-img :src="logo" alt="Logo" width="400" style="display: block;
  margin-left: auto;
  margin-right: auto;
  width: 40%;"></v-img>
            </div>
        </v-card>
        <!-- <CookiesBanner /> -->
    </AdminLayout>
</template>
  
<script setup>
import AdminLayout from '@/layouts/AdminLayout.vue';
import CookiesBanner from '@/components/Admin/CookiesBanner.vue';
// import logo from "@/assets/images/Logo-Home.svg";
import logo from "@/assets/images/Logo-Home-Sail.svg";
import { useAdmins } from '@/stores/admin';

</script>
  