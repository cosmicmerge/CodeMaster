
const idAndValues={
    1:"In Queue",
    2:"Processing",
    3:"Accepted",
    4:"Wrong answer",
    5:"Time limit exceeded",
    6:"Compilation error",
    7:"Runtime error",
    8:"Runtime error",
    9:"Runtime error",
    10:"Runtime error",
    11:"Runtime error",
    12:"Runtime error",
    13:"Internal error",
    14:"Exec format error"
}


const getResultOfId=(id)=>{
    return idAndValues[id] || "runtime error";
}


export default getResultOfId;