import * as yup from "yup";

export const phoneNumberValidation = yup
    .string()
    .matches(/^[\d ()+_-]+$/, "Phone number must only include digits and characters ()+_-");
