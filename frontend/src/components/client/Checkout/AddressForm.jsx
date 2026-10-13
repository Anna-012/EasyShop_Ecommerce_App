const AddressForm = ({ address, handleChange }) => {
  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-[#FAF9FF] px-3.5 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#6D28D9] focus:bg-white focus:ring-2 focus:ring-purple-100";

  const fields = [
    {
      name: "fullName",
      label: "Full Name",
      placeholder: "Enter full name",
      autoComplete: "name",
      required: true,
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
      placeholder: "10-digit phone number",
      type: "tel",
      autoComplete: "tel",
      maxLength: 10,
      inputMode: "numeric",
      required: true,
    },
    {
      name: "houseNo",
      label: "House / Flat Number",
      placeholder: "House or flat number",
      autoComplete: "address-line1",
      required: true,
    },
    {
      name: "area",
      label: "Area / Street",
      placeholder: "Area or street",
      autoComplete: "address-line2",
      required: true,
    },
    {
      name: "landmark",
      label: "Landmark",
      placeholder: "Nearby landmark (optional)",
      required: false,
    },
    {
      name: "city",
      label: "City",
      placeholder: "Enter city",
      autoComplete: "address-level2",
      required: true,
    },
    {
      name: "state",
      label: "State",
      placeholder: "Enter state",
      autoComplete: "address-level1",
      required: true,
    },
    {
      name: "pincode",
      label: "PIN Code",
      placeholder: "6-digit PIN code",
      autoComplete: "postal-code",
      maxLength: 6,
      inputMode: "numeric",
      required: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
      {fields.map((field) => (
        <div
          key={field.name}
          className={
            field.name === "fullName" ||
            field.name === "area" ||
            field.name === "landmark"
              ? "sm:col-span-2"
              : ""
          }
        >
          <label
            htmlFor={field.name}
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            {field.label}
            {!field.required && (
              <span className="ml-1 font-normal text-gray-400">(Optional)</span>
            )}
          </label>

          <input
            id={field.name}
            name={field.name}
            type={field.type || "text"}
            autoComplete={field.autoComplete}
            maxLength={field.maxLength}
            inputMode={field.inputMode}
            pattern={
              field.name === "phoneNumber"
                ? "[0-9]{10}"
                : field.name === "pincode"
                  ? "[0-9]{6}"
                  : undefined
            }
            placeholder={field.placeholder}
            value={address[field.name] ?? ""}
            onChange={handleChange}
            className={inputClass}
            required={field.required}
          />
        </div>
      ))}
    </div>
  );
};

export default AddressForm;
