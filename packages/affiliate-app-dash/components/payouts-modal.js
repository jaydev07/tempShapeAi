import Modal from "reactstrap/lib/Modal";
import ModalHeader from "reactstrap/lib/ModalHeader";
import ModalBody from "reactstrap/lib/ModalBody";
import Button from "reactstrap/lib/Button";
import Table from "reactstrap/lib/Table";
import { useEffect, useState } from 'react';
import payoutsAPI from '../services/api/payout';


const PayoutsModal = ({ isOpen, toggle }) => {
	const [payouts, setPayouts] = useState([]);
	
	useEffect(() => {
		if (isOpen)
		payoutsAPI.getPayouts().then(res => {
			setPayouts(res.data)
		})
	}, [isOpen]);
	
	return <>
		<Modal
			size={'lg'}
			isOpen={isOpen}
			toggle={toggle}
		>
			<ModalHeader>
				Your Withdrawals
				<Button onClick={toggle} close/>
			</ModalHeader>
			<ModalBody>
				<Table striped >
					<thead>
					<th>Transfer Id</th>
					<th>Initiated At</th>
					<th>Amount</th>
					<th>Status</th>
					</thead>
					<tbody>
					{ payouts.length > 0 && payouts.map(payout => <tr>
							<td>{payout._id}</td>
							<td>{new Date(payout.createdAt).toLocaleString()}</td>
							<td>{payout.amount/100}</td>
							<td>
									{payout.status === 'failed' ? payout.cashfreeFailureReason : payout.status}
							</td>
					</tr>
					) }
					
					</tbody>
				</Table>
				
			</ModalBody>
		</Modal>
	</>
};

export default PayoutsModal;
