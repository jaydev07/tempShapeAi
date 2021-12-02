import Container from 'reactstrap/lib/Container';
import FormGroup from 'reactstrap/lib/FormGroup';
import Input from 'reactstrap/lib/Input';
import Label from 'reactstrap/lib/Label';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Button from 'reactstrap/lib/Button';
import Badge from 'reactstrap/lib/Badge';
import Table from 'reactstrap/lib/Table';
import {ADD_USER_QUERY, GET_ADMINS_QUERY, GET_SES_VERIFIED_EMAILS_QUERY, SEND_SES_VERIFICATION} from '../../gql/users';
import graphqlClient from '../../configs/ApolloClient.config';
import {useEffect, useState} from 'react';
import {toast} from 'react-toastify';


const Users = () => {
	const [newUser, setNewUser] = useState({email: '', password: '', type: 'certAdmin', isSESVerified: false});
	const [existingUsers, setUsers] = useState([]);
	const [blocking, setBlocking] = useState(false);
	
	const loadAdmins = async () => {
		const { data } = await graphqlClient.query({
			query: GET_ADMINS_QUERY,
		});
		
		const verifiedEmailsRes = await graphqlClient.query({
			query: GET_SES_VERIFIED_EMAILS_QUERY,
		});
		setUsers(data.getAdmins.map(u => ({
			...u,
			isSESVerified: verifiedEmailsRes.data.getSESVerifiedEmails.includes(u.email)
		})));
	};
	
	useEffect(() => {
		loadAdmins();
	}, []);
	
	const handleInputCredentials = (e) => {
		setNewUser({...newUser, [e.target.id]: e.target.value});
	}
	
	const addUser = async (e) => {
		e.preventDefault();
		try {
			await graphqlClient.mutate({
				mutation: ADD_USER_QUERY,
				variables: newUser,
			});
			setNewUser({
				...newUser,
				email: '',
				password: '',
				isSESVerified: false,
			})
			setUsers(existingUsers.concat(newUser));
		} catch (e) {
			toast.error(e.message, { position: 'top-center' })
		}

	}
	return (<>
	<Container style={{ padding: '10px' }} >
		<Row>
			<Col>
				<form onSubmit={addUser}>
				<h3>Add User</h3>
				<FormGroup>
				<Label>
					Email
				</Label>
				<Input
					id={'email'}
					required
					value={newUser.email}
					onChange={handleInputCredentials}
				/>
				</FormGroup>
				<FormGroup>
				<Label>
					Password
				</Label>
				<Input
					id={'password'}
					required
					value={newUser.password}
					onChange={handleInputCredentials}
				/>
				</FormGroup>
				<FormGroup>
				<Label>
					Type
				</Label>
				<Input
					type={'select'}
					id={'type'}
					value={newUser.type}
					onChange={handleInputCredentials}
				>
					<option defaultChecked={true} value={'certAdmin'} >CertAdmin</option>
					<option value={'admin'} >SuperAdmin</option>
				</Input>
				</FormGroup>
					<Button>Add User</Button>
				</form>
			</Col>
			<Col>
				<h3>Users</h3>
				<Table dark>
					<thead>
					<th>email</th>
					<th>type</th>
					<th>is SES Verified</th>
					</thead>
					<tbody>
					{existingUsers.length > 0 && existingUsers.map(u => <>
						<tr>
							<td>
								{u.email}
							</td>
							<td>
								{u.type}
							</td>
							<td>
								{
									String(u.isSESVerified)
								}
								{
									!u.isSESVerified && <Badge
										color={'primary'}
										style={{
											marginLeft: '25px',
											cursor: blocking ? 'not-allowed': 'pointer',
										}}
										onClick={() => {
											if (!blocking) {
												setBlocking(true);
												graphqlClient.mutate({
													mutation: SEND_SES_VERIFICATION,
													variables: { email: u.email },
												}).then(() => {
													setBlocking(false);
													toast.info('SES Verification initiated', { position: 'top-right' });
												}).catch(err => {
													setBlocking(false);
													toast.error(err.message, { position: 'top-center' });
												});
											}
										}
										}
									>
										Send SES Verification
									</Badge>
								}
							</td>
						</tr>
					</>)}
					</tbody>
				</Table>
				
			
			</Col>
		</Row>

	</Container>
	
	</>)
};

export default Users;