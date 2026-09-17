export type Payroll = {
  id: string;
  staff_id: string;
  salary_structure: string;
  payment_frequency: string;
  base_salary: string;
  allowances: {
    housing: string;
    transport: string;
  };
  deductions: {
    union: string;
  };
  bank_details: {
    bank_name: string;
    account_number: string;
  };
  tax_information: {
    tin: string;
  };
  pension_information: {
    pfa: string;
    pin: string;
  };
  is_masked: boolean;
};