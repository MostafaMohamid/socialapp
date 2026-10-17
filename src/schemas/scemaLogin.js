import * as zod from "zod"


export  let schemaLogin = zod.object({
  email: zod.string().nonempty('Email is Required ').email('Invalid Email'),
  password: zod.string().nonempty('Password is Required').regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, " Password must be more than 8 characters: uppercase, lowercase, number & symbol."),

})