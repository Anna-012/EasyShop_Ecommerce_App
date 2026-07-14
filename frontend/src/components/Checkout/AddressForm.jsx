const AddressForm = ({ address, handleChange }) => {
  return (
    <>
      <input
        name="fullName"
        className="w-full border p-2 rounded"
        type="text"
        placeholder="Full Name"
        value={address.fullName}
        onChange={handleChange}
      />

      <input
        className="w-full border p-2 rounded"
        name="phoneNumber"
        type="text"
        maxLength={10}
        inputMode="numeric"
        placeholder="Phone Number"
        value={address.phoneNumber}
        onChange={handleChange}
      />

      <input
        className="w-full border p-2 rounded"
        name="houseNo"
        type="text"
        placeholder="House No"
        value={address.houseNo}
        onChange={handleChange}
      />

      <input
        className="w-full border p-2 rounded"
        name="area"
        type="text"
        placeholder="Area"
        value={address.area}
        onChange={handleChange}
      />

      <input
        className="w-full border p-2 rounded"
        name="landmark"
        type="text"
        placeholder="Landmark"
        value={address.landmark}
        onChange={handleChange}
      />

      <input
        className="w-full border p-2 rounded"
        name="city"
        type="text"
        placeholder="City"
        value={address.city}
        onChange={handleChange}
      />

      <input
        className="w-full border p-2 rounded"
        name="state"
        type="text"
        placeholder="State"
        value={address.state}
        onChange={handleChange}
      />

      <input
        className="w-full border p-2 rounded"
        name="pincode"
        type="text"
        maxLength={6}
        placeholder="Pincode"
        value={address.pincode}
        onChange={handleChange}
      />
    </>
  );
};

export default AddressForm;
