export const registration_config = {
  columns: [
    {
      label: "Jméno",
      name: "firstName",
      placeholder: "Zadejte křestní jméno",
      tooltip: "Zadejte křestní jméno uživatele.",
      type: "text",
    },
    {
      label: "Příjmení",
      name: "lastName",
      placeholder: "Zadejte příjmení",
      tooltip: "Zadejte příjmení uživatele.",
      type: "text",
    },
    {
      label: "Email",
      name: "email",
      placeholder: "Např. jan.novak@goldfren.cz",
      tooltip: "Zadejte pracovní email uživatele.",
      type: "text",
    },
    {
      label: "Heslo",
      name: "password",
      placeholder: "Zadejte heslo",
      tooltip: "Heslo je povinné a musí mít alespoň 8 znaků.",
      type: "password",
    },
    {
      label: "Uživatelské jméno",
      name: "username",
      placeholder: null,
      tooltip: "Generováno z jména a příjmení bez diakritiky.",
      type: "text",
    },
  ],
};
