import { useVuelidate } from "@vuelidate/core";
import {
  helpers,
  required,
  email,
  sameAs,
  minValue,
} from "@vuelidate/validators";

export const $required = helpers.withMessage(
  "El campo es obligatorio.",
  required
);

export const $email = helpers.withMessage(
  "Correo electrónico inválido.",
  email
);

export const $sameAs = (otherField) =>
  helpers.withMessage("Las contraseñas no coinciden.", sameAs(otherField));

export const $minValue = (value) =>
  helpers.withMessage(
    `El valor mínimo permitido es de ${value}.`,
    minValue(value)
  );

export const setupVuelidate = () => {
  return useVuelidate();
};
