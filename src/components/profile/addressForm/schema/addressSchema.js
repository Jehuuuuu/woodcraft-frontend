import * as z from 'zod';
import parsePhoneNumber from "libphonenumber-js";

export const AddressSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    phoneNumber: z.string().transform((value, ctx) => {
        const phoneNumber = parsePhoneNumber(value, {
          defaultCountry: "PH",
        });
      
        if (!phoneNumber?.isValid()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid phone number",
          });
          return z.NEVER;
        }
      
        return phoneNumber.formatInternational()
    }),
    region: z.string(),
    province: z.string(),
    city: z.string(),
    barangay: z.string().min(1, "This field is required"),
    postalCode:z.string().min(4, "Invalid Postal Code").max(4, "Invalid Postal Code"),
    street: z.string().min(5, "Invalid Address"),
    isDefault: z.boolean()
})

export default function FieldInfo({field}){
    return (
        <>
          {field.state.meta.isTouched && field.state.meta.errors ? (
            <span className='text-sm text-red-500 '>{field.state.meta.errors.map((err) => err.message).join(',')}</span>
          ) : null}
          {field.state.meta.isValidating ? 'Validating...' : null}
        </>
      )
}