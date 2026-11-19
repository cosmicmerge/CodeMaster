import axios from "axios"


async function batchSubmit(batchedSubmission){
  const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'false'
  },
  headers: {
    'x-rapidapi-key': '31d5a4c995msh84a04d98e55eed1p187d97jsnafb2d6041b9b',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },

  data: {
    submissions:batchedSubmission
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error("Batch submission error",error.response?.data || error.message);
	}
}

  return await fetchData();   
}



export default batchSubmit;