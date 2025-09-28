'use server'

import { UserRoleEnum } from '@/app/generated/prisma'
import { updateUserRole } from '@/services/updateRoleUser'

export async function updateUserRoleAction(formData: FormData) {
    const userId = formData.get('userId') as string
    const newRoleRaw = formData.get('role') as string

    const role =
        newRoleRaw === UserRoleEnum.OWNER
            ? UserRoleEnum.OWNER
            : newRoleRaw === UserRoleEnum.ADMIN
                ? UserRoleEnum.ADMIN
                : UserRoleEnum.USER

    await updateUserRole({ userId, role })
}
