<template>
  <div>
    <header>
      <h2 class="fullname">Начисление сотрудникам</h2>
    </header>
    <WalletActions :currencies="currencies" :operations="operations" @submit="handleSubmit" />
    <div>
      <div
        v-for="(employee, index) in selectedEmployersStore.selectedItems"
        :key="employee.id + '-' + index"
      >
        <EmployerSimpleItem :employee="employee" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/types/user'
import { useSelectedUsersStore } from '@/stores/selectedUsersStore'
import EmployerSimpleItem from './EmployerSimpleItem.vue'
import WalletActions from './WalletActions.vue'
import { useUserStore } from '@/stores/userStores'

const currencies = ['🍋', '💎']
const operations = ['+', '-']

const selectedEmployersStore = useSelectedUsersStore()
const userStore = useUserStore()

const handleSubmit = async ({
  currency,
  operation,
  value,
  comment,
  isNotify,
}: {
  currency: string
  operation: string
  value: number
  comment: string
  isNotify: boolean
}) => {
  currency = currency === '🍋' ? 'lemons' : 'diamonds'
  const userIds = selectedEmployersStore.selectedItems.map((item: User) => item.id)
  try {
    await userStore.multipleAccrual({ userIds, currency, count: value, comment })
    if (isNotify) {
      let usersEmails: string[]  = [];

      userIds.forEach((value) => {
        const user = userStore.getUserById(value)
        if (user) {
          usersEmails.push(user.email)
        }
      })
      sendNotificationMultipleRecepients(usersEmails, value, currency, comment)
    }
  } catch (e) {
    console.log('🚀 ~ handleSubmit ~ e:', e)
  } finally {
    props.close()
  }
}

const sendNotificationMultipleRecepients = (
  emails: string[],
  count: number,
  currency: string,
  comment: string,
) => {
  const emailsString = emails.join(',')
  const langCurrency = currency === 'lemons' ? 'лимонов' : 'алмазов'
  const subject = 'Магазин мерча Зарплаты.ру'
  const body = `Привет!%0D%0AМы начислили тебе ${count} ${langCurrency} за ачивку "${comment}".%0D%0AПереходи в наш магазин мерча store.zarplata.ru и оформляй заказ. Вперед за покупками!`
  window.location.href = `
            mailto:${emailsString}?subject=${subject}&body=${body}
        `
}

const props = defineProps<{
  close: () => void
}>()
</script>

<style scoped>
header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin-bottom: 20px;
}

main {
  display: flex;
  flex-direction: column;
  flex: 1;
}

footer {
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 28px;
  width: 100%;
}

.wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.fullname {
  font-style: normal;
  font-weight: 400;
  font-size: 26px;
  line-height: 30px;
}

.email {
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;

  color: var(--color-secondary-text);
}

.wallet {
  display: flex;
  justify-content: space-around;

  padding: 45px 0;
}

.wallet p {
  font-style: normal;
  font-weight: 400;
  font-size: 40px;
  line-height: 46px;
}

.actions {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 1rem;
  justify-content: center;
}

.history {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  flex-grow: 1;
}

.history-title {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
  text-align: center;

  padding: 32px 0;
}

.deactivate {
  font-size: 16px;
}

.history-list {
  flex-grow: 1;
}

.history-empty p {
  color: var(--color-secondary-text);
  text-align: center;
}

.switch {
  display: flex;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 99px;
}

.switch-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 99px;
  margin: 4px;
  cursor: pointer;
}

.switch-item span {
  font-size: 14px;
}

.switch-item.active {
  background-color: var(--vt-c-white);
}

.input {
  border-radius: 99px;
  border: none;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 8px 16px;
  font-size: 14px;
}

.submit {
  width: 40px;
  height: 40px;
  border-radius: 99px;
  padding: 0;
  font-size: 14px;
}

.change-value {
  font-size: 24px;
}

.add {
  color: green;
}

.remove {
  color: #ff746c;
}

.button-title {
  margin-left: 6px;
}

.preloader {
  display: flex;
  justify-content: center;
  align-items: center;
}

.disabled {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
