import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import Card from "reactstrap/lib/Card";
import CardTitle from "reactstrap/lib/CardTitle";
import Button from "reactstrap/lib/Button";
import Modal from "reactstrap/lib/Button";
import Container from "reactstrap/lib/Container";
import swal from 'sweetalert';
import { useEffect, useState } from 'react';
import UpdateProfileModal from "./update-profile-modal";
import EscrowInfoModal from "./escrow-info-modal";
import PayoutsModal from "./payouts-modal";
import payoutAPI from '../services/api/payout';

import Router from 'next/router'

const AffEarnings = ({ userProfileCompleted, setProfileCompleted, data, toggleBlocking}) => {
  
  const [updateProfileModelOpen, setUpdateProfileModalStatus] = useState(false);
  const [escrowInfoModelOpen, setEscrowInfoStatus] = useState(false);
  const [payoutsModelOpen, setPayoutsModelOpen] = useState(false);
  
  const initPayout = () => {
    const blockWithdrawalTill = localStorage.getItem('blockWithdrawalTill');
    if (blockWithdrawalTill && blockWithdrawalTill !== 'null') {
      if (new Date().getTime() < Number(blockWithdrawalTill)) {
        swal({
          icon: 'info',
          title: 'Please wait at least 30 minutes after completing profile',
          text: 'Try after ' + new Date(Number(blockWithdrawalTill)).toLocaleTimeString(),
        })
      } else {
        localStorage.removeItem('blockWithdrawalTill');
        initPayout();
      }
    } else
    swal({
      title: "You are about to withdraw " + data.payable,
      text: "There will be a processing charges upto Rs.30",
      icon: "warning",
      buttons: true,
    })
      .then((proceed) => {
        if (proceed) {
          toggleBlocking();
          payoutAPI.initPayout().then(res => {
            const { data } = res;
            toggleBlocking();
            swal({
              title: data.status,
              text: data.message + '. Your reference Id: ' + data.data.referenceId,
            }).then(() => Router.reload(window.location.pathname))
          }).catch(e => {
            swal({
              title: 'Payout couldn\'t be processed.',
              text: e?.response?.data,
              icon: 'warning',
            }).then(() => {
              toggleBlocking();
            })
          })
        }
      });
  }
  
  return (
    <>
      <h2>Earnings</h2>
      <Row>
        <Col md={'4'} >
          <Card className={'text-center'} >
            <CardTitle>
              <h3>Escrow - [ Policy updated ]</h3>
            </CardTitle>
            <div style={{ margin: '50px' }} >
              <h1>{data.escrow}</h1>
              <i onClick={() => setEscrowInfoStatus(true)} className={'text-info'} style={{ textDecoration: 'underline', cursor: 'pointer' }} >What's this?</i>
            </div>
          </Card>
    
        </Col>
        <Col md={'4'} >
          <Card className={'text-center'} >
            <CardTitle>
              <h3>Available to withdraw</h3>
            </CardTitle>
            <div style={{ margin: '50px' }} >
              <h1>{data.payable}</h1>
              {
                userProfileCompleted ?
                  <Button onClick={initPayout} >
                    Withdraw earnings
                  </Button>
                  :<Button
                    onClick={() => setUpdateProfileModalStatus(true)} color={'warning'} >
                    Complete profile to withdraw funds
                  </Button>
              }
            </div>
          </Card>
        </Col>
        <Col md={'4'}>
        <Card className={'text-center'} >
          <CardTitle>
            <h3>Withdrawn earnings</h3>
          </CardTitle>
          <div style={{ margin: '50px' }} >
            <h1>{data.paid}</h1>
            <Button onClick={() => setPayoutsModelOpen(true)} color={'link'} >My Withdrawals</Button>
          </div>

        </Card>
        </Col>
      </Row>
      
  
      <UpdateProfileModal
        isOpen={updateProfileModelOpen}
        toggle={() => setUpdateProfileModalStatus(s => !s)}
        setProfileCompleted={setProfileCompleted}
      />
      <EscrowInfoModal
        isOpen={escrowInfoModelOpen}
        toggle={() => setEscrowInfoStatus(s => !s)}
      />
      
      <PayoutsModal
      isOpen={payoutsModelOpen}
      toggle={() => setPayoutsModelOpen(s => !s)}
      />
    </>
  )
};

export default AffEarnings;