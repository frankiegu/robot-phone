import {
  WhisperingTypeSelect as EmsWhisperingTypeSelect
} from '@/components/packages/ems/select'
import {
  WhisperingTypeSelect as SmsWhisperingTypeSelect
} from '@/components/packages/sms/select'
import {
  SYSTEM
} from '@/constants'
import {
  systemLocal
} from '@/storage/local'

export const getWhisperingTypeSelect = (system = Number(systemLocal.getOrDefault())) => {
  switch (system) {
    case SYSTEM.ADMIN_TYPE_SMS:
      return SmsWhisperingTypeSelect
    case SYSTEM.ADMIN_TYPE_EMS:
      return EmsWhisperingTypeSelect
  }
  return null
}

export const isEms = (system = Number(systemLocal.getOrDefault())) => {
  return system === SYSTEM.ADMIN_TYPE_EMS
}

export const isSms = (system = Number(systemLocal.getOrDefault())) => {
  return system === SYSTEM.ADMIN_TYPE_SMS
}
