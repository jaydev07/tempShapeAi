import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Button from 'reactstrap/lib/Button';
import Container from 'reactstrap/lib/Container';
import FormGroup from 'reactstrap/lib/FormGroup';
import Input from 'reactstrap/lib/Input';
import Label from 'reactstrap/lib/Label';
import Alert from 'reactstrap/lib/Alert';
import API from '../services/api/auth';

const Login = () => {
	const [serverError, setServerError] = useState('');
	const [res, setRes] = useState('');
	const [userCredentials, setUserCredentials] = useState({
		email: '',
		password: '',
	});
	const [blocking, setBlocking] = useState(false);
	const router = useRouter();

	
	const handleInputCredentials = (e) => {
		setBlocking(false);
		setUserCredentials({...userCredentials, [e.target.name]: e.target.value});
	};
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		setBlocking(true);
		API.signin(userCredentials).then(res => {
				setServerError('');
				setRes('Signed in')
				localStorage.setItem('userToken', res.data.token);
				router.push('/info')
			})
			.catch(e => {
				setServerError(e.response.data)
			})
		setBlocking(false);
	};
	
	return (<>
		<Head>
			<title>
				ShapeAI - Influencer Signup
			</title>
		</Head>
		<Container style={{ padding: '18%' }}>
			<img
				width={300}
				src={
					"https://shapeai-uploads.s3.ap-south-1.amazonaws.com/logo-high.svg"
				}
				alt={"Shape AI"}
			/>
			<form onSubmit={handleSubmit}>
				<Label>Influencer Sign in</Label>
				<FormGroup>
					<Input type="email"
					       maxLength="256"
					       name="email"
					       placeholder="Enter Your Email"
					       id="email"
					       value={userCredentials.email}
					       onChange={handleInputCredentials}
					       required />
				</FormGroup>
				<FormGroup>
					<Input
						type="password"
						className="text-field w-input"
						maxLength="256"
						name="password"
						placeholder="Password"
						required
						value={userCredentials.password}
						onChange={handleInputCredentials}
					/>
				</FormGroup>
				<Button type="submit" value="Sign in"
				        color={'primary'}
				        disabled={blocking}
				        className="submit-button-3 w-button" >
					{blocking ? 'Please Wait...' : 'Sign In'}
				</Button>
				<Alert style={{ marginTop: '50px' }} color={ serverError !== '' ? 'danger': 'primary'} isOpen={serverError || res}>
					<span className="alert-text">{serverError || res}</span>
				</Alert>
			</form>
		</Container>
	
	</>)
};
export default Login;