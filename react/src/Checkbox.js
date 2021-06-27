import React from 'react';
 
function Checkbox(props) {
    const { left, right, text } = props;
    return <div style={{ display: 'flex' }}>
        {left && <label>{text}</label>}
        <input type="checkbox" {...props} />
        {right && <label>{text}</label>}
    </div>;
}
export default Checkbox;