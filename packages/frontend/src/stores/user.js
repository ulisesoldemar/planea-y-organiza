import api from '@/utils/api'
import { useStorage } from '@vueuse/core'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { Buffer } from 'buffer'

export const useUsers = defineStore('users', {
    state: () => ({
        userLogin: useStorage('userLogin', {}),
        userData: useStorage('userData', []),
        authStatus: useStorage('authStatus', []),
        provider: useStorage('provider'),
    }),

    getters: {
        authUser: state => state.authStatus === 204,
        hasUserData: state => Object.keys(state.userData).length > 0,
        hasVerified: state =>
            Object.keys(state.userData).length > 0
                ? state.userData.email_verified_at !== null
                : false,
    },

    actions: {
        async getData() {
            api
                .get('/api/user')
                .then(response => {
                    this.userData = response.data
                })
                .catch(error => {
                    if (error.response.status !== 409) throw error

                    this.router.push('/verify-email')
                })
        },

        async register(form, setErrors, processing) {

            processing.value = true

            api
                .post('/register', form.value)
                .then(response => {
                    this.authStatus = response.status
                    processing.value = false

                    this.router.push({ name: 'dashboard' })
                })
                .catch(error => {
                    if (error.response.status !== 422) throw error

                    setErrors.value = Object.values(
                        error.response.data.errors,
                    ).flat()
                    processing.value = false
                })
        },

        async login(setErrors, processing) {

            processing.value = true

            api
                .post('/login', this.userLogin)
                .then(response => {
                    this.authStatus = response.status
                    processing.value = false
                    this.userLogin.password = null
                    this.router.push({ name: 'dashboard' })
                })
                .catch(error => {
                    if (error.response.status !== 422) throw error

                    setErrors.value = Object.values(
                        error.response.data.errors,
                    ).flat()
                    processing.value = false
                })
        },

        async loginBySocial(provider) {
            let response = api
                .get(`/api/authorize/${provider}/redirect`)
                .then((response) => {
                    this.provider = provider
                    return response
                })
                .catch((error) => {
                    throw error;
                })
            return response
        },

        async loginCallback(provider, code) {
            api
                .get(`/api/authorize/${provider}/callback`, {
                    params: { 'code': code }
                })
                .then((response) => {
                    this.authStatus = response.status
                    this.userLogin.password = null
                    this.router.push({ name: 'dashboard' })
                    this.provider = null
                })
                .catch(error => {
                    throw error;
                })
        },

        async forgotPassword(form, setStatus, setErrors, processing) {

            processing.value = true

            api
                .post('/forgot-password', form.value)
                .then(response => {
                    setStatus.value = response.data.status
                    processing.value = false
                })
                .catch(error => {
                    if (error.response.status !== 422) throw error

                    setErrors.value = Object.values(
                        error.response.data.errors,
                    ).flat()
                    processing.value = false
                })
        },

        async resetPassword(form, setErrors, processing) {

            processing.value = true

            api
                .post('/reset-password', form.value)
                .then(response => {
                    this.router.push(
                        '/login?reset=' + Buffer.from(response.data.status).toString('base64'),
                    )
                    processing.value = false
                })
                .catch(error => {
                    if (error.response.status !== 422) throw error

                    setErrors.value = Object.values(
                        error.response.data.errors,
                    ).flat()
                    processing.value = false
                })
        },

        resendEmailVerification(setStatus, processing) {
            processing.value = true

            api.post('/email/verification-notification').then(response => {
                setStatus.value = response.data.status
                processing.value = false
            })
        },

        async logout() {
            await api
                .post('/logout')
                .then(() => {
                    this.$reset()
                    if (!this.userLogin.remember) {
                        this.userLogin = {}
                    }
                    this.userData = {}
                    this.authStatus = []

                    this.router.push({ name: 'welcome' })
                })
                .catch(error => {
                    if (error.response.status !== 422) throw error
                })
        },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUsers, import.meta.hot))
}
