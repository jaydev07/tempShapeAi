import Modal from "reactstrap/lib/Modal";
import ModalHeader from "reactstrap/lib/ModalHeader";
import ModalBody from "reactstrap/lib/ModalBody";
import FormGroup from "reactstrap/lib/FormGroup";
import Label from "reactstrap/lib/Label";
import Input from "reactstrap/lib/Input";
import InputGroup from "reactstrap/lib/InputGroup";
import InputGroupAddon from "reactstrap/lib/InputGroupAddon";
import InputGroupText from "reactstrap/lib/InputGroupText";
import Button from "reactstrap/lib/Button";
import Alert from "reactstrap/lib/Alert";
import Container from "reactstrap/lib/Container";
import api from '../services/api/auth';
import { useState } from "react";

const UpdateProfileModal = ({ isOpen, toggle, setProfileCompleted }) => {
  const getElementValueById = (id) => document.getElementById(id).value;
  const [error, setError] = useState('');
  const formSubmitHandler = (e) => {
    e.preventDefault();
    const vpa = getElementValueById('vpa');
    const vpaRegex = new RegExp(/[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{3,64}/g);
    const isVpaValid = vpaRegex.test(vpa);
    const name = getElementValueById('name');
    const phone = getElementValueById('phone');
    const address = getElementValueById('address');
    if (!isVpaValid) return setError('Please enter a valid upi id')
    api.updateProfile({
      name,
      vpa,
      phone,
      address,
    }).then(r => {
      const { data } = r;
      if (data.result === 'valid') {
        setProfileCompleted(true);
        swal({
          title: 'Done',
          text:'Profile Completed. Please wait at least 30 minutes to start withdrawing.',
          icon: 'success',
        })
        localStorage.setItem('blockWithdrawalTill', String(new Date().setTime(new Date().getTime() + 1000 * 60 * 30)));
        toggle();
      } else {
        setError('attemptsLeft' in data ? data.message + '. Attempts Remaining: ' + data.attemptsLeft: data.message);
      }
    }).catch(e => {
      setError(e.response.data)
    });
  }
  return <>
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader>Complete Profile</ModalHeader>
      <ModalBody>
        <form
          onSubmit={formSubmitHandler}
          onChange={() => setError("")}
        >
        <FormGroup>
          <Label>Name</Label>
          <Input
            id={'name'}
          required
          />
          <p className={'info'} >Please make sure that this name is the same
            as the account name the upi id is associated with</p>
        </FormGroup>
      
        <FormGroup>
          <Label>Phone</Label>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>+91</InputGroupText>
            </InputGroupAddon>
            <Input
              required
              type={'tel'}
              id={'phone'}
              minLength={10}
              maxLength={10} />
          </InputGroup>
        </FormGroup>
      
        <FormGroup>
          <Label>Address</Label>
          <Input
            placeholder={'Chennai, Tamil Nadu, India'}
            id={'address'}
            required
            minLength={15}
            maxLength={145} />
        </FormGroup>
      
        <FormGroup>
          <Label>UPI Id</Label>
          <Input
            id={'vpa'}
            required
            placeholder={'you@bank'} />
        </FormGroup>
      <FormGroup>
        <Alert
        isOpen={error}
        color={'danger'}
        >
          {error}
        </Alert>
      </FormGroup>
        <Button color={'primary'} > Update Profile </Button>
        </form>
      </ModalBody>
    </Modal>
  </>
};

export default UpdateProfileModal;
