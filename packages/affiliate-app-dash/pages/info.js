import Container from 'reactstrap/lib/Container';
import Table from 'reactstrap/lib/Table'
// import Row from 'reactstrap/lib/Row'
// import Col from 'reactstrap/lib/Col'
// import Card from 'reactstrap/lib/Card'
// import CardTitle from 'reactstrap/lib/CardTitle'
// import Button from 'reactstrap/lib/Button'
import { useEffect, useState } from 'react';
import authAPI  from '../services/api/auth'
import salesAPI  from '../services/api/sales'
import { useRouter } from 'next/router';

// import UpdateProfileModal from "../components/update-profile-modal";
import AffEarnings from "../components/affiliate-earnings";
import Input from "reactstrap/lib/Input";
import Label from "reactstrap/lib/Label";
import Button from 'reactstrap/lib/Button';

import BlockUi from 'react-block-ui';
import { Loader, Types } from 'react-loaders';

const RefInfo = () => {
	const router = useRouter();
	const [refId, setRefId] = useState('');
	const [profileCompleted, setProfileCompleted] = useState(false);
	const [blocking, setBlocking] = useState(false);
	const [role, setRole] = useState('');
	const [userId, setUserId] = useState('');
	const [salesData, setSalesData] = useState({ totalCount: 0, sales: [] });
	const [influencersData, setInfluencersData] = useState([]);
	const [earningsData, setEarningsData] = useState({ escrow: 0, payable: 0, paid: 0 });
	const [referralLinks, setReferralLinks] = useState([]);
	
	const toggleBlocking = () => setBlocking(p => !p);
	
	const loadSalesData = async (refId) => {
		if (refId) {
			const referralSales = await salesAPI.influencerSales(refId);
			setSalesData(referralSales.data);
			const earningsRes = await authAPI.getEarnings();
			const { data } = earningsRes;
			const valuesInString = {};
			Object.keys(data).forEach(key => valuesInString[key] = (data[key]/100)
				.toLocaleString('en-IN', {
				style: 'currency',
				currency: 'INR',
				minimumFractionDigits: 0,
				
			}));
			setEarningsData(valuesInString);
		}
	};
	
	const loadStudentInfluencersSalesCount = async (id) => {
		if (id) {
			const data = await salesAPI.influencerSalesUnderManager(id);
			setInfluencersData([ ...data.data]);
		}
	}
	
	useEffect(() => {
		loadStudentInfluencersSalesCount(userId);
	}, [userId]);
	
	useEffect(() => {
		loadSalesData(refId);
	}, [refId]);
	
	useEffect(() => {
		sortInfluencersData(1);
	}, [influencersData.length])
	
	const sortInfluencersData = (order) => {
		order = Number(order)
		setInfluencersData(d => {
			const c = [...d]
			return c.sort((a,b) => {
				if (a.count > b.count) return order * -1;
				if (b.count > a.count) return order;
				return 0
			});
		});
	}
	
	useEffect(() => {
		authAPI.me().then((res) => {
			const { referralId, role, _id, profileCompleted } = res.data;
			setRefId(referralId);
			setProfileCompleted(profileCompleted);
			setRole(role);
			setUserId(_id)
			setReferralLinks([
				{
					name: 'Data Analyst Bootcamp',
					link: `https://www.shapeai.tech/product/data-analyst-training-and-internship?ref=${referralId}`,
				},
				{
					name: 'Full Stack Dev Bootcamp',
					link: `https://www.shapeai.tech/product/full-stack-training-and-internship?ref=${referralId}`,
				},
				{
                                        name: 'Cybersecurity',
                                        link: `https://www.shapeai.tech/product/cyber-security-training-and-internship-program?ref=${referralId}`,
                                }


			]);
		})
			.catch((e) => {
				router.push('/signin')
			});

		
	}, []);
	return <>

	<Container style={{ padding: '2%' }} >
		<BlockUi tag="div"
		         blocking={blocking}
		         message={<b>
			         <h3>Please wait while the payout is being processed.</h3>
			         <br/>
			         <h4>Do not close or refresh the browser.</h4>
		         </b>}
		>
		
		<h2>Your referral info</h2>
			<Table>
				<tr>
				<td>
					Referral Id
				</td>
				<td>
					{refId}
				</td>
				</tr>
				{
				role === 'studentManager' && <>
				<tr>
				<td>
					Student Joining Link
				</td>
				<td>
					<a href={`https://www.ref.shapeai.tech/register/${refId}`}>
						{`https://www.ref.shapeai.tech/register/${refId}`}
					</a>
				</td>
				</tr>
				</>
			}
				{
					referralLinks.length > 0 && referralLinks.map(ref => <tr>
						<td>
							Referral Link for {ref.name}
						</td>
						<td>
							<a href={ref.link}>
								{ref.link}
							</a>
						</td>
					</tr>)
				}
			</Table>
			<h2>Sales</h2>
			<h3>Total units sold: <b>{salesData.totalCount}</b></h3>
			{
				salesData.sales.length > 0 ?
				<Table color={'dark'} >
					<thead>
					<th>
						Bootcamp
					</th>
					<th>
						Batch
					</th>
					<th>
						Units Sold
					</th>
					</thead>
					<tbody>
					{
						salesData.sales.map(sale => <tr>
							<td>
								{sale.bootcamp}
							</td>
							<td>
								{sale.batchPeriod}
							</td>
							<td>
								{sale.count}
							</td>
						</tr>)
					}
					</tbody>
				
				</Table>
				: 'No sales data to show.'
			}
		
		{/*<AffEarnings*/}
		{/*	userProfileCompleted={profileCompleted}*/}
		{/*	setProfileCompleted={setProfileCompleted}*/}
		{/*	data={earningsData}*/}
		{/*	toggleBlocking={toggleBlocking}*/}
		{/*/>*/}
		
		{
				role === 'studentManager' &&
				<>
					<h2>Influencers' sales</h2>
					<Label>Sort By Units Sold</Label>
					<Input
						onChange={e => {
							sortInfluencersData(e.target.value)
							}
						}
						type={'select'} >
						<option value={1} >descending</option>
						<option value={-1} >ascending</option>
					</Input>
					{
						influencersData.length > 0 ?
							<Table striped={true} >
								<thead>
								<th>
									email
								</th>
								<th>
									Units sold
								</th>
								</thead>
								<tbody>
								{
									influencersData.map(i => <tr>
										<td>
											{i.email}
										</td>
										<td>
											{i.count}
										</td>
									</tr>)
								}
								</tbody>
							</Table>
							: 'No Influencers data available'
					}
				
				</>
			}
		
		</BlockUi>
		
		</Container>
	
	</>
}

export default RefInfo;
