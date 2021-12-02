import graphQlClient from '../../../configs/ApolloClient.config';
import { GET_CERTIFICATE_BATCHES_QUERY } from '../../../gql/courses';
import Container from 'reactstrap/lib/Container';
import Table from 'reactstrap/lib/Table';
import {useEffect, useState} from 'react';
import Button from 'reactstrap/lib/Button';


const Batches = () => {
	const [batches, setBatches] = useState([]);
	
	const loadCertificateBatches = async () => {
		const { data } = await graphQlClient.query({
			query: GET_CERTIFICATE_BATCHES_QUERY,
		});
		setBatches(data.getCertificateBatches)
	};
	
	
	useEffect(() => {
	loadCertificateBatches()
	}, []);
	return (<>
	<Container style={{ padding: '2%'}}>
		<Button onClick={loadCertificateBatches}>
			Refresh
		</Button>
		<Table dark striped={true}>
			<thead>
			<tr>
				<th>id</th>
				<th>created At</th>
				<th>status</th>
				<th>from Template</th>
				<th>Total Entries</th>
				<th>Total Sent</th>
				{/*<th>CSV</th>*/}
			</tr>
			</thead>
			<tbody>
			{
				batches.length > 0 && batches.map(batch =>
					<tr>
						<td>{batch._id}</td>
						<td>{new Date(Number(batch.createdAt)).toString().slice(0, 25)}</td>
						<td>{batch.status}</td>
						<td>{batch.certificateTemplate.name}</td>
						<td>{batch.totalEntries}</td>
						<td>{batch.completedCount}</td>
						{/*<td><a href={batch.csv}>file</a></td>*/}
					</tr>
				)
			}
			</tbody>
		</Table>
	</Container>
	
	
	</>)
};

export default Batches;