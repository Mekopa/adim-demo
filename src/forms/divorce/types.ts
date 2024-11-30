// src/forms/divorce/types.ts

import { FormValue } from "../../types/workflow";

export interface Child {
  age: number;
  // If there are more properties, add them here
  [key: string]: FormValue;
}