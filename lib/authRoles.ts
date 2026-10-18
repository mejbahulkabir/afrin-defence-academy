import { createAccessControl } from "better-auth/plugins";
import { adminAc, defaultStatements, userAc } from "better-auth/plugins/admin/access";

const ac = createAccessControl(defaultStatements);

const authRoles = {
    owner: ac.newRole({ ...adminAc.statements, user: [...adminAc.statements.user, "impersonate-admins"] }),
    admin: ac.newRole({ ...adminAc.statements }),
    teacher: ac.newRole({ ...userAc.statements }),
    student: ac.newRole({ ...userAc.statements }),
    editor: ac.newRole({ ...userAc.statements }),
    accountant: ac.newRole({ ...userAc.statements }),
    receptionist: ac.newRole({ ...userAc.statements }),
    librarian: ac.newRole({ ...userAc.statements }),
}

export { ac, authRoles };