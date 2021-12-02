import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { loginUserAction } from '../../redux/reducers/user/user.action';
import Button from 'reactstrap/lib/Button';
import Container from 'reactstrap/lib/Container';
import FormGroup from 'reactstrap/lib/FormGroup';
import Input from 'reactstrap/lib/Input';
import Label from 'reactstrap/lib/Label';
const BlankLayout = ({children}) => {
	return (
		<>
			<div style={{ padding: '20px' }} >
				{children}
			</div>
		</>
	)
}

const Login = () => {
	const [userCredentials, setUserCredentials] = useState({
		email: "",
		password: "",
	});
	const [blocking, setBlocking] = useState(false);
	
	const dispatch = useDispatch();
	const router = useRouter();
	
	
	const handleInputCredentials = (e) => {
		setBlocking(false);
		setUserCredentials({...userCredentials, [e.target.name]: e.target.value});
	};
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		// Call redux action
		setBlocking(true);
		const { payload } = await dispatch(loginUserAction(userCredentials));
		if (payload.token) {
			if (payload.user.type === 'certAdmin') router.push('/certificates');
			else router.push('/')
		}
		setBlocking(false);
	};
	
	return (<>
		<Container style={{ padding: '18%' }}>
			<form onSubmit={handleSubmit}>
			<Label>Admin Login</Label>
			<FormGroup>
				<Input type="email"
				       maxLength="256"
				       name="email"
				       placeholder="Enter Your Email"
				       id="email"
				       value={userCredentials.email}
				       onChange={handleInputCredentials}
				       required=""/>
			</FormGroup>
			<FormGroup>
				<Input
					type="password"
					className="text-field w-input"
					maxLength="256"
					name="password"
					placeholder="Password"
					required=""
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
			</form>
		</Container>

	</>)
};
Login.Layout = BlankLayout;
export default Login;