// Operator

export interface Operator {
  reference: string
  name: string
  discriminator: string
  value: string
}

export interface CreateOperatorFormInputs {
  name: string
  discriminator: string
  value: string
}

export interface UpdateOperatorFormInputs {
  name: string
  discriminator: string
  value: string
}
