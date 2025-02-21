export interface Resource {
  reference: string
  name: string
  discriminator: string
  value: string
}

export interface CreateResourceFormInputs {
  name: string
  discriminator: string
  value: string
}

export interface UpdateResourceFormInputs {
  name: string
  discriminator: string
  value: string
}

export interface Account {
  reference: string
  name: string
  opened_time: string
  closed_time: string
  ecosystem_type: string
}

export interface CreateAccountFormInputs {
  name: string
  opened_time: string
  closed_time: string
  ecosystem_type: string
}

export interface UpdateAccountFormInputs {
  name: string
  opened_time: string
  closed_time: string
  ecosystem_type: string
}
