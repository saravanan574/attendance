const Button = ({children,onClick,className,col,bg ,type = "button",variant = "default"}) => {

    const design = {
        "default":{
            padding:"10px 20px",
            backgroundColor:bg||"#007bff",
            color:col ||"white",
            border:"none",
            borderRadius:"4px",
            cursor:"pointer",
            fontSize:"14px",
            width:"100%"
        },
        "att-btn":{
            padding:"10px 13px",
            backgroundColor:bg,
            color:col,
            border:"none",
            borderRadius:"4px",
            cursor:"pointer",
            fontSize:"16px",
            margin:"2px",
            fontweight:"400",
            lineHeight:"1",
            display:"inline-flex",
            alignItem:"center",
            justifyContent:"center",
            userSelect:"none",
            whiteSpace:"nowrap",
            transition:"background-color 2s ease, transform 0.1s ease",
            width:"min-content",
            height:"min-content"
        }

    }
    return (
        <button 
            type = {type}
            onClick = {onClick}
            style = {design[variant]}
            className={className}
        >
            {children}
        </button>
    )
}
export default Button;