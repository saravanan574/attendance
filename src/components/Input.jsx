const Input = ({label,type = "text",value,name, onChange,placeholder}) => {
    return (
        <div style = {{marginBottom:"15px"}}>
            <label style = {{display:"block",marginBottom:"5px",fontWeight:"500"}}>
                {label}
            </label>
            <input 
                type = {type}
                value = {value}
                name = {name}
                onChange = {onChange}
                placeholder={placeholder}
                styel = {{
                    width:"100%",
                    padding:"10px",
                    borderRadius:"6px",
                    border:"1px solid #ccc",
                    fontSize:"16px",
                }}
            />
        </div>
    );
}

export default Input;