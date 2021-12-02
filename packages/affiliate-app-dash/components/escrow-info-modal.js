import Modal from "reactstrap/lib/Modal";
import ModalHeader from "reactstrap/lib/ModalHeader";
import ModalBody from "reactstrap/lib/ModalBody";
import Button from "reactstrap/lib/Button";

const EscrowInfoModal = ({ isOpen, toggle }) => {
	return <>
		<Modal isOpen={isOpen} toggle={toggle}>
			<ModalHeader>
				<Button onClick={toggle} close/>
			</ModalHeader>
			<ModalBody>
				<h4>Escrow</h4>
				<p>
					Amount in escrow means it is in a security period <br/>
					Any referral made will be in a security period of <strong> 16 days </strong> as
					bootcamp bookings are eligible for refunds within 16 days <strong>after the batch is started.</strong> <br/>
					After 16 days of a batch started, all referrals will be moved to "Available to Withdraw"
				</p>
			</ModalBody>
		</Modal>
	</>
};

export default EscrowInfoModal;
