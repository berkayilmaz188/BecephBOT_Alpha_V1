import axios from 'axios';
import { parseCookies } from 'nookies';

export async function checkTokenAndRedirect(context) {
  const cookies = parseCookies(context);
  const token = cookies.token;

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
  
/*
  try {
    const response = await axios.get('/api/adminAuth/tokenVerify', { 
      withCredentials: true 
    });
    
    console.log('Axios Response:', response);
    console.log('Axios Request Config:', response.config);
    console.log('Axios Request Data:', response.config.data);
    console.log('Axios Response Status:', response.status); 
    return { props: {} };
  } catch (error) {
    if (error.response) {
      console.error('Axios Error Response:', error.response);
      console.error('Axios Error Response Status:', error.response.status);
    } else if (error.request) {
      console.error('Axios Error Request:', error.request);
    } else {
      console.error('Axios Error:', error.message);
    }
  
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }*/
}
