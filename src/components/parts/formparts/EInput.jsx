import { useEffect, useRef, useState } from "react";

const EInput = ({ name, value, onChange, bg="white", readOnly = false }) => {
  const ref = useRef();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isEditing) {
      ref.current.focus();
      ref.current.select();
    }
  }, [isEditing, ref]);

  const style = {
    width: "30px",
    height: "24px",
    textAlign: "center",
    backgroundColor: bg,
    borderRadius:"5px"
  };

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  return (
    <input
      type="text"
      ref={ref}
      name={name}
      value={value}
      onClick={handleClick}
      onBlur={handleBlur}
      onChange={(e) => {
        onChange(e.target.value);
      }}
      style={style}
      readOnly={readOnly}
    />
  );
};

export default EInput;
