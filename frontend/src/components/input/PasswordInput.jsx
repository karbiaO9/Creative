import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const PasswordInput = ({ value, onChange }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative mb-4">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder="Password"
        className="input-box pr-10 my-2"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
      >
        {show ? <FaRegEyeSlash size={22} className='text-primary cursor-pointer'/> : <FaRegEye size={22} className='text-primary cursor-pointer'/>}
      </button>
    </div>
  );
};

export default PasswordInput;
