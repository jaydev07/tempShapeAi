import Button from 'reactstrap/lib/Button';
import Container from 'reactstrap/lib/Container';
import Card from 'reactstrap/lib/Card';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Badge from 'reactstrap/lib/Badge';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getCertficateTemplateAction } from '../../redux/reducers/courses/courses.action';
import {useRouter} from 'next/router';

const Certificates = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const [templates, setTemplates] = useState([]);
	const fetchTemplates = async () => {
		const { payload } = await dispatch(getCertficateTemplateAction('custom'))
		setTemplates(payload);
	}
	
	useEffect(() => {
		fetchTemplates();
	}, []);
	return (
		<>
		<Container>
				<Link href={'/certificates/add'}>
			<Button color={'primary'} outline>Add Certificate</Button>
			</Link>
			{
				templates.length > 0 && (
					<>
						<Row>
							{
								templates.map(temp => <>
									<Col md={'4'}>
										<Card>
											<h3>{temp.name}</h3>
											<img width={'90%'} alt={temp.name} src={temp.imageUrl} />
											{
												temp.tags.length > 0 && (
													<>
														<Row>
														{
															temp.tags.map(tag => <Col md={'3'}>
																	<Badge style={{ margin: '5px'}} color={'primary'} >
																{tag.key}: {tag.value}
															</Badge>
																</Col>
															)
														}
														</Row>
													</>
													
												)
											}
											<Button onClick={() => router.push(`/certificates/start-batch/${temp._id}`)} color={'dark'} >
												Create a batch
											</Button>
											<Button onClick={() => router.push('/certificates/batches')} >
												Batches list
											</Button>
										</Card>
									</Col>
								</>)
							}
						</Row>
					</>
				)
			}
			</Container>
		</>
	)
}
export default Certificates;