import axios from "axios";



const waiting =(timer)=>new Promise((resolve) =>setTimeout(resolve, timer));

const submitToken=async(resultTokens)=>{
const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    tokens: resultTokens.join(","),
    base64_encoded: 'false',
    fields: '*'
  },
  headers: {
    'x-rapidapi-key': '31d5a4c995msh84a04d98e55eed1p187d97jsnafb2d6041b9b',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error('Polling error:',error.response?.data || error.message);
        return null;
	}
}
   
   while(true){

       const result=await fetchData();
       const isAccepted=result.submissions.every((e)=>e.status_id>2);
    
       if(isAccepted) return result.submissions;

       await waiting(1000);
   }
   

}


export default submitToken;