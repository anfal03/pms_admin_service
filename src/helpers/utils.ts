export const isEmpty = (str) => !(str && str.trim().length)

export const getUserType = (userinfo) => {

    let { id, username = null, roleid = 0, subusermobileno = 0, isparentcustomer = true, mobile = 0 } = userinfo

    const created_user_type = (username && roleid) ? 1 : 2
    const created_by = created_user_type == 1 ? username : (isparentcustomer ? mobile : subusermobileno)

    return { created_user_type, created_by}
}